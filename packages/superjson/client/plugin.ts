import SuperJSON from 'superjson'
import { TuyauPlugin } from '@tuyau/client'

export * from 'superjson'

interface SuperjsonPluginConfig {
  /**
   * If true, the plugin will parse the response body with SuperJSON.
   *
   * @default true
   */
  parseResponse?: boolean

  /**
   * If true, the plugin will stringify the request body with SuperJSON.
   *
   * @default true
   */
  stringifyRequest?: boolean
}

/**
 * Simple plugin for enabling superjson compatibility.
 * - Set a `x-superjson` header to `true`.
 * - Parse the response body with SuperJSON.
 * - Stringify the request body with SuperJSON.
 */
export function superjson(config: SuperjsonPluginConfig = {}): TuyauPlugin {
  config.stringifyRequest = config.stringifyRequest ?? true
  config.parseResponse = config.parseResponse ?? true

  return ({ options }) => {
    options.headers = { ...options.headers, 'x-superjson': 'true' }

    if (config.parseResponse) options.parseJson = (text) => SuperJSON.parse(text)
    if (config.stringifyRequest) options.stringifyJson = (data) => SuperJSON.stringify(data)
  }
}
