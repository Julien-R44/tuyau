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

  const result: string[] = []

  for (const segment of path) {
    const segmentStr = String(segment)

    // Handle compound segments like 'orgs/:orgId/users/:userId'
    if (segmentStr.includes('/')) {
      const parts = segmentStr.split('/')
      for (const part of parts) {
        if (part.startsWith(':')) {
          const paramName = part.slice(1)
          result.push(params[paramName]?.toString() || part)
        } else {
          result.push(part)
        }
      }
    } else if (segmentStr.startsWith(':')) {
      const paramName = segmentStr.slice(1)
      result.push(params[paramName]?.toString() || segmentStr)
    } else {
      result.push(segmentStr)
    }
  }

  return result
}
