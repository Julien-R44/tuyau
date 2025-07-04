/**
 * Unwrap lazy arguments
 */
export function unwrapLazyArg<T>(arg: T | (() => T)): T {
  return typeof arg === 'function' ? (arg as () => T)() : arg
}

/**
 * Check if value is an object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Build request path with route parameters
 */
export function buildRequestPath(
  path: (string | number)[],
  params?: Record<string, string | number>,
): string[] {
  if (!params) return path.map(String)

  const result = path.map((segment) => {
    const segmentStr = String(segment)
    if (!segmentStr.startsWith(':')) return segmentStr

    const paramName = segmentStr.slice(1)
    return params[paramName]?.toString() || segmentStr
  })

  return result
}
