import ky from 'ky'
import type { KyInstance } from 'ky'
import { serialize } from 'object-to-formdata'

import { TuyauHTTPError } from './errors.js'
import type { TuyauOptions as TuyauOptions, AdonisClient } from './types.js'

const methods = ['get', 'post', 'put', 'delete', 'patch', 'head'] as const
const prefixedMethods = methods.map((method) => `$${method}`)

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

/**
 * Build query string from the given object.
 * It will use `duplicate` format for arrays. ?ids[]=1&ids[]=2 since it is
 * handled by AdonisJS out of the box.
 */
function buildSearchParams(query: Record<string, string>) {
  if (!query) return ''

  let stringified = ''
  const append = (key: string, value: string, isArray = false) => {
    const encodedKey = encodeURIComponent(key)
    const encodedValue = encodeURIComponent(value)
    const keyValuePair = `${encodedKey}${isArray ? '[]' : ''}=${encodedValue}`

    stringified += (stringified ? '&' : '?') + keyValuePair
  }

  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      for (const v of value) append(key, v, true)
    } else {
      append(key, `${value}`)
    }
  }

  return stringified
}

function createProxy({
  client,
  config,
  paths = [],
  baseUrl,
}: {
  client: KyInstance
  baseUrl: string
  config: any
  paths?: string[]
}): any {
  return new Proxy(() => {}, {
    get(_, param: string) {
      return createProxy({
        client,
        config,
        paths: param === 'index' ? paths : [...paths, param],
        baseUrl,
      })
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
      const lastPath = paths.at(-1)
      const isMethodCall = prefixedMethods.includes(lastPath as any)
      if (!isMethodCall && typeof body === 'object') {
        return createProxy({
          client,
          config,
          paths: [...paths, Object.values(body)[0] as string],
          baseUrl,
        })
      }

      if (lastPath === '$url') {
        return new URL(paths.join('/').replace('/$url', ''), baseUrl).toString()
      }

      /**
       * Otherwise, it's time to make the request.
       */
      const method = paths[paths.length - 1].slice(1) as (typeof methods)[number]
      const path = paths.slice(0, -1).join('/')

      /**
       * If the method is get or head, we should send the query as the body.
       */
      const isGetOrHead = method === 'get' || method === 'head'
      const query = isGetOrHead ? (body as Record<string, string>)?.query : options?.query
      const hasFileInBody = hasFile(body)
      if (hasFileInBody) body = serialize(body, { indices: true })

      const key = hasFileInBody ? 'body' : 'json'

      async function makeRequest() {
        /**
         * Make the request
         */
        const response = await client[method](path, {
          searchParams: buildSearchParams(query),
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
      }

      return {
        then: (resolve: typeof Promise.resolve, reject: typeof Promise.reject) =>
          makeRequest().then(resolve, reject),

        unwrap: () => {
          return {
            then: (resolve: typeof Promise.resolve, reject: typeof Promise.reject) => {
              return makeRequest().then((response: any) => {
                if (response.error) {
                  reject(response.error)
                } else {
                  resolve(response.data)
                }
              }, reject)
            },
          }
        },
      }
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
  return createProxy({ client, baseUrl, config: options })
}
