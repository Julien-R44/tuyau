import { test } from '@japa/runner'
import { createTuyau } from '@tuyau/client'
import type { ApiDefinition } from '@tuyau/client'

import { Link, TuyauProvider, useRouter } from '../src/react/index.js'

const routes = [
  {
    params: [],
    name: 'users.index',
    path: '/users',
    method: ['GET', 'HEAD'],
    types: {},
  },
  {
    params: ['id', 'commentId'],
    name: 'users.comments.edit',
    path: '/users/:id/comments/:comment_id/edit',
    method: ['GET', 'HEAD'],
    types: {},
  },
] as const

const api = {
  routes,
  definition: {} as ApiDefinition,
}

declare module '../src/types.js' {
  interface Api {
    routes: typeof routes
    definition: Record<string, any>
  }
}

test.group('React | Typings', () => {
  test('Basics', () => {
    Link({ route: 'users.index' })

    Link({ route: 'users.comments.edit', params: ['1', '2'] })

    // @ts-expect-error too much params
    Link({ route: 'users.comments.edit', params: ['1', '2', '3'] })

    // @ts-expect-error missing params
    Link({ route: 'users.comments.edit' })

    // @ts-expect-error missing params
    Link({ route: 'users.comments.edit', params: [] })

    // @ts-expect-error missing params
    Link({ route: 'users.comments.edit', params: ['1'] })

    // @ts-expect-error unknown route
    Link({ route: 'unknown', params: [] })
  }).fails()

  test('do not ask for params if none are required', () => {
    Link({ route: 'users.index' })
    Link({ route: 'users.index', params: [] })
    Link({ route: 'users.comments.edit', params: ['1', '2'] })

    // @ts-expect-error missing params
    Link({ route: 'users.comments.edit' })
  }).fails()

  test('provider typing', () => {
    const client = createTuyau({ api, baseUrl: 'http://localhost' })
    TuyauProvider({ client, children: null })
  })

  test('useRouter typing', () => {
    const router = useRouter()

    router.visit({ route: 'users.index' })
    router.visit({ route: 'users.comments.edit', params: ['1', '2'] })

    // @ts-expect-error inexistent route
    router.visit({ route: 'foo' })

    // @ts-expect-error missing params
    router.visit({ route: 'users.comments.edit' })
  }).fails()
})
