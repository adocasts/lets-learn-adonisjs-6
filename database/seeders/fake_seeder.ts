import { CineastFactory } from '#database/factories/cineast_factory'
import { MovieFactory } from '#database/factories/movie_factory'
import { UserFactory } from '#database/factories/user_factory'
import MovieStatuses from '#enums/movie_statuses'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  static environment = ['development']

  async run() {
    // Write your database queries inside the run method
    await CineastFactory.createMany(10)
    await MovieFactory.createMany(3)
    await MovieFactory.merge({
      statusId: MovieStatuses.RELEASED,
      releasedAt: DateTime.now().minus({ month: 1 }),
    }).createMany(2)
    await UserFactory.createMany(5)
  }
}
