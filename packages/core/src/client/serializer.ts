import type { QueryParameters } from './types/types.ts'

/**
 * Build query string from the given object.
 * - Uses `bracket` format for arrays: ?ids[]=1&ids[]=2
 * - Handles nested objects with bracket notation: ?filter[name][like]=foo
 * - Skips null/undefined values but keeps 0, false, and empty strings
 */
export function buildSearchParams(query: QueryParameters): string {
  if (!query) return ''

  const parts: string[] = []

  function serialize(obj: QueryParameters, prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
      if (value === undefined || value === null) continue

      const encodedKey = encodeURIComponent(key)
      const fullKey = prefix ? `${prefix}[${encodedKey}]` : encodedKey

      if (Array.isArray(value)) {
        for (const item of value) {
          if (item !== undefined && item !== null) {
            parts.push(`${fullKey}[]=${encodeURIComponent(item)}`)
          }
        }
      } else if (typeof value === 'object') {
        serialize(value as QueryParameters, fullKey)
      } else {
        parts.push(`${fullKey}=${encodeURIComponent(value)}`)
      }
    }
  }

  serialize(query)
  return parts.length ? `?${parts.join('&')}` : ''
}
