import type { ErrorOf, RawRequestArgs, ResponseOf, SchemaEndpoint } from '@tuyau/core/types'
import type { DataTag, QueryFilters, SkipToken } from '@tanstack/query-core'
import type { WithRequired, TuyauQueryKey } from '@tuyau/query-core'

import type {
  DefinedTuyauQueryOptionsIn,
  DefinedTuyauQueryOptionsOut,
  UndefinedTuyauQueryOptionsIn,
  UndefinedTuyauQueryOptionsOut,
} from './common.ts'

/**
 * Callable interface for building query options on a given endpoint.
 * Provides overloads for different usage scenarios:
 * - With defined initial data
 * - With optional request args
 * - Without arguments
 * - With skipToken for conditional queries
 */
export interface TuyauSvelteQueryOptions<EDef extends SchemaEndpoint> {
  /**
   * With defined initial data
   */
  <TData = ResponseOf<EDef>>(
    input: RawRequestArgs<EDef> | SkipToken,
    opts: DefinedTuyauQueryOptionsIn<ResponseOf<EDef>, TData, ErrorOf<EDef>>,
  ): DefinedTuyauQueryOptionsOut<ResponseOf<EDef>, TData, ErrorOf<EDef>>

  /**
   * Without initial data (default case)
   */
  <TData = ResponseOf<EDef>>(
    input?: RawRequestArgs<EDef>,
    opts?: UndefinedTuyauQueryOptionsIn<ResponseOf<EDef>, TData, ErrorOf<EDef>>,
  ): UndefinedTuyauQueryOptionsOut<ResponseOf<EDef>, TData, ErrorOf<EDef>>

  /**
   * No arguments
   */
  (): UndefinedTuyauQueryOptionsOut<ResponseOf<EDef>, ResponseOf<EDef>, ErrorOf<EDef>>

  /**
   * With skipToken only (conditional query)
   */
  (
    input: SkipToken,
  ): UndefinedTuyauQueryOptionsOut<ResponseOf<EDef>, ResponseOf<EDef>, ErrorOf<EDef>>

  /**
   * With skipToken or conditional input and optional options
   */
  <TData = ResponseOf<EDef>>(
    input: RawRequestArgs<EDef> | SkipToken,
    opts?: UndefinedTuyauQueryOptionsIn<ResponseOf<EDef>, TData, ErrorOf<EDef>>,
  ): UndefinedTuyauQueryOptionsOut<ResponseOf<EDef>, TData, ErrorOf<EDef>>
}

/**
 * Decorates query endpoints (GET/HEAD) with `queryOptions`, `queryKey`,
 * and `queryFilter` methods for use with Svelte's `createQuery`
 */
export interface DecorateQueryFn<EDef extends SchemaEndpoint> {
  queryOptions: TuyauSvelteQueryOptions<EDef>
  queryKey: (args?: RawRequestArgs<EDef>) => DataTag<TuyauQueryKey, ResponseOf<EDef>>
  queryFilter: (
    args?: RawRequestArgs<EDef>,
    filters?: QueryFilters<DataTag<TuyauQueryKey, ResponseOf<EDef>>>,
  ) => WithRequired<QueryFilters<DataTag<TuyauQueryKey, ResponseOf<EDef>>>, 'queryKey'>
}
