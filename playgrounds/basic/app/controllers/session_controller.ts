import vine from '@vinejs/vine'
import type { HttpContext } from '@adonisjs/core/http'

import User from '#models/user'

export default class SessionController {
  /**
   * Validator using vine.group to accept either password or webauthn assertion.
   * Tests that tuyau correctly handles union body types.
   */
  static storeValidator = vine.create(
    vine.object({}).merge(
      vine
        .group([
          vine.group.if((data) => data.password, { password: vine.string() }),
          vine.group.if((data) => data.assertion, {
            assertion: vine.object({
              id: vine.string(),
              rawId: vine.string(),
              type: vine.string(),
            }),
          }),
        ])
        .otherwise((_, field) => {
          field.report('Password or assertion required', 'passwordOrAssertion', field)
        })
    )
  )

  async create({ inertia }: HttpContext) {
    return inertia.render('auth/login', {})
  }

  async store({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(SessionController.storeValidator)
    const user = await User.verifyCredentials('test@test.com', 'password')

    await auth.use('web').login(user)
    response.redirect().toRoute('home')

    return { success: true, method: 'password' in payload ? 'password' : 'webauthn' }
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    response.redirect().toRoute('session.create')
  }
}
