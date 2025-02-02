import nock from 'nock'
import { test } from '@japa/runner'
import type { Serialize, Simplify } from '@tuyau/utils/types'

import { TuyauHTTPError, createTuyau } from '../index.js'

test.group('Client | Runtime', () => {
  test('post something', async ({ assert }) => {
    const tuyau = createTuyau<{
      routes: []
      definition: {
        auth: {
          login: {
            $post: {
              request: { email: string; password: string }
              response: { 200: Simplify<Serialize<{ token: string }>> }
            }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333' })

    nock('http://localhost:3333').post('/auth/login').reply(200, { token: '123' })

    const result = await tuyau.auth.login.$post({
      email: 'foo@ok.com',
      password: 'secret',
    })

    assert.equal(result.data!.token, '123')
  })

  test('post with query parameters', async ({}) => {
    const tuyau = createTuyau<{
      routes: []
      definition: {
        auth: {
          login: {
            $post: {
              request: { email: string; password: string }
              response: { 200: Simplify<Serialize<{ token: string }>> }
            }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333' })

    nock('http://localhost:3333')
      .post('/auth/login')
      .query({ foo: 'bar' })
      .reply(200, { token: '123' })

    await tuyau.auth.login.$post(
      { email: 'foo@ok.com', password: 'test' },
      { query: { foo: 'bar' } },
    )
  })

  test('get something', async ({ assert }) => {
    const tuyau = createTuyau<{
      routes: []
      definition: {
        users: {
          $get: {
            request: { email: string }
            response: {
              200: Simplify<Serialize<{ token: string }>>
            }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333' })

    nock('http://localhost:3333')
      .get('/users')
      .query({ email: 'foo@ok.com' })
      .reply(200, { token: '123' })

    const result = await tuyau.users.$get({ query: { email: 'foo@ok.com' } })

    assert.equal(result.data!.token, '123')
  })

  test('store and reuse query', async ({ assert }) => {
    const tuyau = createTuyau<{
      routes: []
      definition: {
        auth: {
          login: {
            $post: {
              request: { email: string; password: string }
              response: { 200: Simplify<Serialize<{ token: string }>> }
            }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333' })

    nock('http://localhost:3333').post('/auth/login').times(2).reply(200, { token: '123' })

    const request = tuyau.auth.login.$post

    const r1 = await request({ email: 'foo@ok.com', password: 'secret' })
    const r2 = await request({ email: 'foo@ok.com', password: 'secret' })

    assert.equal(r1.data!.token, '123')
    assert.equal(r2.data!.token, '123')
  })

  test('parse as ArrayBuffer when octet-stream response', async ({ assert }) => {
    const tuyau = createTuyau<{
      routes: []
      definition: {
        auth: {
          login: {
            $post: {
              request: { email: string; password: string }
              response: { 200: Simplify<Serialize<{ token: string }>> }
            }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333' })

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
      routes: []
      definition: {
        auth: {
          login: {
            $post: {
              request: { email: string; password: string }
              response: string
            }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333' })

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
      routes: []
      definition: {
        auth: {
          login: {
            $post: {
              request: unknown
              response: { 200: Simplify<Serialize<{ token: string }>> }
            }
          }
        }
      }
    }>({
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
    await tuyau.auth.login.$post()

    assert.isTrue(hookCalled)
  })

  test('route params', async ({ assert }) => {
    const tuyau = createTuyau<{
      routes: []
      definition: {
        users: {
          ':id': {
            $get: {
              request: { foo: string }
              response: { 200: Simplify<Serialize<{ id: string }>> }
            }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333' })

    nock('http://localhost:3333').get('/users/1?foo=bar').reply(200, { id: '1' })
    const result = await tuyau.users({ id: '1' }).$get({ query: { foo: 'bar' } })

    assert.equal(result.data!.id, '1')
  })

  test('pass query params array the right way', async () => {
    const tuyau = createTuyau<{
      routes: []
      definition: {
        users: {
          $get: {
            request: { ids: (string | number)[] }
            response: { 200: Simplify<Serialize<{ id: string }>> }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333' })

    nock('http://localhost:3333').get('/users?ids[]=1&ids[]=2').reply(200, { id: '1' })

    await tuyau.users.$get({ query: { ids: [1, 2] } })
  })

  test('pass query params array with single item the right way', async () => {
    const tuyau = createTuyau<{
      routes: []
      definition: {
        users: {
          $get: {
            request: { ids: (string | number)[] }
            response: { 200: Simplify<Serialize<{ id: string }>> }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333' })

    nock('http://localhost:3333').get('/users?ids[]=1').reply(200, { id: '1' })

    await tuyau.users.$get({ query: { ids: [1] } })
  })

  test('handle undefined query params', async () => {
    const tuyau = createTuyau<{
      routes: []
      definition: {
        users: {
          $get: {
            request: { ids?: (string | number)[] }
            response: { 200: Simplify<Serialize<{ id: string }>> }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333' })

    nock('http://localhost:3333').get('/users').reply(200, { id: '1' })

    await tuyau.users.$get({ query: { ids: undefined } })
  })

  test('handle undefined query params in array', async () => {
    const tuyau = createTuyau<{
      routes: []
      definition: {
        users: {
          $get: {
            request: { ids?: any[] }
            response: { 200: Simplify<Serialize<{ id: string }>> }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333' })

    nock('http://localhost:3333').get('/users?ids[]=1&ids[]=2').reply(200, { id: 1 })

    await tuyau.users.$get({ query: { ids: [1, undefined, 2, null] } })
  })

  test('multiple query params', async () => {
    const tuyau = createTuyau<{
      routes: []
      definition: {
        users: {
          $get: {
            request: { foo: string; bar: string; ids: (string | number)[] }
            response: { 200: Simplify<Serialize<{ id: string }>> }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333' })

    nock('http://localhost:3333')
      .get('/users?foo=bar&bar=baz&ids[]=1&ids[]=2')
      .reply(200, { id: '1' })

    await tuyau.users.$get({ query: { foo: 'bar', bar: 'baz', ids: [1, 2] } })
  })

  test('send as form data when payload include file', async () => {
    const tuyau = createTuyau<{
      routes: []
      definition: {
        auth: {
          login: {
            $post: {
              request: { file: any }
              response: { 200: Simplify<Serialize<{ token: string }>> }
            }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333' })

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
      routes: []
      definition: {
        auth: {
          login: {
            $post: {
              request: unknown
              response: { 200: Simplify<Serialize<{ token: string }>> }
            }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333' })

    nock('http://localhost:3333').post('/auth/login').reply(200, { token: '123' })

    const result = await tuyau.auth.login.$post().unwrap()
    assert.equal(result.token, '123')
  })

  test('unwrap response throw error when there is an error', async ({ assert }) => {
    assert.plan(2)

    const tuyau = createTuyau<{
      routes: []
      definition: {
        auth: {
          login: {
            $post: {
              request: unknown
              response: { 200: Simplify<Serialize<{ token: string }>> }
            }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333' })

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
      routes: []
      definition: {
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
      }
    }>({ baseUrl: 'http://localhost:3333' })

    assert.deepEqual(tuyau.users.$url(), 'http://localhost:3333/users')
    assert.deepEqual(tuyau.auth.login.$url(), 'http://localhost:3333/auth/login')
    assert.deepEqual(tuyau.users({ id: '1' }).$url(), 'http://localhost:3333/users/1')
  })

  test('generate url with query parameters', async ({ assert }) => {
    const tuyau = createTuyau<{
      routes: []
      definition: {
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
      }
    }>({ baseUrl: 'http://localhost:3333' })

    const result = tuyau.users.$url({ query: { email: 'foo@ok.com', bar: ['baz', 'qux'] } })
    assert.deepEqual(result, 'http://localhost:3333/users?email=foo%40ok.com&bar[]=baz&bar[]=qux')
    assert.deepEqual(tuyau.users({ id: '1' }).$url(), 'http://localhost:3333/users/1')
    assert.deepEqual(
      tuyau.users({ id: '1' }).$url({ query: { foo: 'ok' } }),
      'http://localhost:3333/users/1?foo=ok',
    )
  })

  test('upload file pass the right content type', async () => {
    const tuyau = createTuyau<{
      routes: []
      definition: {
        users: {
          $post: {
            request: { file: any }
            response: { 200: Simplify<Serialize<{ token: string }>> }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333' })

    nock('http://localhost:3333')
      .post('/users')
      .reply(200, { token: '123' })
      .matchHeader('content-type', /multipart\/form-data/)

    await tuyau.users.$post({ file: new File(['hello'], 'hello.txt') })
  })

  test('send blob', async () => {
    const tuyau = createTuyau<{
      routes: []
      definition: {
        users: {
          $post: {
            request: { file: any }
            response: { 200: Simplify<Serialize<{ token: string }>> }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333' })

    const blob = new Blob(['hello'], { type: 'image/jpeg' })

    nock('http://localhost:3333')
      .post('/users')
      .reply(200, { token: '123' })
      .matchHeader('content-type', /multipart\/form-data/)

    await tuyau.users.$post({ file: blob })
  })

  test('pass form data directly', async () => {
    const tuyau = createTuyau<{
      routes: []
      definition: {
        users: {
          $post: {
            request: { name: string; email: string }
            response: { 200: Simplify<Serialize<{ token: string }>> }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333' })

    nock('http://localhost:3333')
      .post('/users')
      .reply(200, { token: '123' })
      .matchHeader('content-type', /multipart\/form-data/)

    const formData = new FormData()
    formData.append('name', 'julien')
    formData.append('email', 'foo@ok.com')

    await tuyau.users.$post(formData as any)
  })

  test('pass headers from queryOptions', async () => {
    const tuyau = createTuyau<{
      routes: []
      definition: {
        users: {
          $get: {
            request: { email: string }
            response: { 200: Simplify<Serialize<{ token: string }>> }
          }
        }
      }
    }>({
      baseUrl: 'http://localhost:3333',
      headers: { 'default-header': 'default-value' },
    })

    nock('http://localhost:3333', {})
      .get('/users')
      .query({ email: 'foo@ok.com' })
      // .matchHeader('default-header', 'default-value')
      .matchHeader('custom-header', 'custom-value')
      .reply(200, { token: '123' })

    await tuyau.users.$get({
      query: { email: 'foo@ok.com' },
      headers: { 'custom-header': 'custom-value' },
    })
  })

  test('pass headers to post request', async () => {
    const tuyau = createTuyau<{
      routes: []
      definition: {
        users: {
          $post: {
            request: { name: string; email: string }
            response: { 200: Simplify<Serialize<{ token: string }>> }
          }
        }
      }
    }>({
      baseUrl: 'http://localhost:3333',
      headers: {
        'default-header': 'default-value',
      },
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

    await tuyau.users.$post(formData as any, {
      headers: { 'custom-header': 'custom-value' },
    })
  })

  test('pass query options to get request', async () => {
    const tuyau = createTuyau<{
      routes: []
      definition: {
        users: {
          $get: {
            request: { email: string }
            response: { 200: Simplify<Serialize<{ token: string }>> }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333' })

    nock('http://localhost:3333')
      .get('/users')
      .query({ email: 'foo@ok.com' })
      .reply(200, { token: '123' })
      .matchHeader('custom-header', 'custom-value')
      .matchHeader('second-header', 'custom-value')

    await tuyau.users.$get({
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

    const tuyau = createTuyau<{
      routes: []
      definition: {
        users: {
          $get: {
            request: any
            response: { 200: Simplify<Serialize<{ token: string }>> }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333' })

    nock('http://localhost:3333')
      .get('/users')
      .reply(200, { token: '123' })
      .matchHeader('X-XSRF-TOKEN', '123')

    await tuyau.users.$get()
  })

  test('plugin should be able to mutate options', async ({ assert }) => {
    assert.plan(2)

    const tuyau = createTuyau<{
      routes: []
      definition: {
        users: { $get: { request: any; response: { 200: Simplify<Serialize<{ token: string }>> } } }
      }
    }>({
      baseUrl: 'http://localhost:3333',
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

    await tuyau.users.$get()
  })
})
