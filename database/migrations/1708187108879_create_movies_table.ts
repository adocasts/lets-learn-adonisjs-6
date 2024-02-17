import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'movies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('status_id').unsigned().references('movie_statuses.id').notNullable()
      table.integer('writer_id').unsigned().references('cineasts.id').notNullable()
      table.integer('director_id').unsigned().references('cineasts.id').notNullable()
      table.string('title', 100).notNullable()
      table.string('slug', 200).notNullable().unique()
      table.string('summary').notNullable().defaultTo('')
      table.text('abstract')
      table.string('poster_url').notNullable().defaultTo('')

      table.timestamp('released_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
