/* ------------------------------------------
   Clients Manager
--------------------------------------------- */
const { blueprints: { createProviderBlueprint } } = require('hermes-utils')

const createAdaptor = require('./Adaptor')
const backendManager = require('./backendManager')
const createConfigManager = require('./configManager')

const createClientsManager = ({ logger, clients, dashboard }) => {
  let backend = null
  if (dashboard) {
    backend = backendManager(dashboard)
  }
  let configManager = null
  if (clients) {
    configManager = createConfigManager(clients)
  }
  const hasDashboard = !!backend
  const adaptorInterface = {
    hasDashboard,
    auth: token => (hasDashboard
      ? backend.getAdaptorByAuthToken(token)
      : configManager.adaptorAuth(token)),
    updateOnlineState: (id, isOnline) => (hasDashboard
      ? backend.adaptorUpdateOnlineState(id, isOnline)
      : () => {}),
    emitter: hasDashboard ? backend.emitter : configManager.emitter
  }

  const Adaptor = createAdaptor({ logger, adaptorInterface })

  return class ClientsManager {
    constructor (defaultResponse) {
      this._defaultResponse = defaultResponse
      this.adaptors = new Map()
      this.pendingResponses = new Map()
    }
    createProviderRequestHandler (req, res) {
      const chunks = []
      req.on('data', chunk => {
        chunks.push(chunk)
      })
      req.on('end', () => {
        const buffer = Buffer.concat(chunks)
        const string = buffer.toString()

        const providerBlueprint = createProviderBlueprint(req.url, req.method, req.headers, string)

        logger.line('verbose', 'cyan')
        logger.verbose('From Provider blueprint'.cyan)
        logger.verbose(`requestId: ${providerBlueprint.requestId}`.green)
        logger.verbose(providerBlueprint)
        logger.line('verbose', 'cyan')

        const hasReadyAdaptor = Array // prevent onAuth adaptors to be considered
          .from(this.adaptors.values())
          .reduce((acc, c) => acc || (c.isAuth && c.isListening), false)

        if (this.adaptors.size > 0 && hasReadyAdaptor) {
          this.pendingResponses.set(providerBlueprint.requestId, res)
          this.broadcastToSockets(providerBlueprint)
          // TODO Manage garbage collector for non-finished old request
        } else {
          this.sendDefaultResponse(res, providerBlueprint)
        }
      })
    }
    broadcastToSockets (providerBlueprint) {
      this.adaptors.forEach(socket => {
        socket.registerRequest(providerBlueprint)
      })
    }
    addAdaptor (nodeSocket) {
      const adaptor = new Adaptor(nodeSocket)
      adaptor.on(Adaptor.ON_DISCONNECT, ({ socketId }) => {
        const beforeDelete = this.adaptors.get(socketId)
        const username = `${beforeDelete.username}`
        this.adaptors.delete(socketId)

        this.adaptors.forEach(socket => {
          socket.communicate({
            BRIDGE_LOG_INFO: 'BRIDGE_LOG_INFO',
            message: `User ${username} just left hermes`
          })
        })
      })
      adaptor.on(Adaptor.ON_ADAPTOR_RECEPTION_SUCCESS, resObjBlueprint => {
        try {
          const {
            requestId,
            statusCode,
            headers,
            method,
            body,
            isBuffer,
            hasError,
            error
          } = resObjBlueprint

          if (this.pendingResponses.has(requestId)) {
            const res = this.pendingResponses.get(requestId)
            this.pendingResponses.delete(requestId)
            if (hasError) {
              this.sendDefaultResponse(res, resObjBlueprint, error)
            } else {
              if (!res.finished) {
                const statusCodeNumber = Number(statusCode)
                res.writeHead(statusCodeNumber, headers)
                if (method !== 'HEAD' && statusCodeNumber !== 204 && statusCodeNumber !== 304) {
                  const payload = isBuffer ? Buffer.from(body, 'base64') : body
                  res.write(payload)
                }
                res.end()
              } else {
                logger.line('error', 'red')
                logger.error(`Response "${requestId}" already finished`.red)
                logger.line('error', 'red')
              }
            }
          }
        } catch (e) {
          logger.line('error', 'red')
          logger.error('Failed to send res to provider'.red)
          logger.error(e)
          logger.line('error', 'red')
        }
      })
      adaptor.on(Adaptor.ON_ADAPTOR_RECEPTION_ERROR, socketId => {
        this.adaptors.delete(socketId)
      })
      adaptor.on(Adaptor.ON_ADAPTOR_AUTH_SUCCESS, ({ socketId, username }) => {
        this.adaptors.forEach(socket => {
          if (socket.id !== socketId) {
            socket.communicate({
              BRIDGE_LOG_INFO: 'BRIDGE_LOG_INFO',
              message: `User ${username} just join hermes`
            })
          }
        })
      })
      adaptor.on(Adaptor.ON_ADAPTOR_AUTH_ERROR, ({ socketId }) => {
        this.adaptors.delete(socketId)
      })

      this.adaptors.set(adaptor.id, adaptor)
    }
    sendDefaultResponse (res, objBlueprint, error) {
      const { statusCode, headers, body } = this._defaultResponse
      if (error) {
        logger.line('error', 'red')
        logger.error('No Local server found - fallback mode'.red)
        logger.error(error)
        logger.line('error', 'red')
      } else {
        logger.line('info', 'yellow')
        logger.info('No Adaptor connected - fallback mode'.yellow)
        logger.info(this._defaultResponse)
        logger.line('info', 'yellow')
      }

      if (!res.finished) {
        res.writeHead(statusCode, headers)
        if (objBlueprint.method !== 'HEAD') {
          res.write(body)
        }
        res.end()
      } else {
        logger.line('error', 'red')
        logger.error(`Response "${objBlueprint.requestId}" already finished`.red)
        logger.line('error', 'red')
      }
    }
  }
}

module.exports = createClientsManager
