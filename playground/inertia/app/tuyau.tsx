/// <reference path="../../adonisrc.ts" />
/// <reference types="hot-hook/import-meta" />

import { AdonisApi } from '../../.adonisjs/types/api'
import { createTuyau } from '@tuyau/client'

export const tuyau = createTuyau<AdonisApi>('http://localhost:3333')

const result = await tuyau.users.get({
  query: {
    email: 'foo',
    password: 'bar',
  }
})
