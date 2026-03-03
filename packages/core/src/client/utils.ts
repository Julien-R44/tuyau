import { KyResponse } from 'ky'

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
 * Converts camelCase segments to snake_case route name
 */
export function segmentsToRouteName(segments: string[]): string {
  return segments
    .map((segment) => segment.replace(/[A-Z]/g, (g) => `_${g.toLowerCase()}`))
    .join('.')
}

/**
 * Converts camelCase segments to kebab-case route name
 */
export function segmentsToKebabRouteName(segments: string[]): string {
  return segments
    .map((segment) => segment.replace(/[A-Z]/g, (g) => `-${g.toLowerCase()}`))
    .join('.')
}

export async function parseResponse(response?: KyResponse) {
  if (!response) return

  const responseType = response.headers.get('Content-Type')?.split(';')[0]
  if (responseType === 'application/json') {
    return await response.json()
  } else if (responseType === 'application/octet-stream') {
    return await response.arrayBuffer()
  }

  return await response.text()
}
