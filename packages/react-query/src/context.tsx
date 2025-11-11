import * as React from 'react'
import type { Tuyau } from '@tuyau/core/client'
import { AdonisEndpoint } from '@tuyau/core/types'
import type { QueryClient } from '@tanstack/react-query'

import { createTuyauReactQueryClient, type TuyauReactQuery } from './index.ts'

type InferTuyauClient<TRegistry extends Record<string, AdonisEndpoint>> = Tuyau<TRegistry>

type InferTuyauReactQuery<TRegistry extends Record<string, AdonisEndpoint>> =
  TuyauReactQuery<TRegistry>

export interface CreateTuyauContextOptions<TRegistry extends Record<string, AdonisEndpoint>> {
  client: InferTuyauClient<TRegistry>
  queryClient: QueryClient
}

export interface CreateTuyauContextResult<TRegistry extends Record<string, AdonisEndpoint>> {
  TuyauProvider: React.FC<{
    children: React.ReactNode
    queryClient: QueryClient
    client: InferTuyauClient<TRegistry>
  }>
  useTuyau: () => InferTuyauReactQuery<TRegistry>
  useTuyauClient: () => InferTuyauClient<TRegistry>
}

/**
 * Create a set of type-safe provider-consumers for Tuyau with React Query
 */
export function createTuyauContext<
  TRegistry extends Record<string, AdonisEndpoint>,
>(): CreateTuyauContextResult<TRegistry> {
  const TuyauClientContext = React.createContext<InferTuyauClient<TRegistry> | null>(null)
  const TuyauContext = React.createContext<InferTuyauReactQuery<TRegistry> | null>(null)

  function TuyauProvider(
    props: Readonly<{
      children: React.ReactNode
      queryClient: QueryClient
      client: InferTuyauClient<TRegistry>
    }>,
  ) {
    const value = React.useMemo(
      () =>
        createTuyauReactQueryClient({
          client: props.client,
          queryClient: props.queryClient,
        }),
      [props.client, props.queryClient],
    )

    return (
      <TuyauClientContext.Provider value={props.client}>
        <TuyauContext.Provider value={value as any}>{props.children}</TuyauContext.Provider>
      </TuyauClientContext.Provider>
    )
  }

  function useTuyau() {
    const utils = React.useContext(TuyauContext)
    if (!utils) throw new Error('useTuyau() can only be used inside of a <TuyauProvider>')

    return utils
  }

  function useTuyauClient() {
    const client = React.useContext(TuyauClientContext)
    if (!client) throw new Error('useTuyauClient() can only be used inside of a <TuyauProvider>')

    return client
  }

  return { TuyauProvider, useTuyau, useTuyauClient }
}
