import type { AdonisEndpoint, RawRequestArgs } from '@tuyau/core/types'
import type { DataTag, QueryFilters, SkipToken, WithRequired } from '@tanstack/react-query'

import type {
  DefinedTuyauQueryOptionsIn,
  DefinedTuyauQueryOptionsOut,
  TuyauQueryKey,
  TypeHelper,
  UndefinedTuyauQueryOptionsIn,
  UndefinedTuyauQueryOptionsOut,
  UnusedSkipTokenTuyauQueryOptionsIn,
  UnusedSkipTokenTuyauQueryOptionsOut,
} from './common.ts'

/**
 * Decorate query endpoints with Tanstack queries abilities
 */
export interface DecorateQueryFn<EDef extends AdonisEndpoint> extends TypeHelper<EDef> {
  queryOptions: TuyauReactQueryOptions<EDef>
  queryKey: (args?: RawRequestArgs<EDef>) => DataTag<TuyauQueryKey, EDef['types']['response']>
  queryFilter: (
    args?: RawRequestArgs<EDef>,
    filters?: QueryFilters<DataTag<TuyauQueryKey, EDef['types']['response']>>,
  ) => WithRequired<QueryFilters<DataTag<TuyauQueryKey, EDef['types']['response']>>, 'queryKey'>
}

/**
 * Type definition for query options with overloads for different scenarios
 */
export interface TuyauReactQueryOptions<EDef extends AdonisEndpoint> {
  // With initial data - when opts has initialData defined
  <TData = EDef['types']['response']>(
    input: RawRequestArgs<EDef> | SkipToken,
    opts: DefinedTuyauQueryOptionsIn<EDef['types']['response'], TData, unknown>,
  ): DefinedTuyauQueryOptionsOut<EDef['types']['response'], TData, unknown>

  // Without skipToken - when input is not SkipToken and no initialData
  <TData = EDef['types']['response']>(
    input: RawRequestArgs<EDef>,
    opts?: UnusedSkipTokenTuyauQueryOptionsIn<EDef['types']['response'], TData, unknown>,
  ): UnusedSkipTokenTuyauQueryOptionsOut<EDef['types']['response'], TData, unknown>

  // Without initial data - when opts has no initialData or input can be SkipToken
  <TData = EDef['types']['response']>(
    input?: RawRequestArgs<EDef> | SkipToken,
    opts?: UndefinedTuyauQueryOptionsIn<EDef['types']['response'], TData, unknown>,
  ): UndefinedTuyauQueryOptionsOut<EDef['types']['response'], TData, unknown>
}
