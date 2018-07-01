/* ------------------------------------------
   Hermes Bridge core
--------------------------------------------- */
const http = require('http')
const net = require('net')
const isEmpty = require('lodash/isEmpty')

const createClientsManager = require('./ClientsManager')
const createLogger = require('./utils/logger')

const responseFallback = {
  statusCode: 500,
  headers: {
    'content-type': 'application/json; charset=utf-8'
  },
  body: JSON.stringify({ error: 'No local server provided' })
}

const createBridgeServer = ({
  httpHost,
  httpPort,
  socketHost,
  socketPort,
  loggerLevel = 'verbose',
  clients,
  dashboard,
  defaultResponse = responseFallback
}) => {
  const logger = createLogger(loggerLevel)

  if (!isEmpty(clients) && !isEmpty(dashboard)) {
    logger.line('info', 'red')
    logger.error('Config cannot contain both "clients" and "dashboard" keys')
    logger.line('info', 'red')
    process.exit(1)
  }

  const ClientsManager = createClientsManager({ logger, clients, dashboard })
  const manager = new ClientsManager(defaultResponse)

  const httpServer = http.createServer(manager.createProviderRequestHandler.bind(manager))
  httpServer.listen(
    {
      host: httpHost || '127.0.0.1',
      port: httpPort
    },
    () => {
      logger.line('verbose', 'cyan')
      logger.verbose(`  Bridge HTTP server running on ${httpHost || '127.0.0.1'}:${httpPort}`.cyan)
      logger.line('verbose', 'cyan')
    }
  )

  const socketServer = net.createServer(manager.addAdaptor.bind(manager))
  socketServer.listen(
    {
      host: socketHost || httpHost || '127.0.0.1',
      port: socketPort
    },
    () => {
      logger.line('verbose', 'cyan')
      logger.verbose(
        `  Bridge Socket server running on ${socketHost || '127.0.0.1'}:${socketPort}`.cyan)
      logger.line('verbose', 'cyan')
    }
  )
}

module.exports = createBridgeServer
