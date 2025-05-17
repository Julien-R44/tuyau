import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Todo extends BaseModel {
  @column({ isPrimary: true }) declare id: number

  @column() declare title: string
  @column() declare description: string
  @column() declare completed: boolean

  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime
}
