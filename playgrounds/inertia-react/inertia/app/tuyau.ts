import { createTuyau } from '@tuyau/client'

import { api } from '../../.adonisjs/api'

declare module '@tuyau/inertia/types' {
  type ApiDefinition = typeof api
  export interface Api extends ApiDefinition {}
}

export const tuyau = createTuyau({
  api,
  baseUrl: import.meta.env.VITE_API_URL || `http://localhost:3333`,
})
