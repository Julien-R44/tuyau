import { createTuyau } from '@tuyau/client'
import { QueryClient } from '@tanstack/react-query'
import { createTuyauContext, createTuyauReactQueryClient } from '@tuyau/react-query'

import { api } from '../../.adonisjs/api'

export const tuyau = createTuyau({
  api,
  baseUrl: import.meta.env.VITE_API_URL || `http://localhost:3333`,
})

export const {
  TuyauProvider: TuyauQueryProvider,
  useTuyau,
  useTuyauClient,
} = createTuyauContext<typeof api>()
export const queryClient = new QueryClient()

export const tuyauQuery = createTuyauReactQueryClient({ client: tuyau, queryClient })
