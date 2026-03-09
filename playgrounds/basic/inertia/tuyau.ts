import { registry } from '~generated/registry'
import { QueryClient } from '@tanstack/react-query'
import { createTuyau } from '@tuyau/core/client'
import { Route } from '@tuyau/core/types'
import { createTuyauReactQueryClient } from '@tuyau/react-query'

export const client = createTuyau({
  baseUrl: 'http://localhost:3333',
  registry,
  headers: { Accept: 'application/json' },
})
export const urlFor = client.urlFor
export type { Route }

export const queryClient = new QueryClient()

export const query = createTuyauReactQueryClient({ client })
