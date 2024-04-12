import nock from 'nock'
import { test } from '@japa/runner'
import { createTuyau } from '../index.js'
import { Serialize, Simplify } from '@tuyau/utils/types'

test.group('Client', () => {
  test('post something', async ({ assert, expectTypeOf }) => {
    const tuyau = createTuyau<{
      auth: {
        login: {
          post: {
            request: { email: string; password: string }
            response: Simplify<Serialize<{ token: string }>>
          }
        }
      }
    }>('http://localhost:3333')

    nock('http://localhost:3333').post('/auth/login').reply(200, { token: '123' })

    const result = await tuyau.auth.login.post({
      email: 'foo@ok.com',
      password: 'secret',
    })

    expectTypeOf(tuyau.auth.login.post).parameter(0).toEqualTypeOf<{
      email: string
      password: string
    }>()

    expectTypeOf(result.data!).toEqualTypeOf<{ token: string }>()
    assert.equal(result.data!.token, '123')
  })

  test('get something', async ({ assert, expectTypeOf }) => {
    const tuyau = createTuyau<{
      users: {
        get: {
          request: { email: string }
          response: Simplify<Serialize<{ token: string }>>
        }
      }
    }>('http://localhost:3333')

    nock('http://localhost:3333')
      .get('/users')
      .query({ email: 'foo@ok.com' })
      .reply(200, { token: '123' })

    const result = await tuyau.users.get({ query: { email: 'foo@ok.com' } })

    expectTypeOf(tuyau.users.get).parameter(0).toMatchTypeOf<{
      query: { email: string }
    }>()

    expectTypeOf(result.data!).toEqualTypeOf<{ token: string }>()

    assert.equal(result.data!.token, '123')
  })

  test('if every request query params are optional, the query should be optional', async ({
    assert,
    expectTypeOf,
  }) => {
    const tuyau = createTuyau<{
      users: {
        get: {
          request: { email?: string }
          response: Simplify<Serialize<{ token: string }>>
        }
      }
    }>('http://localhost:3333')

    nock('http://localhost:3333').get('/users').reply(200, { token: '123' })

    const result = await tuyau.users.get()

    expectTypeOf(tuyau.users.get).parameter(0).toMatchTypeOf<
      | {
          query?: { email?: string }
        }
      | undefined
    >()

    expectTypeOf(result.data!).toEqualTypeOf<{ token: string }>()
    assert.equal(result.data!.token, '123')
  })

  test('if every request params are optional, the body should be optional', async ({
    assert,
    expectTypeOf,
  }) => {
    const tuyau = createTuyau<{
      users: {
        post: {
          request: { email?: string }
          response: Simplify<Serialize<{ token: string }>>
        }
      }
    }>('http://localhost:3333')

    nock('http://localhost:3333')
      .post('/users')
      .matchHeader('x-foo', 'bar')
      .reply(200, { token: '123' })

    const result = await tuyau.users.post(null, { headers: { 'x-foo': 'bar' } })

    expectTypeOf(tuyau.users.post)
      .parameter(0)
      .toMatchTypeOf<{ email?: string } | null | undefined>()
    expectTypeOf(result.data!).toEqualTypeOf<{ token: string }>()
    assert.equal(result.data!.token, '123')
  })

  test('store and reuse query', async ({ assert }) => {
    const tuyau = createTuyau<{
      auth: {
        login: {
          post: {
            request: { email: string; password: string }
            response: Simplify<Serialize<{ token: string }>>
          }
        }
      }
    }>('http://localhost:3333')

    nock('http://localhost:3333').post('/auth/login').times(2).reply(200, { token: '123' })

    const request = tuyau.auth.login.post

    const r1 = await request({ email: 'foo@ok.com', password: 'secret' })
    const r2 = await request({ email: 'foo@ok.com', password: 'secret' })

    assert.equal(r1.data!.token, '123')
    assert.equal(r2.data!.token, '123')
  })

  test('parse as ArrayBuffer when octet-stream response', async ({ assert }) => {
    const tuyau = createTuyau<{
      auth: {
        login: {
          post: {
            request: { email: string; password: string }
            response: Simplify<Serialize<{ token: string }>>
          }
        }
      }
    }>('http://localhost:3333')

    nock('http://localhost:3333')
      .post('/auth/login')
      .reply(200, 'hello', { 'Content-Type': 'application/octet-stream' })

    const result = await tuyau.auth.login.post({
      email: 'foo@ok.com',
      password: 'secret',
    })

    assert.isTrue(result.data instanceof ArrayBuffer)
  })

  test('parse as text when content type is not recognized', async ({ assert }) => {
    const tuyau = createTuyau<{
      auth: {
        login: {
          post: {
            request: { email: string; password: string }
            response: string
          }
        }
      }
    }>('http://localhost:3333')

    nock('http://localhost:3333')
      .post('/auth/login')
      .reply(200, 'hello', { 'Content-Type': 'text/plain' })

    const result = await tuyau.auth.login.post({
      email: 'test@ok.com',
      password: 'secret',
    })

    assert.isTrue(typeof result.data === 'string')
    assert.equal(result.data, 'hello')
  })

  test('pass ky options when creating instance', async ({ assert }) => {
    let hookCalled = false
    const tuyau = createTuyau<{
      auth: {
        login: {
          post: {
            request: unknown
            response: Simplify<Serialize<{ token: string }>>
          }
        }
      }
    }>('http://localhost:3333', {
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
    await tuyau.auth.login.post()

    assert.isTrue(hookCalled)
  })

  test('route params', async ({ assert }) => {
    const tuyau = createTuyau<{
      users: {
        ':id': {
          get: {
            request: { foo: string }
            response: Simplify<Serialize<{ id: string }>>
          }
        }
      }
    }>('http://localhost:3333')

    nock('http://localhost:3333').get('/users/1?foo=bar').reply(200, { id: '1' })
    const result = await tuyau.users({ id: '1' }).get({ query: { foo: 'bar' } })

    assert.equal(result.data!.id, '1')
  })
})
