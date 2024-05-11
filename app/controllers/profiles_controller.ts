import ProfileService from '#services/profile_service'
import { profileUpdateValidator } from '#validators/profile'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

@inject()
export default class ProfilesController {
  constructor(protected profileService: ProfileService) {}

  async edit({ view }: HttpContext) {
    const profile = await this.profileService.find()
    return view.render('pages/profiles/edit', { profile })
  }

  async update({ request, response, session, auth }: HttpContext) {
    const { fullName, description } = await request.validateUsing(profileUpdateValidator)
    const trx = await db.transaction()

    auth.user!.useTransaction(trx)

    try {
      const profile = await this.profileService.find()

      await auth.user!.merge({ fullName }).save()
      await profile.merge({ description }).save()

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      session.flash('errorsBag.form', 'Something went wrong')
    }

    return response.redirect().back()
  }
}
