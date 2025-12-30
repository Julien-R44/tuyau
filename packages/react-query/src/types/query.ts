import type { SchemaEndpoint, RawRequestArgs } from '@tuyau/core/types'
import type { DataTag, QueryFilters, SkipToken, WithRequired } from '@tanstack/react-query'

import type {
  DefinedTuyauQueryOptionsIn,
  DefinedTuyauQueryOptionsOut,
  TuyauQueryKey,
  UndefinedTuyauQueryOptionsIn,
  UndefinedTuyauQueryOptionsOut,
  UnusedSkipTokenTuyauQueryOptionsIn,
  UnusedSkipTokenTuyauQueryOptionsOut,
} from './common.ts'

type Response<E extends SchemaEndpoint> = E['types']['response']

/**
 * Decorate query endpoints with Tanstack queries abilities
 */
export interface DecorateQueryFn<EDef extends SchemaEndpoint> {
  queryOptions: TuyauReactQueryOptions<EDef>
  queryKey: (args?: RawRequestArgs<EDef>) => DataTag<TuyauQueryKey, Response<EDef>>
  queryFilter: (
    args?: RawRequestArgs<EDef>,
    filters?: QueryFilters<DataTag<TuyauQueryKey, Response<EDef>>>,
  ) => WithRequired<QueryFilters<DataTag<TuyauQueryKey, Response<EDef>>>, 'queryKey'>
}

/**
 * Type definition for query options with overloads for different scenarios
 */
export interface TuyauReactQueryOptions<EDef extends SchemaEndpoint> {
  // With initial data - when opts has initialData defined
  <TData = Response<EDef>>(
    input: RawRequestArgs<EDef> | SkipToken,
    opts: DefinedTuyauQueryOptionsIn<Response<EDef>, TData, unknown>,
  ): DefinedTuyauQueryOptionsOut<Response<EDef>, TData, unknown>

  // Without skipToken - when input is not SkipToken and no initialData
  <TData = Response<EDef>>(
    input: RawRequestArgs<EDef>,
    opts?: UnusedSkipTokenTuyauQueryOptionsIn<Response<EDef>, TData, unknown>,
  ): UnusedSkipTokenTuyauQueryOptionsOut<Response<EDef>, TData, unknown>

  // No arguments - no skipToken possible
  (): UnusedSkipTokenTuyauQueryOptionsOut<Response<EDef>, Response<EDef>, unknown>

  // With skipToken only (no options)
  (input: SkipToken): UndefinedTuyauQueryOptionsOut<Response<EDef>, Response<EDef>, unknown>

  // With skipToken or conditional (request | skipToken) with optional options
  <TData = Response<EDef>>(
    input: RawRequestArgs<EDef> | SkipToken,
    opts?: UndefinedTuyauQueryOptionsIn<Response<EDef>, TData, unknown>,
  ): UndefinedTuyauQueryOptionsOut<Response<EDef>, TData, unknown>
}
