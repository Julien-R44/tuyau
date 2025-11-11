import * as React from 'react'
import type { Tuyau } from '@tuyau/core/client'
import { AdonisEndpoint } from '@tuyau/core/types'
import type { QueryClient } from '@tanstack/react-query'

import { createTuyauReactQueryClient, type TuyauReactQuery } from './index.ts'

export interface CreateTuyauContextResult<TRegistry extends Record<string, AdonisEndpoint>> {
  TuyauProvider: React.FC<{
    children: React.ReactNode
    queryClient: QueryClient
    client: Tuyau<TRegistry>
  }>
  useTuyau: () => TuyauReactQuery<TRegistry>
  useTuyauClient: () => Tuyau<TRegistry>
}

/**
 * Create a set of type-safe provider-consumers for Tuyau with React Query
 */
export function createTuyauContext<
  TRegistry extends Record<string, AdonisEndpoint>,
>(): CreateTuyauContextResult<TRegistry> {
  const TuyauClientContext = React.createContext<Tuyau<TRegistry> | null>(null)
  const TuyauContext = React.createContext<TuyauReactQuery<TRegistry> | null>(null)

  function TuyauProvider(
    props: Readonly<{
      children: React.ReactNode
      queryClient: QueryClient
      client: Tuyau<TRegistry>
    }>,
  ) {
    const value = React.useMemo(() => {
      return createTuyauReactQueryClient({
        client: props.client,
        queryClient: props.queryClient,
      })
    }, [props.client, props.queryClient])

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
