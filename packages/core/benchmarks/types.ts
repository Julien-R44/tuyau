import { bench } from '@ark/attest'

import { createTuyau } from '../src/client/tuyau.ts'
import { defaultRegistry } from '../tests/fixtures/index.ts'
import { generatedRegistry as registry100 } from '../tests/fixtures/generated-fixture-100.ts'
import { generatedRegistry as registry300 } from '../tests/fixtures/generated-fixture-300.ts'

bench('Small registry', async () => {
  const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })

  tuyau.get('/auth/login', {}).catch(() => {})
  tuyau.api.auth.login({ body: { email: 'foo', password: 'bar' } }).catch(() => {})
  tuyau
    .request('posts.comments.likes.toggle', {
      params: { likeId: '1', commentId: '2', postId: '3' },
      query: { foo: 'user' },
    })
    .catch(() => {})

  return {}
}).types([4044, 'instantiations'])

bench('Big registry (100 routes)', async () => {
  const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry: registry100 })

  tuyau.get('/blog/combine', {}).catch(() => {})
  tuyau.api.log.coupon.postpone({ params: { entityId: '1' } }).catch(() => {})
  tuyau
    .request('bookmark.home.unassign', {
      params: { categoryId: '1' },
      query: { format: 'full' },
    })
    .catch(() => {})

  return {}
}).types([31_446, 'instantiations'])

bench('Huge registry (300 routes)', async () => {
  const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry: registry300 })

  tuyau.get('/maintenance/pricing/add', {}).catch(() => {})
  tuyau.api.activity.language
    .ungroup({ body: { permissions: ['read', 'write'], userId: '1' } })
    .catch(() => {})
  tuyau.request('admin.generate', { query: { limit: 10 } }).catch(() => {})

  return {}
}).types([70_947, 'instantiations'])
