import { CineastFactory } from '#database/factories/cineast_factory'
import { MovieFactory } from '#database/factories/movie_factory'
import { UserFactory } from '#database/factories/user_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  static environment = ['development']

  async run() {
    // Write your database queries inside the run method
    await CineastFactory.createMany(10)
    await MovieFactory.createMany(3)
    await UserFactory.createMany(5)
  }
}
