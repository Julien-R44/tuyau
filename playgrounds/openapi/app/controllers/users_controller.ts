import type { HttpContext } from '@adonisjs/core/http'

import { createUserValidator } from '#validators/main'

export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    return [
      { id: 1, name: 'John Doe', email: 'foo@ok.com' },
      { id: 2, name: 'Jane Doe', email: 'test@ok.com' },
    ]
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    await request.validateUsing(createUserValidator)

    if (Math.random()) {
      return response.badRequest({ message: 'Invalid data' })
    }

    return { success: true }
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    return { id: params.id, name: 'John Doe', email: 'test@ok.com' }
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, response, request }: HttpContext) {
    await request.validateUsing(createUserValidator)

    if (Math.random()) {
      return response.unauthorized({ message: 'Unauthorized', error: 'E_UNAUTHORIZED', foo: 'bar' })
    }

    return { id: params.id, name: 'John Doe', email: 'test@ok.com' }
  }

  /**
   * Delete record
   */
  async destroy({}: HttpContext) {
    return [{ ok: true }]
  }
}
