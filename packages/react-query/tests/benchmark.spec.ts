import { test } from '@japa/runner'
import { attest } from '@arktype/attest'
import { createTuyau } from '@tuyau/core/client'
import { useMutation, useQuery } from '@tanstack/react-query'

import { defaultRegistry } from './fixtures/index.ts'
import { createTuyauReactQueryClient } from '../src/main.ts'
import { generatedRegistry as registry100 } from './fixtures/generated-fixture-100.ts'
import { generatedRegistry as registry300 } from './fixtures/generated-fixture-300.ts'

const noop = (fn?: Function) => fn

test.group('benchmark', () => {
  test('First one', async () => {
    noop(() => {
      const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
      const query = createTuyauReactQueryClient({ client: tuyau, queryClient: null as any })

      const result = useMutation(query.auth.login.mutationOptions())
      console.log(result.data?.token)

      const result2 = useMutation(query.posts.comments.likes.toggle.mutationOptions())
      result2.mutate({
        params: { postId: '3', commentId: '2', likeId: '1' },
        query: { foo: 'user' },
        body: {},
      })
      console.log(result2.data)
    })

    attest.instantiations([5298, 'instantiations'])
  })

  test('Big registry', async () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry: registry100 })
    const query = createTuyauReactQueryClient({ client: tuyau, queryClient: null as any })

    noop(() => {
      const result = useQuery(query.blog.combine.queryOptions())
      console.log(result.data?.message)

      const result2 = useQuery(
        query.log.coupon.postpone.queryOptions({ params: { entityId: '1' } }),
      )
      console.log(result2.data?.name)

      const mutate = useMutation(query.bookmark.home.unassign.mutationOptions())
      console.log(
        mutate
          .mutateAsync({
            params: { categoryId: '1' },
          })
          .then((res) => console.log(res)),
      )
    })

    attest.instantiations([19_323, 'instantiations'])
  })

  test('Huge registry', async () => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry: registry300 })
    const query = createTuyauReactQueryClient({ client: tuyau, queryClient: null as any })

    noop(() => {
      const res1 = useMutation(query.music.migrate.mutationOptions())
      const res2 = useMutation(query.video.bookmark.sync.mutationOptions())
      const res3 = useMutation(query.user.integration.protect.mutationOptions())
      const res4 = useQuery(query.activity.social.draft.queryOptions())

      console.log(res1.data?.count)
      console.log(res2.data?.total)
      console.log(res3.data?.items)
      console.log(res4.data?.pagination)
    })

    attest.instantiations([34_166, 'instantiations'])
  })
})
