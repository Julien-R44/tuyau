import type { TuyauClient } from '@tuyau/client'
import { MutationFunction, QueryClient } from '@tanstack/react-query'

import {
  TuyauMutationKey,
  EndpointDef,
  UnionFromSuccessStatuses,
  TuyauMutationOptionsIn,
  TuyauMutationOptionsOut,
} from './types.js'

/**
 * Generate a Tuyau mutation key from path
 */
export function getMutationKeyInternal(path: readonly string[]): TuyauMutationKey {
  const splitPath = path.flatMap((part) => part.toString().split('.'))

  return splitPath.length ? [splitPath] : ([] as unknown as TuyauMutationKey)
}

/**
 * Create mutation options for Tuyau with React Query integration
 */
export function tuyauMutationOptions(options: {
  opts: any
  path: string[]
  queryClient: QueryClient
  client: TuyauClient<any, any>
}) {
  const { opts, path } = options
  const mutationKey = getMutationKeyInternal(path)

  const mutationFn: MutationFunction = async (input) => {
    // @ts-expect-error - tk, internal API
    const result = await options.client.$fetch({
      paths: path,
      input,
    })
    return result
  }

  return Object.assign(
    { ...opts, mutationKey, mutationFn },
    { tuyau: { path, type: 'mutation' as const } },
  )
}

/**
 * Type definition for mutation options
 */
export interface TuyauReactMutationOptions<TDef extends EndpointDef> {
  <TContext = unknown>(
    opts?: TuyauMutationOptionsIn<
      TDef['request'],
      any,
      UnionFromSuccessStatuses<TDef['response']>,
      TContext
    >,
  ): TuyauMutationOptionsOut<
    TDef['request'],
    any,
    UnionFromSuccessStatuses<TDef['response']>,
    TContext
  >
}

/**
 * Interface for mutation function decorators (mutationOptions, mutationKey)
 */
export interface DecorateMutationFn<EDef extends EndpointDef> {
  mutationOptions: TuyauReactMutationOptions<EDef>
  mutationKey: () => TuyauMutationKey
}
