/// <reference path="../../inertia-react/adonisrc.ts" />

import { createTuyau } from '@tuyau/client'

import type { ApiDefinition } from '../../.adonisjs/api.js'

export const tuyau = createTuyau<{ definition: ApiDefinition }>({
  baseUrl: 'http://localhost:3333',
})
