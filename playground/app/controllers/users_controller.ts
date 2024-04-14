import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  index({ response }: HttpContext) {
    if (Math.random() > 0.5) {
      return response.badGateway('Something went wrong' as const)
    }

    if (Math.random() > 0.5) {
      return response.badRequest({ message: 'Invalid request' as const })
    }

    return {
      users: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' },
      ],
    }
  }
}
