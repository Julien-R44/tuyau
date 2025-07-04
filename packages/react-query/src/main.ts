import { IsNever } from '@tuyau/utils/types'
import { QueryClient } from '@tanstack/react-query'
import {
  type TuyauClient,
  type GeneratedRoutes,
  type QueryParameters,
  createTuyauRecursiveProxy,
} from '@tuyau/client'

import { unwrapLazyArg } from './utils.js'
import { DecorateRouterKeyable } from './types.js'
import { getQueryKeyInternal, tuyauQueryOptions, DecorateQueryFn } from './query.js'
import { getMutationKeyInternal, tuyauMutationOptions, DecorateMutationFn } from './mutation.js'

/**
 * Main factory function to create a Tuyau React Query client
 * Provides type-safe integration between Tuyau routes and React Query
 */
export function createTuyauReactQueryClient<
  D extends Record<string, any>,
  R extends GeneratedRoutes,
>(options: { client: TuyauClient<D, R>; queryClient: QueryClient | (() => QueryClient) }) {
  return createTuyauRecursiveProxy(({ args, executeIfRouteParamCall, paths }) => {
    const fnName = paths.at(-1)
    const path = paths.slice(0, -1)
    const [arg1, arg2] = args

    if (fnName === 'queryOptions') {
      return tuyauQueryOptions({
        input: arg1,
        opts: arg2 || {},
        queryKey: getQueryKeyInternal(path, arg1, 'query'),
        queryClient: unwrapLazyArg(options.queryClient),
        client: options.client as any,
        path,
      })
    }

    if (fnName === 'queryKey') return getQueryKeyInternal(path, arg1, 'query')
    if (fnName === 'pathKey') return getQueryKeyInternal(path)
    if (fnName === 'queryFilter') {
      return { ...arg2, queryKey: getQueryKeyInternal(path, arg1, 'query') }
    }
    if (fnName === 'pathFilter') {
      return { ...arg1, queryKey: getQueryKeyInternal(path) }
    }

    if (fnName === 'mutationOptions') {
      return tuyauMutationOptions({
        path,
        opts: arg1,
        queryClient: unwrapLazyArg(options.queryClient),
        client: options.client as any,
      })
    }

    if (fnName === 'mutationKey') return getMutationKeyInternal(path)

    // Handle route parameter calls
    const newProxy = executeIfRouteParamCall({ fnName: fnName!, body: args[0] })
    if (newProxy) return newProxy

    throw new Error(`Method ${fnName} not found on Tuyau client`)
  }) as TuyauReactQuery<D> & DecorateRouterKeyable
}

/**
 * Main type for the Tuyau React Query client
 * Maps route definitions to appropriate query or mutation decorators
 */
export type TuyauReactQuery<in out Route extends Record<string, any>, NotProvidedParams = {}> = {
  [K in keyof Route as K extends `:${string}` ? never : K]: Route[K] extends {
    response: infer _Res extends Record<number, unknown>
    request: infer _Request
  }
    ? // GET, HEAD methods become queries
      K extends '$get' | '$head'
      ? DecorateQueryFn<Route[K], NotProvidedParams> & DecorateRouterKeyable
      : // POST, PUT, PATCH, DELETE methods become mutations
        DecorateMutationFn<Route[K], NotProvidedParams> & DecorateRouterKeyable
    : K extends '$url'
      ? (options?: { query?: QueryParameters }) => string
      : CreateParams<Route[K], NotProvidedParams> & DecorateRouterKeyable
}

/**
 * Type for handling route parameters
 */
export type CreateParams<Route extends Record<string, any>, NotProvidedParams = {}> =
  Extract<keyof Route, `:${string}`> extends infer Path extends string
    ? IsNever<Path> extends true
      ? TuyauReactQuery<Route, NotProvidedParams> & DecorateRouterKeyable
      : ((params: {
          [param in Path extends `:${infer Param}` ? Param : never]: string | number
        }) => TuyauReactQuery<Route[Path], NotProvidedParams> &
          CreateParams<
            Route[Path],
            NotProvidedParams & {
              [param in Path extends `:${infer Param}` ? Param : never]: string | number
            }
          >) &
          TuyauReactQuery<Route, NotProvidedParams> & {
            [K in keyof Route as K extends `:${string}` ? K : never]: TuyauReactQuery<
              Route[K],
              NotProvidedParams & {
                [param in Path extends `:${infer Param}` ? Param : never]: string | number
              }
            >
          }
    : never
