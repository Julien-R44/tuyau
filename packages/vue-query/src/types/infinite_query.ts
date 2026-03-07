import type { SchemaEndpoint, RawRequestArgs } from '@tuyau/core/types'
import type { DataTag, InfiniteData, QueryFilters, SkipToken } from '@tanstack/query-core'
import type { WithRequired, TuyauQueryKey } from '@tuyau/query-core'

import type {
  DefinedTuyauInfiniteQueryOptionsIn,
  DefinedTuyauInfiniteQueryOptionsOut,
  UndefinedTuyauInfiniteQueryOptionsIn,
  UndefinedTuyauInfiniteQueryOptionsOut,
} from './common.ts'

/**
 * Extracts the response type from a schema endpoint definition
 */
type Response<E extends SchemaEndpoint> = E['types']['response']

/**
 * Callable interface for building infinite query options on a given endpoint.
 * Provides overloads for different usage scenarios:
 * - With undefined initial data (default)
 * - With defined initial data
 * - Without arguments
 * - With skipToken for conditional queries
 *
 * Note: Vue Query does not have `UnusedSkipTokenInfiniteOptions` like React Query,
 * so there are fewer overloads and no `useSuspenseInfiniteQuery` compatibility
 */
export interface TuyauVueInfiniteQueryOptions<EDef extends SchemaEndpoint> {
  /**
   * With request input and undefined initial data (default case)
   */
  <TData = InfiniteData<Response<EDef>>>(
    input: RawRequestArgs<EDef>,
    opts: UndefinedTuyauInfiniteQueryOptionsIn<Response<EDef>, unknown, TData>,
  ): UndefinedTuyauInfiniteQueryOptionsOut<Response<EDef>, unknown, TData>

  /**
   * With defined initial data
   */
  <TData = InfiniteData<Response<EDef>>>(
    input: RawRequestArgs<EDef> | SkipToken,
    opts: DefinedTuyauInfiniteQueryOptionsIn<Response<EDef>, unknown, TData>,
  ): DefinedTuyauInfiniteQueryOptionsOut<Response<EDef>, unknown, TData>

  /**
   * No arguments
   */
  (): UndefinedTuyauInfiniteQueryOptionsOut<
    Response<EDef>,
    unknown,
    InfiniteData<Response<EDef>>
  >

  /**
   * With skipToken or conditional input and options
   */
  <TData = InfiniteData<Response<EDef>>>(
    input: RawRequestArgs<EDef> | SkipToken,
    opts: UndefinedTuyauInfiniteQueryOptionsIn<Response<EDef>, unknown, TData>,
  ): UndefinedTuyauInfiniteQueryOptionsOut<Response<EDef>, unknown, TData>
}

/**
 * Decorates query endpoints (GET/HEAD) with `infiniteQueryOptions`,
 * `infiniteQueryKey`, and `infiniteQueryFilter` methods for use
 * with Vue's `useInfiniteQuery`
 */
export interface DecorateInfiniteQueryFn<EDef extends SchemaEndpoint> {
  infiniteQueryOptions: TuyauVueInfiniteQueryOptions<EDef>
  infiniteQueryKey: (
    args?: RawRequestArgs<EDef>,
  ) => DataTag<TuyauQueryKey, InfiniteData<Response<EDef>>>
  infiniteQueryFilter: (
    args?: RawRequestArgs<EDef>,
    filters?: QueryFilters<DataTag<TuyauQueryKey, InfiniteData<Response<EDef>>>>,
  ) => WithRequired<QueryFilters<DataTag<TuyauQueryKey, InfiniteData<Response<EDef>>>>, 'queryKey'>
}
