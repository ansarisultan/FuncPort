export function mutateSchema(data) {
  // Skeleton: Randomly alter names, types, or structure of key-value pairs
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(mutateSchema);
  }

  const mutated = {};
  for (const [key, value] of Object.entries(data)) {
    // 10% chance to rename key slightly
    const newKey = Math.random() < 0.1 ? `${key}_mutated` : key;
    mutated[newKey] = mutateSchema(value);
  }
  return mutated;
}
