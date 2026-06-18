export function errorInjectionMiddleware(req, res, next) {
  const config = req.proxyConfig;
  if (!config) return next();

  const { errorCode, failureRate } = config.networkConfig;

  // Check failure rate
  if (failureRate && failureRate > 0) {
    const random = Math.random() * 100;
    if (random < failureRate) {
      // Inject error
      const status = parseInt(errorCode) || 500;
      const errorMessages = {
        400: 'Bad Request - Simulated error',
        401: 'Unauthorized - Simulated error',
        403: 'Forbidden - Simulated error',
        404: 'Not Found - Simulated error',
        429: 'Too Many Requests - Simulated error',
        500: 'Internal Server Error - Simulated error',
        503: 'Service Unavailable - Simulated error',
      };

      return res.status(status).json({
        error: true,
        status,
        message: errorMessages[status] || 'Simulated error',
        timestamp: new Date().toISOString(),
        injected: true,
      });
    }
  }

  // Check specific error code (always inject)
  if (errorCode && errorCode !== 'none') {
    const status = parseInt(errorCode);
    const errorMessages = {
      400: 'Bad Request - Simulated error',
      401: 'Unauthorized - Simulated error',
      403: 'Forbidden - Simulated error',
      404: 'Not Found - Simulated error',
      429: 'Too Many Requests - Simulated error',
      500: 'Internal Server Error - Simulated error',
      503: 'Service Unavailable - Simulated error',
    };

    return res.status(status).json({
      error: true,
      status,
      message: errorMessages[status] || 'Simulated error',
      timestamp: new Date().toISOString(),
      injected: true,
    });
  }

  next();
}
