import type { AdonisEndpoint } from '../../src/client/types/types.ts'
import type { ApiDefinition } from './api_definition.ts'

export type { ApiDefinition } from './api_definition.ts'

const placeholder: any = {}

const routes = {
  'auth.login': {
    methods: ['POST'],
    pattern: '/auth/login',
    domain: 'root',
    tokens: [{ old: '/auth/login', type: 0, val: 'auth/login', end: '' }],
    types: placeholder as {
      body: { email: string; password: string; file?: any }
      paramsTuple: [string, string]
      params: { 'user-id'?: string; 'user-token'?: string }
      query: { foo?: string }
      response: { token: string }
    },
  },
  'auth.login.show': {
    methods: ['GET'],
    pattern: '/auth/login',
    domain: 'root',
    tokens: [{ old: '/auth/login', type: 0, val: 'auth/login', end: '' }],
    types: placeholder as {
      body: {}
      paramsTuple: [string, string]
      params: {}
      query: { foo?: string }
      response: { token: string }
    },
  },
  'users.index': {
    methods: ['GET'],
    pattern: '/users',
    domain: 'root',
    tokens: [{ old: '/users', type: 0, val: 'users', end: '' }],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { ids?: (string | number | undefined | null)[]; email?: string }
      response: { token: string }
    },
  },
  'users.bar': {
    methods: ['GET'],
    pattern: '/users/foo',
    domain: 'root',
    tokens: [{ old: '/users/foo', type: 0, val: 'users', end: '' }],
    types: placeholder as {
      body: {}
      params: {}
      paramsTuple: []
      query: { ids: (string | number | undefined | null)[]; email?: string }
      response: { token: string }
    },
  },
  'users.store': {
    methods: ['POST'],
    pattern: '/users',
    domain: 'root',
    tokens: [{ old: '/users', type: 0, val: 'users', end: '' }],
    types: placeholder as {
      paramsTuple: [string, string, string]
      body: { file: any }
      params: {}
      query: {}
      response: { token: string }
    },
  },
  'posts.comments.likes.detail': {
    methods: ['GET'],
    pattern: '/posts/:postId/comments/:commentId/likes/:likeId',
    domain: 'root',
    tokens: [
      { old: '/posts/:postId/comments/:commentId/likes/:likeId', type: 0, val: 'posts', end: '' },
      { old: '/posts/:postId/comments/:commentId/likes/:likeId', type: 1, val: 'postId', end: '' },
      {
        old: '/posts/:postId/comments/:commentId/likes/:likeId',
        type: 0,
        val: 'comments',
        end: '',
      },
      {
        old: '/posts/:postId/comments/:commentId/likes/:likeId',
        type: 1,
        val: 'commentId',
        end: '',
      },
      { old: '/posts/:postId/comments/:commentId/likes/:likeId', type: 0, val: 'likes', end: '' },
      { old: '/posts/:postId/comments/:commentId/likes/:likeId', type: 1, val: 'likeId', end: '' },
    ],
    types: placeholder as {
      paramsTuple: [string, string, string]
      body: {}
      params: { postId: string; commentId: string; likeId: string }
      query: { foo: string }
      response: { id: string }
    },
  },
  'posts.comments.likes.toggle': {
    methods: ['POST'],
    pattern: '/posts/:postId/comments/:commentId/likes/:likeId/toggle',
    domain: 'root',
    tokens: [
      {
        old: '/posts/:postId/comments/:commentId/likes/:likeId/toggle',
        type: 0,
        val: 'posts',
        end: '',
      },
      {
        old: '/posts/:postId/comments/:commentId/likes/:likeId/toggle',
        type: 1,
        val: 'postId',
        end: '',
      },
      {
        old: '/posts/:postId/comments/:commentId/likes/:likeId/toggle',
        type: 0,
        val: 'comments',
        end: '',
      },
      {
        old: '/posts/:postId/comments/:commentId/likes/:likeId/toggle',
        type: 1,
        val: 'commentId',
        end: '',
      },
      {
        old: '/posts/:postId/comments/:commentId/likes/:likeId/toggle',
        type: 0,
        val: 'likes',
        end: '',
      },
    ],
    types: placeholder as {
      paramsTuple: [string, string, string]
      body: { baz?: string }
      params: { postId: string; commentId: string; likeId: string }
      query: { foo: string }
      response: { id: string }
    },
  },
  'users.show': {
    methods: ['GET'],
    pattern: '/users/:id',
    domain: 'root',
    tokens: [
      { old: '/users/:id', type: 0, val: 'users', end: '' },
      { old: '/users/:id', type: 1, val: 'id', end: '' },
    ],
    types: placeholder as {
      paramsTuple: [string]
      body: {}
      params: { id: string }
      query: { foo: string }
      response: { id: string }
    },
  },
  'products.search': {
    methods: ['GET'],
    pattern: '/products/search',
    domain: 'root',
    tokens: [{ old: '/products/search', type: 0, val: 'products/search', end: '' }],
    types: placeholder as {
      paramsTuple: []
      body: {}
      params: {}
      query: { q?: string; category?: string; minPrice?: number }
      response: { products: Array<{ id: number; name: string }> }
    },
  },
  'products.store': {
    methods: ['POST'],
    pattern: '/products',
    domain: 'root',
    tokens: [{ old: '/products', type: 0, val: 'products', end: '' }],
    types: placeholder as {
      paramsTuple: []
      body: { name: string; price: number; category: string }
      params: {}
      query: {}
      response: { id: number; name: string }
    },
  },
  'users.update': {
    methods: ['PUT'],
    pattern: '/users/:id',
    domain: 'root',
    tokens: [
      { old: '/users/:id', type: 0, val: 'users', end: '' },
      { old: '/users/:id', type: 1, val: 'id', end: '' },
    ],
    types: placeholder as {
      paramsTuple: [string]
      body: { name: string }
      params: { id: string }
      query: {}
      response: { id: string; name: string }
    },
  },
  'users.patch': {
    methods: ['PATCH'],
    pattern: '/users/:id',
    domain: 'root',
    tokens: [
      { old: '/users/:id', type: 0, val: 'users', end: '' },
      { old: '/users/:id', type: 1, val: 'id', end: '' },
    ],
    types: placeholder as {
      paramsTuple: [string]
      body: { name?: string }
      params: { id: string }
      query: {}
      response: { id: string; name: string }
    },
  },
  'users.destroy': {
    methods: ['DELETE'],
    pattern: '/users/:id',
    domain: 'root',
    tokens: [
      { old: '/users/:id', type: 0, val: 'users', end: '' },
      { old: '/users/:id', type: 1, val: 'id', end: '' },
    ],
    types: placeholder as {
      paramsTuple: [string]
      body: {}
      params: { id: string }
      query: {}
      response: { success: boolean }
    },
  },

  'subscriber_lists.store': {
    methods: ['POST'],
    pattern: '/api/subscriber-lists',
    domain: 'root',
    tokens: [
      { old: '/api/subscriber-lists', type: 0, val: 'api', end: '' },
      { old: '/api/subscriber-lists', type: 0, val: 'subscriber-lists', end: '' },
    ],
    types: placeholder as {
      paramsTuple: []
      body: { name: string }
      params: {}
      query: {}
      response: { id: number; name: string }
    },
  },
  'subscriber_lists.index': {
    methods: ['GET'],
    pattern: '/api/subscriber-lists',
    domain: 'root',
    tokens: [
      { old: '/api/subscriber-lists', type: 0, val: 'api', end: '' },
      { old: '/api/subscriber-lists', type: 0, val: 'subscriber-lists', end: '' },
    ],
    types: placeholder as {
      paramsTuple: []
      body: {}
      params: {}
      query: {}
      response: { lists: Array<{ id: number; name: string }> }
    },
  },

  'subscriber-lists.show': {
    methods: ['GET'],
    pattern: '/api/subscriber-lists/:id',
    domain: 'root',
    tokens: [
      { old: '/api/subscriber-lists/:id', type: 0, val: 'api', end: '' },
      { old: '/api/subscriber-lists/:id', type: 0, val: 'subscriber-lists', end: '' },
      { old: '/api/subscriber-lists/:id', type: 1, val: 'id', end: '' },
    ],
    types: placeholder as {
      paramsTuple: [string]
      body: {}
      params: { id: string }
      query: {}
      response: { id: number; name: string }
    },
  },
  /**
   * Route with headers and cookies validation (POST)
   * Simulates a validator like:
   * vine.object({
   *   username: vine.string(),
   *   headers: vine.object({ authorization: vine.string() }),
   *   cookies: vine.object({ sessionId: vine.string() }),
   * })
   */
  'secure.create': {
    methods: ['POST'],
    pattern: '/secure',
    domain: 'root',
    tokens: [{ old: '/secure', type: 0, val: 'secure', end: '' }],
    types: placeholder as {
      paramsTuple: []
      body: { username: string }
      params: {}
      query: {}
      response: { success: boolean }
    },
  },
  /**
   * Route with headers, cookies and query validation (GET)
   * Simulates a validator like:
   * vine.object({
   *   search: vine.string().optional(),
   *   headers: vine.object({ 'x-api-key': vine.string() }),
   *   cookies: vine.object({ token: vine.string().optional() }),
   * })
   */
  'secure.search': {
    methods: ['GET'],
    pattern: '/secure/search',
    domain: 'root',
    tokens: [{ old: '/secure/search', type: 0, val: 'secure/search', end: '' }],
    types: placeholder as {
      paramsTuple: []
      body: {}
      params: {}
      query: { search?: string }
      response: { results: string[] }
    },
  },
  'api.v1.teste': {
    methods: ['GET'],
    pattern: '/v1/teste',
    domain: 'api',
    tokens: [{ old: '/v1/teste', type: 0, val: 'v1/teste', end: '' }],
    types: placeholder as {
      paramsTuple: []
      body: {}
      params: {}
      query: {}
      response: { message: string }
    },
  },
} as const satisfies Record<string, AdonisEndpoint>

export const defaultRegistry = {
  routes,
  $tree: {} as ApiDefinition,
}
