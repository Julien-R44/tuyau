import nock from 'nock'
import { test } from '@japa/runner'
import { createTuyau } from '@tuyau/client'
import type { HttpContext } from '@adonisjs/core/http'
import type {
  Serialize,
  Simplify,
  ConvertReturnTypeToRecordStatusResponse,
} from '@tuyau/utils/types'

test.group('Typings', () => {
  test('status helpers methods', async ({ expectTypeOf }) => {
    async function controllerMethod({ response }: HttpContext) {
      if (Math.random()) {
        return response.badRequest({ messageBadRequest: 'Invalid input' })
      } else if (Math.random()) {
        return response.badGateway({ messageBadGateway: 'Cannot connect to the upstream server' })
      } else if (Math.random()) {
        return { messageOkFirst: 'Hello world 2' as const }
      } else if (Math.random()) {
        return response.json({ messageOk: 'JSON' as const })
      }

      return response.ok({ messageOk: 'Hello world' as const })
    }

    const tuyau = createTuyau<{
      auth: {
        login: {
          $post: {
            request: { email: string; password: string }
            response: Simplify<
              Serialize<
                ConvertReturnTypeToRecordStatusResponse<
                  Awaited<ReturnType<typeof controllerMethod>>
                >
              >
            >
          }
        }
      }
    }>('http://localhost:3333')

    nock('http://localhost:3333').post('/auth/login').reply(200, { token: '123' })

    const res = await tuyau.auth.login.$post({ email: 'foo@ok.com', password: 'secret' })

    if (res.data) {
      expectTypeOf(res.data).toEqualTypeOf<
        { messageOk: 'Hello world' } | { messageOkFirst: 'Hello world 2' } | { messageOk: 'JSON' }
      >()

      if ('messageOk' in res.data) {
        expectTypeOf(res.data).toEqualTypeOf<{ messageOk: 'Hello world' } | { messageOk: 'JSON' }>()
      }

      if ('messageOkFirst' in res.data) {
        expectTypeOf(res.data).toEqualTypeOf<{ messageOkFirst: 'Hello world 2' }>()
      }
    }

    if (res.error) {
      expectTypeOf(res.error).toEqualTypeOf<
        | { status: 400; value: { messageBadRequest: string } }
        | { status: 502; value: { messageBadGateway: string } }
      >()
    }
  })
})
