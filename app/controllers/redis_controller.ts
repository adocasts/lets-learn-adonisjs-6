import cache from '#services/cache_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class RedisController {
  async destroy({ response, params }: HttpContext) {
    await cache.delete(params.slug)
    return response.redirect().back()
  }

  async flush({ response }: HttpContext) {
    console.log('Flushing Redis Database')
    await cache.flushDb()
    return response.redirect().back()
  }
}
