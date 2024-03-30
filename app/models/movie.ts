import MovieStatuses from '#enums/movie_statuses'
import { BaseModel, beforeCreate, belongsTo, column, manyToMany, scope } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import string from '@adonisjs/core/helpers/string'
import MovieStatus from './movie_status.js'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Cineast from './cineast.js'

export default class Movie extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare statusId: number

  @column()
  declare writerId: number

  @column()
  declare directorId: number

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare summary: string

  @column()
  declare abstract: string

  @column()
  declare posterUrl: string

  @column.dateTime()
  declare releasedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => MovieStatus, {
    foreignKey: 'statusId',
  })
  declare status: BelongsTo<typeof MovieStatus>

  @belongsTo(() => Cineast, {
    foreignKey: 'directorId',
  })
  declare director: BelongsTo<typeof Cineast>

  @belongsTo(() => Cineast, {
    foreignKey: 'writerId',
  })
  declare writer: BelongsTo<typeof Cineast>

  @manyToMany(() => Cineast, {
    pivotTable: 'crew_movies',
    pivotTimestamps: true,
  })
  declare crewMembers: ManyToMany<typeof Cineast>

  @manyToMany(() => Cineast, {
    pivotTable: 'cast_movies',
    pivotTimestamps: true,
    pivotColumns: ['character_name', 'sort_order'],
  })
  declare castMembers: ManyToMany<typeof Cineast>

  static released = scope((query) => {
    query.where((group) =>
      group
        .where('statusId', MovieStatuses.RELEASED)
        .whereNotNull('releasedAt')
        .where('releasedAt', '<=', DateTime.now().toSQL())
    )
  })

  static notReleased = scope((query) => {
    query.where((group) =>
      group
        .whereNot('statusId', MovieStatuses.RELEASED)
        .orWhereNull('releasedAt')
        .orWhere('releasedAt', '>', DateTime.now().toSQL())
    )
  })

  @beforeCreate()
  static async slugify(movie: Movie) {
    if (movie.slug) return

    const slug = string.slug(movie.title, {
      replacement: '-',
      lower: true,
      strict: true,
    })

    const rows = await Movie.query()
      .select('slug')
      .whereRaw('lower(??) = ?', ['slug', slug])
      .orWhereRaw('lower(??) like ?', ['slug', `${slug}-%`])

    if (!rows.length) {
      movie.slug = slug
      return
    }

    const incrementors = rows.reduce<number[]>((result, row) => {
      const tokens = row.slug.toLowerCase().split(`${slug}-`)

      if (tokens.length < 2) {
        return result
      }

      const increment = Number(tokens.at(1))

      if (!Number.isNaN(increment)) {
        result.push(increment)
      }

      return result
    }, [])

    const increment = incrementors.length ? Math.max(...incrementors) + 1 : 1

    movie.slug = `${slug}-${increment}`
  }
}
