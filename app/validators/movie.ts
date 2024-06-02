import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export const movieValidator = vine.compile(
  vine.object({
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
  })
)
