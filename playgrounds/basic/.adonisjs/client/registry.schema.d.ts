/* eslint-disable prettier/prettier */
/// <reference path="../../adonisrc.ts" />

import type { ExtractBody, ExtractQuery } from '@tuyau/core/types'
import type { Infer } from '@vinejs/vine/types'

export interface Registry {
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
    }
  }
  'posts.page': {
    methods: ["GET","HEAD"]
    pattern: '/posts-page'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
    }
  }
  'products.page': {
    methods: ["GET","HEAD"]
    pattern: '/products-page'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
    }
  }
  'users.page': {
    methods: ["GET","HEAD"]
    pattern: '/users-page'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
    }
  }
  'accounts.create': {
    methods: ["GET","HEAD"]
    pattern: '/signup'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: Awaited<ReturnType<import('#controllers/accounts_controller').default['create']>>
    }
  }
  'accounts.store': {
    methods: ["POST"]
    pattern: '/signup'
    types: {
      body: ExtractBody<Infer<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<Infer<(typeof import('#validators/user').signupValidator)>>
      response: Awaited<ReturnType<import('#controllers/accounts_controller').default['store']>>
    }
  }
  'accounts.upload_profile_picture': {
    methods: ["POST"]
    pattern: '/users/profile-picture'
    types: {
      body: ExtractBody<Infer<(typeof import('#controllers/accounts_controller').default)['uploadProfilePictureValidator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<Infer<(typeof import('#controllers/accounts_controller').default)['uploadProfilePictureValidator']>>
      response: Awaited<ReturnType<import('#controllers/accounts_controller').default['uploadProfilePicture']>>
    }
  }
  'session.create': {
    methods: ["GET","HEAD"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: Awaited<ReturnType<import('#controllers/session_controller').default['create']>>
    }
  }
  'session.store': {
    methods: ["POST"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: Awaited<ReturnType<import('#controllers/session_controller').default['store']>>
    }
  }
  'session.destroy': {
    methods: ["POST"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>
    }
  }
  'users.list': {
    methods: ["GET","HEAD"]
    pattern: '/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: Awaited<ReturnType<import('#controllers/users_controller').default['list']>>
    }
  }
  'users.show': {
    methods: ["GET","HEAD"]
    pattern: '/users/:id'
    types: {
      body: {}
      paramsTuple: [string]
      params: { id: string }
      query: {}
      response: Awaited<ReturnType<import('#controllers/users_controller').default['show']>>
    }
  }
  'users.store': {
    methods: ["POST"]
    pattern: '/users'
    types: {
      body: ExtractBody<Infer<(typeof import('#controllers/users_controller').default)['createValidator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<Infer<(typeof import('#controllers/users_controller').default)['createValidator']>>
      response: Awaited<ReturnType<import('#controllers/users_controller').default['store']>>
    }
  }
  'users.update': {
    methods: ["PUT"]
    pattern: '/users/:id'
    types: {
      body: ExtractBody<Infer<(typeof import('#controllers/users_controller').default)['updateValidator']>>
      paramsTuple: [string]
      params: { id: string }
      query: ExtractQuery<Infer<(typeof import('#controllers/users_controller').default)['updateValidator']>>
      response: Awaited<ReturnType<import('#controllers/users_controller').default['update']>>
    }
  }
  'users.delete': {
    methods: ["DELETE"]
    pattern: '/users/:id'
    types: {
      body: {}
      paramsTuple: [string]
      params: { id: string }
      query: {}
      response: Awaited<ReturnType<import('#controllers/users_controller').default['delete']>>
    }
  }
  'posts.list': {
    methods: ["GET","HEAD"]
    pattern: '/posts'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: Infer<(typeof import('#controllers/posts_controller').default)['listValidator']>
      response: Awaited<ReturnType<import('#controllers/posts_controller').default['list']>>
    }
  }
  'posts.show': {
    methods: ["GET","HEAD"]
    pattern: '/posts/:id'
    types: {
      body: {}
      paramsTuple: [string]
      params: { id: string }
      query: {}
      response: Awaited<ReturnType<import('#controllers/posts_controller').default['show']>>
    }
  }
  'posts.store': {
    methods: ["POST"]
    pattern: '/posts'
    types: {
      body: ExtractBody<Infer<(typeof import('#controllers/posts_controller').default)['createValidator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<Infer<(typeof import('#controllers/posts_controller').default)['createValidator']>>
      response: Awaited<ReturnType<import('#controllers/posts_controller').default['store']>>
    }
  }
  'posts.update': {
    methods: ["PUT"]
    pattern: '/posts/:id'
    types: {
      body: ExtractBody<Infer<(typeof import('#controllers/posts_controller').default)['updateValidator']>>
      paramsTuple: [string]
      params: { id: string }
      query: ExtractQuery<Infer<(typeof import('#controllers/posts_controller').default)['updateValidator']>>
      response: Awaited<ReturnType<import('#controllers/posts_controller').default['update']>>
    }
  }
  'posts.delete': {
    methods: ["DELETE"]
    pattern: '/posts/:id'
    types: {
      body: {}
      paramsTuple: [string]
      params: { id: string }
      query: {}
      response: Awaited<ReturnType<import('#controllers/posts_controller').default['delete']>>
    }
  }
  'products.search': {
    methods: ["GET","HEAD"]
    pattern: '/products/search'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: Infer<(typeof import('#controllers/products_controller').default)['searchValidator']>
      response: Awaited<ReturnType<import('#controllers/products_controller').default['search']>>
    }
  }
  'products.categories': {
    methods: ["GET","HEAD"]
    pattern: '/products/categories'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: Awaited<ReturnType<import('#controllers/products_controller').default['categories']>>
    }
  }
  'products.by_category': {
    methods: ["GET","HEAD"]
    pattern: '/products/category/:category'
    types: {
      body: {}
      paramsTuple: [string]
      params: { category: string }
      query: {}
      response: Awaited<ReturnType<import('#controllers/products_controller').default['byCategory']>>
    }
  }
  'products.show': {
    methods: ["GET","HEAD"]
    pattern: '/products/:id'
    types: {
      body: {}
      paramsTuple: [string]
      params: { id: string }
      query: {}
      response: Awaited<ReturnType<import('#controllers/products_controller').default['show']>>
    }
  }
  'products.store': {
    methods: ["POST"]
    pattern: '/products'
    types: {
      body: ExtractBody<Infer<(typeof import('#controllers/products_controller').default)['createValidator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<Infer<(typeof import('#controllers/products_controller').default)['createValidator']>>
      response: Awaited<ReturnType<import('#controllers/products_controller').default['store']>>
    }
  }
  'products.delete': {
    methods: ["DELETE"]
    pattern: '/products/:id'
    types: {
      body: {}
      paramsTuple: [string]
      params: { id: string }
      query: {}
      response: Awaited<ReturnType<import('#controllers/products_controller').default['delete']>>
    }
  }
}
