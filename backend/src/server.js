import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import proxyRoutes from './routes/proxy.js';
import scenarioRoutes from './routes/scenarios.js';
import healthRoutes from './routes/health.js';
import { networkConditionsMiddleware } from './middleware/networkConditions.js';
import { errorInjectionMiddleware } from './middleware/errorInjection.js';
import { rateLimiterMiddleware } from './middleware/rateLimiter.js';
import { payloadMutatorMiddleware } from './middleware/payloadMutator.js';
import { loggerMiddleware } from './middleware/logger.js';
import { proxyService } from './services/proxyService.js';
import { trafficService } from './services/trafficService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

export function createServer() {
  const app = express();

  // Security Middleware
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }));
  
  // CORS
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:') || origin === process.env.CORS_ORIGIN) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  }));

  // Compression
  app.use(compression());

  // Logging
  app.use(morgan('combined'));

  // Body Parsing
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Routes
  app.use('/health', healthRoutes);
  app.use('/api/health', healthRoutes);
  app.use('/api/proxy', proxyRoutes);
  app.use('/api/scenarios', scenarioRoutes);

  // Main Proxy Handler
  app.use('/p/:proxyId', [
    loggerMiddleware,
    rateLimiterMiddleware,
    networkConditionsMiddleware,
    errorInjectionMiddleware,
    payloadMutatorMiddleware,
    async (req, res, next) => {
      try {
        const { proxyId } = req.params;
        
        // Get proxy configuration
        const config = await proxyService.getProxyConfig(proxyId);
        if (!config) {
          return res.status(404).json({
            error: 'Proxy not found',
            message: 'Invalid proxy ID',
          });
        }

        // Check if proxy is active
        if (!config.isActive) {
          return res.status(403).json({
            error: 'Proxy inactive',
            message: 'This proxy has been deactivated',
          });
        }

        // Store config in request for middleware
        req.proxyConfig = config;
        req.proxyId = proxyId;

        next();
      } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({
          error: 'Proxy error',
          message: error.message,
        });
      }
    },
    async (req, res) => {
      try {
        const { proxyId } = req.params;
        const config = req.proxyConfig;
        const startTime = Date.now();

        // Create proxy middleware
        const proxy = createProxyMiddleware({
          target: config.backendUrl,
          changeOrigin: true,
          pathRewrite: {
            [`^/p/${proxyId}`]: '',
          },
          onProxyReq: (proxyReq, req) => {
            // Forward custom headers
            if (req.headers['x-request-id']) {
              proxyReq.setHeader('X-Request-ID', req.headers['x-request-id']);
            }
          },
          onProxyRes: async (proxyRes, req, res) => {
            const responseTime = Date.now() - startTime;
            
            // Log traffic
            await trafficService.logTraffic({
              proxyId,
              method: req.method,
              route: req.url,
              status: proxyRes.statusCode,
              responseTime,
              responseSize: parseInt(proxyRes.headers['content-length']) || 0,
              headers: proxyRes.headers,
              timestamp: new Date().toISOString(),
            });

            // Apply schema mutations if configured
            if (config.schemaMutations) {
              const originalSend = res.send;
              res.send = function(body) {
                try {
                  const parsed = JSON.parse(body);
                  const mutated = applySchemaMutations(parsed, config.schemaMutations);
                  return originalSend.call(this, JSON.stringify(mutated));
                } catch (e) {
                  return originalSend.call(this, body);
                }
              };
            }
          },
          onError: async (err, req, res) => {
            console.error('Proxy error:', err);
            await trafficService.logTraffic({
              proxyId,
              method: req.method,
              route: req.url,
              status: 500,
              responseTime: Date.now() - startTime,
              error: err.message,
              timestamp: new Date().toISOString(),
            });
            res.status(500).json({
              error: 'Proxy error',
              message: err.message,
            });
          },
        });

        proxy(req, res);
      } catch (error) {
        console.error('Proxy handler error:', error);
        res.status(500).json({
          error: 'Proxy error',
          message: error.message,
        });
      }
    }
  ]);

  // Error Handling
  app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error',
      code: err.code || 'INTERNAL_ERROR',
    });
  });

  // 404 Handler
  app.use((req, res) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Route ${req.method} ${req.url} not found`,
    });
  });

  return app;
}

// Helper: Apply schema mutations
function applySchemaMutations(data, mutations) {
  if (!mutations || typeof data !== 'object') return data;

  let result = { ...data };

  // Remove fields
  if (mutations.removeFields) {
    mutations.removeFields.forEach(field => {
      delete result[field];
    });
  }

  // Rename fields
  if (mutations.renameFields) {
    Object.entries(mutations.renameFields).forEach(([oldName, newName]) => {
      if (result[oldName] !== undefined) {
        result[newName] = result[oldName];
        delete result[oldName];
      }
    });
  }

  // Return null for fields
  if (mutations.returnNull) {
    mutations.returnNull.forEach(field => {
      if (result[field] !== undefined) {
        result[field] = null;
      }
    });
  }

  // Empty arrays
  if (mutations.emptyArrays) {
    mutations.emptyArrays.forEach(field => {
      if (Array.isArray(result[field])) {
        result[field] = [];
      }
    });
  }

  return result;
}
