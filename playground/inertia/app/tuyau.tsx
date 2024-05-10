/// <reference path="../../adonisrc.ts" />

import { createTuyau } from '@tuyau/client'

import type { ApiDefinition } from '../../.adonisjs/api'

export const tuyau = createTuyau<{ definition: ApiDefinition }>({
  baseUrl: 'http://localhost:3333',
})
