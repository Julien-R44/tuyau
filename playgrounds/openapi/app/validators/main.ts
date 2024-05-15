import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    name: vine.string(),
    // age: vine.number(),
    email: vine.string(),
    password: vine.string(),
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    name: vine.string(),
    age: vine.number().optional(),
  })
)

export const getMiscValidator = vine.compile(
  vine.object({
    foo: vine.string(),
    params: vine.number().optional(),
  })
)
