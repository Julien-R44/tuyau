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
})
