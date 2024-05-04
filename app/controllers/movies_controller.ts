import type { HttpContext } from '@adonisjs/core/http'
import Movie from '#models/movie'
import MovieStatus from '#models/movie_status'
import MovieService from '#services/movie_service'
import { movieFilterValidator } from '#validators/movie'
import router from '@adonisjs/core/services/router'
import querystring from 'node:querystring'

export default class MoviesController {
  async index({ request, view, auth }: HttpContext) {
    const page = request.input('page')
    const filters = await movieFilterValidator.validate(request.qs())
    const movies = await MovieService.getFiltered(page, filters, auth.user)
    const movieStatuses = await MovieStatus.query().orderBy('name').select('id', 'name')
    const movieSortOptions = MovieService.sortOptions
    const qs = querystring.stringify(filters)

    movies.baseUrl(router.makeUrl('movies.index'))

    const rangeMin = movies.currentPage - 3
    const rangeMax = movies.currentPage + 3
    let pagination = movies.getUrlsForRange(1, movies.lastPage).filter((item) => {
      return item.page >= rangeMin && item.page <= rangeMax
    })

    if (qs) {
      pagination = pagination.map((item) => {
        item.url += `&${qs}`
        return item
      })
    }

    return view.render('pages/movies/index', {
      movies,
      movieStatuses,
      movieSortOptions,
      filters,
      pagination,
      qs,
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
