export function expandPayload(data) {
  // Skeleton: Inject filler fields or nested levels
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(expandPayload);
  }

  return {
    ...data,
    _expansion: {
      timestamp: new Date().toISOString(),
      filler: 'x'.repeat(100),
      nested: { level: 1 }
    }
  };
}
