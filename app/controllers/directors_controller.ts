import Cineast from '#models/cineast'
import type { HttpContext } from '@adonisjs/core/http'

export default class DirectorsController {
  async index({ view }: HttpContext) {
    const directors = await Cineast.query()
      .whereHas('moviesDirected', (query) => query.apply((scope) => scope.released()))
      .orderBy([
        { column: 'firstName', order: 'asc' },
        { column: 'lastName', order: 'asc' },
      ])

    return view.render('pages/directors/index', { directors })
  }

  async show({ view, params }: HttpContext) {
    const director = await Cineast.findOrFail(params.id)
    const movies = await director.related('moviesDirected').query().orderBy('title')
    return view.render('pages/directors/show', { director, movies })
  }
}
