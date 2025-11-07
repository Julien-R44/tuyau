import { createTuyau } from '@tuyau/core/client'
import { registry } from '~generated/registry'

export const client = createTuyau({
  baseUrl: 'http://localhost:3333',
  registry: registry,
})
export const urlFor = client.urlFor
