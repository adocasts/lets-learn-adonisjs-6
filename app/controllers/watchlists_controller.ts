import MovieStatus from '#models/movie_status'
import Watchlist from '#models/watchlist'
import MovieService from '#services/movie_service'
import { watchlistFilterValidator } from '#validators/movie_filter'
import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import { DateTime } from 'luxon'

export default class WatchlistsController {
  async index({ view, request, auth }: HttpContext) {
    const page = request.input('page', 1)
    const filters = await watchlistFilterValidator.validate(request.qs())
    const movies = await MovieService.getFiltered(filters, auth.user)
      .whereHas('watchlist', (query) =>
        query
          .where('userId', auth.user!.id)
          .if(filters.watched === 'watched', (watchlist) => watchlist.whereNotNull('watchedAt'))
          .if(filters.watched === 'unwatched', (watchlist) => watchlist.whereNull('watchedAt'))
      )
      .paginate(page, 15)
    const movieStatuses = await MovieStatus.query().orderBy('name').select('id', 'name')
    const movieSortOptions = MovieService.sortOptions

    movies.baseUrl(router.makeUrl('watchlists.index'))
    movies.queryString(filters)

    return view.render('pages/watchlist', {
      movies,
      movieStatuses,
      movieSortOptions,
      filters,
    })
  }

  async toggle({ response, params, auth }: HttpContext) {
    const { movieId } = params
    const userId = auth.user!.id
    const watchlist = await Watchlist.query().where({ movieId, userId }).first()

    if (watchlist) {
      await watchlist.delete()
    } else {
      await Watchlist.create({ movieId, userId })
    }

    return response.redirect().back()
  }

  async toggleWatched({ response, params, auth }: HttpContext) {
    const { movieId } = params
    const userId = auth.user!.id
    const watchlist = await Watchlist.query().where({ movieId, userId }).firstOrFail()

    if (watchlist.watchedAt) {
      watchlist.watchedAt = null
    } else {
      watchlist.watchedAt = DateTime.now()
    }

    await watchlist.save()

    return response.redirect().withQs().back()
  }
}
