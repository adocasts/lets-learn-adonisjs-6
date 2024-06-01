import Movie from '#models/movie'
import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'

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
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {}

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
