import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import BaseInertiaMiddleware from '@adonisjs/inertia/inertia_middleware'

import UserTransformer from '#transformers/user_transformer'

export default class InertiaMiddleware extends BaseInertiaMiddleware {
  share(ctx: HttpContext) {
    const errorsBag = ctx.session.flashMessages.get('errorsBag', {})
    const error: string | undefined = Object.keys(errorsBag)
      .filter((code) => {
        return code !== 'E_VALIDATION_ERROR'
      })
      .map((code) => errorsBag[code])[0]

    return {
      errors: ctx.inertia.always(this.getValidationErrors(ctx)),
      flash: ctx.inertia.always({
        error,
      }),
      user: ctx.inertia.always(
        ctx.auth.user ? UserTransformer.transform(ctx.auth.user) : undefined
      ),
    }
  }

  async handle(ctx: HttpContext, next: NextFn) {
    await this.init(ctx)
    const output = await next()
    this.dispose(ctx)
    return output
  }
}

declare module '@adonisjs/inertia/types' {
  type MiddlewareSharedProps = InferSharedProps<InertiaMiddleware>
  export interface SharedProps extends MiddlewareSharedProps {}
}
