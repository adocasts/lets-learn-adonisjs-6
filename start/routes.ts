/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const MoviesController = () => import('#controllers/movies_controller')
const RedisController = () => import('#controllers/redis_controller')

router.get('/', [MoviesController, 'index']).as('home')

router
  .get('/movies/:slug', [MoviesController, 'show'])
  .as('movies.show')
  .where('slug', router.matchers.slug())

router
  .get('/', async () => {
    const builder = router
      .builderForDomain('app.lvh.me')
      .prefixUrl('http://app.lvh.me:3333')
      .make('app.home')

    const url = router.makeUrl(
      'app.home',
      {},
      {
        domain: 'app.lvh.me',
        prefixUrl: 'http://app.lvh.me:3333',
      }
    )

    console.log({ builder, url })

    return 'route reached with subdomain'
  })
  .domain('app.lvh.me')
  .as('app.home')

router.delete('/redis/flush', [RedisController, 'flush']).as('redis.flush')
router.delete('/redis/:slug', [RedisController, 'destroy']).as('redis.destroy')
