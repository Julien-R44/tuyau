import { test } from '@japa/runner'

test.group('Example', () => {
  test('add two numbers', ({ assert }) => {
    assert.equal(1 + 1, 2)
  })
})
