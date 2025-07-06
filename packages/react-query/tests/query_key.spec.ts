import { test } from '@japa/runner'
import { skipToken } from '@tanstack/react-query'

import { TuyauQueryKey } from '../src/types.js'
import { getQueryKeyInternal } from '../src/query.js'

test.group('Query Key Generation', () => {
  test('should generate query key with no input', ({ assert }) => {
    const result = getQueryKeyInternal(['users', '$get'])

    assert.deepEqual(result, [['users', '$get']])
  })

  test('should generate query key with simple payload', ({ assert }) => {
    const result = getQueryKeyInternal(['users', '$get'], { name: 'john' })

    assert.deepEqual(result, [['users', '$get'], { payload: { name: 'john' } }])
  })

  test('should generate query key with payload and params', ({ assert }) => {
    const input = { payload: { name: 'john' }, params: { id: 1 } }

    const result = getQueryKeyInternal(['users', ':id', '$get'], input)

    assert.deepEqual(result, [
      ['users', ':id', '$get'],
      { payload: { name: 'john' }, params: { id: 1 } },
    ])
  })

  test('should generate query key with only params', ({ assert }) => {
    const input = { params: { id: 1 } }

    const result = getQueryKeyInternal(['users', ':id', '$get'], input)

    assert.deepEqual(result, [['users', ':id', '$get'], { params: { id: 1 } }])
  })

  test('should generate query key with query type', ({ assert }) => {
    const result = getQueryKeyInternal(['users', '$get'], { name: 'john' }, 'query')

    assert.deepEqual(result, [['users', '$get'], { payload: { name: 'john' }, type: 'query' }])
  })

  test('should generate query key with infinite type', ({ assert }) => {
    const result = getQueryKeyInternal(['users', '$get'], { name: 'john' }, 'infinite')

    assert.deepEqual(result, [['users', '$get'], { payload: { name: 'john' }, type: 'infinite' }])
  })

  test('should handle complex route parameters', ({ assert }) => {
    const input = {
      payload: { search: 'test' },
      params: { userId: 123, commentId: 456 },
    }

    const result = getQueryKeyInternal(
      ['users', ':userId', 'comments', ':commentId', '$get'],
      input,
    )

    assert.deepEqual(result, [
      ['users', ':userId', 'comments', ':commentId', '$get'],
      { payload: { search: 'test' }, params: { userId: 123, commentId: 456 } },
    ])
  })

  test('should handle skipToken as payload', ({ assert }) => {
    const result = getQueryKeyInternal(['users', '$get'], skipToken, 'query')

    assert.deepEqual(result, [['users', '$get'], { type: 'query' }])
  })

  test('should handle undefined payload', ({ assert }) => {
    const input = {
      payload: undefined,
      params: { id: 1 },
    }

    const result = getQueryKeyInternal(['users', ':id', '$get'], input)

    assert.deepEqual(result, [['users', ':id', '$get'], { params: { id: 1 } }])
  })

  test('should handle null payload', ({ assert }) => {
    const input = {
      payload: null,
      params: { id: 1 },
    }

    const result = getQueryKeyInternal(['users', ':id', '$get'], input)

    assert.deepEqual(result, [['users', ':id', '$get'], { payload: null, params: { id: 1 } }])
  })

  test('should handle empty object payload', ({ assert }) => {
    const input = {
      payload: {},
      params: { id: 1 },
    }

    const result = getQueryKeyInternal(['users', ':id', '$get'], input)

    assert.deepEqual(result, [['users', ':id', '$get'], { payload: {}, params: { id: 1 } }])
  })

  test('should handle nested path segments', ({ assert }) => {
    const result = getQueryKeyInternal(['api/v1/users', '$get'], { name: 'john' })

    assert.deepEqual(result, [['api', 'v1', 'users', '$get'], { payload: { name: 'john' } }])
  })

  test('should handle multiple nested path segments with params', ({ assert }) => {
    const input = {
      payload: { active: true },
      params: { orgId: 1, userId: 2 },
    }

    const result = getQueryKeyInternal(['orgs/:orgId/users/:userId', '$get'], input)

    assert.deepEqual(result, [
      ['orgs', ':orgId', 'users', ':userId', '$get'],
      { payload: { active: true }, params: { orgId: 1, userId: 2 } },
    ])
  })

  test('should not include type when it is "any"', ({ assert }) => {
    const result = getQueryKeyInternal(['users', '$get'], { name: 'john' }, 'any')

    assert.deepEqual(result, [['users', '$get'], { payload: { name: 'john' } }])
  })

  test('should handle backward compatibility with simple input', ({ assert }) => {
    const result = getQueryKeyInternal(['users', '$get'], { name: 'john' })

    assert.deepEqual(result, [['users', '$get'], { payload: { name: 'john' } }])
  })

  test('should match TuyauQueryKey type structure', ({ assert }) => {
    const result = getQueryKeyInternal(['users', '$get'], { name: 'john' }, 'query')

    assert.isArray(result)
    assert.lengthOf(result, 2)
    assert.isArray(result[0])
    assert.isObject(result[1])

    const [path, options] = result as TuyauQueryKey
    assert.deepEqual(path, ['users', '$get'])
    assert.property(options, 'payload')
    assert.property(options, 'type')
    assert.equal(options?.type, 'query')
  })

  test('should handle optional second parameter', ({ assert }) => {
    const result1 = getQueryKeyInternal(['users', '$get'])
    const result2 = getQueryKeyInternal(['users', '$get'], undefined)

    assert.deepEqual(result1, [['users', '$get']])
    assert.deepEqual(result2, [['users', '$get']])
  })

  test('should preserve type information for infinite queries', ({ assert }) => {
    const result = getQueryKeyInternal(['users', '$get'], { page: 1 }, 'infinite')

    const [, options] = result as TuyauQueryKey
    assert.equal(options?.type, 'infinite')
  })
})
