import { test } from '@japa/runner'

import { createTuyau } from '../src/client/tuyau.ts'
import { defaultRegistry as registry } from './fixtures/index.ts'
import type {
  ExtractBody,
  ExtractQuery,
  ExtractQueryForGet,
  PathWithRegistry,
  RouteWithRegistry,
} from '../src/client/types/types.ts'

const routes = registry.routes

test.group('Client | Typings', (group) => {
  group.tap((t) => t.skip(true, 'skip typings tests'))

  test('named', async ({ expectTypeOf }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    tuyau.api.users.bar({
      query: {
        email: 'foo@ok.com',
        ids: [1, 2, 3, null, undefined, '4'],
      },
    })

    // @ts-expect-error missing mandatory query param
    tuyau.api.users.bar({})

    // @ts-expect-error missing required body
    tuyau.api.auth.login({})

    tuyau.api.auth.login({
      body: {
        email: 'foo@ok.com',
        password: 'secret',
      },
    })

    type Response = Awaited<ReturnType<typeof tuyau.api.users.index>>
    expectTypeOf<Response>().toEqualTypeOf<{ token: string }>()
  })

  test('request - body validation', () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    // Valid body for auth.login
    tuyau.request('auth.login', {
      body: {
        email: 'test@example.com',
        password: 'secret',
        file: new File([], 'test.txt'),
      },
    })

    // Valid body with optional file
    tuyau.request('auth.login', {
      body: {
        email: 'test@example.com',
        password: 'secret',
      },
    })

    tuyau.request('auth.login', {
      // @ts-expect-error missing required email
      body: {
        password: 'secret',
      },
    })

    tuyau.request('auth.login', {
      // @ts-expect-error missing required password
      body: {
        email: 'test@example.com',
      },
    })

    // @ts-expect-error body required for POST endpoint
    tuyau.request('auth.login', {})
  })

  test('request - query params validation', () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    // Valid query params for users.index
    tuyau.request('users.index', {
      query: {
        email: 'test@example.com',
        ids: [1, 2, null, undefined, '3'],
      },
    })

    // Query params are optional for users.index
    tuyau.request('users.index', {})

    // Valid mandatory query for posts.comments.likes.detail
    tuyau.request('posts.comments.likes.detail', {
      params: { postId: '1', commentId: '2', likeId: '3' },
      query: { foo: 'bar' },
    })

    // @ts-expect-error missing mandatory query param
    tuyau.request('posts.comments.likes.detail', {
      params: { postId: '1', commentId: '2', likeId: '3' },
    })
  })

  test('request - route params validation', () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    // Valid params for route with parameters
    tuyau.request('posts.comments.likes.detail', {
      params: { postId: '1', commentId: '2', likeId: '3' },
      query: { foo: 'bar' },
    })

    tuyau.request('posts.comments.likes.detail', {
      // @ts-expect-error missing required postId
      params: { commentId: '2', likeId: '3' },
      query: { foo: 'bar' },
    })

    tuyau.request('posts.comments.likes.detail', {
      // @ts-expect-error wrong param type
      params: { postId: 123, commentId: '2', likeId: '3' },
      query: { foo: 'bar' },
    })

    // Route without params should not require params
    tuyau.request('users.index', {})

    tuyau.request('users.index', {
      // @ts-expect-error providing params to route that doesn't need them
      params: { id: '1' },
    })
  })

  test('request - ExtractQuery/ExtractBody endpoints', () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    // products.search uses ExtractQuery - query params should be extracted from validator
    tuyau.request('products.search', {
      query: { q: 'laptop', category: 'electronics', minPrice: 100 },
    })

    // Query is optional since all fields are optional
    tuyau.request('products.search', {})

    // products.store uses ExtractBody - body should be the full validator (no query property)
    tuyau.request('products.store', {
      body: { name: 'Laptop', price: 999, category: 'electronics' },
    })

    // @ts-expect-error products.store requires body
    tuyau.request('products.store', {})

    tuyau.request('products.store', {
      // @ts-expect-error missing required name field
      body: { price: 999, category: 'electronics' },
    })
  })

  test('request - response type validation', ({ expectTypeOf }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    // Verify response types match registry
    type AuthResponse = Awaited<ReturnType<typeof tuyau.request<'auth.login'>>>
    expectTypeOf<AuthResponse>().toEqualTypeOf<{ token: string }>()

    type UsersResponse = Awaited<ReturnType<typeof tuyau.request<'users.index'>>>
    expectTypeOf<UsersResponse>().toEqualTypeOf<{ token: string }>()

    type PostDetailResponse = Awaited<
      ReturnType<typeof tuyau.request<'posts.comments.likes.detail'>>
    >
    expectTypeOf<PostDetailResponse>().toEqualTypeOf<{ id: string }>()
  })

  test('request method - runtime response types', async ({ expectTypeOf }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    // Test types without actually executing requests
    const res1 = tuyau.request('users.index', {})

    type UsersIndexResponse = Awaited<typeof res1>
    expectTypeOf<UsersIndexResponse>().toEqualTypeOf<{ token: string }>()

    const res2 = tuyau.request('auth.login', {
      body: { email: 'test@example.com', password: 'secret' },
    })

    type AuthLoginResponse = Awaited<typeof res2>
    expectTypeOf<AuthLoginResponse>().toEqualTypeOf<{ token: string }>()

    const res3 = tuyau.request('posts.comments.likes.detail', {
      params: { postId: '1', commentId: '2', likeId: '3' },
      query: { foo: 'bar' },
    })

    type PostDetailResponse = Awaited<typeof res3>
    expectTypeOf<PostDetailResponse>().toEqualTypeOf<{ id: string }>()

    const res4 = tuyau.request('users.show', {
      params: { id: '123' },
      query: { foo: 'test' },
    })

    type UsersShowResponse = Awaited<typeof res4>
    expectTypeOf<UsersShowResponse>().toEqualTypeOf<{ id: string }>()

    const res5 = tuyau.request('users.store', {
      body: { file: new File([], 'test.txt') },
    })

    type UsersStoreResponse = Awaited<typeof res5>
    expectTypeOf<UsersStoreResponse>().toEqualTypeOf<{ token: string }>()
  })

  test('request - combined validation', () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    // Valid complex request with all parts
    tuyau.request('posts.comments.likes.toggle', {
      params: { postId: '1', commentId: '2', likeId: '3' },
      query: { foo: 'bar' },
      body: { baz: 'qux' },
    })

    // Body is optional for this endpoint
    tuyau.request('posts.comments.likes.toggle', {
      params: { postId: '1', commentId: '2', likeId: '3' },
      query: { foo: 'bar' },
    })

    // @ts-expect-error missing required params and query
    tuyau.request('posts.comments.likes.toggle', {
      body: { baz: 'qux' },
    })
  })

  test('by path', () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    // @ts-expect-error path not in registry
    tuyau.get('inexistent/path')

    // @ts-expect-error missing required params
    tuyau.get('/posts/:postId/comments/:commentId/likes/:likeId')

    // @ts-expect-error cant POST to a GET-only route
    tuyau.post('/users/:id', {
      params: { id: '1' },
    })

    tuyau.post('/auth/login', {
      body: {
        email: 'foo@ok.com',
        password: 'foo',
      },
    })

    tuyau.post('/auth/login', {
      // @ts-expect-error missing required body fields
      body: {},
    })
  })

  test('same pattern different methods - type isolation', () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    // POST /auth/login should require body with email and password
    tuyau.post('/auth/login', {
      body: {
        email: 'test@example.com',
        password: 'secret',
      },
    })

    tuyau.post('/auth/login', {
      // @ts-expect-error POST /auth/login requires body with email and password, not empty body
      body: {},
    })

    // GET /auth/login should not require body (different endpoint: auth.login.show)
    tuyau.get('/auth/login', {
      query: { foo: 'bar' },
    })

    // GET /auth/login should work with empty args since query is optional
    tuyau.get('/auth/login', {})

    // Verify that POST and GET endpoints are properly isolated in their type requirements
    tuyau.post('/auth/login', {
      // @ts-expect-error missing required email
      body: {
        password: 'secret',
      },
    })

    tuyau.post('/auth/login', {
      // @ts-expect-error missing required password
      body: {
        email: 'test@example.com',
      },
    })
  })

  test('http methods - GET', () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    // Valid GET requests
    tuyau.get('/users', {
      query: {
        email: 'test@example.com',
        ids: [1, 2, null],
      },
    })

    // GET with required params and query
    tuyau.get('/posts/:postId/comments/:commentId/likes/:likeId', {
      params: { postId: '1', commentId: '2', likeId: '3' },
      query: { foo: 'bar' },
    })

    // GET with only required params (no query)
    tuyau.get('/users/:id', {
      params: { id: '123' },
      query: { foo: 'test' },
    })

    // @ts-expect-error missing required params for parameterized route
    tuyau.get('/posts/:postId/comments/:commentId/likes/:likeId', {
      query: { foo: 'bar' },
    })
  })

  test('http methods - POST', () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    // Valid POST with body
    tuyau.post('/auth/login', {
      body: {
        email: 'test@example.com',
        password: 'secret',
      },
    })

    // POST with file
    tuyau.post('/users', {
      body: {
        file: new File([], 'test.txt'),
      },
    })

    // POST with params and body
    tuyau.post('/posts/:postId/comments/:commentId/likes/:likeId/toggle', {
      params: { postId: '1', commentId: '2', likeId: '3' },
      query: { foo: 'bar' },
      body: { baz: 'optional' },
    })

    // @ts-expect-error wrong HTTP method for route
    tuyau.post('/users/:id', {
      params: { id: '1' },
    })

    tuyau.post('/auth/login', {
      // @ts-expect-error missing required body fields
      body: {
        email: 'test@example.com',
        // missing password
      },
    })
  })

  test('http methods - PUT/PATCH/DELETE', () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    // These methods should work with existing POST routes for typing validation
    // @ts-expect-error route doesn't support PUT method
    tuyau.put('/auth/login', {
      body: {
        email: 'test@example.com',
        password: 'secret',
      },
    })

    // @ts-expect-error route doesn't support PATCH method
    tuyau.patch('/users', {
      body: { file: new File([], 'test.txt') },
    })

    // @ts-expect-error route doesn't support DELETE method
    tuyau.delete('/products', {
      params: { id: '1' },
    })

    // @ts-expect-error inexistent route
    tuyau.delete('/nonexistent/route')
  })

  test('http methods - response types', async ({ expectTypeOf }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    // Test types without actually executing requests
    const res = tuyau.get('/users', {})

    type GetUsersResponse = Awaited<typeof res>
    expectTypeOf<GetUsersResponse>().toEqualTypeOf<{ token: string }>()

    const res2 = tuyau.post('/auth/login', { body: { email: '', password: '' } })

    type PostAuthResponse = Awaited<typeof res2>
    expectTypeOf<PostAuthResponse>().toEqualTypeOf<{ token: string }>()

    const res3 = tuyau.get('/posts/:postId/comments/:commentId/likes/:likeId', {
      params: { postId: '1', commentId: '2', likeId: '3' },
      query: { foo: 'bar' },
    })

    type GetWithParamsResponse = Awaited<typeof res3>
    expectTypeOf<GetWithParamsResponse>().toEqualTypeOf<{ id: string }>()
  })

  test('url builder - various methods', () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    tuyau.urlFor('auth.login', { 'user-id': '123', 'user-token': 'foo' })

    // @ts-expect-error route doesn't exist
    tuyau.urlFor('inexistent.route')

    // @ts-expect-error missing params
    tuyau.urlFor.get('posts.comments.likes.detail', {})
  })

  test('Path helper', ({ expectTypeOf }) => {
    type Params = PathWithRegistry.Params<typeof routes, 'GET', '/users/:id'>

    type Response = PathWithRegistry.Response<typeof routes, 'GET', '/users/:id'>

    type Query = PathWithRegistry.Query<typeof routes, 'GET', '/users/:id'>

    type Params2 = PathWithRegistry.Params<
      typeof routes,
      'DELETE',
      // @ts-expect-error path is not a GET method
      '/posts/:postId/comments/:commentId/likes/:likeId/toggle'
    >

    expectTypeOf<Params2>().toEqualTypeOf<never>()
    expectTypeOf<Response>().toEqualTypeOf<{ id: string }>()
    expectTypeOf<Params>().toEqualTypeOf<{ id: string }>()
    expectTypeOf<Query>().toEqualTypeOf<{ foo: string }>()
  })

  test('PathWithRegistry type helpers', ({ expectTypeOf }) => {
    // Test POST route with body
    type PostAuthResponse = PathWithRegistry.Response<typeof routes, 'POST', '/auth/login'>

    type PostAuthParams = PathWithRegistry.Params<typeof routes, 'POST', '/auth/login'>

    type PostAuthQuery = PathWithRegistry.Query<typeof routes, 'POST', '/auth/login'>

    type PostAuthBody = PathWithRegistry.Body<typeof routes, 'POST', '/auth/login'>

    expectTypeOf<PostAuthResponse>().toEqualTypeOf<{ token: string }>()
    expectTypeOf<PostAuthParams>().toEqualTypeOf<{ 'user-id'?: string; 'user-token'?: string }>()
    expectTypeOf<PostAuthQuery>().toEqualTypeOf<{ foo?: string }>()
    expectTypeOf<PostAuthBody>().toEqualTypeOf<{ email: string; password: string; file?: any }>()

    // Test GET route with params
    type GetUsersShowResponse = PathWithRegistry.Response<typeof routes, 'GET', '/users/:id'>

    type GetUsersShowParams = PathWithRegistry.Params<typeof routes, 'GET', '/users/:id'>

    type GetUsersShowQuery = PathWithRegistry.Query<typeof routes, 'GET', '/users/:id'>

    expectTypeOf<GetUsersShowResponse>().toEqualTypeOf<{ id: string }>()
    expectTypeOf<GetUsersShowParams>().toEqualTypeOf<{ id: string }>()
    expectTypeOf<GetUsersShowQuery>().toEqualTypeOf<{ foo: string }>()

    // Test route with multiple params
    type GetPostDetailResponse = PathWithRegistry.Response<
      typeof routes,
      'GET',
      '/posts/:postId/comments/:commentId/likes/:likeId'
    >

    type GetPostDetailParams = PathWithRegistry.Params<
      typeof routes,
      'GET',
      '/posts/:postId/comments/:commentId/likes/:likeId'
    >

    expectTypeOf<GetPostDetailResponse>().toEqualTypeOf<{ id: string }>()
    expectTypeOf<GetPostDetailParams>().toEqualTypeOf<{
      postId: string
      commentId: string
      likeId: string
    }>()
  })

  test('RouteWithRegistry type helpers', ({ expectTypeOf }) => {
    // Test route without params (users.index)
    type UsersIndexResponse = RouteWithRegistry.Response<typeof routes, 'users.index'>

    type UsersIndexParams = RouteWithRegistry.Params<typeof routes, 'users.index'>

    type UsersIndexQuery = RouteWithRegistry.Query<typeof routes, 'users.index'>

    type UsersIndexBody = RouteWithRegistry.Body<typeof routes, 'users.index'>

    expectTypeOf<UsersIndexResponse>().toEqualTypeOf<{ token: string }>()
    expectTypeOf<UsersIndexParams>().toEqualTypeOf<{}>()
    expectTypeOf<UsersIndexQuery>().toEqualTypeOf<{
      ids?: (string | number | undefined | null)[]
      email?: string
    }>()
    expectTypeOf<UsersIndexBody>().toEqualTypeOf<{}>()

    // Test POST route with required body
    type AuthLoginResponse = RouteWithRegistry.Response<typeof routes, 'auth.login'>

    type AuthLoginParams = RouteWithRegistry.Params<typeof routes, 'auth.login'>

    type AuthLoginBody = RouteWithRegistry.Body<typeof routes, 'auth.login'>

    expectTypeOf<AuthLoginResponse>().toEqualTypeOf<{ token: string }>()
    expectTypeOf<AuthLoginParams>().toEqualTypeOf<{ 'user-id'?: string; 'user-token'?: string }>()
    expectTypeOf<AuthLoginBody>().toEqualTypeOf<{ email: string; password: string; file?: any }>()

    // Test route with required params
    type PostDetailResponse = RouteWithRegistry.Response<
      typeof routes,
      'posts.comments.likes.detail'
    >

    type PostDetailParams = RouteWithRegistry.Params<typeof routes, 'posts.comments.likes.detail'>

    type PostDetailQuery = RouteWithRegistry.Query<typeof routes, 'posts.comments.likes.detail'>

    expectTypeOf<PostDetailResponse>().toEqualTypeOf<{ id: string }>()
    expectTypeOf<PostDetailParams>().toEqualTypeOf<{
      postId: string
      commentId: string
      likeId: string
    }>()
    expectTypeOf<PostDetailQuery>().toEqualTypeOf<{ foo: string }>()

    // Test route with file upload
    type UsersStoreResponse = RouteWithRegistry.Response<typeof routes, 'users.store'>

    type UsersStoreBody = RouteWithRegistry.Body<typeof routes, 'users.store'>

    expectTypeOf<UsersStoreResponse>().toEqualTypeOf<{ token: string }>()
    expectTypeOf<UsersStoreBody>().toEqualTypeOf<{ file: any }>()

    // Test route with optional body
    type PostToggleBody = RouteWithRegistry.Body<typeof routes, 'posts.comments.likes.toggle'>

    expectTypeOf<PostToggleBody>().toEqualTypeOf<{ baz?: string }>()
  })

  test('camel case route names', () => {
    const camelCaseRoutes = {
      'new_account.create': {
        methods: ['GET', 'HEAD'] as ('GET' | 'HEAD')[],
        pattern: '/signup',
        tokens: [{ old: '/signup', type: 0 as const, val: 'signup', end: '' }],
        types: {} as {
          body: { email: string; password: string; file?: any }
          paramsTuple: [string, string]
          params: { 'user-id'?: string; 'user-token'?: string }
          query: { foo?: string }
          response: { token: string }
        },
      },
    }

    interface CamelCaseApi {
      newAccount: {
        create: (typeof camelCaseRoutes)['new_account.create']
      }
    }

    const tuyau = createTuyau({
      baseUrl: 'http://localhost:3333',
      registry: {
        routes: camelCaseRoutes,
        $tree: {} as CamelCaseApi,
      },
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    tuyau.api.newAccount.create

    tuyau.urlFor.get('new_account.create', { 'user-id': '123', 'user-token': 'foo' })
  })
})

test.group('ExtractQuery and ExtractBody types', (group) => {
  group.tap((t) => t.skip(true, 'skip typings tests'))

  test('ExtractQuery extracts query from validator with query property', ({ expectTypeOf }) => {
    type ValidatorWithQuery = { query: { page: number; limit?: number } }

    type Result = ExtractQuery<ValidatorWithQuery>
    expectTypeOf<Result>().toEqualTypeOf<{ page: number; limit?: number }>()
  })

  test('ExtractBody excludes headers and cookies from validator', ({ expectTypeOf }) => {
    type ValidatorWithHeadersAndCookies = {
      username: string
      headers: { authorization: string }
      cookies: { sessionId: string }
    }

    type Result = ExtractBody<ValidatorWithHeadersAndCookies>
    expectTypeOf<Result>().toEqualTypeOf<{ username: string }>()
  })

  test('ExtractBody excludes query, params, headers, and cookies', ({ expectTypeOf }) => {
    type FullValidator = {
      name: string
      email: string
      query: { page: number }
      params: { id: string }
      headers: { 'x-api-key': string }
      cookies: { token: string }
    }

    type Result = ExtractBody<FullValidator>
    expectTypeOf<Result>().toEqualTypeOf<{ name: string; email: string }>()
  })

  test('ExtractQuery does not include headers or cookies', ({ expectTypeOf }) => {
    // ExtractQuery only extracts nested query property, not the whole type
    type GetValidator = {
      search: string
      headers: { authorization: string }
      cookies: { session: string }
    }

    type Result = ExtractQuery<GetValidator>
    expectTypeOf<Result>().toEqualTypeOf<{}>()
  })

  test('ExtractQueryForGet excludes headers, cookies, and params', ({ expectTypeOf }) => {
    // For GET requests, ExtractQueryForGet is used to exclude reserved properties
    type GetValidator = {
      search: string
      page?: number
      headers: { authorization: string }
      cookies: { session: string }
      params: { id: string }
    }

    type Result = ExtractQueryForGet<GetValidator>
    expectTypeOf<Result>().toEqualTypeOf<{ search: string; page?: number }>()
  })

  test('ExtractQueryForGet returns full type when no reserved properties', ({ expectTypeOf }) => {
    type SimpleValidator = { q: string; limit?: number }

    type Result = ExtractQueryForGet<SimpleValidator>
    expectTypeOf<Result>().toEqualTypeOf<{ q: string; limit?: number }>()
  })

  test('ExtractQuery returns empty object for validator without query', ({ expectTypeOf }) => {
    type ValidatorWithoutQuery = { name: string; email: string }

    type Result = ExtractQuery<ValidatorWithoutQuery>
    expectTypeOf<Result>().toEqualTypeOf<{}>()
  })

  test('ExtractBody removes query from validator', ({ expectTypeOf }) => {
    type ValidatorWithQueryAndBody = { query: { page: number }; name: string; email: string }

    type Result = ExtractBody<ValidatorWithQueryAndBody>
    expectTypeOf<Result>().toEqualTypeOf<{ name: string; email: string }>()
  })

  test('ExtractBody keeps all properties when no query/params', ({ expectTypeOf }) => {
    type ValidatorBodyOnly = { name: string; email: string }

    type Result = ExtractBody<ValidatorBodyOnly>
    expectTypeOf<Result>().toEqualTypeOf<{ name: string; email: string }>()
  })

  test('ExtractBody returns empty object when only query', ({ expectTypeOf }) => {
    type ValidatorQueryOnly = { query: { q: string } }

    type Result = ExtractBody<ValidatorQueryOnly>
    expectTypeOf<Result>().toEqualTypeOf<{}>()
  })

  test('ExtractQuery handles optional query property', ({ expectTypeOf }) => {
    type ValidatorWithOptionalQuery = { query?: { q?: string } }

    type Result = ExtractQuery<ValidatorWithOptionalQuery>
    expectTypeOf<Result>().toEqualTypeOf<{ q?: string }>()
  })

  test('ExtractQuery handles optional query with multiple fields', ({ expectTypeOf }) => {
    type SignupValidator = {
      query?: { referralCode?: string }
      fullName: string | null
      email: string
      password: string
    }

    type QueryResult = ExtractQuery<SignupValidator>
    expectTypeOf<QueryResult>().toEqualTypeOf<{ referralCode?: string }>()

    type BodyResult = ExtractBody<SignupValidator>
    expectTypeOf<BodyResult>().toEqualTypeOf<{
      fullName: string | null
      email: string
      password: string
    }>()
  })
})
