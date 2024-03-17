/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const WritersController = () => import('#controllers/writers_controller')
import router from '@adonisjs/core/services/router'
const DirectorsController = () => import('#controllers/directors_controller')
const MoviesController = () => import('#controllers/movies_controller')
const RedisController = () => import('#controllers/redis_controller')

router.get('/', [MoviesController, 'index']).as('home')

router
  .get('/movies/:slug', [MoviesController, 'show'])
  .as('movies.show')
  .where('slug', router.matchers.slug())

router.get('/directors', [DirectorsController, 'index']).as('directors.index')
router.get('/directors/:id', [DirectorsController, 'show']).as('directors.show')

router.get('/writers', [WritersController, 'index']).as('writers.index')
router.get('/writers/:id', [WritersController, 'show']).as('writers.show')

router.delete('/redis/flush', [RedisController, 'flush']).as('redis.flush')
router.delete('/redis/:slug', [RedisController, 'destroy']).as('redis.destroy')
