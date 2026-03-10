import type {
  ErrorOf,
  ResponseOf,
  SchemaEndpoint,
  RawRequestArgs,
} from '@tuyau/core/types'
import type { DataTag, QueryFilters, SkipToken } from '@tanstack/react-query'
import type { WithRequired } from '@tuyau/query-core'

import type {
  DefinedTuyauQueryOptionsIn,
  DefinedTuyauQueryOptionsOut,
  TuyauQueryKey,
  UndefinedTuyauQueryOptionsIn,
  UndefinedTuyauQueryOptionsOut,
  UnusedSkipTokenTuyauQueryOptionsIn,
  UnusedSkipTokenTuyauQueryOptionsOut,
} from './common.ts'

/**
 * Decorate query endpoints with Tanstack queries abilities
 */
export interface DecorateQueryFn<EDef extends SchemaEndpoint> {
  queryOptions: TuyauReactQueryOptions<EDef>
  queryKey: (args?: RawRequestArgs<EDef>) => DataTag<TuyauQueryKey, ResponseOf<EDef>>
  queryFilter: (
    args?: RawRequestArgs<EDef>,
    filters?: QueryFilters<DataTag<TuyauQueryKey, ResponseOf<EDef>>>,
  ) => WithRequired<QueryFilters<DataTag<TuyauQueryKey, ResponseOf<EDef>>>, 'queryKey'>
}

/**
 * Type definition for query options with overloads for different scenarios
 */
export interface TuyauReactQueryOptions<EDef extends SchemaEndpoint> {
  // With initial data - when opts has initialData defined
  <TData = ResponseOf<EDef>>(
    input: RawRequestArgs<EDef> | SkipToken,
    opts: DefinedTuyauQueryOptionsIn<ResponseOf<EDef>, TData, ErrorOf<EDef>>,
  ): DefinedTuyauQueryOptionsOut<ResponseOf<EDef>, TData, ErrorOf<EDef>>

  // Without skipToken - when input is not SkipToken and no initialData
  <TData = ResponseOf<EDef>>(
    input: RawRequestArgs<EDef>,
    opts?: UnusedSkipTokenTuyauQueryOptionsIn<ResponseOf<EDef>, TData, ErrorOf<EDef>>,
  ): UnusedSkipTokenTuyauQueryOptionsOut<ResponseOf<EDef>, TData, ErrorOf<EDef>>

  // No arguments - no skipToken possible
  (): UnusedSkipTokenTuyauQueryOptionsOut<ResponseOf<EDef>, ResponseOf<EDef>, ErrorOf<EDef>>

  // With skipToken only (no options)
  (input: SkipToken): UndefinedTuyauQueryOptionsOut<ResponseOf<EDef>, ResponseOf<EDef>, ErrorOf<EDef>>

  // With skipToken or conditional (request | skipToken) with optional options
  <TData = ResponseOf<EDef>>(
    input: RawRequestArgs<EDef> | SkipToken,
    opts?: UndefinedTuyauQueryOptionsIn<ResponseOf<EDef>, TData, ErrorOf<EDef>>,
  ): UndefinedTuyauQueryOptionsOut<ResponseOf<EDef>, TData, ErrorOf<EDef>>
}
