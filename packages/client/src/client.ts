import ky from 'ky'
import type { KyInstance } from 'ky'
import { serialize } from 'object-to-formdata'

import { TuyauHTTPError } from './errors.js'
import type { TuyauOptions as TuyauOptions, AdonisClient } from './types.js'

const methods = ['get', 'post', 'put', 'delete', 'patch', 'head'] as const

const isReactNative = typeof navigator === 'object' && navigator['product'] === 'ReactNative'

function isObject(value: unknown) {
  return value === Object(value)
}

function isUndefined(value: unknown) {
  return value === undefined
}

function isBlob(value: any) {
  return isReactNative
    ? isObject(value) && !isUndefined(value.uri)
    : isObject(value) &&
        typeof value.size === 'number' &&
        typeof value.type === 'string' &&
        typeof value.slice === 'function'
}

function isFile(value: any) {
  return (
    isBlob(value) &&
    typeof value.name === 'string' &&
    (isObject(value.lastModifiedDate) || typeof value.lastModified === 'number')
  )
}

function hasFile(obj: Record<string, any>) {
  if (!obj) return false

  for (const key in obj) {
    if (isFile(obj[key])) return true

    if (Array.isArray(obj[key]) && (obj[key] as unknown[]).find(isFile)) return true
  }

  return false
}

function createProxy(client: KyInstance, config: any, paths: string[] = []): any {
  return new Proxy(() => {}, {
    get(_, param: string) {
      return createProxy(client, config, param === 'index' ? paths : [...paths, param])
    },

    /**
     * When the proxy is called, we need to check if we should make a request or not.
     * If the last path is a method, we should make a request.
     * Otherwise, that means it's just a path parameter and we should continue to build the path.
     */
    apply(_, __, [body, options]) {
      /**
       * If last path is not a method, we should continue to build the path.
       */
      const isMethodCall = methods.includes(paths.at(-1) as any)
      if (!isMethodCall && typeof body === 'object') {
        return createProxy(client, config, [...paths, Object.values(body)[0] as string])
      }

      /**
       * Otherwise, it's time to make the request.
       */
      const method = paths[paths.length - 1] as (typeof methods)[number]
      const path = paths.slice(0, -1).join('/')

      /**
       * If the method is get or head, we should send the query as the body.
       */
      const isGetOrHead = method === 'get' || method === 'head'
      const query = isGetOrHead ? (body as Record<string, string>)?.query : options?.query
      const hasFileInBody = hasFile(body)
      if (hasFileInBody) body = serialize(body, { indices: true })

      const key = hasFileInBody ? 'body' : 'json'
      return (async () => {
        /**
         * Make the request
         */
        const response = await client[method](path, {
          searchParams: query,
          [key]: !isGetOrHead ? body : undefined,
          ...options,
        })

        let data: any
        let error: any

        const status = response.status

        /**
         * Parse the response based on the content type
         */
        const responseType = response.headers.get('Content-Type')?.split(';')[0]
        if (responseType === 'application/json') {
          data = await response.json()
        } else if (responseType === 'application/octet-stream') {
          data = await response.arrayBuffer()
        } else {
          data = await response.text()
        }

        /**
         * If the status code is not in the 200 range, we remove
         * the data and set the error
         */
        if (!response.ok) {
          error = new TuyauHTTPError(response.status, data)
          data = undefined
        }

        return { data, error, response, status }
      })()
    },
  })
}

/**
 * Create a new Tuyau client
 */
export function createTuyau<const T extends Record<string, any>>(
  baseUrl: string,
  options?: TuyauOptions,
): AdonisClient<T> {
  const client = ky.create({ prefixUrl: baseUrl, throwHttpErrors: false, ...options })
  return createProxy(client, options)
}
