import SuperJSON from 'superjson'
import { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class SuperjsonMiddleware {
  #isSuperJsonRequest(ctx: HttpContext) {
    return ctx.request.header('x-superjson') === 'true'
  }

  async handle(ctx: HttpContext, next: NextFn) {
    const { request, response } = ctx
    const isSuperjsonRequest = this.#isSuperJsonRequest(ctx)

    /**
     * If we received a superjson request with a body, then
     * deserialize the body.
     */
    if (isSuperjsonRequest && request.hasBody()) {
      request.updateBody(SuperJSON.deserialize(request.body() as any))
    }

    await next()

    /**
     * Now time to serialize the response body using superjson
     */
    if (!isSuperjsonRequest || !response.hasContent || typeof response.content !== 'object') return
    response
      .header('Content-Type', 'application/json')
      .send(SuperJSON.stringify(response.getBody()))
  }
}
