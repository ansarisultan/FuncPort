export function payloadMutatorMiddleware(req, res, next) {
  const config = req.proxyConfig;
  if (!config) return next();

  const { payloadMultiplier } = config.networkConfig;

  // Modify response payload
  const originalSend = res.send;
  res.send = function(body) {
    // Skip if no multiplier or multiplier is 1
    if (!payloadMultiplier || payloadMultiplier <= 1 || !body) {
      return originalSend.call(this, body);
    }

    try {
      // Try to parse as JSON
      const data = JSON.parse(body);
      
      // If data is an array, expand it
      if (Array.isArray(data)) {
        const expanded = expandArray(data, payloadMultiplier);
        return originalSend.call(this, JSON.stringify(expanded));
      }
      
      // If data is an object with array property
      if (typeof data === 'object' && data !== null) {
        const expanded = expandObject(data, payloadMultiplier);
        return originalSend.call(this, JSON.stringify(expanded));
      }
    } catch (e) {
      // Not JSON, pass through
      return originalSend.call(this, body);
    }

    return originalSend.call(this, body);
  };

  next();
}

function expandArray(arr, multiplier) {
  if (!Array.isArray(arr) || arr.length === 0) return arr;
  
  const targetLength = arr.length * multiplier;
  const expanded = [];
  
  while (expanded.length < targetLength) {
    const remaining = targetLength - expanded.length;
    const chunk = arr.slice(0, Math.min(remaining, arr.length));
    
    // Modify each item slightly to avoid identical objects
    const modifiedChunk = chunk.map((item, index) => {
      if (typeof item === 'object' && item !== null) {
        return {
          ...item,
          _id: `${item._id || 'item'}_${expanded.length + index}`,
          _index: expanded.length + index,
        };
      }
      return item;
    });
    
    expanded.push(...modifiedChunk);
  }
  
  return expanded;
}

function expandObject(obj, multiplier) {
  const result = { ...obj };
  
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      result[key] = expandArray(value, multiplier);
    } else if (typeof value === 'object' && value !== null) {
      result[key] = expandObject(value, multiplier);
    }
  }
  
  return result;
}
