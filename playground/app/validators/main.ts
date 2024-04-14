import vine from '@vinejs/vine'

export const getUsersValidator = vine.compile(
  vine.object({
    limit: vine.number(),
    page: vine.number().optional(),
  }),
)
