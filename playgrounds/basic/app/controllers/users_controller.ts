import vine from '@vinejs/vine'
import { type HttpContext } from '@adonisjs/core/http'

import User from '#models/user'
import UserTransformer from '#transformers/user_transformer'

export default class UsersController {
  static createValidator = vine.create({
    fullName: vine.string().minLength(2).maxLength(100),
    email: vine.string().email(),
    password: vine.string().minLength(6),
  })

  static updateValidator = vine.create({
    fullName: vine.string().minLength(2).maxLength(100).optional(),
    email: vine.string().email().optional(),
  })

  /**
   * List all users with transformer
   */
  async list({ serialize }: HttpContext) {
    const users = await User.all()
    return { users: await serialize(UserTransformer.transform(users)) }
  }

  /**
   * Get a single user by ID with transformer
   */
  async show({ params, serialize }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return { error: 'User not found' }
    }

    return { user: await serialize(UserTransformer.transform(user)) }
  }

  /**
   * Create a new user
   */
  async store({ request, serialize }: HttpContext) {
    const payload = await request.validateUsing(UsersController.createValidator)
    const user = await User.create(payload)

    return {
      success: true,
      user: await serialize(UserTransformer.transform(user)),
    }
  }

  /**
   * Update an existing user
   */
  async update({ params, request, serialize }: HttpContext) {
    const payload = await request.validateUsing(UsersController.updateValidator)
    const user = await User.find(params.id)

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    user.merge(payload)
    await user.save()

    return {
      success: true,
      user: await serialize(UserTransformer.transform(user)),
    }
  }

  /**
   * Delete a user
   */
  async delete({ params }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return { success: false, error: 'User not found' }
    }

    await user.delete()
    return { success: true }
  }
}
