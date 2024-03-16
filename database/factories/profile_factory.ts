import factory from '@adonisjs/lucid/factories'
import Profile from '#models/profile'
import { UserFactory } from './user_factory.js'

export const ProfileFactory = factory
  .define(Profile, async ({ faker }) => {
    return {
      userId: 1,
      description: faker.lorem.paragraphs(),
    }
  })
  .relation('user', () => UserFactory)
  .build()
