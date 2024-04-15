import vine from '@vinejs/vine'

export const getUsersValidator = vine.compile(
  vine.object({
    limit: vine.number(),
    page: vine.number().optional(),
  }),
)

export const uploadFileValidator = vine.compile(
  vine.object({
    file: vine.file({
      size: '2mb',
    }),
  }),
)
