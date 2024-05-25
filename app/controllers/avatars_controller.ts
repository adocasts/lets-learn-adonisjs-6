import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class AvatarsController {
  async show({ response, params }: HttpContext) {
    return response.download(app.makePath('storage/avatars', params.filename))
  }
}
