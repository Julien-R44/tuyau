import { registry } from '~generated/registry'
import { createTuyau } from '@tuyau/core/client'
import { createTuyauReactQueryClient } from '@tuyau/react-query'
import { QueryClient } from '@tanstack/react-query'

export const client = createTuyau({
  baseUrl: 'http://localhost:3333',
  registry,
})
export const urlFor = client.urlFor

export const queryClient = new QueryClient()

export const query = createTuyauReactQueryClient({
  client,
  queryClient,
})
