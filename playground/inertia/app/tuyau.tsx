/// <reference path="../../adonisrc.ts" />

import { createTuyau } from '@tuyau/client'

import type { AdonisApi } from '../../.adonisjs/types/api'

export const tuyau = createTuyau<AdonisApi>('http://localhost:3333')
