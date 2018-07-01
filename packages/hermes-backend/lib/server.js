/* ------------------------------------------
   Backend server
--------------------------------------------- */
require('colors')
const express = require('express')

const http = require('http')

const createLogger = require('./utils/logger')
const validateConfig = require('./utils/validateConfig')
const { registerGlobals } = require('./utils/global')

const createAPIRouter = require('./api')
const createDashboardRouter = require('./dashboard')

const { createSocketServer } = require('./services/socketIO')
const { createSocketController } = require('./resources/socket')

const createServer = (initialConfig = {}) => {
  const environment = process.env.NODE_ENV || initialConfig.env || 'development'
  const logger = createLogger(environment === 'development' ? 'verbose' : 'warn')
  let config = {}
  try {
    config = validateConfig(initialConfig)
  } catch (e) {
    logger.line('error', 'red')
    logger.error(`Backend server configuration is not valid`.red)
    logger.error(`${e.message}`.red)
    logger.line('error', 'red')
    process.exit(1)
  }

  registerGlobals(['JWT_SECRET', config.adminAuth.jwtSecret])

  const { host, port } = config

  const app = express()
  const server = http.Server(app)
  const socketIO = createSocketServer(createSocketController)(server)

  app.use('/api', createAPIRouter(config))

  app.use(createDashboardRouter())

  server.listen({ host, port }, () => {
    logger.line('info', 'cyan')
    logger.info(`  Dashboard server running on port: ${host}:${port}`.cyan)
    logger.line('info', 'cyan')
  })
  return {
    server,
    socketIO
  }
}

module.exports = createServer
