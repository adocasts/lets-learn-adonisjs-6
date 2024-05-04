import Cineast from '#models/cineast'
import type { HttpContext } from '@adonisjs/core/http'

export default class WritersController {
  async index({ view }: HttpContext) {
    const writers = await Cineast.query()
      .whereHas('moviesWritten', (query) => query)
      .withCount('moviesWritten', (query) =>
        query.apply((scope) => scope.released()).as('releasedCount')
      )
      .withCount('moviesWritten', (query) =>
        query.apply((scope) => scope.notReleased()).as('notReleasedCount')
      )
      .orderBy([
        { column: 'firstName', order: 'asc' },
        { column: 'lastName', order: 'asc' },
      ])

    return view.render('pages/writers/index', { writers })
  }

  async show({ view, params, auth }: HttpContext) {
    const writer = await Cineast.query()
      .where({ id: params.id })
      .preload('moviesWritten', (written) =>
        written.if(auth.user, (query) =>
          query.preload('watchlist', (watchlist) => watchlist.where('userId', auth.user!.id))
        )
      )
      .firstOrFail()

    return view.render('pages/writers/show', { writer })
  }
}
