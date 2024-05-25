import User from '#models/user'
import ProfileService from '#services/profile_service'
import { profileUpdateValidator } from '#validators/profile'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'
import { unlink } from 'node:fs/promises'

@inject()
export default class ProfilesController {
  constructor(protected profileService: ProfileService) {}

  async show({ view, params }: HttpContext) {
    const user = await User.findOrFail(params.id)

    await user.load('profile')

    return view.render('pages/profiles/show', { user })
  }

  async at({ view, params }: HttpContext) {
    const id = params.username.replace('@', '')
    const user = await User.findOrFail(id)

    await user.load('profile')

    return view.render('pages/profiles/show', { user })
  }

  async edit({ view }: HttpContext) {
    const profile = await this.profileService.find()
    return view.render('pages/profiles/edit', { profile })
  }

  async update({ request, response, session, auth }: HttpContext) {
    const { fullName, description, avatar, avatarUrl } =
      await request.validateUsing(profileUpdateValidator)
    const trx = await db.transaction()

    auth.user!.useTransaction(trx)

    try {
      const profile = await this.profileService.find()

      if (avatar) {
        await avatar.move(app.makePath('storage/avatars'))
        auth.user!.avatarUrl = `/avatars/${avatar.fileName}`
      } else if (!avatarUrl && auth.user?.avatarUrl) {
        await unlink(app.makePath('storage', auth.user.avatarUrl))
        auth.user!.avatarUrl = null
      }

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
