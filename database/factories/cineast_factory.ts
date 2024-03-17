import factory from '@adonisjs/lucid/factories'
import Cineast from '#models/cineast'

export const CineastFactory = factory
  .define(Cineast, async ({ faker }) => {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      headshotUrl: faker.image.avatar(),
    }
  })
  .build()
