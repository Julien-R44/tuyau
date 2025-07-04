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
import { tuyauInfiniteQueryOptions, DecorateInfiniteQueryFn } from './infinite_query.js'
import { getMutationKeyInternal, tuyauMutationOptions, DecorateMutationFn } from './mutation.js'

/**
 * Create the Tuyau React Query client
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

    if (fnName === 'infiniteQueryOptions') {
      return tuyauInfiniteQueryOptions({
        input: arg1,
        opts: arg2 || {},
        queryKey: getQueryKeyInternal(path, arg1, 'infinite'),
        queryClient: unwrapLazyArg(options.queryClient),
        client: options.client as any,
        path,
      })
    }

    if (fnName === 'queryKey') return getQueryKeyInternal(path, arg1, 'query')
    if (fnName === 'infiniteQueryKey') return getQueryKeyInternal(path, arg1, 'infinite')
    if (fnName === 'pathKey') return getQueryKeyInternal(path)

    if (fnName === 'queryFilter') {
      return { ...arg2, queryKey: getQueryKeyInternal(path, arg1, 'query') }
    }
    if (fnName === 'infiniteQueryFilter') {
      return { ...arg2, queryKey: getQueryKeyInternal(path, arg1, 'infinite') }
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
      ? DecorateQueryFn<Route[K], NotProvidedParams> &
          DecorateInfiniteQueryFn<Route[K], NotProvidedParams> &
          DecorateRouterKeyable
      : // POST, PUT, PATCH, DELETE methods become mutations
        DecorateMutationFn<Route[K], NotProvidedParams> & DecorateRouterKeyable
    : K extends '$url'
      ? (options?: { query?: QueryParameters }) => string
      : CreateParams<Route[K], NotProvidedParams> & DecorateRouterKeyable
}

/**
 * Extract path parameters from route keys
 */
type ExtractPathParams<Route> = Extract<keyof Route, `:${string}`>

/**
 * Convert path parameter to object type
 */
type PathParamToObject<Path extends string> = Path extends `:${infer Param}`
  ? { [K in Param]: string | number }
  : never

/**
 * Create the route parameter function signature
 */
type CreateParamFunction<
  Route extends Record<string, any>,
  Path extends string,
  NotProvidedParams,
> = (
  params: PathParamToObject<Path>,
) => TuyauReactQuery<Route[Path], NotProvidedParams> &
  CreateParams<Route[Path], NotProvidedParams & PathParamToObject<Path>>

/**
 * Create the parameter property mappings
 */
type CreateParamProperties<
  Route extends Record<string, any>,
  Path extends string,
  NotProvidedParams,
> = {
  [K in keyof Route as K extends `:${string}` ? K : never]: TuyauReactQuery<
    Route[K],
    NotProvidedParams & PathParamToObject<Path>
  >
}

/**
 * Type for handling route parameters
 */
export type CreateParams<Route extends Record<string, any>, NotProvidedParams = {}> =
  ExtractPathParams<Route> extends infer Path extends string
    ? IsNever<Path> extends true
      ? TuyauReactQuery<Route, NotProvidedParams> & DecorateRouterKeyable
      : CreateParamFunction<Route, Path, NotProvidedParams> &
          TuyauReactQuery<Route, NotProvidedParams> &
          CreateParamProperties<Route, Path, NotProvidedParams> &
          DecorateRouterKeyable
    : never
