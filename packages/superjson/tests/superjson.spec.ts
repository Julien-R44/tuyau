import nock from 'nock'
import { test } from '@japa/runner'
import { createTuyau } from '@tuyau/client'
import { Serialize, Simplify } from '@tuyau/utils/types'

import { superjson } from '../client/plugin.js'

test.group('Superjson', () => {
  test('parse errors', async ({ assert }) => {
    const tuyau = createTuyau<{
      routes: []
      definition: {
        users: {
          $get: {
            request: unknown
            response: { 200: Simplify<Serialize<{ token: string }>> }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333', plugins: [superjson()] })

    nock('http://localhost:3333')
      .get('/users')
      .reply(500, {
        json: { date: '1970-01-01T00:00:00.000Z' },
        meta: { values: { date: ['Date'] } },
      })

    const result = await tuyau.users.$get()
    // @ts-ignore
    assert.instanceOf(result.error?.value.date, Date)
  })
})
