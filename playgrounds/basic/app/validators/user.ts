import vine from '@vinejs/vine'

/**
 * Shared rules for email and password.
 */
const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(32)

/**
 * Validator to use when performing self-signup
 */
export const signupValidator = vine.compile(
  vine.object({
    fullName: vine.string(),
    // email: email(),
    // password: password().confirmed({
    //   confirmationField: 'passwordConfirmation',
    // }),
  })
)
