import { loginValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  
  async show({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }
  
  async store({ request, response }: HttpContext) {
    // 1. Grab our validated data off the request
    const data = await request.validateUsing(loginValidator)
    console.log({ data })
    // 2. Login our user

    // 3. Return our user back to the home page
    return response.redirect().toRoute('home')
  }
  
}
