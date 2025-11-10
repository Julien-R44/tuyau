import { test } from '@japa/runner'
import { attest } from '@arktype/attest'

import { createTuyau } from '../src/client/tuyau.js'
import { defaultRegistry } from './fixtures/index.js'
import { generatedRegistry as registry100 } from './fixtures/generated-fixture-100.ts'
import { generatedRegistry as registry300 } from './fixtures/generated-fixture-300.ts'

test.group('benchmark', () => {
  test('First one', async () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })

    tuyau.get('/auth/login', {}).catch(() => {})
    tuyau.api.auth.login({ body: { email: 'foo', password: 'bar' } }).catch(() => {})
    tuyau
      .request('posts.comments.likes.toggle', {
        params: { likeId: '1', commentId: '2', postId: '3' },
        query: { foo: 'user' },
      })
      .catch(() => {})

    // 2709 before camel case things
    attest.instantiations([4518, 'instantiations'])
  })

  test('Big registry', async () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry: registry100 })

    tuyau.get('/blog/combine', {}).catch(() => {})
    tuyau.api.log.coupon.postpone({ params: { entityId: '1' } }).catch(() => {})
    tuyau
      .request('bookmark.home.unassign', {
        params: { categoryId: '1' },
        query: { format: 'full' },
      })
      .catch(() => {})

    // 17674 before camel case things
    attest.instantiations([31_835, 'instantiations'])
  })

  test('Huge registry', async () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry: registry300 })

    tuyau.get('/maintenance/pricing/add', {}).catch(() => {})
    tuyau.api.activity.language
      .ungroup({ body: { permissions: ['read', 'write'], userId: '1' } })
      .catch(() => {})
    tuyau.request('admin.generate', { query: { limit: 10 } }).catch(() => {})

    // 50645 before camel case things
    attest.instantiations([70_915, 'instantiations'])
  })
})
