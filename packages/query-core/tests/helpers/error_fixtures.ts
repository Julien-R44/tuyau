import type { AdonisEndpoint } from '@tuyau/core/types'

const placeholder: any = {}

const routes = {
  'articles.index': {
    methods: ['GET'],
    pattern: '/articles',
    tokens: [{ old: '/articles', type: 0, val: 'articles', end: '' }],
    types: placeholder as {
      body: {}
      paramsTuple: []
      params: {}
      query: { page?: number }
      response: { data: Array<{ id: number; title: string }>; nextCursor: number | null }
      errorResponse:
        | { status: 404; response: { message: string } }
        | { status: 422; response: { field: string } }
    },
  },
  'contacts.show': {
    methods: ['GET'],
    pattern: '/contacts/:id',
    tokens: [
      { old: '/contacts/:id', type: 0, val: 'contacts', end: '' },
      { old: '/contacts/:id', type: 1, val: 'id', end: '' },
    ],
    types: placeholder as {
      body: {}
      paramsTuple: [string]
      params: { id: string }
      query: {}
      response: { contact: { id: number; name: string } }
      errorResponse:
        | { status: 404; response: { message: string; id: string } }
        | { status: 422; response: { field: string } }
    },
  },
  'contacts.store': {
    methods: ['POST'],
    pattern: '/contacts',
    tokens: [{ old: '/contacts', type: 0, val: 'contacts', end: '' }],
    types: placeholder as {
      body: { name: string }
      paramsTuple: []
      params: {}
      query: {}
      response: { contact: { id: number; name: string } }
      errorResponse:
        | { status: 409; response: { message: string; existingId: number } }
        | { status: 422; response: { field: string } }
    },
  },
} as const satisfies Record<string, AdonisEndpoint>

type Routes = typeof routes

export interface ErrorApiDefinition {
  articles: {
    index: Routes['articles.index']
  }
  contacts: {
    show: Routes['contacts.show']
    store: Routes['contacts.store']
  }
}

export const errorRegistry = {
  routes,
  $tree: {} as ErrorApiDefinition,
}
