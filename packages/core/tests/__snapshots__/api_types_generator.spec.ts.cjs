exports[`Api Types Generator > works fine 1`] = `"import type { MakeTuyauRequest, MakeTuyauResponse } from '@tuyau/utils/types'
import type { InferInput } from '@vinejs/vine/types'

type UsersGet = {
  request: unknown
  response: MakeTuyauResponse<import('../app/controllers/users_controller.ts').default['index']>
}
export interface ApiDefinition {
  'users': {
    '$url': {
    };
    '$get': UsersGet;
  };
}
const routes = [
] as const;
export const api = {
  routes,
  definition: {} as ApiDefinition
}
declare module '@tuyau/inertia/types' {
  type ApiDefinition = typeof api
  export interface Api extends ApiDefinition {}
}
"`

exports[`Api Types Generator > extract validateUsing request 1`] = `"import type { MakeTuyauRequest, MakeTuyauResponse } from '@tuyau/utils/types'
import type { InferInput } from '@vinejs/vine/types'

type UsersGet = {
  request: MakeTuyauRequest<InferInput<typeof import('../app/validators/get_users_validator.ts')['getUsersValidator']>>
  response: MakeTuyauResponse<import('../app/controllers/users_controller.ts').default['index']>
}
export interface ApiDefinition {
  'users': {
    '$url': {
    };
    '$get': UsersGet;
  };
}
const routes = [
] as const;
export const api = {
  routes,
  definition: {} as ApiDefinition
}
declare module '@tuyau/inertia/types' {
  type ApiDefinition = typeof api
  export interface Api extends ApiDefinition {}
}
"`

exports[`Api Types Generator > should use unknown in route name array if type is not found 1`] = `"import type { MakeTuyauRequest, MakeTuyauResponse } from '@tuyau/utils/types'
import type { InferInput } from '@vinejs/vine/types'

export interface ApiDefinition {
}
const routes = [
  {
    params: [],
    name: 'users',
    path: '/users',
    method: [\\"GET\\"],
    types: {} as unknown,
  },
] as const;
export const api = {
  routes,
  definition: {} as ApiDefinition
}
declare module '@tuyau/inertia/types' {
  type ApiDefinition = typeof api
  export interface Api extends ApiDefinition {}
}
"`

exports[`Api Types Generator | Filters > filter definitions using codegen.only function 1`] = `"import type { MakeTuyauRequest, MakeTuyauResponse } from '@tuyau/utils/types'
import type { InferInput } from '@vinejs/vine/types'

type UsersGet = {
  request: unknown
  response: MakeTuyauResponse<import('../app/controllers/users_controller.ts').default['index']>
}
export interface ApiDefinition {
  'users': {
    '$url': {
    };
    '$get': UsersGet;
  };
}
const routes = [
] as const;
export const api = {
  routes,
  definition: {} as ApiDefinition
}
declare module '@tuyau/inertia/types' {
  type ApiDefinition = typeof api
  export interface Api extends ApiDefinition {}
}
"`

exports[`Api Types Generator | Filters > filter definitions using codegen.except function 1`] = `"import type { MakeTuyauRequest, MakeTuyauResponse } from '@tuyau/utils/types'
import type { InferInput } from '@vinejs/vine/types'

type PostsGet = {
  request: unknown
  response: MakeTuyauResponse<import('../app/controllers/posts_controller.ts').default['index']>
}
export interface ApiDefinition {
  'posts': {
    '$url': {
    };
    '$get': PostsGet;
  };
}
const routes = [
] as const;
export const api = {
  routes,
  definition: {} as ApiDefinition
}
declare module '@tuyau/inertia/types' {
  type ApiDefinition = typeof api
  export interface Api extends ApiDefinition {}
}
"`

exports[`Api Types Generator | Filters > filter definitions using codegen.only array 1`] = `"import type { MakeTuyauRequest, MakeTuyauResponse } from '@tuyau/utils/types'
import type { InferInput } from '@vinejs/vine/types'

type UsersGet = {
  request: unknown
  response: MakeTuyauResponse<import('../app/controllers/users_controller.ts').default['index']>
}
export interface ApiDefinition {
  'users': {
    '$url': {
    };
    '$get': UsersGet;
  };
}
const routes = [
] as const;
export const api = {
  routes,
  definition: {} as ApiDefinition
}
declare module '@tuyau/inertia/types' {
  type ApiDefinition = typeof api
  export interface Api extends ApiDefinition {}
}
"`

exports[`Api Types Generator | Filters > filter definitions using codegen.except array 1`] = `"import type { MakeTuyauRequest, MakeTuyauResponse } from '@tuyau/utils/types'
import type { InferInput } from '@vinejs/vine/types'

type PostsGet = {
  request: unknown
  response: MakeTuyauResponse<import('../app/controllers/posts_controller.ts').default['index']>
}
export interface ApiDefinition {
  'posts': {
    '$url': {
    };
    '$get': PostsGet;
  };
}
const routes = [
] as const;
export const api = {
  routes,
  definition: {} as ApiDefinition
}
declare module '@tuyau/inertia/types' {
  type ApiDefinition = typeof api
  export interface Api extends ApiDefinition {}
}
"`

