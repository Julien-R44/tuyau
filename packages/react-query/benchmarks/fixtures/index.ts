import type { AdonisEndpoint } from '@tuyau/core/types'
import type { ApiDefinition } from './api_definition.ts'

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
} as const satisfies Record<string, AdonisEndpoint>

export const defaultRegistry = {
  routes,
  $tree: {} as ApiDefinition,
}
