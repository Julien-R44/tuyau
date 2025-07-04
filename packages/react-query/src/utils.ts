/**
 * Unwrap lazy arguments
 */
export function unwrapLazyArg<T>(arg: T | (() => T)): T {
  return typeof arg === 'function' ? (arg as () => T)() : arg
}

/**
 * Build request path with route parameters
 */
export function buildRequestPath(
  path: string[],
  params?: Record<string, string | number>,
): string[] {
  if (!params) return path

  const result = path.map((segment) => {
    if (!segment.startsWith(':')) return segment

    const paramName = segment.slice(1)
    return params[paramName]?.toString() || segment
  })

  return result
}
