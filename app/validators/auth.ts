import vine from '@vinejs/vine'

export const fullNameRule = vine.string().maxLength(100).optional()

export const registerValidator = vine.compile(
  vine.object({
    fullName: fullNameRule,
    email: vine.string().email().normalizeEmail().isUnique({ table: 'users', column: 'email' }),
    password: vine.string().minLength(8),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string(),
    isRememberMe: vine.accepted().optional(),
  })
)
