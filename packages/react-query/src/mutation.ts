import { Tuyau } from '@tuyau/core/client'
import { mutationOptions } from '@tanstack/react-query'
import type { SchemaEndpoint, RawRequestArgs } from '@tuyau/core/types'
import type { MutationFunction, UseMutationOptions } from '@tanstack/react-query'

import type { DistributiveOmit } from './types/utils.ts'
import type { TuyauQueryBaseOptions, TuyauMutationKey } from './types/common.ts'

type ReservedOptions = 'mutationKey' | 'mutationFn'

type Response<E extends SchemaEndpoint> = E['types']['response']

export interface TuyauMutationOptionsIn<TInput, TError, TOutput, TContext>
  extends DistributiveOmit<UseMutationOptions<TOutput, TError, TInput, TContext>, ReservedOptions>,
    TuyauQueryBaseOptions {}

export interface TuyauMutationOptionsOut<TInput, TError, TOutput, TContext>
  extends UseMutationOptions<TOutput, TError, TInput, TContext> {
  mutationKey: TuyauMutationKey
}

export interface TuyauReactMutationOptions<TDef extends SchemaEndpoint> {
  <TContext = unknown>(
    opts?: TuyauMutationOptionsIn<RawRequestArgs<TDef>, any, Response<TDef>, TContext>,
  ): TuyauMutationOptionsOut<RawRequestArgs<TDef>, any, Response<TDef>, TContext>
}

export function getMutationKeyInternal(options: { segments: string[] }): TuyauMutationKey {
  const key: TuyauMutationKey = [options.segments.flatMap((part) => part.split('.'))]
  return key
}

export interface DecorateMutationFn<EDef extends SchemaEndpoint> {
  mutationOptions: TuyauReactMutationOptions<EDef>
  mutationKey: () => TuyauMutationKey
}

export interface TuyauMutationOptionsOptions {
  opts?: TuyauMutationOptionsIn<any, any, any, any>
  routeName: string
  client: Tuyau<any>
}

export function tuyauMutationOptions(options: TuyauMutationOptionsOptions) {
  const { opts, routeName, client } = options

  const mutationKey = getMutationKeyInternal({ segments: routeName.split('.') })

  const mutationFn: MutationFunction = async (request: any) => {
    const requestArgs: RawRequestArgs<any> = request || {}
    return await client.request(routeName, { ...requestArgs, retry: 0 })
  }

  return mutationOptions({ ...opts, mutationKey, mutationFn })
}
