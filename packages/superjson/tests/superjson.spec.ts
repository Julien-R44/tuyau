import nock from 'nock'
import { test } from '@japa/runner'
import { createTuyau } from '@tuyau/client'
import { Serialize, Simplify } from '@tuyau/utils/types'
import { BodyParserMiddlewareFactory } from '@adonisjs/core/factories/bodyparser'
import { HttpContextFactory, RequestFactory } from '@adonisjs/core/factories/http'

import { httpServer } from './helpers.js'
import { superjson } from '../client/plugin.js'
import SuperjsonMiddleware from '../middleware/superjson_middleware.js'

test.group('Superjson', (group) => {
  group.each.teardown(() => nock.cleanAll())

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
      .matchHeader('x-superjson', 'true')
      .reply(500, {
        json: { date: '1970-01-01T00:00:00.000Z' },
        meta: { values: { date: ['Date'] } },
      })

    const result = await tuyau.users.$get()
    // @ts-ignore
    assert.instanceOf(result.error?.value.date, Date)
  })

  test('also serialise using superjson while posting data', async () => {
    const tuyau = createTuyau<{
      routes: []
      definition: {
        users: {
          $post: {
            request: { date: Date }
            response: { 200: Simplify<Serialize<{ token: string }>> }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333', plugins: [superjson()] })

    nock('http://localhost:3333')
      .post(
        '/users',
        '{"json":{"date":"1970-01-01T00:00:00.000Z"},"meta":{"values":{"date":["Date"]}}}',
      )
      .reply(200, { token: 'foo' })

    await tuyau.users.$post({ date: new Date('1970-01-01') })
  })

  test('adonis body is deserialized', async ({ assert }) => {
    assert.plan(2)

    const server = httpServer.create(async (req, res) => {
      const request = new RequestFactory().merge({ req, res, method: 'POST' }).create()
      const ctx = new HttpContextFactory().merge({ request }).create()

      const bodyParser = new BodyParserMiddlewareFactory().create()
      const middleware = new SuperjsonMiddleware()
      await bodyParser.handle(ctx, async () => {})

      await middleware.handle(ctx, () => {
        assert.instanceOf(ctx.request.body().date, Date)
        assert.typeOf(ctx.request.body().bigInt, 'bigint')
      })

      res.end(ctx.response.getBody())
    })

    server.listen(3333)

    const tuyau = createTuyau<{
      routes: []
      definition: {
        users: {
          $post: {
            request: { date: Date; bigInt: bigint }
            response: { 200: Simplify<Serialize<{ token: string }>> }
          }
        }
      }
    }>({ baseUrl: 'http://localhost:3333', plugins: [superjson()] })

    await tuyau.users.$post({ date: new Date('1970-01-01'), bigInt: BigInt(1) }).unwrap()

    server.close()
  })
})
