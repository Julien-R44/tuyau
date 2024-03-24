import ky from 'ky'
import type { KyInstance } from 'ky'

import { ConduitHTTPError } from './errors.js'
import type { ConduitOptions, AdonisClient } from './types.js'

const methods = ['get', 'post', 'put', 'delete', 'patch', 'head'] as const

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
      const method = paths.pop() as (typeof methods)[number]
      const path = paths.join('/')

      /**
       * If the method is get or head, we should send the query as the body.
       */
      const isGetOrHead = method === 'get' || method === 'head'
      const query = isGetOrHead ? (body as Record<string, string>)?.query : options?.query

      return (async () => {
        /**
         * Make the request
         */
        const response = await client[method](path, {
          searchParams: query,
          json: !isGetOrHead ? body : undefined,
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
          error = new ConduitHTTPError(response.status, data)
          data = undefined
        }

        return { data, error, response, status }
      })()
    },
  })
}

/**
 * Create a new Conduit client
 */
export function conduit<const T extends Record<string, any>>(
  baseUrl: string,
  options?: ConduitOptions
): AdonisClient<T> {
  const client = ky.create({ prefixUrl: baseUrl, throwHttpErrors: false, ...options })
  return createProxy(client, options)
}
