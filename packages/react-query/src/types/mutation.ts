import { UseMutationOptions } from '@tanstack/react-query'
import { AdonisEndpoint, RawRequestArgs } from '@tuyau/core/types'

import { DistributiveOmit } from './utils.ts'
import { TuyauMutationKey, TuyauQueryBaseOptions } from './common.ts'

type ReservedOptions = 'mutationKey' | 'mutationFn'

export interface TuyauMutationOptionsIn<TInput, TError, TOutput, TContext>
  extends DistributiveOmit<UseMutationOptions<TOutput, TError, TInput, TContext>, ReservedOptions>,
    TuyauQueryBaseOptions {}

export interface TuyauMutationOptionsOut<TInput, TError, TOutput, TContext>
  extends UseMutationOptions<TOutput, TError, TInput, TContext> {
  mutationKey: TuyauMutationKey
}

/**
 * Type definition for mutation options
 */
export interface TuyauReactMutationOptions<TDef extends AdonisEndpoint> {
  <TContext = unknown>(
    opts?: TuyauMutationOptionsIn<RawRequestArgs<TDef>, any, TDef['types']['response'], TContext>,
  ): TuyauMutationOptionsOut<RawRequestArgs<TDef>, any, TDef['types']['response'], TContext>
}
