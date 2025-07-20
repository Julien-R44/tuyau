import { test } from '@japa/runner'
import { createTuyau, InferResponseType } from '@tuyau/client'

import { ApiDefinition, queryClient } from './helpers.jsx'
import { createTuyauReactQueryClient } from '../src/main.js'
import {
  InferRequestType as InferRQRequestType,
  InferResponseType as InferRQResponseType,
} from '../src/types.js'

test.group('Typings', () => {
  test('Infer response and request typings', ({ expectTypeOf }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    type Result = InferRQResponseType<typeof tuyau.users.$get>

    type Result2 = InferResponseType<typeof client.users.$get>

    expectTypeOf<Result>().toEqualTypeOf<Result2>()

    type Request = InferRQRequestType<typeof tuyau.users.$get>

    expectTypeOf<Request>().toEqualTypeOf<{ name: string | null }>()
  })
})
