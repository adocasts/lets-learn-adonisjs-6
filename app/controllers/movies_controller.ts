import type { HttpContext } from '@adonisjs/core/http'
import Movie from '#models/movie'
import MovieStatus from '#models/movie_status'
import MovieService from '#services/movie_service'
import { movieFilterValidator } from '#validators/movie'
import router from '@adonisjs/core/services/router'

export default class MoviesController {
  async index({ request, view, auth }: HttpContext) {
    const page = request.input('page', 1)
    const filters = await movieFilterValidator.validate(request.qs())
    const movies = await MovieService.getFiltered(filters, auth.user).paginate(page, 15)
    const movieStatuses = await MovieStatus.query().orderBy('name').select('id', 'name')
    const movieSortOptions = MovieService.sortOptions

    movies.baseUrl(router.makeUrl('movies.index'))
    movies.queryString(filters)

    return view.render('pages/movies/index', {
      movies,
      movieStatuses,
      movieSortOptions,
      filters,
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
