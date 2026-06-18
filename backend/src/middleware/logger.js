export function loggerMiddleware(req, res, next) {
  const startTime = Date.now();
  
  // Capture original send
  const originalSend = res.send;
  let responseBody = null;
  
  res.send = function(body) {
    responseBody = body;
    return originalSend.call(this, body);
  };

  // Log after response
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    const logEntry = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      responseTime: `${responseTime}ms`,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString(),
    };
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      const statusColor = res.statusCode < 400 ? '\x1b[32m' : '\x1b[31m';
      console.log(`${statusColor}${res.statusCode}\x1b[0m ${req.method} ${req.url} - ${responseTime}ms`);
    }
  });

  next();
}
