import { QueryClient } from '@tanstack/react-query'
import { IsNever, Prettify } from '@tuyau/utils/types'
import {
  type TuyauClient,
  type GeneratedRoutes,
  type QueryParameters,
  createTuyauRecursiveProxy,
} from '@tuyau/client'

import { DecorateRouterKeyable } from './types.js'
import { getQueryKeyInternal, tuyauQueryOptions, DecorateQueryFn } from './query.js'
import { getMutationKeyInternal, tuyauMutationOptions, DecorateMutationFn } from './mutation.js'

/**
 * Unwrap lazy arguments
 */
function unwrapLazyArg<T>(arg: T | (() => T)): T {
  return typeof arg === 'function' ? (arg as () => T)() : arg
}

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

    // Handle query-related methods
    if (fnName === 'queryOptions') {
      return tuyauQueryOptions({
        input: arg1,
        opts: arg2,
        queryKey: getQueryKeyInternal(path, arg1, 'query'),
        queryClient: unwrapLazyArg(options.queryClient),
        client: options.client as any,
        path,
      })
    }

    if (fnName === 'queryKey') return getQueryKeyInternal(path, arg1, 'query')
    if (fnName === 'pathKey') return getQueryKeyInternal(path)

    // Handle query filter support
    if (fnName === 'queryFilter') {
      return {
        ...arg2,
        queryKey: getQueryKeyInternal(path, arg1, 'query'),
      }
    }

    // Handle path filter support
    if (fnName === 'pathFilter') {
      return {
        ...arg1,
        queryKey: getQueryKeyInternal(path),
      }
    }

    // Handle mutation-related methods
    if (fnName === 'mutationOptions') {
      return tuyauMutationOptions({
        opts: arg1,
        path,
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
export type TuyauReactQuery<in out Route extends Record<string, any>> = {
  [K in keyof Route as K extends `:${string}` ? never : K]: Route[K] extends {
    response: infer _Res extends Record<number, unknown>
    request: infer _Request
  }
    ? // GET, HEAD methods become queries
      K extends '$get' | '$head'
      ? DecorateQueryFn<Route[K]> & DecorateRouterKeyable
      : // POST, PUT, PATCH, DELETE methods become mutations
        DecorateMutationFn<Route[K]> & DecorateRouterKeyable
    : K extends '$url'
      ? (options?: { query?: QueryParameters }) => string
      : CreateParams<Route[K]> & DecorateRouterKeyable
}

/**
 * Type for handling route parameters
 */
export type CreateParams<Route extends Record<string, any>> =
  Extract<keyof Route, `:${string}`> extends infer Path extends string
    ? IsNever<Path> extends true
      ? Prettify<TuyauReactQuery<Route>> & DecorateRouterKeyable
      : ((params: {
          [param in Path extends `:${infer Param}` ? Param : never]: string | number
        }) => Prettify<TuyauReactQuery<Route[Path]>> & CreateParams<Route[Path]>) &
          Prettify<TuyauReactQuery<Route>>
    : never
