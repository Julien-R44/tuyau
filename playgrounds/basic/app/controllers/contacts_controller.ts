import vine from '@vinejs/vine'
import { type HttpContext } from '@adonisjs/core/http'

interface Contact {
  id: number
  name: string
  email: string
  phone?: string
}

const contacts: Contact[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', phone: '+33600000001' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', phone: '+33600000003' },
]

let nextId = 4

export default class ContactsController {
  static createValidator = vine.create({
    name: vine.string().minLength(2).maxLength(100),
    email: vine.string().email(),
    phone: vine.string().optional(),
  })

  static updateValidator = vine.create({
    name: vine.string().minLength(2).maxLength(100).optional(),
    email: vine.string().email().optional(),
    phone: vine.string().optional(),
  })

  async list() {
    return { contacts }
  }

  /**
   * Uses typed response methods to produce discriminated union return type:
   * - 200: { contact: Contact }
   * - 404: { message: string, id: number }
   */
  async show({ params, response }: HttpContext) {
    const contact = contacts.find((c) => c.id === Number(params.id))
    if (!contact) return response.notFound({ message: 'Contact not found', id: Number(params.id) })

    return response.ok({ contact })
  }

  /**
   * Uses typed response methods:
   * - 201: { contact: Contact }
   * - 409: { message: string, existingEmail: string }
   * - 422: handled by vine validator automatically
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(ContactsController.createValidator)

    const existing = contacts.find((c) => c.email === payload.email)
    if (existing) {
      return response.conflict({
        message: 'A contact with this email already exists',
        existingEmail: existing.email,
      })
    }

    const contact: Contact = { id: nextId++, ...payload }
    contacts.push(contact)

    return response.created({ contact })
  }

  /**
   * Uses typed response methods:
   * - 200: { contact: Contact }
   * - 404: { message: string }
   * - 409: { message: string, existingEmail: string }
   */
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(ContactsController.updateValidator)
    const contact = contacts.find((c) => c.id === Number(params.id))
    if (!contact) return response.notFound({ message: 'Contact not found' })

    if (payload.email && payload.email !== contact.email) {
      const duplicate = contacts.find((c) => c.email === payload.email)
      if (duplicate) {
        return response.conflict({
          message: 'Email already taken',
          existingEmail: duplicate.email,
        })
      }
    }

    Object.assign(contact, payload)

    return response.ok({ contact })
  }

  /**
   * Uses typed response methods:
   * - 200: { success: true }
   * - 404: { message: string }
   */
  async delete({ params, response }: HttpContext) {
    const index = contacts.findIndex((c) => c.id === Number(params.id))
    if (index === -1) return response.notFound({ message: 'Contact not found' })

    contacts.splice(index, 1)

    return response.ok({ success: true as const })
  }
}
