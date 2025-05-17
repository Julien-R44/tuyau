import vine from '@vinejs/vine'
import type { HttpContext } from '@adonisjs/core/http'

import Todo from '#models/todo'

class TodoPresenter {
  static serialize(todo: Todo) {
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      createdAt: todo.createdAt.toFormat('yyyy-MM-dd HH:mm:ss'),
      updatedAt: todo.updatedAt.toFormat('yyyy-MM-dd HH:mm:ss'),
    }
  }
}
export default class TodosController {
  async index({}: HttpContext) {
    const todos = await Todo.all()
    return todos.map((todo) => TodoPresenter.serialize(todo))
  }

  static validator = vine.compile(
    vine.object({
      title: vine.string(),
      description: vine.string(),
    })
  )

  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(TodosController.validator)
    const todo = await Todo.create(payload)

    return TodoPresenter.serialize(todo)
  }

  async destroy({ params }: HttpContext) {
    const todo = await Todo.findOrFail(params.id)
    await todo.delete()

    return { message: 'Todo deleted successfully' }
  }
}
