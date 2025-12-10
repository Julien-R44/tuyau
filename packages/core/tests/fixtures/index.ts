import type { AdonisEndpoint } from '../../src/client/types/types.ts'
import type { ApiDefinition } from './api_definition.ts'

export type { ApiDefinition } from './api_definition.ts'

const placeholder: any = {}

const routes = {
  'auth.login': {
    methods: ['POST'],
    pattern: '/auth/login',
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
} as const satisfies Record<string, AdonisEndpoint>

export const defaultRegistry = {
  routes,
  $tree: {} as ApiDefinition,
}
