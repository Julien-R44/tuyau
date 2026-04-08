import type { ErrorOf, RawRequestArgs, ResponseOf, SchemaEndpoint } from '@tuyau/core/types'
import type { DataTag, InfiniteData, QueryFilters, SkipToken } from '@tanstack/query-core'
import type { WithRequired, TuyauQueryKey } from '@tuyau/query-core'

import type {
  DefinedTuyauInfiniteQueryOptionsIn,
  DefinedTuyauInfiniteQueryOptionsOut,
  UndefinedTuyauInfiniteQueryOptionsIn,
  UndefinedTuyauInfiniteQueryOptionsOut,
} from './common.ts'

/**
 * Callable interface for building infinite query options on a given endpoint.
 * Provides overloads for different usage scenarios:
 * - With undefined initial data (default)
 * - With defined initial data
 * - Without arguments
 * - With skipToken for conditional queries
 */
export interface TuyauSvelteInfiniteQueryOptions<EDef extends SchemaEndpoint> {
  /**
   * With request input and undefined initial data (default case)
   */
  <TData = InfiniteData<ResponseOf<EDef>>>(
    input: RawRequestArgs<EDef>,
    opts: UndefinedTuyauInfiniteQueryOptionsIn<ResponseOf<EDef>, ErrorOf<EDef>, TData>,
  ): UndefinedTuyauInfiniteQueryOptionsOut<ResponseOf<EDef>, ErrorOf<EDef>, TData>

  /**
   * With defined initial data
   */
  <TData = InfiniteData<ResponseOf<EDef>>>(
    input: RawRequestArgs<EDef> | SkipToken,
    opts: DefinedTuyauInfiniteQueryOptionsIn<ResponseOf<EDef>, ErrorOf<EDef>, TData>,
  ): DefinedTuyauInfiniteQueryOptionsOut<ResponseOf<EDef>, ErrorOf<EDef>, TData>

  /**
   * No arguments
   */
  (): UndefinedTuyauInfiniteQueryOptionsOut<
    ResponseOf<EDef>,
    ErrorOf<EDef>,
    InfiniteData<ResponseOf<EDef>>
  >

  /**
   * With skipToken or conditional input and options
   */
  <TData = InfiniteData<ResponseOf<EDef>>>(
    input: RawRequestArgs<EDef> | SkipToken,
    opts: UndefinedTuyauInfiniteQueryOptionsIn<ResponseOf<EDef>, ErrorOf<EDef>, TData>,
  ): UndefinedTuyauInfiniteQueryOptionsOut<ResponseOf<EDef>, ErrorOf<EDef>, TData>
}

/**
 * Decorates query endpoints (GET/HEAD) with `infiniteQueryOptions`,
 * `infiniteQueryKey`, and `infiniteQueryFilter` methods for use
 * with Svelte's `createInfiniteQuery`
 */
export interface DecorateInfiniteQueryFn<EDef extends SchemaEndpoint> {
  infiniteQueryOptions: TuyauSvelteInfiniteQueryOptions<EDef>
  infiniteQueryKey: (
    args?: RawRequestArgs<EDef>,
  ) => DataTag<TuyauQueryKey, InfiniteData<ResponseOf<EDef>>>
  infiniteQueryFilter: (
    args?: RawRequestArgs<EDef>,
    filters?: QueryFilters<DataTag<TuyauQueryKey, InfiniteData<ResponseOf<EDef>>>>,
  ) => WithRequired<
    QueryFilters<DataTag<TuyauQueryKey, InfiniteData<ResponseOf<EDef>>>>,
    'queryKey'
  >
}
