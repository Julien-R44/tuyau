import { Tuyau } from '@tuyau/core/client'
import type { RawRequestArgs } from '@tuyau/core/types'
import { queryOptions, skipToken } from '@tanstack/react-query'
import type { QueryFunctionContext, SkipToken } from '@tanstack/react-query'

import { invoke } from './utils.ts'
import type {
  TuyauQueryBaseOptions,
  TuyauQueryKey,
  TuyauReactRequestOptions,
} from './types/common.ts'

export interface TuyauQueryOptionsOptions {
  request: RawRequestArgs<any> | SkipToken
  opts?: TuyauQueryBaseOptions
  queryKey: TuyauQueryKey
  routeName: string
  client: Tuyau<any>
  globalOptions?: TuyauReactRequestOptions
}

export function tuyauQueryOptions(options: TuyauQueryOptionsOptions) {
  const { request, routeName, opts, queryKey, client, globalOptions } = options

  const queryFn = invoke(() => {
    if (request === skipToken) return skipToken

    return async (queryFnContext: QueryFunctionContext) => {
      const effectiveAbortOnUnmount =
        opts?.tuyau?.abortOnUnmount ?? globalOptions?.abortOnUnmount ?? false

      return await client.request(routeName, {
        ...request,
        retry: 0,
        ...(effectiveAbortOnUnmount ? { signal: queryFnContext.signal } : {}),
      })
    }
  })

  return queryOptions({ ...opts, queryKey, queryFn })
}
