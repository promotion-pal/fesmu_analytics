export type Entity<T, O extends keyof T = never> = Omit<
  T,
  'id' | 'createdAt' | 'updatedAt' | O
>;
