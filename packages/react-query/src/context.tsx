import * as React from 'react'
import type { Tuyau } from '@tuyau/core/client'
import type { QueryClient } from '@tanstack/react-query'
import type { AdonisEndpoint, InferRoutes, TuyauRegistry } from '@tuyau/core/types'

import { createTuyauReactQueryClient, type TuyauReactQuery } from './index.ts'

export interface CreateTuyauContextResult<
  TRegistry extends TuyauRegistry,
  TRoutes extends Record<string, AdonisEndpoint> = InferRoutes<TRegistry>,
> {
  TuyauProvider: React.FC<{
    children: React.ReactNode
    queryClient: QueryClient
    client: Tuyau<TRegistry, TRoutes>
  }>
  useTuyau: () => TuyauReactQuery<TRoutes>
  useTuyauClient: () => Tuyau<TRegistry, TRoutes>
}

/**
 * Create a set of type-safe provider-consumers for Tuyau with React Query
 */
export function createTuyauContext<
  TRegistry extends TuyauRegistry,
  TRoutes extends Record<string, AdonisEndpoint> = InferRoutes<TRegistry>,
>(): CreateTuyauContextResult<TRegistry, TRoutes> {
  const TuyauClientContext = React.createContext<Tuyau<TRegistry, TRoutes> | null>(null)
  const TuyauContext = React.createContext<TuyauReactQuery<TRoutes> | null>(null)

  function TuyauProvider(
    props: Readonly<{
      children: React.ReactNode
      queryClient: QueryClient
      client: Tuyau<TRegistry, TRoutes>
    }>,
  ) {
    const value = React.useMemo(() => {
      return createTuyauReactQueryClient({ client: props.client })
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
