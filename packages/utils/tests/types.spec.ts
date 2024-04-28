import { test } from '@japa/runner'

import type { Simplify, Serialize } from '../src/types.js'

test.group('Types | Serialize', () => {
  test('misc', ({ expectTypeOf }) => {
    expectTypeOf<Serialize<undefined>>().toEqualTypeOf<undefined>()
    expectTypeOf<Serialize<{ test?: string }>>().toEqualTypeOf<{
      test?: string
    }>()

    expectTypeOf<Serialize<{ test: Date }>>().toEqualTypeOf<{ test: string }>()
    expectTypeOf<Serialize<{ test?: Date }>>().toEqualTypeOf<{
      test?: string
    }>()

    expectTypeOf<Serialize<{ test: Map<string, string> }>>().toEqualTypeOf<{
      test: Record<string, never>
    }>()

    expectTypeOf<Serialize<{ nested: { test: Map<string, string> } }>>().toEqualTypeOf<{
      nested: { test: Record<string, never> }
    }>()
  })

  test('original interface when every prop are already serialized', ({ expectTypeOf }) => {
    interface MyInterface {
      id: number
      rank: number
    }

    type Serialized = Serialize<MyInterface>

    expectTypeOf<Serialized>().toEqualTypeOf<{
      id: number
      rank: number
    }>()
  })

  test('serialize non-json primitives', ({ expectTypeOf }) => {
    interface MyInterface {
      id: number
      rank: number
      date: Date
    }

    type Serialized = Serialize<MyInterface>

    expectTypeOf<Serialized>().toEqualTypeOf<{
      id: number
      rank: number
      date: string
    }>()
  })

  test('use toJSON method when available', ({ expectTypeOf }) => {
    interface MyInterface {
      id: number
      rank: number
      date: Date
      toJSON(): {
        id: `id-${number}`
        rank: `rank-${number}`
        date: string
      }
    }

    type Serialized = Serialize<MyInterface>

    expectTypeOf<Serialized>().toEqualTypeOf<{
      id: `id-${number}`
      rank: `rank-${number}`
      date: string
    }>()
  })
})

test.group('Types | Simplify', () => {
  test('Simplify', ({ expectTypeOf }) => {
    expectTypeOf<Simplify<Serialize<{ test: Date }>>>().toEqualTypeOf<{
      test: string
    }>()

    expectTypeOf<Simplify<Serialize<{ test: Map<string, string> }>>>().toEqualTypeOf<{
      test: Record<string, never>
    }>()

    expectTypeOf<Simplify<Serialize<{ nested: { test: Map<string, string> } }>>>().toEqualTypeOf<{
      nested: { test: Record<string, never> }
    }>()
  })
})
