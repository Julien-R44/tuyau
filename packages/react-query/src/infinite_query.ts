import type { TuyauClient } from '@tuyau/client'
import {
  DataTag,
  QueryFilters,
  QueryClient,
  infiniteQueryOptions,
  skipToken,
  SkipToken,
  DefinedInitialDataInfiniteOptions,
  UndefinedInitialDataInfiniteOptions,
  UnusedSkipTokenInfiniteOptions,
  QueryFunctionContext,
} from '@tanstack/react-query'

import { buildRequestPath } from './utils.js'
import {
  TuyauQueryKey,
  EndpointDef,
  UnionFromSuccessStatuses,
  WithRequired,
  DistributiveOmit,
  TuyauQueryBaseOptions,
  TuyauReactRequestOptions,
} from './types.js'

/**
 * Reserved infinite query options that should not be overridden
 */
type InfiniteQueryReservedOptions = 'queryKey' | 'queryFn' | 'queryHashFn' | 'queryHash'

/**
 * Tuyau infinite data structure
 */
type TuyauInfiniteData<TData> = {
  pages: TData[]
  pageParams: unknown[]
}

/**
 * Infinite query options with undefined initial data
 */
interface UndefinedTuyauInfiniteQueryOptionsIn<
  TQueryFnData,
  TData,
  TError,
  TRequest,
  TPageParamKey extends keyof TRequest,
> extends DistributiveOmit<
      UndefinedInitialDataInfiniteOptions<
        TQueryFnData,
        TError,
        TuyauInfiniteData<TData>,
        TuyauQueryKey,
        ExtractPageParamType<TRequest, TPageParamKey> | null
      >,
      InfiniteQueryReservedOptions
    >,
    TuyauQueryBaseOptions {
  pageParamKey: TPageParamKey
}

/**
 * Infinite query options with defined initial data
 */
interface DefinedTuyauInfiniteQueryOptionsIn<
  TQueryFnData,
  TData,
  TError,
  TRequest,
  TPageParamKey extends keyof TRequest,
> extends DistributiveOmit<
      DefinedInitialDataInfiniteOptions<
        TQueryFnData,
        TError,
        TuyauInfiniteData<TData>,
        TuyauQueryKey,
        ExtractPageParamType<TRequest, TPageParamKey> | null
      >,
      InfiniteQueryReservedOptions
    >,
    TuyauQueryBaseOptions {
  pageParamKey: TPageParamKey
}

type ExtractPageParamType<TRequest, TPageParamKey extends keyof TRequest> = TRequest[TPageParamKey]

/**
 * Infinite query options with unused skip token
 */
interface UnusedSkipTokenTuyauInfiniteQueryOptionsIn<
  TQueryFnData,
  TData,
  TError,
  TRequest,
  TPageParamKey extends keyof TRequest,
> extends DistributiveOmit<
      UnusedSkipTokenInfiniteOptions<
        TQueryFnData,
        TError,
        TuyauInfiniteData<TData>,
        TuyauQueryKey,
        ExtractPageParamType<TRequest, TPageParamKey>
      >,
      InfiniteQueryReservedOptions
    >,
    TuyauQueryBaseOptions {
  pageParamKey: TPageParamKey
}

/**
 * Output type for infinite query options with undefined initial data
 */
interface UndefinedTuyauInfiniteQueryOptionsOut<TQueryFnData, TData, TError>
  extends UndefinedInitialDataInfiniteOptions<
    TQueryFnData,
    TError,
    TuyauInfiniteData<TData>,
    TuyauQueryKey,
    unknown
  > {
  queryKey: DataTag<TuyauQueryKey, TuyauInfiniteData<TData>, TError>
  tuyau: { path: string[]; type: 'infinite' }
}

/**
 * Output type for infinite query options with defined initial data
 */
interface DefinedTuyauInfiniteQueryOptionsOut<TQueryFnData, TData, TError>
  extends DefinedInitialDataInfiniteOptions<
    TQueryFnData,
    TError,
    TuyauInfiniteData<TData>,
    TuyauQueryKey,
    unknown
  > {
  queryKey: DataTag<TuyauQueryKey, TuyauInfiniteData<TData>, TError>
  tuyau: { path: string[]; type: 'infinite' }
}

/**
 * Output type for infinite query options with unused skip token
 */
interface UnusedSkipTokenTuyauInfiniteQueryOptionsOut<TQueryFnData, TData, TError>
  extends UnusedSkipTokenInfiniteOptions<
    TQueryFnData,
    TError,
    TuyauInfiniteData<TData>,
    TuyauQueryKey,
    unknown
  > {
  queryKey: DataTag<TuyauQueryKey, TuyauInfiniteData<TData>, TError>
  tuyau: { path: string[]; type: 'infinite' }
}

/**
 * Type definition for infinite query options with overloads for different scenarios
 */
export interface TuyauReactInfiniteQueryOptions<
  EDef extends EndpointDef,
  TParams = Record<string, string | number>,
> {
  // With initial data - when opts has initialData defined
  <
    TData = UnionFromSuccessStatuses<EDef['response']>,
    TPageParamKey extends keyof EDef['request'] = string,
  >(
    input: { payload?: Omit<EDef['request'], TPageParamKey>; params?: TParams } | SkipToken,
    opts: DefinedTuyauInfiniteQueryOptionsIn<
      UnionFromSuccessStatuses<EDef['response']>,
      TData,
      any,
      EDef['request'],
      TPageParamKey
    >,
  ): DefinedTuyauInfiniteQueryOptionsOut<UnionFromSuccessStatuses<EDef['response']>, TData, any>

  // Without skipToken - when input is not SkipToken and no initialData
  <
    TData = UnionFromSuccessStatuses<EDef['response']>,
    TPageParamKey extends keyof EDef['request'] = string,
  >(
    input: { payload?: Omit<EDef['request'], TPageParamKey>; params?: TParams },
    opts: UnusedSkipTokenTuyauInfiniteQueryOptionsIn<
      UnionFromSuccessStatuses<EDef['response']>,
      TData,
      any,
      EDef['request'],
      TPageParamKey
    >,
  ): UnusedSkipTokenTuyauInfiniteQueryOptionsOut<
    UnionFromSuccessStatuses<EDef['response']>,
    TData,
    any
  >

  // Without initial data - when opts has no initialData or input can be SkipToken
  <
    TData = UnionFromSuccessStatuses<EDef['response']>,
    TPageParamKey extends keyof EDef['request'] = string,
  >(
    input?: { payload?: Omit<EDef['request'], TPageParamKey>; params?: TParams } | SkipToken,
    opts?: UndefinedTuyauInfiniteQueryOptionsIn<
      UnionFromSuccessStatuses<EDef['response']>,
      TData,
      any,
      EDef['request'],
      TPageParamKey
    >,
  ): UndefinedTuyauInfiniteQueryOptionsOut<UnionFromSuccessStatuses<EDef['response']>, TData, any>
}

/**
 * Extract payload and build request path from input and path segments for infinite queries
 */
function extractInfiniteInputAndPath(
  input: unknown,
  path: string[],
  pageParamKey: string,
  pageParam: unknown,
) {
  // If input is not an object with payload/params, use it directly
  if (
    typeof input !== 'object' ||
    input === null ||
    (!('payload' in input) && !('params' in input))
  ) {
    const payload = typeof input === 'object' && input !== null ? input : {}
    const enhancedPayload = { ...payload, [pageParamKey]: pageParam }
    return { payload: enhancedPayload, requestPath: path }
  }

  const { payload, params } = input as {
    payload?: any
    params?: Record<string, string | number>
  }

  const requestPath = buildRequestPath(path, params)

  const enhancedPayload = { ...payload, [pageParamKey]: pageParam }

  return { payload: enhancedPayload, requestPath }
}

export function tuyauInfiniteQueryOptions(options: {
  input: unknown
  opts: any
  queryKey: TuyauQueryKey
  queryClient: QueryClient
  path: string[]
  client: TuyauClient<any, any>
  globalOptions?: TuyauReactRequestOptions
}) {
  const { input, opts, queryKey, path, client, globalOptions } = options
  const inputIsSkipToken = input === skipToken

  if (!opts?.pageParamKey) {
    throw new Error('pageParamKey is required for infinite queries')
  }

  const queryFn = inputIsSkipToken
    ? skipToken
    : async (queryFnContext: QueryFunctionContext) => {
        const { payload, requestPath } = extractInfiniteInputAndPath(
          input,
          path,
          opts.pageParamKey,
          queryFnContext.pageParam,
        )

        // Merge global options with local options, local options take precedence
        const effectiveAbortOnUnmount =
          opts?.tuyau?.abortOnUnmount ?? globalOptions?.abortOnUnmount ?? false

        // Merge Tuyau options with abort signal if abortOnUnmount is enabled
        const actualOpts = {
          ...opts,
          tuyau: {
            ...globalOptions,
            ...opts?.tuyau,
            ...(effectiveAbortOnUnmount ? { signal: queryFnContext.signal } : { signal: null }),
          },
        }

        // @ts-expect-error - Using internal API for client fetch
        return await client.$fetch({ paths: requestPath, input: payload, queryOptions: actualOpts })
      }

  return Object.assign(
    infiniteQueryOptions({
      ...opts,
      queryKey,
      queryFn,
      initialPageParam: opts?.initialPageParam ?? null,
    }),
    { tuyau: { path, type: 'infinite' as const } },
  )
}

/**
 * Interface for infinite query function decorators
 */
export interface DecorateInfiniteQueryFn<
  EDef extends EndpointDef,
  TParams = Record<string, string | number>,
> {
  infiniteQueryOptions: TuyauReactInfiniteQueryOptions<EDef, TParams>
  infiniteQueryKey: (input?: {
    payload?: Partial<EDef['request']>
    params?: TParams
  }) => DataTag<TuyauQueryKey, TuyauInfiniteData<UnionFromSuccessStatuses<EDef['response']>>, any>
  infiniteQueryFilter: (
    input?: { payload?: Partial<EDef['request']>; params?: TParams },
    filters?: QueryFilters<
      DataTag<TuyauQueryKey, TuyauInfiniteData<UnionFromSuccessStatuses<EDef['response']>>, any>
    >,
  ) => WithRequired<
    QueryFilters<
      DataTag<TuyauQueryKey, TuyauInfiniteData<UnionFromSuccessStatuses<EDef['response']>>, any>
    >,
    'queryKey'
  >
}
