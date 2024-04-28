import { test } from '@japa/runner'
import type { Serialize, Simplify } from '@tuyau/utils/types'

import { createTuyau } from '../index.js'
import type { InferRequestType, InferResponseType } from '../index.js'

test.group('Client | Typings', () => {
  test('post', async ({ expectTypeOf }) => {
    const tuyau = createTuyau<{
      auth: {
        login: {
          post: {
            request: { email: string; password: string }
            response: { 200: Simplify<Serialize<{ token: string }>> }
          }
        }
      }
    }>('http://localhost:3333')

    expectTypeOf(tuyau.auth.login.post).parameter(0).toEqualTypeOf<{
      email: string
      password: string
    }>()

    type Response = Awaited<ReturnType<typeof tuyau.auth.login.post>>
    expectTypeOf<NonNullable<Response['data']>>().toEqualTypeOf<{ token: string }>()
  })

  test('get', async ({ expectTypeOf }) => {
    const tuyau = createTuyau<{
      users: {
        get: {
          request: { email: string }
          response: { 200: Simplify<Serialize<{ token: string }>> }
        }
      }
    }>('http://localhost:3333')

    expectTypeOf(tuyau.users.get).parameter(0).toMatchTypeOf<{
      query: { email: string }
    }>()

    type Response = Awaited<ReturnType<typeof tuyau.users.get>>
    expectTypeOf<NonNullable<Response['data']>>().toEqualTypeOf<{ token: string }>()
  })

  test('get | every params optionals', async ({ expectTypeOf }) => {
    const tuyau = createTuyau<{
      users: {
        get: {
          request: { email?: string }
          response: { 200: Simplify<Serialize<{ token: string }>> }
        }
      }
    }>('http://localhost:3333')

    expectTypeOf(tuyau.users.get)
      .parameter(0)
      .toMatchTypeOf<{ query?: { email?: string } } | undefined>()
  })

  test('get | only one optional props', async ({ expectTypeOf }) => {
    const tuyau = createTuyau<{
      users: {
        get: {
          request: { email: string; page?: number }
          response: { 200: Simplify<Serialize<{ token: string }>> }
        }
      }
    }>('http://localhost:3333')

    expectTypeOf(tuyau.users.get)
      .parameter(0)
      .toMatchTypeOf<{ query: { email: string; page?: number } }>()
  })

  test('result as string', async ({ expectTypeOf }) => {
    const tuyau = createTuyau<{
      auth: {
        login: {
          post: {
            request: { email: string; password: string }
            response: { 200: Simplify<Serialize<string>> }
          }
        }
      }
    }>('http://localhost:3333')

    type Response = Awaited<ReturnType<typeof tuyau.auth.login.post>>
    expectTypeOf<NonNullable<Response['data']>>().toEqualTypeOf<string>()
  })

  test('route params', async ({ expectTypeOf }) => {
    const tuyau = createTuyau<{
      users: {
        ':id': {
          get: {
            request: { foo: string }
            response: { 200: Simplify<Serialize<{ id: string }>> }
          }
        }
      }
    }>('http://localhost:3333')

    expectTypeOf(tuyau.users).parameter(0).toEqualTypeOf<{ id: string | number }>()
    expectTypeOf(tuyau.users({ id: '1' }).get)
      .parameter(0)
      .toMatchTypeOf<{ query: { foo: string } }>()
  })

  test('narrow error', async ({ expectTypeOf }) => {
    const tuyau = createTuyau<{
      users: {
        get: {
          request: { foo: string }
          response: {
            200: Simplify<Serialize<{ id: string }>>
            404: Simplify<Serialize<{ messageNotFound: string }>>
            500: Simplify<Serialize<{ messageServerError: string }>>
          }
        }
      }
    }>('http://localhost:3333')

    type Error = Awaited<ReturnType<typeof tuyau.users.get>>['error']

    type Response = Awaited<ReturnType<typeof tuyau.users.get>>

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
      users: {
        get: {
          request: { foo: string }
          response: {
            200: Simplify<Serialize<{ id: string }>>
            404: Simplify<Serialize<{ messageNotFound: string }>>
            500: Simplify<Serialize<{ messageServerError: string }>>
          }
        }
      }
    }>('http://localhost:3333')

    expectTypeOf<InferResponseType<typeof tuyau.users.get>>().toEqualTypeOf<{
      id: string
    }>()
  })

  test('InferRequestType', async ({ expectTypeOf }) => {
    const tuyau = createTuyau<{
      users: {
        get: {
          request: { foo: string }
          response: {
            200: Simplify<Serialize<{ id: string }>>
            404: Simplify<Serialize<{ messageNotFound: string }>>
            500: Simplify<Serialize<{ messageServerError: string }>>
          }
        }
      }
    }>('http://localhost:3333')

    expectTypeOf<InferRequestType<typeof tuyau.users.get>>().toEqualTypeOf<{ foo: string }>()
  })
})
