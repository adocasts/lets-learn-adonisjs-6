import MovieService from '#services/movie_service'
import vine from '@vinejs/vine'

export const movieFilterValidator = vine.compile(
  vine.object({
    search: vine.string().optional(),
    status: vine
      .number()
      .exists(async (db, value) => {
        if (!value) return true
        const exists = await db.from('movie_statuses').select('id').where('id', value).first()
        return !!exists
      })
      .optional(),
    sort: vine
      .string()
      .exists(async (_db, value) => {
        return MovieService.sortOptions.some((option) => option.id === value)
      })
      .optional(),
  })
)
