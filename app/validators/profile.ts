import vine from '@vinejs/vine'
import { fullNameRule } from './auth.js'

export const profileUpdateValidator = vine.compile(
  vine.object({
    avatar: vine.file({ extnames: ['jpg', 'png', 'jpeg'], size: '5mb' }).optional(),
    avatarUrl: vine.string().optional(),
    fullName: fullNameRule,
    description: vine.string().optional(),
  })
)
