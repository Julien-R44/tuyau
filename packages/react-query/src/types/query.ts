import type { TuyauError } from '@tuyau/core/client'
import type {
  ErrorResponseOf,
  NormalizeError,
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

type Response<E extends SchemaEndpoint> = E['types']['response']
type Error<E extends SchemaEndpoint> = TuyauError<NormalizeError<ErrorResponseOf<E>>>

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
    opts: DefinedTuyauQueryOptionsIn<Response<EDef>, TData, Error<EDef>>,
  ): DefinedTuyauQueryOptionsOut<Response<EDef>, TData, Error<EDef>>

  // Without skipToken - when input is not SkipToken and no initialData
  <TData = Response<EDef>>(
    input: RawRequestArgs<EDef>,
    opts?: UnusedSkipTokenTuyauQueryOptionsIn<Response<EDef>, TData, Error<EDef>>,
  ): UnusedSkipTokenTuyauQueryOptionsOut<Response<EDef>, TData, Error<EDef>>

  // No arguments - no skipToken possible
  (): UnusedSkipTokenTuyauQueryOptionsOut<Response<EDef>, Response<EDef>, Error<EDef>>

  // With skipToken only (no options)
  (input: SkipToken): UndefinedTuyauQueryOptionsOut<Response<EDef>, Response<EDef>, Error<EDef>>

  // With skipToken or conditional (request | skipToken) with optional options
  <TData = Response<EDef>>(
    input: RawRequestArgs<EDef> | SkipToken,
    opts?: UndefinedTuyauQueryOptionsIn<Response<EDef>, TData, Error<EDef>>,
  ): UndefinedTuyauQueryOptionsOut<Response<EDef>, TData, Error<EDef>>
}
