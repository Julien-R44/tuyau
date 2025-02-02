import SuperJSON from 'superjson'
import { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class SuperjsonMiddleware {
  async handle({ request, response }: HttpContext, next: NextFn) {
    await next()

    if (request.header('x-superjson') !== 'true') return

    if (!response.hasContent) return
    if (typeof response.content !== 'object') return

    const stringified = SuperJSON.stringify(response.getBody())
    response.header('Content-Type', 'application/json').send(stringified)
  }
}
