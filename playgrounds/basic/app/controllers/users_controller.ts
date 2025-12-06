// import type { HttpContext } from '@adonisjs/core/http'

import { type HttpContext } from '@adonisjs/core/http'

const users: Array<{ id: number; name: string; email: string }> = []
export default class UsersController {
  store({}: HttpContext) {
    users.push({
      id: users.length + 1,
      name: Math.random().toString(36).substring(7),
      email: Math.random().toString(36).substring(7) + '@example.com',
    })
    return { success: true }
  }

  delete({ params }: HttpContext) {
    const userIndex = users.findIndex((user) => user.id === Number(params.id))
    if (userIndex !== -1) {
      users.splice(userIndex, 1)
      return { success: true }
    }
    return { success: false, message: 'User not found' }
  }

  list() {
    return { users }
  }
}
