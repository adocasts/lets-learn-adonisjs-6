import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Movie from './movie.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class MovieStatus extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Movie, {
    foreignKey: 'statusId',
  })
  declare movies: HasMany<typeof Movie>
}
