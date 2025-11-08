import vine from '@vinejs/vine'
import type { HttpContext } from '@adonisjs/core/http'

import User from '#models/user'
import { signupValidator } from '#validators/user'
import UserTransformer from '#transformers/user_transformer'

export default class AccountsController {
  static validator = vine.compile(
    vine.object({
      email: vine.string().email(),
    })
  )

  async list({ request, serialize }: HttpContext) {
    const payload = await request.validateUsing(AccountsController.validator)
    const users = await User.all()

    return {
      users: await serialize(UserTransformer.transform(users)),
    }
  }

  static uploadProfilePictureValidator = vine.compile(
    vine.object({
      profilePicture: vine.file(),
    })
  )

  async uploadProfilePicture({ request }: HttpContext) {
    const payload = await request.validateUsing(AccountsController.uploadProfilePictureValidator)
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('auth/signup', {})
  }

  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(signupValidator)
    const user = await User.create({ ...payload })

    await auth.use('web').login(user)
    response.redirect().toRoute('home')
  }
}
