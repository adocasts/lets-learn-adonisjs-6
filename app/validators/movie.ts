import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export const movieValidator = vine.compile(
  vine.object({
    poster: vine.file({ extnames: ['png', 'jpg', 'jpeg', 'gif'], size: '5mb' }).optional(),
    posterUrl: vine.string().optional(),
    title: vine.string().maxLength(100),
    summary: vine
      .string()
      .maxLength(255)
      .nullable()
      .transform((value) => (value ? value : '')),
    abstract: vine.string(),
    writerId: vine.number().isExists({ table: 'cineasts', column: 'id' }),
    directorId: vine.number().isExists({ table: 'cineasts', column: 'id' }),
    statusId: vine.number().isExists({ table: 'movie_statuses', column: 'id' }),
    releasedAt: vine
      .date()
      .nullable()
      .transform((value) => {
        if (!value) return
        return DateTime.fromJSDate(value)
      }),
    crew: vine
      .array(
        vine.object({
          id: vine.number().isExists({ table: 'cineasts', column: 'id' }),
          title: vine.string(),
        })
      )
      .optional(),
    cast: vine
      .array(
        vine.object({
          id: vine.number().isExists({ table: 'cineasts', column: 'id' }),
          character_name: vine.string(),
        })
      )
      .optional(),
  })
)
