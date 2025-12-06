import { test } from '@japa/runner'
import { attest } from '@arktype/attest'

import { createTuyau } from '../src/client/tuyau.ts'
import { defaultRegistry } from './fixtures/index.ts'
import { generatedRegistry as registry100 } from './fixtures/generated-fixture-100.ts'
import { generatedRegistry as registry300 } from './fixtures/generated-fixture-300.ts'

test.group('benchmark - with pre-computed tree', () => {
  test('Small registry', async () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })

    tuyau.get('/auth/login', {}).catch(() => {})
    tuyau.api.auth.login({ body: { email: 'foo', password: 'bar' } }).catch(() => {})
    tuyau
      .request('posts.comments.likes.toggle', {
        params: { likeId: '1', commentId: '2', postId: '3' },
        query: { foo: 'user' },
      })
      .catch(() => {})

    attest.instantiations([4100, 'instantiations'])
  })

  test('Big registry (100 routes)', async () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry: registry100 })

    tuyau.get('/cart/search', {}).catch(() => {})
    tuyau.api.document.archive({ body: { token: 'test' } }).catch(() => {})

    attest.instantiations([9200, 'instantiations'])
  })

  test('Huge registry (300 routes)', async () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry: registry300 })

    tuyau.get('/message/index', {}).catch(() => {})
    tuyau.api.chat.unfollow({}).catch(() => {})

    attest.instantiations([26_000, 'instantiations'])
  })
})
