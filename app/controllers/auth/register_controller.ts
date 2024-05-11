import User from '#models/user'
import { registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class RegisterController {
  async show({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  async store({ request, response, auth }: HttpContext) {
    // 1. Grab our request data and validate it
    const data = await request.validateUsing(registerValidator)
    // 2. Create our user
    const user = await User.create(data)
    // 3. Create profile for user
    await user.related('profile').create({})
    // 4. Login that user
    await auth.use('web').login(user)
    // 5. Return the user back to home
    return response.redirect().toRoute('home')
  }
}
