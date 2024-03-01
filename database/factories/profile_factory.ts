import factory from '@adonisjs/lucid/factories'
import Profile from '#models/profile'

export const ProfileFactory = factory
  .define(Profile, async ({ faker }) => {
    return {
      userId: 1,
      description: faker.lorem.paragraphs(),
    }
  })
  .build()
