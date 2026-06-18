import { rateLimit } from 'express-rate-limit';

// In-memory store for rate limiting
const requestCounts = new Map();
const windowMs = 60000; // 1 minute

export function rateLimiterMiddleware(req, res, next) {
  const config = req.proxyConfig;
  if (!config) return next();

  const { rateLimit: limit } = config.networkConfig;
  
  // No rate limit
  if (!limit || limit === 'none') {
    return next();
  }

  const maxRequests = parseInt(limit);
  const key = `${req.proxyId}-${req.ip}`;
  const now = Date.now();
  const windowStart = now - windowMs;

  // Clean old entries
  if (requestCounts.has(key)) {
    const entry = requestCounts.get(key);
    const recent = entry.filter(timestamp => timestamp > windowStart);
    if (recent.length >= maxRequests) {
      return res.status(429).json({
        error: true,
        status: 429,
        message: `Rate limit exceeded. Maximum ${maxRequests} requests per minute.`,
        timestamp: new Date().toISOString(),
        injected: true,
      });
    }
    recent.push(now);
    requestCounts.set(key, recent);
  } else {
    requestCounts.set(key, [now]);
  }

  // Clean old entries periodically
  if (Math.random() < 0.1) {
    const keys = Array.from(requestCounts.keys());
    keys.forEach(key => {
      const entry = requestCounts.get(key);
      const filtered = entry.filter(timestamp => timestamp > windowStart);
      if (filtered.length === 0) {
        requestCounts.delete(key);
      } else {
        requestCounts.set(key, filtered);
      }
    });
  }

  next();
}
