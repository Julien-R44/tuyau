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
}).types([1613, 'instantiations'])

bench('Big registry 100 routes', async () => {
  const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry: registry100 })

  tuyau.get('/cart/search', {}).catch(() => {})
  tuyau.api.document.archive({ body: { token: 'test' } }).catch(() => {})

  return {}
}).types([3467, 'instantiations'])

bench('Huge registry 300 routes', async () => {
  const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry: registry300 })

  tuyau.get('/message/index', {}).catch(() => {})
  tuyau.api.chat.unfollow({}).catch(() => {})

  return {}
}).types([9507, 'instantiations'])
