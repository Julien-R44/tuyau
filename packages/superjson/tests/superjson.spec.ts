import nock from 'nock'
import SuperJSON from 'superjson'
import { once } from 'node:events'
import { rm } from 'node:fs/promises'
import { test } from '@japa/runner'
import { createTuyau } from '@tuyau/core/client'
import { BodyParserMiddlewareFactory } from '@adonisjs/core/factories/bodyparser'
import { HttpContextFactory, RequestFactory } from '@adonisjs/core/factories/http'

import { httpServer } from './helpers.ts'
import { superjson } from '../client/plugin.ts'
import { defaultRegistry } from './fixtures/index.ts'
import SuperjsonMiddleware from '../middleware/superjson_middleware.ts'

test.group('Superjson', (group) => {
  group.each.teardown(() => nock.cleanAll())

  test('parse errors', async ({ assert }) => {
    const tuyau = createTuyau({
      baseUrl: 'http://localhost:3333',
      registry: defaultRegistry,
      plugins: [superjson()],
      retry: { limit: 0 },
    })

    nock('http://localhost:3333')
      .get('/users')
      .matchHeader('x-superjson', 'true')
      .reply(500, {
        json: { date: '1970-01-01T00:00:00.000Z' },
        meta: { values: { date: ['Date'] } },
      })

    const result = await tuyau.api.users.index({}).catch((err: any) => err)
    assert.instanceOf(result.response.date, Date)
  })

  test('also serialise using superjson while posting data', async () => {
    const tuyau = createTuyau({
      baseUrl: 'http://localhost:3333',
      registry: defaultRegistry,
      plugins: [superjson()],
    })

    nock('http://localhost:3333')
      .post(
        '/users',
        '{"json":{"date":"1970-01-01T00:00:00.000Z"},"meta":{"values":{"date":["Date"]},"v":1}}',
      )
      .reply(200, { token: 'foo' })

    await tuyau.api.users.store({ body: { date: new Date('1970-01-01') } })
  })

  test('adonis body is deserialized ({contentType})')
    .with([
      { contentType: 'application/json' },
      { contentType: 'application/json; charset=utf-8' },
      { contentType: 'application/vnd.api+json' },
      { contentType: 'application/json-patch+json' },
      { contentType: 'application/csp-report' },
      { contentType: 'application/x-tuyau' },
    ])
    .run(async ({ assert }, { contentType }) => {
      const server = httpServer.create(async (req, res) => {
        const request = new RequestFactory().merge({ req, res, method: 'POST' }).create()
        const ctx = new HttpContextFactory().merge({ request }).create()

        const factory = new BodyParserMiddlewareFactory()
        if (contentType === 'application/x-tuyau') factory.merge({ json: { types: [contentType] } })
        const bodyParser = factory.create()
        const middleware = new SuperjsonMiddleware()
        await bodyParser.handle(ctx, async () => {})

        await middleware.handle(ctx, () => {
          ctx.response.send(ctx.request.body())
        })

        res.setHeader('Content-Type', ctx.response.getHeader('Content-Type')!)
        res.end(ctx.response.getBody())
      })

      server.listen(3333)

      const tuyau = createTuyau({
        baseUrl: 'http://localhost:3333',
        registry: defaultRegistry,
        plugins: [superjson()],
        retry: { limit: 0 },
      })

      const result = await tuyau.api.users.store({
        body: { date: new Date('1970-01-01'), bigInt: BigInt(1) },
        headers: { 'content-type': contentType },
      })

      assert.deepEqual(result, { date: new Date('1970-01-01'), bigInt: BigInt(1) })

      server.close()
    })

  test(
    'preserve form request fields and serialize the response ({format}, json field: {jsonField})',
  )
    .with(
      ['file upload', 'FormData', 'urlencoded'].flatMap((format) => [
        { format, jsonField: false },
        { format, jsonField: true },
      ]),
    )
    .run(async ({ assert, cleanup }, { format, jsonField }) => {
      const server = httpServer.create(async (req, res) => {
        const request = new RequestFactory().merge({ req, res, method: 'POST' }).create()
        const ctx = new HttpContextFactory().merge({ request }).create()
        await new BodyParserMiddlewareFactory().create().handle(ctx, async () => {})

        const before = Object.keys(request.body())
        const file = request.file('avatar')
        if (file?.tmpPath) cleanup(() => rm(file.tmpPath!))

        await new SuperjsonMiddleware().handle(ctx, async () => {
          ctx.response.send({
            before,
            name: request.body()?.name,
            json: request.body()?.json,
            allName: request.all().name,
            fileName: request.body()?.avatar?.clientName,
            fileSize: request.body()?.avatar?.size,
            date: new Date('2026-05-12T10:30:00.000Z'),
          })
        })

        res.setHeader('Content-Type', ctx.response.getHeader('Content-Type')!)
        res.end(ctx.response.getBody())
      })

      server.listen(0)
      await once(server, 'listening')
      const address = server.address() as import('node:net').AddressInfo
      const baseUrl = `http://127.0.0.1:${address.port}`
      const fields: Record<string, string> = { name: 'jane' }
      if (jsonField) fields.json = 'ordinary form field'
      let result: unknown

      if (format === 'urlencoded') {
        const response = await fetch(`${baseUrl}/users`, {
          method: 'POST',
          headers: { 'x-superjson': 'true' },
          body: new URLSearchParams(fields),
        })
        result = SuperJSON.parse(await response.text())
      } else {
        const registry = {
          routes: {
            'users.store': {
              ...defaultRegistry.routes['users.store'],
              types: {} as {
                body: Record<string, string | File> | FormData
                params: {}
                paramsTuple: []
                query: {}
                response: unknown
              },
            },
          },
          $tree: {},
        }
        const tuyau = createTuyau({
          baseUrl,
          registry,
          plugins: [superjson()],
          retry: { limit: 0 },
        })
        const avatar = new File(['png'], 'a.png', { type: 'image/png' })
        const form = new FormData()
        for (const [key, value] of Object.entries(fields)) form.set(key, value)
        form.set('avatar', avatar)

        result = await tuyau.request('users.store', {
          body: format === 'file upload' ? { ...fields, avatar } : form,
        })
      }

      assert.deepEqual(result, {
        before: [...Object.keys(fields), ...(format === 'urlencoded' ? [] : ['avatar'])],
        name: 'jane',
        json: fields.json,
        allName: 'jane',
        fileName: format === 'urlencoded' ? undefined : 'a.png',
        fileSize: format === 'urlencoded' ? undefined : 3,
        date: new Date('2026-05-12T10:30:00.000Z'),
      })
    })
})
