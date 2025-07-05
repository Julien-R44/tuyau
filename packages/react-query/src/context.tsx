import * as React from 'react'
import type { QueryClient } from '@tanstack/react-query'
import type { TuyauClient, GeneratedRoutes, ApiDefinition } from '@tuyau/client'

import { createTuyauReactQueryClient, type TuyauReactQuery } from './main.js'

type InferTuyauClient<API extends ApiDefinition> = TuyauClient<
  API['definition'],
  API['routes'] extends GeneratedRoutes ? API['routes'] : any
>

type InferTuyauReactQuery<API extends ApiDefinition> = TuyauReactQuery<API['definition']>

export interface CreateTuyauContextOptions<API extends ApiDefinition> {
  client: InferTuyauClient<API>
  queryClient: QueryClient
}

export interface CreateTuyauContextResult<API extends ApiDefinition> {
  TuyauProvider: React.FC<{
    children: React.ReactNode
    queryClient: QueryClient
    client: InferTuyauClient<API>
  }>
  useTuyau: () => InferTuyauReactQuery<API>
  useTuyauClient: () => InferTuyauClient<API>
}

/**
 * Create a set of type-safe provider-consumers for Tuyau with React Query
 */
export function createTuyauContext<API extends ApiDefinition>(): CreateTuyauContextResult<API> {
  const TuyauClientContext = React.createContext<InferTuyauClient<API> | null>(null)
  const TuyauContext = React.createContext<InferTuyauReactQuery<API> | null>(null)

  function TuyauProvider(
    props: Readonly<{
      children: React.ReactNode
      queryClient: QueryClient
      client: InferTuyauClient<API>
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
        <TuyauContext.Provider value={value}>{props.children}</TuyauContext.Provider>
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
