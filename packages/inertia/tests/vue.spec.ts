import { test } from '@japa/runner'
import { createTuyau } from '@tuyau/client'
import type { ApiDefinition } from '@tuyau/client'

import { Link, TuyauPlugin } from '../src/vue/index.js'

const routes = [
  {
    params: [],
    name: 'users.index',
    path: '/users',
    method: ['GET', 'HEAD'],
    types: {},
  },
  {
    params: ['id', 'comment_id'],
    name: 'users.comments.edit',
    path: '/users/:id/comments/:comment_id/edit',
    method: ['GET', 'HEAD'],
    types: {},
  },
] as const

declare module '../src/types.js' {
  interface Api {
    // @ts-expect-error fine
    routes: typeof routes
    definition: Record<string, any>
  }
}

const api = {
  routes,
  definition: {} as ApiDefinition,
}

test.group('Vue | Typings', () => {
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
    TuyauPlugin.install(null as any, {
      client: createTuyau({ baseUrl: 'http://localhost', api }),
    })
  }).fails()
})
