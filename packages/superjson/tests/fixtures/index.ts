import type { AdonisEndpoint } from '@tuyau/core/types'

const placeholder: any = {}

const routes = {
  'users.index': {
    methods: ['GET'],
    pattern: '/users',
    tokens: [{ old: '/users', type: 0, val: 'users', end: '' }],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: {}
      response: { token: string }
    },
  },
  'users.store': {
    methods: ['POST'],
    pattern: '/users',
    tokens: [{ old: '/users', type: 0, val: 'users', end: '' }],
    types: placeholder as {
      paramsTuple: []
      body: { date: Date; bigInt?: bigint }
      params: {}
      query: {}
      response: { token: string }
    },
  },
} as const satisfies Record<string, AdonisEndpoint>

type Routes = typeof routes

export interface ApiDefinition {
  users: {
    index: Routes['users.index']
    store: Routes['users.store']
  }
}

export const defaultRegistry = {
  routes,
  $tree: {} as ApiDefinition,
}
