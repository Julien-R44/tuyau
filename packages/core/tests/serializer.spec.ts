import { test } from '@japa/runner'

import { buildSearchParams } from '../src/client/serializer.ts'

test.group('buildSearchParams', () => {
  test('simple key-value pairs', ({ assert }) => {
    const result = buildSearchParams({ foo: 'bar', baz: 'qux' })
    assert.equal(result, 'foo=bar&baz=qux')
  })

  test('arrays with bracket notation', ({ assert }) => {
    const result = buildSearchParams({ ids: [1, 2, 3] })
    assert.equal(result, 'ids[]=1&ids[]=2&ids[]=3')
  })

  test('nested objects with bracket notation', ({ assert }) => {
    const result = buildSearchParams({
      filter: { name: { like: 'foo' }, price: { gte: 1200 } },
    })
    assert.equal(result, 'filter[name][like]=foo&filter[price][gte]=1200')
  })

  test('deeply nested objects', ({ assert }) => {
    const result = buildSearchParams({
      a: { b: { c: { d: 'value' } } },
    })
    assert.equal(result, 'a[b][c][d]=value')
  })

  test('mixed: simple, arrays, and nested', ({ assert }) => {
    const result = buildSearchParams({
      page: 1,
      ids: [1, 2],
      filter: { status: 'active' },
    })
    assert.equal(result, 'page=1&ids[]=1&ids[]=2&filter[status]=active')
  })

  test('skips null and undefined values', ({ assert }) => {
    const result = buildSearchParams({
      foo: 'bar',
      empty: null,
      missing: undefined,
      nested: { valid: 'yes', empty: null },
    })
    assert.equal(result, 'foo=bar&nested[valid]=yes')
  })

  test('encodes special characters', ({ assert }) => {
    const result = buildSearchParams({ q: 'hello world', tag: 'foo&bar' })
    assert.equal(result, 'q=hello%20world&tag=foo%26bar')
  })

  test('handles empty object', ({ assert }) => {
    const result = buildSearchParams({})
    assert.equal(result, '')
  })

  test('handles null/undefined input', ({ assert }) => {
    assert.equal(buildSearchParams(null as any), '')
    assert.equal(buildSearchParams(undefined as any), '')
  })

  test('boolean values', ({ assert }) => {
    const result = buildSearchParams({ active: true, deleted: false })
    assert.equal(result, 'active=true&deleted=false')
  })

  test('arrays inside nested objects', ({ assert }) => {
    const result = buildSearchParams({
      filter: { tags: ['a', 'b'] },
    })
    assert.equal(result, 'filter[tags][]=a&filter[tags][]=b')
  })
})
