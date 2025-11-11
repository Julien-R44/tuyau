import { AdonisEndpoint } from '@tuyau/core/types'

const placeholder: any = {}
export const defaultRegistry = {
  'articles.index': {
    methods: ['GET'],
    pattern: '/articles',
    tokens: [{ old: '/articles', type: 0, val: 'articles', end: '' }],
    types: placeholder as {
      body: {}
      paramsTuple: []
      params: {}
      query: { page?: number; limit?: number }
      response: { data: Array<{ id: number; title: string }>; nextCursor: number | null }
    },
  },
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
      query: { name?: string; email?: string }
      response: Array<{ id: number; name: string }>
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
      body: { name: string }
      params: {}
      query: {}
      response: { id: number; name: string }
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
  'users.comments.index': {
    methods: ['GET'],
    pattern: '/users/:userId/comments',
    tokens: [
      { old: '/users/:userId/comments', type: 0, val: 'users', end: '' },
      { old: '/users/:userId/comments', type: 1, val: 'userId', end: '' },
      { old: '/users/:userId/comments', type: 0, val: 'comments', end: '' },
    ],
    types: placeholder as {
      paramsTuple: [string]
      body: {}
      params: { userId: string }
      query: { page?: number; perPage?: number }
      response: Array<{ id: number; body: string }>
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
      query: { foo?: string }
      response: { id: string }
    },
  },
  'do.something': {
    methods: ['POST'],
    pattern: '/do-something',
    tokens: [{ old: '/do-something', type: 0, val: 'do-something', end: '' }],
    types: placeholder as {
      paramsTuple: []
      body: {}
      params: {}
      query: {}
      response: { success: boolean }
    },
  },
} as const satisfies Record<string, AdonisEndpoint>
