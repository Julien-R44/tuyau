/// <reference types="@adonisjs/core/providers/vinejs_provider" />

import vine from '@vinejs/vine'
import { test } from '@japa/runner'
import type { InferInput } from '@vinejs/vine/types'
import type { MakeTuyauRequest, Serialize, Simplify } from '@tuyau/utils/types'

import { createTuyau } from '../index.js'
import type { InferRequestType, InferResponseType } from '../index.js'

test.group('Client | Typings', () => {
  test('post', async ({ expectTypeOf }) => {
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

    expectTypeOf(tuyau.auth.login.$post).parameter(0).toEqualTypeOf<{
      email: string
      password: string
    }>()

    type Response = Awaited<ReturnType<typeof tuyau.auth.login.$post>>
    expectTypeOf<NonNullable<Response['data']>>().toEqualTypeOf<{ token: string }>()
  })

  test('get', async ({ expectTypeOf }) => {
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

    expectTypeOf(tuyau.users.$get).parameter(0).toMatchTypeOf<{
      query: { email: string }
    }>()

    type Response = Awaited<ReturnType<typeof tuyau.users.$get>>
    expectTypeOf<NonNullable<Response['data']>>().toEqualTypeOf<{ token: string }>()
  })

  test('get | every params optionals', async ({ expectTypeOf }) => {
    const tuyau = createTuyau<{
      routes: []
      definition: {
        users: {
          $get: {
            request: { email?: string }
            response: { 200: Simplify<Serialize<{ token: string }>> }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333' })

    expectTypeOf(tuyau.users.$get)
      .parameter(0)
      .toMatchTypeOf<{ query?: { email?: string } } | undefined>()
  })

  test('get | only one optional props', async ({ expectTypeOf }) => {
    const tuyau = createTuyau<{
      routes: []
      definition: {
        users: {
          $get: {
            request: { email: string; page?: number }
            response: { 200: Simplify<Serialize<{ token: string }>> }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333' })

    expectTypeOf(tuyau.users.$get)
      .parameter(0)
      .toMatchTypeOf<{ query: { email: string; page?: number } }>()
  })

  test('result as string', async ({ expectTypeOf }) => {
    const tuyau = createTuyau<{
      routes: []
      definition: {
        auth: {
          login: {
            $post: {
              request: { email: string; password: string }
              response: { 200: Simplify<Serialize<string>> }
            }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333' })

    type Response = Awaited<ReturnType<typeof tuyau.auth.login.$post>>
    expectTypeOf<NonNullable<Response['data']>>().toEqualTypeOf<string>()
  })

  test('route params', async ({ expectTypeOf }) => {
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

    expectTypeOf(tuyau.users).parameter(0).toEqualTypeOf<{ id: string | number }>()
    expectTypeOf(tuyau.users({ id: '1' }).$get)
      .parameter(0)
      .toMatchTypeOf<{ query: { foo: string } }>()
  })

  test('narrow error', async ({ expectTypeOf }) => {
    const tuyau = createTuyau<{
      routes: []
      definition: {
        users: {
          $get: {
            request: { foo: string }
            response: {
              200: Simplify<Serialize<{ id: string }>>
              404: Simplify<Serialize<{ messageNotFound: string }>>
              500: Simplify<Serialize<{ messageServerError: string }>>
            }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333' })

    type Error = Awaited<ReturnType<typeof tuyau.users.$get>>['error']

    type Response = Awaited<ReturnType<typeof tuyau.users.$get>>

    expectTypeOf<Error>().toMatchTypeOf<
      | { status: 404; value: { messageNotFound: string } }
      | { status: 500; value: { messageServerError: string } }
      | null
    >()

    expectTypeOf<Exclude<Response, { error: null }>>().toMatchTypeOf<{
      data: null
      status: number
      error:
        | { status: 404; value: { messageNotFound: string } }
        | { status: 500; value: { messageServerError: string } }
    }>()

    expectTypeOf<Exclude<Response, { data: null }>>().toMatchTypeOf<{
      error: null
      status: number
      data: { id: string }
    }>()
  })

  test('InferResponseType', async ({ expectTypeOf }) => {
    const tuyau = createTuyau<{
      routes: []
      definition: {
        users: {
          $get: {
            request: { foo: string }
            response: {
              200: Simplify<Serialize<{ id: string }>>
              404: Simplify<Serialize<{ messageNotFound: string }>>
              500: Simplify<Serialize<{ messageServerError: string }>>
            }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333' })

    expectTypeOf<InferResponseType<typeof tuyau.users.$get>>().toEqualTypeOf<{
      id: string
    }>()
  })

  test('InferRequestType', async ({ expectTypeOf }) => {
    const tuyau = createTuyau<{
      routes: [
        {
          name: 'users'
          path: '/users'
          params: []
          method: ['GET', 'POST']
          types: {
            request: { foo: string }
            response: {
              200: Simplify<Serialize<{ id: string }>>
              404: Simplify<Serialize<{ messageNotFound: string }>>
              500: Simplify<Serialize<{ messageServerError: string }>>
            }
          }
        },
      ]
      definition: {
        users: {
          $get: {
            request: { foo: string }
            response: {
              200: Simplify<Serialize<{ id: string }>>
              404: Simplify<Serialize<{ messageNotFound: string }>>
              500: Simplify<Serialize<{ messageServerError: string }>>
            }
          }
          $post: {
            request: { foo: string }
            response: {
              200: Simplify<Serialize<{ id: string }>>
              404: Simplify<Serialize<{ messageNotFound: string }>>
              500: Simplify<Serialize<{ messageServerError: string }>>
            }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333' })

    const getUsers = tuyau.$route('users').$get
    expectTypeOf<InferRequestType<typeof tuyau.users.$get>>().toMatchTypeOf<{ foo: string }>()
    expectTypeOf<InferRequestType<typeof tuyau.users.$post>>().toEqualTypeOf<{ foo: string }>()
    expectTypeOf<InferRequestType<typeof getUsers>>().toMatchTypeOf<{ foo: string }>()
  }).fails()

  test('$url method', async ({ expectTypeOf }) => {
    const tuyau = createTuyau<{
      routes: []
      definition: {
        users: {
          $url: {}
          $get: {
            request: { foo: string }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333' })

    const result = tuyau.users.$url()
    expectTypeOf(result).toEqualTypeOf<string>()
  })

  test('file typing', async ({}) => {
    // @ts-expect-error
    vine.file = () => vine.string()

    const request = vine.compile(
      vine.object({
        picture: vine.file({ extnames: ['jpg', 'jpeg', 'png', 'gif'], size: '1mb' }),
      }),
    )

    const tuyau = createTuyau<{
      routes: []
      definition: {
        user: {
          $post: {
            request: MakeTuyauRequest<InferInput<typeof request>>
            response: { 200: Simplify<Serialize<{ id: string }>> }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333' })

    tuyau.user.$post({
      picture: new File([], 'filename.jpg'),
    })

    tuyau.user.$post({
      picture: new Blob([], { type: 'image/jpeg' }),
    })

    // This is how you would use it in React Native
    tuyau.user.$post({
      picture: {
        uri: 'http://example.com/filename.jpg',
        name: 'filename.jpg',
        type: 'image/jpeg',
      },
    })
  })

  test('if no routes passed, $route and co should not be available', async ({}) => {
    const tuyau = createTuyau<{ definition: { users: { $get: {} } } }>({
      baseUrl: 'http://localhost:3333',
    })

    // @ts-expect-error $route should not be available
    tuyau.$route

    // @ts-expect-error $route should not be available
    tuyau.$has

    tuyau.users.$get
  })
})
