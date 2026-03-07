import { Tuyau } from '@tuyau/core/client'
import type { RawRequestArgs } from '@tuyau/core/types'

import { extractKyOptions } from './utils.ts'
import type { TuyauMutationKey, TuyauQueryBaseOptions } from './types.ts'

/**
 * Builds a mutation key from route path segments
 */
export function getMutationKeyInternal(options: { segments: string[] }): TuyauMutationKey {
  const key: TuyauMutationKey = [options.segments.flatMap((part) => part.split('.'))]
  return key
}

/**
 * Internal options for building a mutation function
 */
export interface CreateMutationFnOptions {
  opts?: TuyauQueryBaseOptions
  routeName: string
  client: Tuyau<any>
}

/**
 * Creates a TanStack Query `mutationFn` from Tuyau route information.
 * Ky retries are disabled (retry: 0) to let TanStack Query handle retries
 */
export function createMutationFn(options: CreateMutationFnOptions) {
  return async (request: any) => {
    const kyOptions = extractKyOptions(options.opts?.tuyau)
    const requestArgs: RawRequestArgs<any> = request || {}
    return await options.client.request(options.routeName, {
      ...requestArgs,
      ...kyOptions,
      retry: 0,
    })
  }
}
