import type { QueryParameters } from './types/types.ts'

/**
 * Build query string from the given object.
 * - It will use `bracket` format for arrays. ?ids[]=1&ids[]=2 since it is
 * handled by AdonisJS out of the box.
 * - It will skip the key/value if value is `null` or `undefined`
 */
export function buildSearchParams(query: QueryParameters) {
  if (!query) return ''

  let stringified = ''

  const append = (key: string, value?: string | number | boolean | null) => {
    if (value === undefined || value === null) return

    stringified +=
      (stringified ? '&' : '?') + encodeURIComponent(key) + '=' + encodeURIComponent(value)
  }

  const build = (obj: QueryParameters, prefix = '') => {
    for (const [key, value] of Object.entries(obj)) {
      if (value === undefined || value === null) continue

      const fullKey = prefix ? `${prefix}[${key}]` : key

      if (Array.isArray(value)) {
        value.forEach((v) => append(`${fullKey}[]`, v))
      } else if (typeof value === 'object') {
        build(value, fullKey)
      } else {
        append(fullKey, value)
      }
    }
  }

  build(query)

  return stringified
}

/**
 * Remove leading slash from the value
 */
export function removeSlash(value: string) {
  return value.replace(/^\//, '')
}

/**
 * Check if value is an object
 */
export function isObject(value: any) {
  return typeof value === 'object' && !Array.isArray(value) && value !== null
}

export const isServer = typeof FileList === 'undefined'
export const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative'

/**
 * Converts camelCase segments to kebab-case route name
 */
export function segmentsToRouteName(segments: string[]): string {
  return segments
    .map((segment) => segment.replace(/[A-Z]/g, (g) => `-${g.toLowerCase()}`))
    .join('.')
}
