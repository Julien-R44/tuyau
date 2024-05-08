import type { QueryParameters } from './types.js'

/**
 * Build query string from the given object.
 * - It will use `bracket` format for arrays. ?ids[]=1&ids[]=2 since it is
 * handled by AdonisJS out of the box.
 * - It will skip the key/value if value is `null` or `undefined`
 */
export function buildSearchParams(query: QueryParameters) {
  if (!query) return ''

  let stringified = ''
  const append = (
    key: string,
    value: string | number | boolean | null | undefined,
    isArray = false,
  ) => {
    if (value === undefined || value === null) return

    const encodedKey = encodeURIComponent(key)
    const encodedValue = encodeURIComponent(value)
    const keyValuePair = `${encodedKey}${isArray ? '[]' : ''}=${encodedValue}`

    stringified += (stringified ? '&' : '?') + keyValuePair
  }

  for (const [key, value] of Object.entries(query)) {
    if (!value) continue

    if (Array.isArray(value)) {
      for (const v of value) {
        append(key, v, true)
      }
    } else {
      append(key, `${value}`)
    }
  }

  return stringified
}

/**
 * Simple snake case implementation
 */
export function snakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (g) => `_${g.toLowerCase()}`)
}

/**
 * Simple camel case implementation
 */
export function camelCase(str: string): string {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
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
