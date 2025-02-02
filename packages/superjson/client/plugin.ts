import SuperJSON from 'superjson'
import { TuyauPlugin } from '@tuyau/client'

export * from 'superjson'

/**
 * Simple plugin for enabling superjson compatibility.
 * - Set a `x-superjson` header to `true`.
 * - Parse the response body with SuperJSON.
 */
export function superjson(): TuyauPlugin {
  return ({ options }) => {
    options.headers = { ...options.headers, 'x-superjson': 'true' }
    options.parseJson = (text) => SuperJSON.parse(text)
  }
}
