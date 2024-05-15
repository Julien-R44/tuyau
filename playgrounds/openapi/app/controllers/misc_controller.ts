import type { HttpContext } from '@adonisjs/core/http'

import { getMiscValidator } from '#validators/main'

export default class MiscController {
  async index({ request }: HttpContext) {
    await request.validateUsing(getMiscValidator)
    return 'Hello, world!' as const
  }
}
