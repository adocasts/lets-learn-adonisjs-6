import Movie from '#models/movie'
import MovieService from '#services/movie_service'
import { movieValidator } from '#validators/movie'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import router from '@adonisjs/core/services/router'
import db from '@adonisjs/lucid/services/db'
import { unlink } from 'node:fs/promises'

export default class MoviesController {
  /**
   * Display a list of resource
   */
  async index({ request, view }: HttpContext) {
    const page = request.input('page', 1)
    const movies = await Movie.query()
      .preload('status')
      .preload('director')
      .preload('writer')
      .withCount('castMembers')
      .withCount('crewMembers')
      .orderBy('updatedAt', 'desc')
      .paginate(page, 30)

    movies.baseUrl(router.makeUrl('admin.movies.index'))

    return view.render('pages/admin/movies/index', { movies })
  }

  /**
   * Display form to create a new record
   */
  async create({ view }: HttpContext) {
    const data = await MovieService.getFormData()
    return view.render('pages/admin/movies/createOrEdit', data)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const { poster, ...data } = await request.validateUsing(movieValidator)

    if (poster) {
      data.posterUrl = await MovieService.storePoster(poster)
    }

    await Movie.create(data)

    return response.redirect().toRoute('admin.movies.index')
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ view, params }: HttpContext) {
    const movie = await Movie.findOrFail(params.id)
    const data = await MovieService.getFormData()
    const crewMembers = await db
      .from('crew_movies')
      .where('movie_id', movie.id)
      .orderBy('sort_order')

    return view.render('pages/admin/movies/createOrEdit', {
      ...data,
      movie,
      crewMembers,
    })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const { poster, crew, ...data } = await request.validateUsing(movieValidator)
    const movie = await Movie.findOrFail(params.id)

    if (poster) {
      data.posterUrl = await MovieService.storePoster(poster)
    } else if (!data.posterUrl && movie.posterUrl) {
      await unlink(app.makePath('storage', movie.posterUrl))
      data.posterUrl = ''
    }

    await movie.merge(data).save()

    const crewMembers = crew?.reduce<Record<number, { title: string; sort_order: number }>>(
      (acc, row, index) => {
        acc[row.id] = { title: row.title, sort_order: index }
        return acc
      },
      {}
    )

    await movie.related('crewMembers').sync(crewMembers ?? [])

    return response.redirect().toRoute('admin.movies.index')
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
