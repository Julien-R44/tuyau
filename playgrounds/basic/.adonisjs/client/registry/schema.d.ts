/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput } from '@vinejs/vine/types'

export interface Registry {
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    domain: 'root'
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
    domain: 'root'
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
    domain: 'root'
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
    domain: 'root'
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
    domain: 'root'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/accounts_controller').default['create']>>>
    }
  }
  'accounts.store': {
    methods: ["POST"]
    pattern: '/signup'
    domain: 'root'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/accounts_controller').default['store']>>>
    }
  }
  'accounts.upload_profile_picture': {
    methods: ["POST"]
    pattern: '/users/profile-picture'
    domain: 'root'
    types: {
      body: ExtractBody<InferInput<(typeof import('#controllers/accounts_controller').default)['uploadProfilePictureValidator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#controllers/accounts_controller').default)['uploadProfilePictureValidator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/accounts_controller').default['uploadProfilePicture']>>>
    }
  }
  'session.create': {
    methods: ["GET","HEAD"]
    pattern: '/login'
    domain: 'root'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
    }
  }
  'session.store': {
    methods: ["POST"]
    pattern: '/login'
    domain: 'root'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
    }
  }
  'session.destroy': {
    methods: ["POST"]
    pattern: '/logout'
    domain: 'root'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
    }
  }
  'users.list': {
    methods: ["GET","HEAD"]
    pattern: '/users'
    domain: 'root'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['list']>>>
    }
  }
  'users.show': {
    methods: ["GET","HEAD"]
    pattern: '/users/:id'
    domain: 'root'
    types: {
      body: {}
      paramsTuple: [string]
      params: { id: string }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['show']>>>
    }
  }
  'users.store': {
    methods: ["POST"]
    pattern: '/users'
    domain: 'root'
    types: {
      body: ExtractBody<InferInput<(typeof import('#controllers/users_controller').default)['createValidator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#controllers/users_controller').default)['createValidator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['store']>>>
    }
  }
  'users.update': {
    methods: ["PUT"]
    pattern: '/users/:id'
    domain: 'root'
    types: {
      body: ExtractBody<InferInput<(typeof import('#controllers/users_controller').default)['updateValidator']>>
      paramsTuple: [string]
      params: { id: string }
      query: ExtractQuery<InferInput<(typeof import('#controllers/users_controller').default)['updateValidator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['update']>>>
    }
  }
  'users.delete': {
    methods: ["DELETE"]
    pattern: '/users/:id'
    domain: 'root'
    types: {
      body: {}
      paramsTuple: [string]
      params: { id: string }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['delete']>>>
    }
  }
  'posts.list': {
    methods: ["GET","HEAD"]
    pattern: '/posts'
    domain: 'root'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#controllers/posts_controller').default)['listValidator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['list']>>>
    }
  }
  'posts.show': {
    methods: ["GET","HEAD"]
    pattern: '/posts/:id'
    domain: 'root'
    types: {
      body: {}
      paramsTuple: [string]
      params: { id: string }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['show']>>>
    }
  }
  'posts.store': {
    methods: ["POST"]
    pattern: '/posts'
    domain: 'root'
    types: {
      body: ExtractBody<InferInput<(typeof import('#controllers/posts_controller').default)['createValidator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#controllers/posts_controller').default)['createValidator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['store']>>>
    }
  }
  'posts.update': {
    methods: ["PUT"]
    pattern: '/posts/:id'
    domain: 'root'
    types: {
      body: ExtractBody<InferInput<(typeof import('#controllers/posts_controller').default)['updateValidator']>>
      paramsTuple: [string]
      params: { id: string }
      query: ExtractQuery<InferInput<(typeof import('#controllers/posts_controller').default)['updateValidator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['update']>>>
    }
  }
  'posts.delete': {
    methods: ["DELETE"]
    pattern: '/posts/:id'
    domain: 'root'
    types: {
      body: {}
      paramsTuple: [string]
      params: { id: string }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['delete']>>>
    }
  }
  'products.search': {
    methods: ["GET","HEAD"]
    pattern: '/products/search'
    domain: 'root'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#controllers/products_controller').default)['searchValidator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/products_controller').default['search']>>>
    }
  }
  'products.categories': {
    methods: ["GET","HEAD"]
    pattern: '/products/categories'
    domain: 'root'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/products_controller').default['categories']>>>
    }
  }
  'products.by_category': {
    methods: ["GET","HEAD"]
    pattern: '/products/category/:category'
    domain: 'root'
    types: {
      body: {}
      paramsTuple: [string]
      params: { category: string }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/products_controller').default['byCategory']>>>
    }
  }
  'products.show': {
    methods: ["GET","HEAD"]
    pattern: '/products/:id'
    domain: 'root'
    types: {
      body: {}
      paramsTuple: [string]
      params: { id: string }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/products_controller').default['show']>>>
    }
  }
  'products.store': {
    methods: ["POST"]
    pattern: '/products'
    domain: 'root'
    types: {
      body: ExtractBody<InferInput<(typeof import('#controllers/products_controller').default)['createValidator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#controllers/products_controller').default)['createValidator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/products_controller').default['store']>>>
    }
  }
  'products.delete': {
    methods: ["DELETE"]
    pattern: '/products/:id'
    domain: 'root'
    types: {
      body: {}
      paramsTuple: [string]
      params: { id: string }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/products_controller').default['delete']>>>
    }
  }
  'blog.posts.api': {
    methods: ["GET","HEAD"]
    pattern: '/posts-api'
    domain: 'blog'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#controllers/posts_controller').default)['listValidator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['list']>>>
    }
  }
}
