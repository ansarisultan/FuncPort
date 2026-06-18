export function networkConditionsMiddleware(req, res, next) {
  const config = req.proxyConfig;
  if (!config) return next();

  const { latency, networkProfile } = config.networkConfig;

  // Apply latency
  if (latency && latency > 0) {
    setTimeout(() => {
      next();
    }, latency);
  } else {
    next();
  }

  // Track latency in response headers
  const originalSend = res.send;
  res.send = function(body) {
    res.setHeader('X-Mock-Latency', latency || 0);
    res.setHeader('X-Mock-Network-Profile', networkProfile || 'custom');
    return originalSend.call(this, body);
  };
}
