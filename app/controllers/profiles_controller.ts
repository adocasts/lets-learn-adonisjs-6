import type { HttpContext } from '@adonisjs/core/http'

export default class ProfilesController {
  async edit({ view, auth }: HttpContext) {
    const profile = await auth.user!.related('profile').query().firstOrFail()
    return view.render('pages/profiles/edit', { profile })
  }
}
