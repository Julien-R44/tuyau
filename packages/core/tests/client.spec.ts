import nock from 'nock'
import { test } from '@japa/runner'

import { createTuyau } from '../src/client/tuyau.ts'
import { defaultRegistry as registry } from './fixtures/index.ts'
import { TuyauHTTPError, TuyauNetworkError } from '../src/client/errors.ts'

const createTestTuyau = (baseUrl: string = 'http://localhost:3333') =>
  createTuyau({ baseUrl, registry })

test.group('Client | Chained', () => {
  test('post something', async ({ assert }) => {
    const tuyau = createTestTuyau()

    nock('http://localhost:3333').post('/auth/login').reply(200, { token: '123' })
    const result = await tuyau.api.auth.login({ body: { email: 'foo@ok.com', password: 'secret' } })

    assert.equal(result.token, '123')
  })

  test('network error', async ({ assert }) => {
    const tuyau = createTestTuyau('http://localhost:9999')

    let error: any = null
    await tuyau.api.auth
      .login({ body: { email: 'test@test.com', password: 'password' } })
      .catch((err) => {
        error = err
      })

    assert.isTrue(error !== null)
    assert.instanceOf(error, TuyauNetworkError)
    assert.include(error!.message, 'Network error: POST /auth/login')
  })

  test('post with query parameters', async () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333')
      .post('/auth/login')
      .query({ foo: 'bar' })
      .reply(200, { token: '123' })

    await tuyau.api.auth.login({
      body: { email: 'foo@ok.com', password: 'test' },
      query: { foo: 'bar' },
    })
  })

  test('get something', async ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333')
      .get('/users')
      .query({ email: 'foo@ok.com' })
      .reply(200, { token: '123' })

    const result = await tuyau.api.users.index({ query: { email: 'foo@ok.com' } })
    assert.equal(result.token, '123')
  })

  test('GET request sends query params correctly', async ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333')
      .get('/products/search')
      .query({ q: 'laptop', category: 'electronics', minPrice: '100' })
      .reply(200, { products: [{ id: 1, name: 'Laptop' }] })

    const result = await tuyau.api.products.search({
      query: { q: 'laptop', category: 'electronics', minPrice: 100 },
    })
    assert.deepEqual(result.products, [{ id: 1, name: 'Laptop' }])
  })

  test('parse as ArrayBuffer when octet-stream response', async ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333')
      .post('/auth/login')
      .reply(200, 'hello', { 'Content-Type': 'application/octet-stream' })

    const result = await tuyau.api.auth.login({
      body: { email: 'foo@ok.com', password: 'secret' },
    })

    assert.isTrue(result instanceof ArrayBuffer)
  })

  test('parse as text when content type is not recognized', async ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333')
      .post('/auth/login')
      .reply(200, 'hello', { 'Content-Type': 'text/plain' })

    const result = await tuyau.api.auth.login({
      body: { email: 'test@ok.com', password: 'secret' },
    })

    assert.isTrue(typeof result === 'string')
    assert.equal(result, 'hello')
  })

  test('pass ky options when creating instance', async ({ assert }) => {
    let hookCalled = false
    const tuyau = createTuyau({
      registry,
      baseUrl: 'http://localhost:3333',
      headers: { 'x-foo': 'bar' },
      hooks: {
        beforeRequest: [
          () => {
            hookCalled = true
          },
        ],
      },
    })

    nock('http://localhost:3333')
      .post('/auth/login')
      .reply(200, { token: '123' })
      .matchHeader('x-foo', 'bar')

    await tuyau.api.auth.login({ body: { email: 'foo@ok.com', password: 'test' } })

    assert.isTrue(hookCalled)
  })

  test('route params', async ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333').get('/users/1?foo=bar').reply(200, { id: '1' })
    const result = await tuyau.api.users.show({
      params: { id: '1' },
      query: { foo: 'bar' },
    })

    assert.equal(result.id, '1')
  })

  test('pass query params array the right way', async () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333').get('/users?ids[]=1&ids[]=2').reply(200, { id: '1' })

    await tuyau.api.users.index({ query: { ids: [1, 2] } })
  })

  test('pass query params array with single item the right way', async () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })
    nock('http://localhost:3333').get('/users?ids[]=1').reply(200, { id: '1' })

    await tuyau.api.users.index({ query: { ids: [1] } })
  })

  test('handle undefined query params', async () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })
    nock('http://localhost:3333').get('/users').reply(200, { id: '1' })

    await tuyau.api.users.index({ query: { ids: undefined } })
  })

  test('handle undefined query params in array', async () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333').get('/users?ids[]=1&ids[]=2').reply(200, { id: 1 })

    await tuyau.api.users.index({ query: { ids: [1, undefined, 2, null] } })
  })

  test('multiple query params', async () => {
    const inlineRoutes = {
      'users.index': {
        methods: ['GET'] as 'GET'[],
        pattern: '/users',
        tokens: [{ old: '/users', type: 0 as const, val: 'users', end: '' }],
        types: {} as any as {
          body: {}
          params: {}
          paramsTuple: []
          query: { foo: string; bar: string; ids: (string | number)[] }
          response: { id: string }
        },
      },
    }

    interface InlineApi {
      users: { index: (typeof inlineRoutes)['users.index'] }
    }

    const tuyau = createTuyau({
      baseUrl: 'http://localhost:3333',
      registry: {
        routes: inlineRoutes,
        $tree: {} as InlineApi,
      },
    })

    nock('http://localhost:3333')
      .get('/users?foo=bar&bar=baz&ids[]=1&ids[]=2')
      .reply(200, { id: '1' })

    await tuyau.api.users.index({ query: { foo: 'bar', bar: 'baz', ids: [1, 2] } })
  })

  test('send as form data when payload include file', async () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333')
      .post('/auth/login')
      .reply(200, { token: '123' })
      .matchHeader('content-type', /multipart\/form-data/)

    await tuyau.api.auth.login({
      body: { file: new File(['hello'], 'hello.txt'), email: 'foo@ok.com', password: 'foo' },
    })
  })

  test('response throw error with clear message', async ({ assert }) => {
    assert.plan(2)

    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })
    nock('http://localhost:3333').post('/auth/login').reply(400, { message: 'Invalid credentials' })

    try {
      await tuyau.api.auth.login({ body: { email: 'foo@ok.com', password: 'bar' } })
    } catch (error) {
      assert.instanceOf(error, TuyauHTTPError)
      assert.equal(error.response.message, 'Invalid credentials')
    }
  })

  test('upload file pass the right content type', async () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333')
      .post('/users')
      .reply(200, { token: '123' })
      .matchHeader('content-type', /multipart\/form-data/)

    await tuyau.api.users.store({ body: { file: new File(['hello'], 'hello.txt') } })
  })

  test('send blob', async () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    const blob = new Blob(['hello'], { type: 'image/jpeg' })

    nock('http://localhost:3333')
      .post('/users')
      .reply(200, { token: '123' })
      .matchHeader('content-type', /multipart\/form-data/)

    await tuyau.api.users.store({ body: { file: blob } })
  })

  test('pass form data directly', async () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333')
      .post('/users')
      .reply(200, { token: '123' })
      .matchHeader('content-type', /multipart\/form-data/)

    const formData = new FormData()
    formData.append('name', 'julien')
    formData.append('email', 'foo@ok.com')

    await tuyau.api.users.store({ body: formData as any })
  })

  test('pass headers', async () => {
    const tuyau = createTuyau({
      baseUrl: 'http://localhost:3333',
      headers: { 'default-header': 'default-value' },
      registry,
    })

    nock('http://localhost:3333', {})
      .get('/users')
      .query({ email: 'foo@ok.com' })
      .matchHeader('custom-header', 'custom-value')
      .reply(200, { token: '123' })

    await tuyau.api.users.index({
      query: { email: 'foo@ok.com' },
      headers: { 'custom-header': 'custom-value' },
    })
  })

  test('pass headers to post request', async () => {
    const tuyau = createTuyau({
      baseUrl: 'http://localhost:3333',
      registry,
      headers: { 'default-header': 'default-value' },
    })

    nock('http://localhost:3333')
      .post('/users')
      .reply(200, { token: '123' })
      .matchHeader('content-type', /multipart\/form-data/)
      .matchHeader('custom-header', 'custom-value')
      .matchHeader('default-header', 'default-value')

    const formData = new FormData()
    formData.append('name', 'julien')
    formData.append('email', 'foo@ok.com')

    await tuyau.api.users.store({
      body: formData as any,
      headers: { 'custom-header': 'custom-value' },
    })
  })

  test('pass query options to get request', async () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333')
      .get('/users')
      .query({ email: 'foo@ok.com' })
      .reply(200, { token: '123' })
      .matchHeader('custom-header', 'custom-value')
      .matchHeader('second-header', 'custom-value')

    await tuyau.api.users.index({
      query: { email: 'foo@ok.com' },
      headers: { 'custom-header': 'custom-value' },
      hooks: {
        beforeRequest: [(request) => request.headers.set('second-header', 'custom-value')],
      },
    })
  })

  test('automatically pickup cookie x-csrf-token', async () => {
    // @ts-ignore osef
    globalThis.document ||= {}
    globalThis.document.cookie = 'XSRF-TOKEN=123'

    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333')
      .get('/users')
      .reply(200, { token: '123' })
      .matchHeader('x-xsrf-token', '123')

    await tuyau.api.users.index({})
  })

  test('plugin should be able to mutate options', async ({ assert }) => {
    assert.plan(2)

    const tuyau = createTuyau({
      baseUrl: 'http://localhost:3333',
      registry,
      plugins: [
        ({ options }) => {
          assert.isTrue(true)
          options.parseJson = (text) => {
            assert.deepEqual(text, JSON.stringify({ token: '123' }))
            return text
          }
        },
      ],
    })

    nock('http://localhost:3333').get('/users').reply(200, { token: '123' })

    await tuyau.api.users.index({ query: {} })
  })

  test('TuyauHTTPError message should be clean', async ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333').post('/auth/login').reply(400, { message: 'Invalid credentials' })

    try {
      await tuyau.api.auth.login({ body: { email: 'foo@ok.com', password: 'password' } })
      // @ts-ignore
    } catch (error) {
      assert.deepEqual(error.message, 'Request failed with status code 400: POST /auth/login')
    }
  })
})

test.group('Client | request', () => {
  test('basic', async ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333')
      .post('/auth/login')
      .query({ foo: 'bar' })
      .reply(200, { token: '123' })

    const result = await tuyau.request('auth.login', {
      body: { email: 'foo@ok.com', password: 'password' },
      query: { foo: 'bar' },
    })

    assert.equal(result.token, '123')
  })
})

test.group('Client | url', () => {
  test('basic', async ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333')
      .get('/users')
      .query({ email: 'foo@ok.com' })
      .reply(200, { token: '123' })

    nock('http://localhost:3333')
      .get('/posts/1/comments/2/likes/3')
      .query({ foo: 'bar' })
      .reply(200, { id: '3' })

    nock('http://localhost:3333').get('/users/1').query({ foo: 'bar' }).reply(200, { id: '1' })

    await tuyau.get('/posts/:postId/comments/:commentId/likes/:likeId', {
      params: { commentId: '2', likeId: '3', postId: '1' },
      query: { foo: 'bar' },
    })

    const r1 = await tuyau.get('/users', { query: { email: 'foo@ok.com' } })
    const r2 = await tuyau.get('/users/:id', { params: { id: '1' }, query: { foo: 'bar' } })

    assert.equal(r1.token, '123')
    assert.equal(r2.id, '1')
  })
})
