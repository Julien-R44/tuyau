import { test } from '@japa/runner'
import { attest } from '@arktype/attest'

import { createTuyau } from '../src/client/tuyau.js'
import { defaultRegistry } from './fixtures/index.js'

test.group('benchmark', () => {
  test('My Test', async () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })

    tuyau.get('/auth/login', {}).catch(() => {})
    tuyau.api.auth.login({ body: { email: 'foo', password: 'bar' } }).catch(() => {})
    tuyau.request('posts.comments.likes.toggle', {
      params: { likeId: '1', commentId: '2', postId: '3' },
      query: { foo: 'user' },
    })

    attest.instantiations()
  })
})
