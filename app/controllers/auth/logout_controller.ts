import type { HttpContext } from '@adonisjs/core/http'

export default class LogoutController {
  async handle({ request, response, auth }: HttpContext) {
    await auth.use('web').logout()

    if (request.header('referer', '')?.includes('/admin')) {
      return response.redirect().toRoute('auth.login.show')
    }

    return response.redirect().back()
  }
}
