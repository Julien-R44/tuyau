import { AdonisEndpoint } from '../../src/client/types/types.js'

const placeholder: any = {}
export const defaultRegistry = {
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
    pattern: '/posts/:post_id/comments/:comment_id/likes/:like_id',
    tokens: [
      {
        old: '/posts/:post_id/comments/:comment_id/likes/:like_id',
        type: 0,
        val: 'posts',
        end: '',
      },
      {
        old: '/posts/:post_id/comments/:comment_id/likes/:like_id',
        type: 1,
        val: 'post_id',
        end: '',
      },
      {
        old: '/posts/:post_id/comments/:comment_id/likes/:like_id',
        type: 0,
        val: 'comments',
        end: '',
      },
      {
        old: '/posts/:post_id/comments/:comment_id/likes/:like_id',
        type: 1,
        val: 'comment_id',
        end: '',
      },
      {
        old: '/posts/:post_id/comments/:comment_id/likes/:like_id',
        type: 0,
        val: 'likes',
        end: '',
      },
      {
        old: '/posts/:post_id/comments/:comment_id/likes/:like_id',
        type: 1,
        val: 'like_id',
        end: '',
      },
    ],
    types: placeholder as {
      paramsTuple: [string, string, string]
      body: {}
      params: { post_id: string; comment_id: string; like_id: string }
      query: { foo: string }
      response: { id: string }
    },
  },
  'posts.comments.likes.toggle': {
    methods: ['POST'],
    pattern: '/posts/:postId/comments/:comment_id/likes/:like_id/toggle',
    tokens: [
      {
        old: '/posts/:postId/comments/:comment_id/likes/:like_id/toggle',
        type: 0,
        val: 'posts',
        end: '',
      },
      {
        old: '/posts/:postId/comments/:comment_id/likes/:like_id/toggle',
        type: 1,
        val: 'postId',
        end: '',
      },
      {
        old: '/posts/:postId/comments/:comment_id/likes/:like_id/toggle',
        type: 0,
        val: 'comments',
        end: '',
      },
      {
        old: '/posts/:postId/comments/:comment_id/likes/:like_id/toggle',
        type: 1,
        val: 'comment_id',
        end: '',
      },
      {
        old: '/posts/:postId/comments/:comment_id/likes/:like_id/toggle',
        type: 0,
        val: 'likes',
        end: '',
      },
    ],
    types: placeholder as {
      paramsTuple: [string, string, string]
      body: { baz?: string }
      params: { postId: string; comment_id: string; like_id: string }
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
} as const satisfies Record<string, AdonisEndpoint>
