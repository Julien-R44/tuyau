/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

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
      errorResponse: unknown
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
      errorResponse: unknown
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
      errorResponse: unknown
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
      errorResponse: unknown
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/accounts_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/accounts_controller').default['create']>>>
    }
  }
  'accounts.store': {
    methods: ["POST"]
    pattern: '/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/accounts_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/accounts_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'accounts.upload_profile_picture': {
    methods: ["POST"]
    pattern: '/users/profile-picture'
    types: {
      body: ExtractBody<InferInput<(typeof import('#controllers/accounts_controller').default)['uploadProfilePictureValidator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#controllers/accounts_controller').default)['uploadProfilePictureValidator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/accounts_controller').default['uploadProfilePicture']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/accounts_controller').default['uploadProfilePicture']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
    }
  }
  'session.store': {
    methods: ["POST"]
    pattern: '/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#controllers/session_controller').default)['storeValidator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#controllers/session_controller').default)['storeValidator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['list']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['list']>>>
    }
  }
  'users.show': {
    methods: ["GET","HEAD"]
    pattern: '/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['show']>>>
    }
  }
  'users.store': {
    methods: ["POST"]
    pattern: '/users'
    types: {
      body: ExtractBody<InferInput<(typeof import('#controllers/users_controller').default)['createValidator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#controllers/users_controller').default)['createValidator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'users.update': {
    methods: ["PUT"]
    pattern: '/users/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#controllers/users_controller').default)['updateValidator']>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#controllers/users_controller').default)['updateValidator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'users.delete': {
    methods: ["DELETE"]
    pattern: '/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['delete']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['delete']>>>
    }
  }
  'posts.list': {
    methods: ["GET","HEAD"]
    pattern: '/posts'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#controllers/posts_controller').default)['listValidator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['list']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['list']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'posts.show': {
    methods: ["GET","HEAD"]
    pattern: '/posts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['show']>>>
    }
  }
  'posts.store': {
    methods: ["POST"]
    pattern: '/posts'
    types: {
      body: ExtractBody<InferInput<(typeof import('#controllers/posts_controller').default)['createValidator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#controllers/posts_controller').default)['createValidator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'posts.update': {
    methods: ["PUT"]
    pattern: '/posts/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#controllers/posts_controller').default)['updateValidator']>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#controllers/posts_controller').default)['updateValidator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'posts.delete': {
    methods: ["DELETE"]
    pattern: '/posts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['delete']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['delete']>>>
    }
  }
  'contacts.page': {
    methods: ["GET","HEAD"]
    pattern: '/contacts-page'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'contacts.list': {
    methods: ["GET","HEAD"]
    pattern: '/contacts'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/contacts_controller').default['list']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/contacts_controller').default['list']>>>
    }
  }
  'contacts.show': {
    methods: ["GET","HEAD"]
    pattern: '/contacts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/contacts_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/contacts_controller').default['show']>>>
    }
  }
  'contacts.store': {
    methods: ["POST"]
    pattern: '/contacts'
    types: {
      body: ExtractBody<InferInput<(typeof import('#controllers/contacts_controller').default)['createValidator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#controllers/contacts_controller').default)['createValidator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/contacts_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/contacts_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'contacts.update': {
    methods: ["PUT"]
    pattern: '/contacts/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#controllers/contacts_controller').default)['updateValidator']>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#controllers/contacts_controller').default)['updateValidator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/contacts_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/contacts_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'contacts.delete': {
    methods: ["DELETE"]
    pattern: '/contacts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/contacts_controller').default['delete']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/contacts_controller').default['delete']>>>
    }
  }
  'products.search': {
    methods: ["GET","HEAD"]
    pattern: '/products/search'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#controllers/products_controller').default)['searchValidator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/products_controller').default['search']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/products_controller').default['search']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/products_controller').default['categories']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/products_controller').default['categories']>>>
    }
  }
  'products.by_category': {
    methods: ["GET","HEAD"]
    pattern: '/products/category/:category'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { category: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/products_controller').default['byCategory']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/products_controller').default['byCategory']>>>
    }
  }
  'products.show': {
    methods: ["GET","HEAD"]
    pattern: '/products/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/products_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/products_controller').default['show']>>>
    }
  }
  'products.store': {
    methods: ["POST"]
    pattern: '/products'
    types: {
      body: ExtractBody<InferInput<(typeof import('#controllers/products_controller').default)['createValidator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#controllers/products_controller').default)['createValidator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/products_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/products_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'products.delete': {
    methods: ["DELETE"]
    pattern: '/products/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/products_controller').default['delete']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/products_controller').default['delete']>>>
    }
  }
}
