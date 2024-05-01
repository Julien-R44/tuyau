import nock from 'nock'
import { test } from '@japa/runner'
import type { Serialize, Simplify } from '@tuyau/utils/types'

import { TuyauHTTPError, createTuyau } from '../index.js'

test.group('Client | Runtime', () => {
  test('post something', async ({ assert }) => {
    const tuyau = createTuyau<{
      auth: {
        login: {
          $post: {
            request: { email: string; password: string }
            response: { 200: Simplify<Serialize<{ token: string }>> }
          }
        }
      }
    }>('http://localhost:3333')

    nock('http://localhost:3333').post('/auth/login').reply(200, { token: '123' })

    const result = await tuyau.auth.login.$post({
      email: 'foo@ok.com',
      password: 'secret',
    })

    assert.equal(result.data!.token, '123')
  })

  test('get something', async ({ assert }) => {
    const tuyau = createTuyau<{
      users: {
        $get: {
          request: { email: string }
          response: {
            200: Simplify<Serialize<{ token: string }>>
          }
        }
      }
    }>('http://localhost:3333')

    nock('http://localhost:3333')
      .get('/users')
      .query({ email: 'foo@ok.com' })
      .reply(200, { token: '123' })

    const result = await tuyau.users.$get({ query: { email: 'foo@ok.com' } })

    assert.equal(result.data!.token, '123')
  })

  test('store and reuse query', async ({ assert }) => {
    const tuyau = createTuyau<{
      auth: {
        login: {
          $post: {
            request: { email: string; password: string }
            response: { 200: Simplify<Serialize<{ token: string }>> }
          }
        }
      }
    }>('http://localhost:3333')

    nock('http://localhost:3333').post('/auth/login').times(2).reply(200, { token: '123' })

    const request = tuyau.auth.login.$post

    const r1 = await request({ email: 'foo@ok.com', password: 'secret' })
    const r2 = await request({ email: 'foo@ok.com', password: 'secret' })

    assert.equal(r1.data!.token, '123')
    assert.equal(r2.data!.token, '123')
  })

  test('parse as ArrayBuffer when octet-stream response', async ({ assert }) => {
    const tuyau = createTuyau<{
      auth: {
        login: {
          $post: {
            request: { email: string; password: string }
            response: { 200: Simplify<Serialize<{ token: string }>> }
          }
        }
      }
    }>('http://localhost:3333')

    nock('http://localhost:3333')
      .post('/auth/login')
      .reply(200, 'hello', { 'Content-Type': 'application/octet-stream' })

    const result = await tuyau.auth.login.$post({
      email: 'foo@ok.com',
      password: 'secret',
    })

    assert.isTrue(result.data instanceof ArrayBuffer)
  })

  test('parse as text when content type is not recognized', async ({ assert }) => {
    const tuyau = createTuyau<{
      auth: {
        login: {
          $post: {
            request: { email: string; password: string }
            response: string
          }
        }
      }
    }>('http://localhost:3333')

    nock('http://localhost:3333')
      .post('/auth/login')
      .reply(200, 'hello', { 'Content-Type': 'text/plain' })

    const result = await tuyau.auth.login.$post({
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
          $post: {
            request: unknown
            response: { 200: Simplify<Serialize<{ token: string }>> }
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
    await tuyau.auth.login.$post()

    assert.isTrue(hookCalled)
  })

  test('route params', async ({ assert }) => {
    const tuyau = createTuyau<{
      users: {
        ':id': {
          $get: {
            request: { foo: string }
            response: { 200: Simplify<Serialize<{ id: string }>> }
          }
        }
      }
    }>('http://localhost:3333')

    nock('http://localhost:3333').get('/users/1?foo=bar').reply(200, { id: '1' })
    const result = await tuyau.users({ id: '1' }).$get({ query: { foo: 'bar' } })

    assert.equal(result.data!.id, '1')
  })

  test('pass query params array the right way', async ({ assert }) => {
    const tuyau = createTuyau<{
      users: {
        $get: {
          request: { ids: (string | number)[] }
          response: { 200: Simplify<Serialize<{ id: string }>> }
        }
      }
    }>('http://localhost:3333')

    nock('http://localhost:3333').get('/users?ids=1&ids=2').reply(200, { id: '1' })

    await tuyau.users.$get({ query: { ids: [1, 2] } })
  })

  test('multiple query params', async ({ assert }) => {
    const tuyau = createTuyau<{
      users: {
        $get: {
          request: { foo: string; bar: string; ids: (string | number)[] }
          response: { 200: Simplify<Serialize<{ id: string }>> }
        }
      }
    }>('http://localhost:3333')

    nock('http://localhost:3333').get('/users?foo=bar&bar=baz&ids=1&ids=2').reply(200, { id: '1' })

    await tuyau.users.$get({ query: { foo: 'bar', bar: 'baz', ids: [1, 2] } })
  })

  test('send as form data when payload include file', async () => {
    const tuyau = createTuyau<{
      auth: {
        login: {
          $post: {
            request: { file: any }
            response: { 200: Simplify<Serialize<{ token: string }>> }
          }
        }
      }
    }>('http://localhost:3333')

    nock('http://localhost:3333')
      .post('/auth/login')
      .reply(200, { token: '123' })
      .matchHeader('content-type', /multipart\/form-data/)

    await tuyau.auth.login.$post({
      file: new File(['hello'], 'hello.txt'),
    })
  })

  test('unwrap response', async ({ assert }) => {
    const tuyau = createTuyau<{
      auth: {
        login: {
          $post: {
            request: unknown
            response: { 200: Simplify<Serialize<{ token: string }>> }
          }
        }
      }
    }>('http://localhost:3333')

    nock('http://localhost:3333').post('/auth/login').reply(200, { token: '123' })

    const result = await tuyau.auth.login.$post().unwrap()
    assert.equal(result.token, '123')
  })

  test('unwrap response throw error when there is an error', async ({ assert }) => {
    assert.plan(2)

    const tuyau = createTuyau<{
      auth: {
        login: {
          $post: {
            request: unknown
            response: { 200: Simplify<Serialize<{ token: string }>> }
          }
        }
      }
    }>('http://localhost:3333')

    nock('http://localhost:3333').post('/auth/login').reply(400, { message: 'Invalid credentials' })

    try {
      await tuyau.auth.login.$post().unwrap()
    } catch (error) {
      assert.instanceOf(error, TuyauHTTPError)
      assert.equal(error.value.message, 'Invalid credentials')
    }
  })

  test('generate url using $url', async ({ assert }) => {
    const tuyau = createTuyau<{
      users: {
        '$url': {}
        '$get': {
          request: { email: string }
          response: { 200: Simplify<Serialize<{ token: string }>> }
        }
        ':id': {
          $url: {}
          $get: {
            request: { email: string }
            response: { 200: Simplify<Serialize<{ token: string }>> }
          }
        }
      }
      auth: {
        login: {
          $url: {}
          $post: {
            request: unknown
            response: { 200: Simplify<Serialize<{ token: string }>> }
          }
        }
      }
    }>('http://localhost:3333')

    assert.deepEqual(tuyau.users.$url(), 'http://localhost:3333/users')
    assert.deepEqual(tuyau.auth.login.$url(), 'http://localhost:3333/auth/login')
    assert.deepEqual(tuyau.users({ id: '1' }).$url(), 'http://localhost:3333/users/1')
  })
})
