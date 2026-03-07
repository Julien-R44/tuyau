import { test } from '@japa/runner'

import {
  buildKey,
  extractKyOptions,
  isObject,
  toSnakeCase,
  segmentsToRouteName,
  getMutationKeyInternal,
} from '../src/index.ts'

test.group('isObject', () => {
  test('returns true for plain objects', ({ assert }) => {
    assert.isTrue(isObject({}))
    assert.isTrue(isObject({ a: 1 }))
  })

  test('returns false for non-objects', ({ assert }) => {
    assert.isFalse(isObject(null))
    assert.isFalse(isObject(undefined))
    assert.isFalse(isObject('string'))
    assert.isFalse(isObject(42))
    assert.isFalse(isObject([1, 2]))
    assert.isFalse(isObject(true))
  })
})

test.group('toSnakeCase', () => {
  test('converts camelCase to snake_case', ({ assert }) => {
    assert.equal(toSnakeCase('byCategory'), 'by_category')
    assert.equal(toSnakeCase('getArticles'), 'get_articles')
    assert.equal(toSnakeCase('myLongMethodName'), 'my_long_method_name')
  })

  test('leaves already snake_case unchanged', ({ assert }) => {
    assert.equal(toSnakeCase('by_category'), 'by_category')
    assert.equal(toSnakeCase('index'), 'index')
  })
})

test.group('segmentsToRouteName', () => {
  test('joins segments with dots and converts to snake_case', ({ assert }) => {
    assert.equal(segmentsToRouteName(['products', 'byCategory']), 'products.by_category')
    assert.equal(segmentsToRouteName(['users', 'index']), 'users.index')
    assert.equal(segmentsToRouteName(['auth', 'login']), 'auth.login')
  })

  test('handles single segment', ({ assert }) => {
    assert.equal(segmentsToRouteName(['users']), 'users')
  })

  test('handles empty array', ({ assert }) => {
    assert.equal(segmentsToRouteName([]), '')
  })
})

test.group('getMutationKeyInternal', () => {
  test('builds mutation key from segments', ({ assert }) => {
    assert.deepEqual(getMutationKeyInternal({ segments: ['users', 'store'] }), [
      ['users', 'store'],
    ])
  })

  test('splits dotted segments', ({ assert }) => {
    assert.deepEqual(getMutationKeyInternal({ segments: ['auth.login'] }), [['auth', 'login']])
  })
})

test.group('extractKyOptions', () => {
  test('returns empty object when no options', ({ assert }) => {
    assert.deepEqual(extractKyOptions(undefined), {})
  })

  test('strips abortOnUnmount from options', ({ assert }) => {
    const result = extractKyOptions({ abortOnUnmount: true, timeout: 5000 })
    assert.deepEqual(result, { timeout: 5000 })
    assert.notProperty(result, 'abortOnUnmount')
  })

  test('passes through all other options', ({ assert }) => {
    const result = extractKyOptions({ timeout: 60_000 })
    assert.deepEqual(result, { timeout: 60_000 })
  })
})

test.group('buildKey', () => {
  test('builds basic query key', ({ assert }) => {
    const key = buildKey({
      segments: ['users', 'index'],
      request: { query: { name: 'foo' } },
      type: 'query',
    })
    assert.deepEqual(key, [
      ['users', 'index'],
      { request: { query: { name: 'foo' } }, type: 'query' },
    ])
  })

  test('builds key without request', ({ assert }) => {
    const key = buildKey({ segments: ['users', 'index'], type: 'query' })
    assert.deepEqual(key, [['users', 'index'], { type: 'query' }])
  })

  test('builds path key with type any and no request', ({ assert }) => {
    const key = buildKey({ segments: ['users'], type: 'any' })
    assert.deepEqual(key, [['users']])
  })

  test('returns empty key for empty segments with type any', ({ assert }) => {
    const key = buildKey({ segments: [], type: 'any' })
    assert.deepEqual(key, [])
  })

  test('splits dotted segments', ({ assert }) => {
    const key = buildKey({
      segments: ['users.index'],
      request: { query: { page: 1 } },
      type: 'query',
    })
    assert.deepEqual(key, [
      ['users', 'index'],
      { request: { query: { page: 1 } }, type: 'query' },
    ])
  })

  test('builds infinite query key', ({ assert }) => {
    const key = buildKey({
      segments: ['articles', 'index'],
      request: { query: { page: 1, limit: 10 } },
      type: 'infinite',
    })
    assert.deepEqual(key, [
      ['articles', 'index'],
      { request: { query: { page: 1, limit: 10 } }, type: 'infinite' },
    ])
  })
})

test.group('buildKey | cursor/direction stripping', () => {
  test('strips cursor and direction from query params in infinite query key', ({ assert }) => {
    const key = buildKey({
      segments: ['articles', 'index'],
      request: { query: { page: 1, cursor: 'abc123', direction: 'forward', limit: 10 } },
      type: 'infinite',
    })
    assert.deepEqual(key, [
      ['articles', 'index'],
      { request: { query: { page: 1, limit: 10 } }, type: 'infinite' },
    ])
  })

  test('strips cursor and direction from body params in infinite query key', ({ assert }) => {
    const key = buildKey({
      segments: ['articles', 'index'],
      request: { body: { cursor: 'abc123', direction: 'backward', filter: 'active' } },
      type: 'infinite',
    })
    assert.deepEqual(key, [
      ['articles', 'index'],
      { request: { body: { filter: 'active' } }, type: 'infinite' },
    ])
  })

  test('strips cursor/direction from both query and body', ({ assert }) => {
    const key = buildKey({
      segments: ['articles', 'index'],
      request: {
        query: { cursor: 'q-cursor', page: 1 },
        body: { direction: 'forward', data: 'test' },
      },
      type: 'infinite',
    })
    assert.deepEqual(key, [
      ['articles', 'index'],
      { request: { query: { page: 1 }, body: { data: 'test' } }, type: 'infinite' },
    ])
  })

  test('does not strip cursor/direction for regular queries', ({ assert }) => {
    const key = buildKey({
      segments: ['articles', 'index'],
      request: { query: { cursor: 'abc123', direction: 'forward', page: 1 } },
      type: 'query',
    })
    assert.deepEqual(key, [
      ['articles', 'index'],
      { request: { query: { cursor: 'abc123', direction: 'forward', page: 1 } }, type: 'query' },
    ])
  })

  test('handles request without cursor/direction gracefully', ({ assert }) => {
    const key = buildKey({
      segments: ['articles', 'index'],
      request: { query: { page: 1, limit: 10 } },
      type: 'infinite',
    })
    assert.deepEqual(key, [
      ['articles', 'index'],
      { request: { query: { page: 1, limit: 10 } }, type: 'infinite' },
    ])
  })
})
