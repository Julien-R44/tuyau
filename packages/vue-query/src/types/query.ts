import type { SchemaEndpoint, RawRequestArgs } from '@tuyau/core/types'
import type { DataTag, QueryFilters, SkipToken } from '@tanstack/query-core'
import type { WithRequired, TuyauQueryKey } from '@tuyau/query-core'

import type {
  DefinedTuyauQueryOptionsIn,
  DefinedTuyauQueryOptionsOut,
  UndefinedTuyauQueryOptionsIn,
  UndefinedTuyauQueryOptionsOut,
} from './common.ts'

/**
 * Extracts the response type from a schema endpoint definition
 */
type Response<E extends SchemaEndpoint> = E['types']['response']

/**
 * Callable interface for building query options on a given endpoint.
 * Provides overloads for different usage scenarios:
 * - With defined initial data
 * - With optional request args
 * - Without arguments
 * - With skipToken for conditional queries
 *
 * Note: Vue Query does not have `UnusedSkipTokenOptions` like React Query,
 * so there are fewer overloads compared to `TuyauReactQueryOptions`
 */
export interface TuyauVueQueryOptions<EDef extends SchemaEndpoint> {
  /**
   * With defined initial data
   */
  <TData = Response<EDef>>(
    input: RawRequestArgs<EDef> | SkipToken,
    opts: DefinedTuyauQueryOptionsIn<Response<EDef>, TData, unknown>,
  ): DefinedTuyauQueryOptionsOut<Response<EDef>, TData, unknown>

  /**
   * Without initial data (default case)
   */
  <TData = Response<EDef>>(
    input?: RawRequestArgs<EDef>,
    opts?: UndefinedTuyauQueryOptionsIn<Response<EDef>, TData, unknown>,
  ): UndefinedTuyauQueryOptionsOut<Response<EDef>, TData, unknown>

  /**
   * No arguments
   */
  (): UndefinedTuyauQueryOptionsOut<Response<EDef>, Response<EDef>, unknown>

  /**
   * With skipToken only (conditional query)
   */
  (input: SkipToken): UndefinedTuyauQueryOptionsOut<Response<EDef>, Response<EDef>, unknown>

  /**
   * With skipToken or conditional input and optional options
   */
  <TData = Response<EDef>>(
    input: RawRequestArgs<EDef> | SkipToken,
    opts?: UndefinedTuyauQueryOptionsIn<Response<EDef>, TData, unknown>,
  ): UndefinedTuyauQueryOptionsOut<Response<EDef>, TData, unknown>
}

/**
 * Decorates query endpoints (GET/HEAD) with `queryOptions`, `queryKey`,
 * and `queryFilter` methods for use with Vue's `useQuery`
 */
export interface DecorateQueryFn<EDef extends SchemaEndpoint> {
  queryOptions: TuyauVueQueryOptions<EDef>
  queryKey: (args?: RawRequestArgs<EDef>) => DataTag<TuyauQueryKey, Response<EDef>>
  queryFilter: (
    args?: RawRequestArgs<EDef>,
    filters?: QueryFilters<DataTag<TuyauQueryKey, Response<EDef>>>,
  ) => WithRequired<QueryFilters<DataTag<TuyauQueryKey, Response<EDef>>>, 'queryKey'>
}
