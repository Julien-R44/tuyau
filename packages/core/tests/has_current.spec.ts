import { test } from '@japa/runner'

import { createTuyau } from '../src/client/tuyau.ts'
import { TuyauRouter } from '../src/client/router.ts'
import { defaultRegistry as registry } from './fixtures/index.ts'

const extraRegistry: any = {
  routes: {
    'home': {
      methods: ['GET'] as const,
      pattern: '/',
      tokens: [{ type: 0, val: '/', old: '/', end: '' }],
      types: {} as any,
    },
    'files.glob': {
      methods: ['GET'] as const,
      pattern: '/files/*',
      tokens: [
        { type: 0, val: 'files', old: '/files/*', end: '' },
        { type: 2, val: 'path', old: '/files/*', end: '' },
      ],
      types: {} as any,
    },
    'users.optional': {
      methods: ['GET'] as const,
      pattern: '/users/:id?',
      tokens: [
        { type: 0, val: 'users', old: '/users/:id?', end: '' },
        { type: 3, val: 'id', old: '/users/:id?', end: '' },
      ],
      types: {} as any,
    },
  },
} as const

function setWindowLocation(pathname: string, search = '') {
  // @ts-expect-error mock window.location
  globalThis.window = { location: { pathname, search } }
}

function clearWindow() {
  // @ts-expect-error cleanup
  delete globalThis.window
}

test.group('matchPathAgainstPattern', () => {
  test('matches static segments', ({ assert }) => {
    assert.deepEqual(TuyauRouter.matchPathAgainstPattern('/users', '/users'), {})
    assert.deepEqual(TuyauRouter.matchPathAgainstPattern('/auth/login', '/auth/login'), {})
    assert.isNull(TuyauRouter.matchPathAgainstPattern('/users', '/posts'))
    assert.isNull(TuyauRouter.matchPathAgainstPattern('/users/extra', '/users'))
    assert.isNull(TuyauRouter.matchPathAgainstPattern('/users', '/users/extra'))
  })

  test('matches dynamic params', ({ assert }) => {
    assert.deepEqual(TuyauRouter.matchPathAgainstPattern('/users/42', '/users/:id'), { id: '42' })
    assert.deepEqual(
      TuyauRouter.matchPathAgainstPattern(
        '/posts/1/comments/2',
        '/posts/:postId/comments/:commentId',
      ),
      { postId: '1', commentId: '2' },
    )
    assert.isNull(TuyauRouter.matchPathAgainstPattern('/users', '/users/:id'))
  })

  test('matches optional params', ({ assert }) => {
    assert.deepEqual(TuyauRouter.matchPathAgainstPattern('/users/42', '/users/:id?'), { id: '42' })
    assert.deepEqual(TuyauRouter.matchPathAgainstPattern('/users', '/users/:id?'), {})
  })

  test('matches wildcard', ({ assert }) => {
    const result = TuyauRouter.matchPathAgainstPattern('/files/docs/report.pdf', '/files/*')
    assert.deepEqual(result, { '*': 'docs/report.pdf' })
    assert.isNull(TuyauRouter.matchPathAgainstPattern('/files', '/files/*'))
  })

  test('matches root route', ({ assert }) => {
    assert.deepEqual(TuyauRouter.matchPathAgainstPattern('/', '/'), {})
  })

  test('ignores trailing slashes', ({ assert }) => {
    assert.deepEqual(TuyauRouter.matchPathAgainstPattern('/users/', '/users'), {})
    assert.deepEqual(TuyauRouter.matchPathAgainstPattern('/users/42/', '/users/:id'), { id: '42' })
  })
})

test.group('Client | has', () => {
  test('returns true for exact match', ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    assert.isTrue(tuyau.has('users.show'))
    assert.isTrue(tuyau.has('auth.login'))
    assert.isTrue(tuyau.has('posts.comments.likes.detail'))
  })

  test('returns false for non-existent route', ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    assert.isFalse(tuyau.has('nope' as any))
    assert.isFalse(tuyau.has('users.nope' as any))
  })
})

test.group('Client | current', (group) => {
  group.each.teardown(() => clearWindow())

  test('returns the current route name when called with no args', ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })
    setWindowLocation('/users/42')

    assert.equal(tuyau.current(), 'users.show')
  })

  test('returns undefined when no route matches', ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })
    setWindowLocation('/unknown/path')

    assert.isUndefined(tuyau.current())
  })

  test('returns true when routeName matches current path', ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })
    setWindowLocation('/users/42')

    assert.isTrue(tuyau.current('users.show'))
    assert.isFalse(tuyau.current('auth.login'))
  })

  test('supports wildcard matching with routeName', ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })
    setWindowLocation('/users/42')

    assert.isTrue(tuyau.current('users.*'))
    assert.isFalse(tuyau.current('posts.*'))
  })

  test('matches with params option', ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })
    setWindowLocation('/users/42')

    assert.isTrue(tuyau.current('users.show', { params: { id: '42' } }))
    assert.isFalse(tuyau.current('users.show', { params: { id: '99' } }))
  })

  test('converts numeric param values to strings for comparison', ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })
    setWindowLocation('/users/42')

    assert.isTrue(tuyau.current('users.show', { params: { id: 42 } }))
  })

  test('matches with query option', ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })
    setWindowLocation('/users/42', '?foo=bar')

    assert.isTrue(tuyau.current('users.show', { query: { foo: 'bar' } }))
    assert.isFalse(tuyau.current('users.show', { query: { foo: 'baz' } }))
  })

  test('strips base URL path prefix', ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333/api', registry })
    setWindowLocation('/api/users/42')

    assert.isTrue(tuyau.current('users.show'))
    assert.equal(tuyau.current(), 'users.show')
  })

  test('returns undefined / false when no window (SSR)', ({ assert }) => {
    clearWindow()
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

    assert.isUndefined(tuyau.current())
    assert.isFalse(tuyau.current('users.show'))
  })

  test('matches deeply nested route with params', ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })
    setWindowLocation('/posts/1/comments/2/likes/3')

    assert.isTrue(tuyau.current('posts.comments.likes.detail'))
    assert.isTrue(
      tuyau.current('posts.comments.likes.detail', {
        params: { postId: '1', commentId: '2', likeId: '3' },
      }),
    )
    assert.isFalse(
      tuyau.current('posts.comments.likes.detail', {
        params: { postId: '999' },
      }),
    )
  })

  test('matches static multi-segment route', ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })
    setWindowLocation('/auth/login')

    assert.isTrue(tuyau.current('auth.login.show'))
  })

  test('ignores non-navigable routes when resolving the current route', ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })
    setWindowLocation('/auth/login')

    assert.equal(tuyau.current(), 'auth.login.show')
    assert.isTrue(tuyau.current('auth.login.show'))
    assert.isFalse(tuyau.current('auth.login'))
  })

  test('matches the root route token', ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry: extraRegistry })
    setWindowLocation('/')

    assert.equal(tuyau.current(), 'home')
    assert.isTrue(tuyau.current('home'))
  })

  test('matches wildcard tokens', ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry: extraRegistry })
    setWindowLocation('/files/documents/report.pdf')

    assert.equal(tuyau.current(), 'files.glob')
    assert.isTrue(tuyau.current('files.glob'))
  })

  test('matches optional params when the segment is present', ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry: extraRegistry })
    setWindowLocation('/users/42')

    assert.equal(tuyau.current(), 'users.optional')
    assert.isTrue(tuyau.current('users.optional', { params: { id: '42' } }))
  })

  test('matches queries serialized with bracket notation', ({ assert }) => {
    const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })
    setWindowLocation('/users/42', '?ids[]=1&ids[]=2&filter[name]=julien')

    assert.isTrue(
      tuyau.current('users.show', {
        query: {
          ids: [1, 2],
          filter: { name: 'julien' },
        },
      }),
    )
  })
})
