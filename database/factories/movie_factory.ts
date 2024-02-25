import factory from '@adonisjs/lucid/factories'
import Movie from '#models/movie'
import MovieStatuses from '#enums/movie_statuses'

export const MovieFactory = factory
  .define(Movie, async ({ faker }) => {
    return {
      statusId: MovieStatuses.WRITING,
      writerId: 1,
      directorId: 2,
      title: faker.music.songName(),
      slug: faker.string.uuid(),
      summary: faker.lorem.sentence(),
      abstract: faker.lorem.paragraphs(),
      posterUrl: faker.image.urlPicsumPhotos(),
      releasedAt: null,
    }
  })
  .build()
