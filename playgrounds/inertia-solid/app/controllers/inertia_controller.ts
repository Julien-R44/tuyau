import type { HttpContext } from '@adonisjs/core/http'

export default class InertiaController {
  async index({ inertia }: HttpContext) {
    return inertia.render('home', { version: '6.0' })
  }

  async backoffice({ inertia }: HttpContext) {
    return inertia.render('backoffice', { version: '6.0' })
  }
}
