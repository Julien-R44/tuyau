import type { AdonisEndpoint, RawRequestArgs } from '@tuyau/core/types'
import type {
  DataTag,
  InfiniteData,
  InfiniteQueryObserverOptions,
  QueryFilters,
  SkipToken,
  WithRequired,
} from '@tanstack/react-query'

import type { DistributiveOmit } from './utils.ts'
import type { TuyauQueryBaseOptions, TuyauQueryKey, TypeHelper } from './common.ts'

/**
 * Infinite query options input type
 */
export interface TuyauInfiniteQueryOptionsIn<TQueryFnData, TError, TData>
  extends DistributiveOmit<
      InfiniteQueryObserverOptions<TQueryFnData, TError, TData>,
      'queryKey' | 'queryFn' | 'queryHashFn' | 'queryHash'
    >,
    TuyauQueryBaseOptions {
  /**
   * The key that will be used for the page parameter in the request.
   * For example, if your API expects ?page=1, set this to 'page'.
   * If your API expects ?cursor=abc, set this to 'cursor'.
   */
  pageParamKey?: string
}

/**
 * Infinite query options output type
 */
export interface TuyauInfiniteQueryOptionsOut<TQueryFnData, TError, TData>
  extends Omit<InfiniteQueryObserverOptions<TQueryFnData, TError, TData>, 'queryKey'> {
  queryKey: DataTag<TuyauQueryKey, TData>
}

/**
 * Type definition for infinite query options
 */
export interface TuyauReactInfiniteQueryOptions<EDef extends AdonisEndpoint> {
  <TData = InfiniteData<EDef['types']['response']>>(
    input: RawRequestArgs<EDef> | SkipToken,
    opts: TuyauInfiniteQueryOptionsIn<EDef['types']['response'], unknown, TData>,
  ): TuyauInfiniteQueryOptionsOut<EDef['types']['response'], unknown, TData>

  <TData = InfiniteData<EDef['types']['response']>>(
    input?: RawRequestArgs<EDef> | SkipToken,
    opts?: TuyauInfiniteQueryOptionsIn<EDef['types']['response'], unknown, TData>,
  ): TuyauInfiniteQueryOptionsOut<EDef['types']['response'], unknown, TData>
}

/**
 * Decorate query endpoints with infinite query capabilities
 */
export interface DecorateInfiniteQueryFn<EDef extends AdonisEndpoint> extends TypeHelper<EDef> {
  infiniteQueryOptions: TuyauReactInfiniteQueryOptions<EDef>
  infiniteQueryKey: (
    args?: RawRequestArgs<EDef>,
  ) => DataTag<TuyauQueryKey, InfiniteData<EDef['types']['response']>>
  infiniteQueryFilter: (
    args?: RawRequestArgs<EDef>,
    filters?: QueryFilters<DataTag<TuyauQueryKey, InfiniteData<EDef['types']['response']>>>,
  ) => WithRequired<
    QueryFilters<DataTag<TuyauQueryKey, InfiniteData<EDef['types']['response']>>>,
    'queryKey'
  >
}
