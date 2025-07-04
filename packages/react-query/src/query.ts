import type { TuyauClient } from '@tuyau/client'
import {
  DataTag,
  QueryFilters,
  QueryClient,
  queryOptions,
  skipToken,
  SkipToken,
} from '@tanstack/react-query'

import {
  TuyauQueryKey,
  QueryType,
  EndpointDef,
  UnionFromSuccessStatuses,
  WithRequired,
  DefinedTuyauQueryOptionsIn,
  UndefinedTuyauQueryOptionsIn,
  UnusedSkipTokenTuyauQueryOptionsIn,
  DefinedTuyauQueryOptionsOut,
  UndefinedTuyauQueryOptionsOut,
  UnusedSkipTokenTuyauQueryOptionsOut,
} from './types.js'

/**
 * Generate a Tuyau query key from path and input parameters
 */
export function getQueryKeyInternal(
  path: string[],
  input?: unknown,
  type?: QueryType,
): TuyauQueryKey {
  const splitPath = path.flatMap((part) => part.toString().split('/'))

  if (!input && (!type || type === 'any')) {
    return splitPath.length ? [splitPath] : ([] as unknown as TuyauQueryKey)
  }

  return [
    splitPath,
    {
      ...(typeof input !== 'undefined' && input !== skipToken && { input }),
      ...(type && type !== 'any' && { type }),
    },
  ]
}

/**
 * Create query options for Tuyau with React Query integration
 */
export function tuyauQueryOptions(options: {
  input: unknown
  opts: any
  queryKey: TuyauQueryKey
  queryClient: QueryClient
  path: string[]
  client: TuyauClient<any, any>
}) {
  const { input, opts, queryKey } = options
  const inputIsSkipToken = input === skipToken

  const queryFn = inputIsSkipToken
    ? skipToken
    : async () => {
        // @ts-expect-error - tkt, internal API
        const result = await options.client.$fetch({
          paths: options.path,
          input: options.input,
        })
        return result
      }

  return Object.assign(queryOptions({ ...opts, queryKey, queryFn }), {
    tuyau: { path: options.path, type: 'query' as const },
  })
}

/**
 * Type definition for query options with overloads for different scenarios
 */
export interface TuyauReactQueryOptions<EDef extends EndpointDef> {
  // With initial data - when opts has initialData defined
  <TData = UnionFromSuccessStatuses<EDef['response']>>(
    input: EDef['request'] | SkipToken,
    opts: DefinedTuyauQueryOptionsIn<UnionFromSuccessStatuses<EDef['response']>, TData, any>,
  ): DefinedTuyauQueryOptionsOut<UnionFromSuccessStatuses<EDef['response']>, TData, any>

  // Without skipToken - when input is not SkipToken and no initialData
  <TData = UnionFromSuccessStatuses<EDef['response']>>(
    input: EDef['request'],
    opts?: UnusedSkipTokenTuyauQueryOptionsIn<
      UnionFromSuccessStatuses<EDef['response']>,
      TData,
      any
    >,
  ): UnusedSkipTokenTuyauQueryOptionsOut<UnionFromSuccessStatuses<EDef['response']>, TData, any>

  // Without initial data - when opts has no initialData or input can be SkipToken
  <TData = UnionFromSuccessStatuses<EDef['response']>>(
    input: EDef['request'] | SkipToken,
    opts?: UndefinedTuyauQueryOptionsIn<UnionFromSuccessStatuses<EDef['response']>, TData, any>,
  ): UndefinedTuyauQueryOptionsOut<UnionFromSuccessStatuses<EDef['response']>, TData, any>
}

/**
 * Interface for query function decorators (queryOptions, queryKey, queryFilter)
 */
export interface DecorateQueryFn<EDef extends EndpointDef> {
  queryOptions: TuyauReactQueryOptions<EDef>
  queryKey: (
    input?: Partial<EDef['request']>,
  ) => DataTag<TuyauQueryKey, UnionFromSuccessStatuses<EDef['response']>, any>
  queryFilter: (
    input?: Partial<EDef['request']>,
    filters?: QueryFilters<DataTag<TuyauQueryKey, UnionFromSuccessStatuses<EDef['response']>, any>>,
  ) => WithRequired<
    QueryFilters<DataTag<TuyauQueryKey, UnionFromSuccessStatuses<EDef['response']>, any>>,
    'queryKey'
  >
}
