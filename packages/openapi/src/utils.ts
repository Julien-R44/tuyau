export function notNullish<T>(v: T | null | undefined): v is NonNullable<T> {
  // eslint-disable-next-line eqeqeq
  return v != null
}
export function objectMap<K extends string, V, NK = K, NV = V>(
  obj: Record<K, V>,
  fn: (key: K, value: V) => [NK, NV] | undefined,
): Record<K, V> {
  return Object.fromEntries(
    Object.entries(obj)
      .map(([k, v]) => fn(k as K, v as V))
      .filter(notNullish),
  )
}
