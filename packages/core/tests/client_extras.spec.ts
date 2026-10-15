import nock from 'nock'
import { test } from '@japa/runner'

import { createTuyau } from '../src/client/tuyau.ts'
import { defaultRegistry as registry } from './fixtures/index.ts'
import type { AdonisEndpoint } from '../src/client/types/types.ts'

test.group('Client | getRoute', () => {
  test('returns url and methods for named route', async ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    const route = tuyau.getRoute('users.show', {
      params: { id: '42' },
      query: { foo: 'bar' },
    })

    assert.equal(route.url, '/users/42')
    assert.deepEqual(route.methods, ['GET'])
  })

  test('throws error for non-existent route', async ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    assert.throws(
      // @ts-expect-error - testing invalid route
      () => tuyau.getRoute('non.existent', {}),
      /Route non\.existent not found/,
    )
  })
})

test.group('Client | urlFor', () => {
  test('urlFor should not produce double ?? with query params', ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    const result = tuyau.urlFor.get('users.index', {}, { qs: { var: 'hi' } }).url
    assert.isFalse(result.includes('??'), `URL contains double "??": ${result}`)
    assert.include(result, '?var=hi')
  })

  test('compact tokens support root, optional parameters, and wildcards', ({ assert }) => {
    const cases: {
      pattern: string
      tokens: AdonisEndpoint['tokens']
      params: Record<string, string | string[]>
      expected: string
    }[] = [
      { pattern: '/', tokens: [[0, '/']], params: {}, expected: '/' },
      {
        pattern: '/posts/:slug?',
        tokens: [
          [0, 'posts'],
          [3, 'slug'],
        ],
        params: {},
        expected: '/posts',
      },
      {
        pattern: '/posts/:slug?',
        tokens: [
          [0, 'posts'],
          [3, 'slug'],
        ],
        params: { slug: 'hello' },
        expected: '/posts/hello',
      },
      {
        pattern: '/downloads/*',
        tokens: [
          [0, 'downloads'],
          [2, '*'],
        ],
        params: { '*': ['docs', 'guide.pdf'] },
        expected: '/downloads/docs/guide.pdf',
      },
    ]

    for (const { pattern, tokens, params, expected } of cases) {
      const tuyau = createTuyau({
        baseUrl: 'http://localhost:3333',
        registry: {
          routes: {
            route: { methods: ['GET'], pattern, tokens, types: {} as AdonisEndpoint['types'] },
          },
        },
      })

      assert.equal(tuyau.urlFor('route', params), expected)
      assert.deepEqual(tuyau.getRoute('route', { params }), { url: expected, methods: ['GET'] })
    }
  })
})

test.group('Client | urlFor wildcard', () => {
  test('urlFor generates correct URL for wildcard route', ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    const result = tuyau.urlFor.get('downloads.file', { '*': ['docs', 'api', 'guide.pdf'] })
    assert.include(result.url, '/downloads/docs/api/guide.pdf')
  })

  test('urlFor generates correct URL for single-segment wildcard', ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    const result = tuyau.urlFor.get('downloads.file', { '*': ['readme.txt'] })
    assert.include(result.url, '/downloads/readme.txt')
  })
})

test.group('Client | Errors', () => {
  test('throws error for non-existent pattern', async ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    // @ts-ignore osef
    await assert.rejects(
      // @ts-expect-error - testing invalid pattern
      () => tuyau.get('/non-existent', {}),
      /No GET \/non-existent/,
    )
  })
})

test.group('Client | File uploads', () => {
  test('send array of files as form data', async () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333')
      .post('/users')
      .reply(200, { token: '123' })
      .matchHeader('content-type', /multipart\/form-data/)

    const files = [new File(['content1'], 'file1.txt'), new File(['content2'], 'file2.txt')]

    await tuyau.api.users.store({ body: { file: files } as any })
  })

  test('send file with other fields', async () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    nock('http://localhost:3333')
      .post('/auth/login')
      .reply(200, { token: '123' })
      .matchHeader('content-type', /multipart\/form-data/)

    await tuyau.api.auth.login({
      body: {
        email: 'test@example.com',
        password: 'secret',
        file: new File(['avatar'], 'avatar.png'),
      },
    })
  })
})
