/* ------------------------------------------
   API Router
--------------------------------------------- */
const Router = require('express').Router
const bodyParser = require('body-parser')
const cors = require('cors')

const createAuthRouter = require('./auth')
const createAdaptorsRouter = require('./adaptors')

const createAPIRouter = config => {
  const router = Router()
  router.use(cors())
  router.use(bodyParser.json())

  router.options(cors())
  router.use(createAuthRouter(config.adminAuth))
  router.use(createAdaptorsRouter())

  return router
}

module.exports = createAPIRouter
