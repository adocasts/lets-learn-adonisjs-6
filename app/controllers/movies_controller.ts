import type { HttpContext } from '@adonisjs/core/http'
import Movie from '#models/movie'
import MovieStatus from '#models/movie_status'

export default class MoviesController {
  async index({ request, view }: HttpContext) {
    const qs = request.qs()
    const movies = await Movie.query()
      .if(qs.search, (query) => query.whereILike('title', `%${qs.search}%`))
      .if(qs.status, (query) => query.where('statusId', qs.status))
      .preload('director')
      .preload('writer')
      .preload('status')
      .orderBy('title')
      .limit(15)

    const movieStatuses = await MovieStatus.query().orderBy('name').select('id', 'name')

    return view.render('pages/movies/index', {
      movies,
      movieStatuses,
      filters: qs,
    })
  }

  async show({ view, params }: HttpContext) {
    const movie = await Movie.findByOrFail('slug', params.slug)
    const cast = await movie.related('castMembers').query().orderBy('pivot_sort_order')
    const crew = await movie
      .related('crewMembers')
      .query()
      .pivotColumns(['title', 'sort_order'])
      .orderBy('pivot_sort_order')

    await movie.load('director')
    await movie.load('writer')

    return view.render('pages/movies/show', { movie, cast, crew })
  }
}
