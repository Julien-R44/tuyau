import app from '@adonisjs/core/services/app'
import type { HttpContext } from '@adonisjs/core/http'

import { getUsersValidator, uploadFileValidator } from '../validators/main.js'

export default class UsersController {
  async index({ response, request }: HttpContext) {
    await request.validateUsing(getUsersValidator)

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

  async simpleText() {
    return 'foo' as const
  }

  async fileUpload({ request }: HttpContext) {
    const payload = await request.validateUsing(uploadFileValidator)
    await payload.file.move(app.makePath('uploads'))
    return { message: 'File uploaded' as const }
  }
}
