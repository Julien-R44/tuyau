/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ['GET', 'HEAD'],
    pattern: '/',
    domain: 'root',
    tokens: [{ old: '/', type: 0, val: '/', end: '' }],
    types: placeholder as Registry['home']['types'],
  },
  'posts.page': {
    methods: ['GET', 'HEAD'],
    pattern: '/posts-page',
    domain: 'root',
    tokens: [{ old: '/posts-page', type: 0, val: 'posts-page', end: '' }],
    types: placeholder as Registry['posts.page']['types'],
  },
  'products.page': {
    methods: ['GET', 'HEAD'],
    pattern: '/products-page',
    domain: 'root',
    tokens: [{ old: '/products-page', type: 0, val: 'products-page', end: '' }],
    types: placeholder as Registry['products.page']['types'],
  },
  'users.page': {
    methods: ['GET', 'HEAD'],
    pattern: '/users-page',
    domain: 'root',
    tokens: [{ old: '/users-page', type: 0, val: 'users-page', end: '' }],
    types: placeholder as Registry['users.page']['types'],
  },
  'accounts.create': {
    methods: ['GET', 'HEAD'],
    pattern: '/signup',
    domain: 'root',
    tokens: [{ old: '/signup', type: 0, val: 'signup', end: '' }],
    types: placeholder as Registry['accounts.create']['types'],
  },
  'accounts.store': {
    methods: ['POST'],
    pattern: '/signup',
    domain: 'root',
    tokens: [{ old: '/signup', type: 0, val: 'signup', end: '' }],
    types: placeholder as Registry['accounts.store']['types'],
  },
  'accounts.upload_profile_picture': {
    methods: ['POST'],
    pattern: '/users/profile-picture',
    domain: 'root',
    tokens: [
      { old: '/users/profile-picture', type: 0, val: 'users', end: '' },
      { old: '/users/profile-picture', type: 0, val: 'profile-picture', end: '' },
    ],
    types: placeholder as Registry['accounts.upload_profile_picture']['types'],
  },
  'session.create': {
    methods: ['GET', 'HEAD'],
    pattern: '/login',
    domain: 'root',
    tokens: [{ old: '/login', type: 0, val: 'login', end: '' }],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ['POST'],
    pattern: '/login',
    domain: 'root',
    tokens: [{ old: '/login', type: 0, val: 'login', end: '' }],
    types: placeholder as Registry['session.store']['types'],
  },
  'session.destroy': {
    methods: ['POST'],
    pattern: '/logout',
    domain: 'root',
    tokens: [{ old: '/logout', type: 0, val: 'logout', end: '' }],
    types: placeholder as Registry['session.destroy']['types'],
  },
  'users.list': {
    methods: ['GET', 'HEAD'],
    pattern: '/users',
    domain: 'root',
    tokens: [{ old: '/users', type: 0, val: 'users', end: '' }],
    types: placeholder as Registry['users.list']['types'],
  },
  'users.show': {
    methods: ['GET', 'HEAD'],
    pattern: '/users/:id',
    domain: 'root',
    tokens: [
      { old: '/users/:id', type: 0, val: 'users', end: '' },
      { old: '/users/:id', type: 1, val: 'id', end: '' },
    ],
    types: placeholder as Registry['users.show']['types'],
  },
  'users.store': {
    methods: ['POST'],
    pattern: '/users',
    domain: 'root',
    tokens: [{ old: '/users', type: 0, val: 'users', end: '' }],
    types: placeholder as Registry['users.store']['types'],
  },
  'users.update': {
    methods: ['PUT'],
    pattern: '/users/:id',
    domain: 'root',
    tokens: [
      { old: '/users/:id', type: 0, val: 'users', end: '' },
      { old: '/users/:id', type: 1, val: 'id', end: '' },
    ],
    types: placeholder as Registry['users.update']['types'],
  },
  'users.delete': {
    methods: ['DELETE'],
    pattern: '/users/:id',
    domain: 'root',
    tokens: [
      { old: '/users/:id', type: 0, val: 'users', end: '' },
      { old: '/users/:id', type: 1, val: 'id', end: '' },
    ],
    types: placeholder as Registry['users.delete']['types'],
  },
  'posts.list': {
    methods: ['GET', 'HEAD'],
    pattern: '/posts',
    domain: 'root',
    tokens: [{ old: '/posts', type: 0, val: 'posts', end: '' }],
    types: placeholder as Registry['posts.list']['types'],
  },
  'posts.show': {
    methods: ['GET', 'HEAD'],
    pattern: '/posts/:id',
    domain: 'root',
    tokens: [
      { old: '/posts/:id', type: 0, val: 'posts', end: '' },
      { old: '/posts/:id', type: 1, val: 'id', end: '' },
    ],
    types: placeholder as Registry['posts.show']['types'],
  },
  'posts.store': {
    methods: ['POST'],
    pattern: '/posts',
    domain: 'root',
    tokens: [{ old: '/posts', type: 0, val: 'posts', end: '' }],
    types: placeholder as Registry['posts.store']['types'],
  },
  'posts.update': {
    methods: ['PUT'],
    pattern: '/posts/:id',
    domain: 'root',
    tokens: [
      { old: '/posts/:id', type: 0, val: 'posts', end: '' },
      { old: '/posts/:id', type: 1, val: 'id', end: '' },
    ],
    types: placeholder as Registry['posts.update']['types'],
  },
  'posts.delete': {
    methods: ['DELETE'],
    pattern: '/posts/:id',
    domain: 'root',
    tokens: [
      { old: '/posts/:id', type: 0, val: 'posts', end: '' },
      { old: '/posts/:id', type: 1, val: 'id', end: '' },
    ],
    types: placeholder as Registry['posts.delete']['types'],
  },
  'products.search': {
    methods: ['GET', 'HEAD'],
    pattern: '/products/search',
    domain: 'root',
    tokens: [
      { old: '/products/search', type: 0, val: 'products', end: '' },
      { old: '/products/search', type: 0, val: 'search', end: '' },
    ],
    types: placeholder as Registry['products.search']['types'],
  },
  'products.categories': {
    methods: ['GET', 'HEAD'],
    pattern: '/products/categories',
    domain: 'root',
    tokens: [
      { old: '/products/categories', type: 0, val: 'products', end: '' },
      { old: '/products/categories', type: 0, val: 'categories', end: '' },
    ],
    types: placeholder as Registry['products.categories']['types'],
  },
  'products.by_category': {
    methods: ['GET', 'HEAD'],
    pattern: '/products/category/:category',
    domain: 'root',
    tokens: [
      { old: '/products/category/:category', type: 0, val: 'products', end: '' },
      { old: '/products/category/:category', type: 0, val: 'category', end: '' },
      { old: '/products/category/:category', type: 1, val: 'category', end: '' },
    ],
    types: placeholder as Registry['products.by_category']['types'],
  },
  'products.show': {
    methods: ['GET', 'HEAD'],
    pattern: '/products/:id',
    domain: 'root',
    tokens: [
      { old: '/products/:id', type: 0, val: 'products', end: '' },
      { old: '/products/:id', type: 1, val: 'id', end: '' },
    ],
    types: placeholder as Registry['products.show']['types'],
  },
  'products.store': {
    methods: ['POST'],
    pattern: '/products',
    domain: 'root',
    tokens: [{ old: '/products', type: 0, val: 'products', end: '' }],
    types: placeholder as Registry['products.store']['types'],
  },
  'products.delete': {
    methods: ['DELETE'],
    pattern: '/products/:id',
    domain: 'root',
    tokens: [
      { old: '/products/:id', type: 0, val: 'products', end: '' },
      { old: '/products/:id', type: 1, val: 'id', end: '' },
    ],
    types: placeholder as Registry['products.delete']['types'],
  },
  'blog.posts.api': {
    methods: ['GET', 'HEAD'],
    pattern: '/posts-api',
    domain: 'blog',
    tokens: [{ old: '/posts-api', type: 0, val: 'posts-api', end: '' }],
    types: placeholder as Registry['blog.posts.api']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
