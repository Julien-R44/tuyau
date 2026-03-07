import nock from 'nock'
import { test } from '@japa/runner'

import { createTuyau } from '../src/client/tuyau.ts'
import { defaultRegistry as registry } from './fixtures/index.ts'
import { TuyauError, TuyauHTTPError, TuyauNetworkError } from '../src/client/errors.ts'

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

  test('responseType: arrayBuffer overrides content-type parsing', async ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333')
      .post('/auth/login')
      .reply(200, 'hello', { 'Content-Type': 'application/pdf' })

    const result = await tuyau.api.auth.login({
      body: { email: 'foo@ok.com', password: 'secret' },
      responseType: 'arrayBuffer',
    })

    assert.isTrue(result instanceof ArrayBuffer)
  })

  test('responseType: json overrides content-type parsing', async ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333')
      .post('/auth/login')
      .reply(200, JSON.stringify({ ok: true }), { 'Content-Type': 'text/plain' })

    const result = await tuyau.api.auth.login({
      body: { email: 'foo@ok.com', password: 'secret' },
      responseType: 'json',
    })

    assert.deepEqual(result, { ok: true })
  })

  test('responseType: text overrides content-type parsing', async ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333')
      .post('/auth/login')
      .reply(200, JSON.stringify({ ok: true }), { 'Content-Type': 'application/json' })

    const result = await tuyau.api.auth.login({
      body: { email: 'foo@ok.com', password: 'secret' },
      responseType: 'text',
    })

    assert.isTrue(typeof result === 'string')
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

  test('send as form data when file is nested in object', async () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333')
      .post('/auth/login')
      .reply(200, { token: '123' })
      .matchHeader('content-type', /multipart\/form-data/)

    await tuyau.api.auth.login({
      body: { email: 'foo@ok.com', password: 'foo', profile: { avatar: new File(['img'], 'avatar.png') } },
    })
  })

  test('send as form data when file is deeply nested', async () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333')
      .post('/auth/login')
      .reply(200, { token: '123' })
      .matchHeader('content-type', /multipart\/form-data/)

    await tuyau.api.auth.login({
      body: { email: 'foo@ok.com', password: 'foo', data: { nested: { deep: { file: new File(['hello'], 'hello.txt') } } } },
    })
  })

  test('send as form data when file is inside array of objects', async () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333')
      .post('/auth/login')
      .reply(200, { token: '123' })
      .matchHeader('content-type', /multipart\/form-data/)

    await tuyau.api.auth.login({
      body: { email: 'foo@ok.com', password: 'foo', attachments: [{ file: new File(['doc'], 'doc.pdf') }] },
    })
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

  test('handle CSRF token with empty value', async () => {
    // @ts-ignore
    globalThis.document ||= {}
    globalThis.document.cookie = 'XSRF-TOKEN='

    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333').get('/users').reply(200, { token: '123' })

    await tuyau.api.users.index({})
  })

  test('handle CSRF token with malformed URI encoding', async () => {
    // @ts-ignore
    globalThis.document ||= {}
    globalThis.document.cookie = 'XSRF-TOKEN=%E0%A4%A'

    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333').get('/users').reply(200, { token: '123' })

    await tuyau.api.users.index({})
  })

  test('handle Content-Type with extra whitespace', async ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333')
      .get('/users')
      .reply(200, { id: 1 }, { 'Content-Type': 'application/json ; charset=utf-8' })

    const result = await tuyau.api.users.index({})

    assert.deepEqual(result, { id: 1 })
  })

  test('route with snake_case name (subscriber_lists)', async ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333')
      .post('/api/subscriber-lists')
      .reply(200, { id: 1, name: 'Test List' })

    const result = await tuyau.api.subscriberLists.store({ body: { name: 'Test List' } })

    assert.deepEqual(result, { id: 1, name: 'Test List' })
  })

  test('GET route with snake_case name', async ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333')
      .get('/api/subscriber-lists')
      .reply(200, { lists: [{ id: 1, name: 'Test' }] })

    const result = await tuyau.api.subscriberLists.index({})

    assert.deepEqual(result, { lists: [{ id: 1, name: 'Test' }] })
  })

  test('route with kebab-case name (subscriber-lists)', async ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333').get('/api/subscriber-lists/1').reply(200, { id: 1, name: 'Test' })

    const result = await tuyau.api.subscriberLists.show({ params: { id: '1' } })

    assert.deepEqual(result, { id: 1, name: 'Test' })
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

test.group('Client | safe()', () => {
  test('returns [data, null] on success', async ({ assert }) => {
    const tuyau = createTestTuyau()

    nock('http://localhost:3333').post('/auth/login').reply(200, { token: '123' })

    const [data, error] = await tuyau.api.auth
      .login({ body: { email: 'foo@ok.com', password: 'secret' } })
      .safe()

    assert.deepEqual(data, { token: '123' })
    assert.isNull(error)
  })

  test('returns [null, error] on HTTP error', async ({ assert }) => {
    const tuyau = createTestTuyau()

    nock('http://localhost:3333').post('/auth/login').reply(400, { message: 'Invalid credentials' })

    const [data, error] = await tuyau.api.auth
      .login({ body: { email: 'foo@ok.com', password: 'bar' } })
      .safe()

    assert.isNull(data)
    assert.instanceOf(error, TuyauError)
    assert.instanceOf(error, TuyauHTTPError)
    assert.equal(error!.kind, 'http')
    assert.equal(error!.status, 400)
    assert.equal((error!.response as any).message, 'Invalid credentials')
    assert.isTrue(error!.isStatus(400))
  })

  test('returns [null, error] on network error', async ({ assert }) => {
    const tuyau = createTestTuyau('http://localhost:9999')

    const [data, error] = await tuyau.api.auth
      .login({ body: { email: 'test@test.com', password: 'password' } })
      .safe()

    assert.isNull(data)
    assert.instanceOf(error, TuyauError)
    assert.instanceOf(error, TuyauNetworkError)
    assert.equal(error!.kind, 'network')
    assert.isUndefined(error!.status)
    assert.isUndefined(error!.response)
    assert.include(error!.message, 'Network error')
    assert.isFalse(error!.isStatus(404))
  })

  test('safe() works with path-based methods', async ({ assert }) => {
    const tuyau = createTestTuyau()

    nock('http://localhost:3333').get('/users').reply(200, { token: '123' })

    const [data, error] = await tuyau.get('/users', {}).safe()

    assert.deepEqual(data, { token: '123' })
    assert.isNull(error)
  })

  test('safe() works with request method', async ({ assert }) => {
    const tuyau = createTestTuyau()

    nock('http://localhost:3333').get('/users').reply(200, { token: '123' })

    const [data, error] = await tuyau.request('users.index', {}).safe()

    assert.deepEqual(data, { token: '123' })
    assert.isNull(error)
  })

  test('await still works (throws on error)', async ({ assert }) => {
    const tuyau = createTestTuyau()

    nock('http://localhost:3333').post('/auth/login').reply(400, { message: 'Invalid' })

    try {
      await tuyau.api.auth.login({ body: { email: 'foo@ok.com', password: 'bar' } })
      assert.fail('Expected an error')
    } catch (error) {
      assert.instanceOf(error, TuyauHTTPError)
    }
  })

  test('catch() still works on TuyauPromise', async ({ assert }) => {
    const tuyau = createTestTuyau()

    nock('http://localhost:3333').post('/auth/login').reply(400, { message: 'Invalid' })

    let caughtError: any = null
    await tuyau.api.auth.login({ body: { email: 'foo@ok.com', password: 'bar' } }).catch((err) => {
      caughtError = err
    })

    assert.instanceOf(caughtError, TuyauHTTPError)
  })

  test('finally() still works on TuyauPromise', async ({ assert }) => {
    const tuyau = createTestTuyau()

    nock('http://localhost:3333').post('/auth/login').reply(200, { token: '123' })

    let finallyCalled = false
    await tuyau.api.auth
      .login({ body: { email: 'foo@ok.com', password: 'secret' } })
      .finally(() => {
        finallyCalled = true
      })

    assert.isTrue(finallyCalled)
  })
})

test.group('Client | isStatus()', () => {
  test('isStatus returns true for matching status', async ({ assert }) => {
    const tuyau = createTestTuyau()

    nock('http://localhost:3333').post('/auth/login').reply(400, { error: 'Bad request' })

    const [, error] = await tuyau.api.auth
      .login({ body: { email: 'foo@ok.com', password: 'bar' } })
      .safe()

    assert.isTrue(error!.isStatus(400))
    assert.isFalse(error!.isStatus(422))
    assert.isFalse(error!.isStatus(500))
  })

  test('isStatus returns false for non-matching status', async ({ assert }) => {
    const tuyau = createTestTuyau()

    nock('http://localhost:3333').post('/auth/login').reply(500, { error: 'Server error' })

    const [, error] = await tuyau.api.auth
      .login({ body: { email: 'foo@ok.com', password: 'bar' } })
      .safe()

    assert.isFalse(error!.isStatus(400))
    assert.isTrue(error!.isStatus(500))
  })
})
