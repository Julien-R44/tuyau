import nock from 'nock'
import { test } from '@japa/runner'

import { createTuyau } from '../src/client/tuyau.ts'
import { defaultRegistry as registry } from './fixtures/index.ts'

test.group('Client | HTTP Methods', () => {
  test('PUT request with body and params', async ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333').put('/users/1').reply(200, { id: '1', name: 'John' })

    const result = await tuyau.put('/users/:id', {
      params: { id: '1' },
      body: { name: 'John' },
    })

    assert.deepEqual(result, { id: '1', name: 'John' })
  })

  test('PATCH request with body and params', async ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333').patch('/users/1').reply(200, { id: '1', name: 'Jane' })

    const result = await tuyau.patch('/users/:id', {
      params: { id: '1' },
      body: { name: 'Jane' },
    })

    assert.deepEqual(result, { id: '1', name: 'Jane' })
  })

  test('DELETE request with params', async ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333').delete('/users/1').reply(200, { success: true })

    const result = await tuyau.delete('/users/:id', {
      params: { id: '1' },
    })

    assert.deepEqual(result, { success: true })
  })

  test('POST with empty body', async ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333').post('/users').reply(200, { token: '123' })

    const result = await tuyau.api.users.store({ body: {} as any })
    assert.deepEqual(result, { token: '123' })
  })

  test('PUT with undefined body', async ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333').put('/users/1').reply(200, { id: '1', name: 'test' })

    const result = await tuyau.put('/users/:id', {
      params: { id: '1' },
      body: undefined as any,
    })

    assert.deepEqual(result, { id: '1', name: 'test' })
  })
})
