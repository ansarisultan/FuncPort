import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  proxy: {
    timeout: parseInt(process.env.PROXY_TIMEOUT || '30000', 10),
    maxRetries: parseInt(process.env.PROXY_MAX_RETRIES || '3', 10),
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '60000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },
  storage: {
    path: process.env.STORAGE_PATH || './data',
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || 'mock-funclexa-secret-key-2024',
    encryptionKey: process.env.ENCRYPTION_KEY || 'your-encryption-key-here',
  }
};
