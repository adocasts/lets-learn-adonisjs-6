import vine from '@vinejs/vine'
import { fullNameRule } from './auth.js'

export const profileUpdateValidator = vine.compile(
  vine.object({
    fullName: fullNameRule,
    description: vine.string().optional(),
  })
)
