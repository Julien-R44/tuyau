import { mutationOptions } from '@tanstack/react-query'
import type {
  SchemaEndpoint,
  RawRequestArgs,
  ErrorResponseOf,
  NormalizeError,
} from '@tuyau/core/types'
import type { UseMutationOptions } from '@tanstack/react-query'
import { getMutationKeyInternal, createMutationFn } from '@tuyau/query-core'
import type { DistributiveOmit, TuyauQueryBaseOptions, TuyauMutationKey } from '@tuyau/query-core'
import { Tuyau } from '@tuyau/core/client'
import type { TuyauError } from '@tuyau/core/client'

type ReservedOptions = 'mutationKey' | 'mutationFn'

/**
 * Extracts the response type from a schema endpoint definition
 */
type Response<E extends SchemaEndpoint> = E['types']['response']

/*
 * Extracts the error type from a schema endpoint definition,
 */
type Error<E extends SchemaEndpoint> = TuyauError<NormalizeError<ErrorResponseOf<E>>>

/**
 * User-facing mutation options input. Extends TanStack's mutation observer
 * options but omits `mutationKey` and `mutationFn` which are auto-generated
 */
export interface TuyauMutationOptionsIn<TInput, TError, TOutput, TContext>
  extends
    DistributiveOmit<UseMutationOptions<TOutput, TError, TInput, TContext>, ReservedOptions>,
    TuyauQueryBaseOptions {}

/**
 * Fully resolved mutation options ready to be passed to `useMutation`.
 * Includes the auto-generated `mutationKey` and `mutationFn`
 */
export interface TuyauMutationOptionsOut<
  TInput,
  TError,
  TOutput,
  TContext,
> extends UseMutationOptions<TOutput, TError, TInput, TContext> {
  mutationKey: TuyauMutationKey
}

/**
 * Callable interface exposed on mutation endpoints.
 * Returns fully resolved mutation options from user-provided options
 */
export interface TuyauReactMutationOptions<TDef extends SchemaEndpoint> {
  <TContext = unknown>(
    opts?: TuyauMutationOptionsIn<RawRequestArgs<TDef>, Error<TDef>, Response<TDef>, TContext>,
  ): TuyauMutationOptionsOut<RawRequestArgs<TDef>, Error<TDef>, Response<TDef>, TContext>
}

/**
 * Decorates mutation endpoints with `mutationOptions` and `mutationKey` methods
 */
export interface DecorateMutationFn<EDef extends SchemaEndpoint> {
  mutationOptions: TuyauReactMutationOptions<EDef>
  mutationKey: () => TuyauMutationKey
}

/**
 * Internal options for building a mutation options object
 */
export interface TuyauMutationOptionsOptions {
  opts?: TuyauMutationOptionsIn<any, any, any, any>
  routeName: string
  client: Tuyau<any>
}

/**
 * Builds a TanStack React Query `mutationOptions` object from Tuyau route information.
 * Delegates mutationFn creation to the shared `createMutationFn` from `@tuyau/query-core`
 */
export function tuyauMutationOptions(options: TuyauMutationOptionsOptions) {
  const { opts, routeName, client } = options
  const mutationKey = getMutationKeyInternal({ segments: routeName.split('.') })
  const mutationFn = createMutationFn({ opts, routeName, client })
  return mutationOptions({ ...opts, mutationKey, mutationFn })
}
