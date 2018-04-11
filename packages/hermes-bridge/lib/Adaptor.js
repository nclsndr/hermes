/* ------------------------------------------
   Socket
--------------------------------------------- */
const EventEmitter = require('events')
const uuid = require('uuid/v4')
const { socketChunks } = require('hermes-utils')

const ADAPTOR_TO_BRIDGE_SUCCESS = 'ADAPTOR_TO_BRIDGE_SUCCESS'
const ADAPTOR_TO_BRIDGE_ERROR = 'ADAPTOR_TO_BRIDGE_ERROR'
const BRIDGE_REFUSED_AUTH = 'BRIDGE_REFUSED_AUTH'
const BRIDGE_ACCEPTED_AUTH = 'BRIDGE_ACCEPTED_AUTH'
// const BRIDGE_TO_ADAPTOR_SUCCESS = 'BRIDGE_TO_ADAPTOR_SUCCESS'
// const BRIDGE_TO_ADAPTOR_ERROR = 'BRIDGE_TO_ADAPTOR_ERROR'

const createAdaptor = ({ logger }) =>
  class Adaptor extends EventEmitter {
    static get ON_ADAPTOR_RECEPTION_SUCCESS () {
      return 'ON_ADAPTOR_RECEPTION_SUCCESS'
    }
    static get ON_ADAPTOR_RECEPTION_ERROR () {
      return 'ON_ADAPTOR_RECEPTION_ERROR'
    }
    static get ON_ADAPTOR_AUTH_SUCCESS () {
      return 'ON_ADAPTOR_AUTH_SUCCESS'
    }
    static get ON_ADAPTOR_AUTH_ERROR () {
      return 'ON_ADAPTOR_AUTH_ERROR'
    }
    static get ON_DISCONNECT () {
      return 'ON_DISCONNECT'
    }
    constructor (socket, config) {
      super()
      this.id = uuid()
      this._socket = socket
      this._config = config
      this._socket.on('data', this.onData.bind(this))
      this._socket.on('end', this.onEnd.bind(this))
      this.isAuth = !config.isAuthRequired
      this.token = null
      this.username = 'Anonymous'
      this.pendingRequests = []
      this.ready = true
      this.chunks = ''
      this.nextReqLength = 0
      this.accLength = 0
      this.authTimeout = null

      if (config.isAuthRequired) {
        this.authTimeout = setTimeout(() => {
          if (!this.isAuth) {
            this._socket.destroy()
            logger.verbose(`Adaptor ${this.id} auth timeout`.red)
            this.emit(Adaptor.ON_ADAPTOR_AUTH_ERROR, { socketId: this.id })
          }
        }, 2000)
      }
      logger.verbose(`Adaptor on connect ${this.id}`.green)
    }
    registerRequest (providerObjBlueprint) {
      if (this.isAuth) {
        logger.verbose(
          `Add blueprint ${providerObjBlueprint.requestId} to Adaptor ${this.id} queue`.green
        )
        const blueprint = JSON.stringify(providerObjBlueprint)
        this.pendingRequests.push(blueprint)
        this.writeQueue()
      } else {
        logger.verbose(
          `Cannot add ${providerObjBlueprint.requestId} to Adaptor ${this.id} queue (not auth)`.red
        )
      }
    }
    communicate (obj) {
      this.writeSocket(socketChunks.buildCommunication(obj))
    }
    onData (buffer) {
      const parsed = buffer.toString()
      const {
        isStartOfRequest,
        isEndOfRequest,
        requestLength,
        requestContent,
        communication
      } = socketChunks.parse(parsed)
      // Internal communication
      if (Object.keys(communication).length > 0) {
        this.onCommunication(communication)
      }
      if (this.isAuth) {
        // Request management
        if (isStartOfRequest) {
          this.nextReqLength = requestLength
          this.accLength = 0
          this.chunks = ''
        }
        if (requestContent) {
          this.accLength += requestContent.length
          this.chunks += requestContent
        }
        if (isEndOfRequest) {
          this.onEmissionEnd()
        }
      }
    }
    onEmissionEnd () {
      if (this.nextReqLength !== this.accLength) {
        logger.line('error', 'red')
        logger.error('Req length do not match'.red)
        logger.error('Expected:'.red, this.nextReqLength)
        logger.error('Received:'.red, this.accLength)
        logger.line('error', 'red')

        this.onEmissionError()
        return
      }
      try {
        const resObjBlueprint = JSON.parse(this.chunks)

        logger.line('verbose', 'cyan')
        logger.verbose('From Adaptor blueprint'.cyan)
        logger.verbose(`requestId: ${resObjBlueprint.requestId}`.green)
        logger.verbose(resObjBlueprint)
        logger.line('verbose', 'cyan')

        this.nextReqLength = 0
        this.accLength = 0
        this.chunks = ''
        this.writeSocket(socketChunks.buildCommunication({ ADAPTOR_TO_BRIDGE_SUCCESS }))
        logger.verbose(`Write ${ADAPTOR_TO_BRIDGE_SUCCESS}`.yellow)

        this.emit(Adaptor.ON_ADAPTOR_RECEPTION_SUCCESS, resObjBlueprint)
      } catch (e) {
        logger.line('error', 'red')
        logger.error('Failed to parse into JSON'.red)
        logger.error(e)
        logger.line('error', 'red')
      }
    }
    onEmissionError () {
      this.nextReqLength = 0
      this.accLength = 0
      this.chunks = ''
      this.writeSocket(ADAPTOR_TO_BRIDGE_ERROR)
      logger.error(`Write ${ADAPTOR_TO_BRIDGE_ERROR}`.red)

      if (this.authTimeout) {
        clearTimeout(this.authTimeout)
      }
      this._socket.destroy()
      this.emit(Adaptor.ON_ADAPTOR_RECEPTION_ERROR, this.id)
    }
    onCommunication (communication) {
      const {
        BRIDGE_TO_ADAPTOR_SUCCESS,
        BRIDGE_TO_ADAPTOR_ERROR,
        auth
      } = communication
      if (auth && !this.isAuth && this._config.isAuthRequired) {
        if (this._config.authTokens.includes(auth.token)) {
          this.isAuth = true
          this.username = auth.username
          this.token = auth.token
          logger.verbose(`User: ${auth.username} is authenticated (${auth.token})`.green)

          this.writeSocket(socketChunks.buildCommunication({ BRIDGE_ACCEPTED_AUTH }), () => {
            this.emit(
              Adaptor.ON_ADAPTOR_AUTH_SUCCESS, { socketId: this.id, username: auth.username })
          })
        } else {
          this.writeSocket(socketChunks.buildCommunication({ BRIDGE_REFUSED_AUTH }), () => {
            logger.verbose(`User: ${auth.username} authentication refused (${auth.token})`.red)

            if (this.authTimeout) {
              clearTimeout(this.authTimeout)
            }
            this._socket.destroy()
            this.emit(Adaptor.ON_ADAPTOR_AUTH_ERROR, { socketId: this.id, username: auth.username })
          })
        }
      }
      if (BRIDGE_TO_ADAPTOR_SUCCESS) {
        logger.verbose(`Receive ${BRIDGE_TO_ADAPTOR_SUCCESS} from ${this.id}`.yellow)
      }
      if (BRIDGE_TO_ADAPTOR_ERROR) {
        logger.error(`Receive ${BRIDGE_TO_ADAPTOR_ERROR} from ${this.id}`.red)
      }
      if (BRIDGE_TO_ADAPTOR_SUCCESS || BRIDGE_TO_ADAPTOR_ERROR) {
        this.ready = true
        this.writeQueue()
      }
    }
    onEnd () {
      this.ready = false
      this.pendingRequests = []
      logger.verbose(`Adaptor on disconnect ${this.id}`.yellow)

      if (this.authTimeout) {
        clearTimeout(this.authTimeout)
      }
      this.emit(Adaptor.ON_DISCONNECT, { socketId: this.id })
    }
    writeQueue () {
      if (this.ready) {
        const blueprint = this.pendingRequests.shift()
        if (blueprint) {
          this.ready = false

          const { requestId } = JSON.parse(blueprint)
          logger.line('verbose', 'cyan')
          logger.verbose(`Write ${requestId} to Adaptor ${this.id}`.green)
          logger.verbose('Blueprint length:'.cyan, `${blueprint.length}`.green)
          logger.line('verbose', 'cyan')

          this.writeSocket(socketChunks.buildRequest(blueprint))
        }
      }
    }
    writeSocket (chunk, cb = () => {}) {
      try {
        if (!this._socket.destroyed) {
          this._socket.write(chunk, cb)
        } else {
          logger.line('error', 'red')
          logger.error(`Socket ${this.id} is destroyed`.red)
          logger.line('error', 'red')
        }
      } catch (e) {
        logger.line('error', 'red')
        logger.error(`Failed to write on socket ${this.id}`.red)
        logger.error(e)
        logger.line('error', 'red')
      }
    }
  }

module.exports = createAdaptor
