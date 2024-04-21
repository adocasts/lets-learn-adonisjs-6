import Roles from '#enums/roles'
import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const isAdmin = ctx.auth.user?.roleId === Roles.ADMIN

    if (!isAdmin) {
      throw new Exception('You are not authorized to perform this action', {
        code: 'E_NOT_AUTHORIZED',
        status: 401,
      })
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
