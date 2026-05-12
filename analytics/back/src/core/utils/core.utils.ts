export function dbFilters<T extends Record<string, any>>(
  obj: T,
  operator: 'AND' | 'OR' = 'AND',
): any {
  const entries = Object.entries(obj).filter(
    ([_, value]) => value !== undefined,
  );

  if (operator === 'OR') {
    return entries.map(([key, value]) => ({ [key]: value }));
  }

  return Object.fromEntries(entries);
}
