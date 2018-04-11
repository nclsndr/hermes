require('colors')
const net = require('net')
const EventEmitter = require('events')
const socketChunks = require('hermes-utils').socketChunks

// const ADAPTOR_TO_BRIDGE_SUCCESS = 'ADAPTOR_TO_BRIDGE_SUCCESS'
// const ADAPTOR_TO_BRIDGE_ERROR = 'ADAPTOR_TO_BRIDGE_ERROR'
const BRIDGE_TO_ADAPTOR_SUCCESS = 'BRIDGE_TO_ADAPTOR_SUCCESS'
const BRIDGE_TO_ADAPTOR_ERROR = 'BRIDGE_TO_ADAPTOR_ERROR'

class SocketConnection extends EventEmitter {
  static get ON_BRIDGE_RECEPTION_SUCCESS () {
    return 'ON_BRIDGE_RECEPTION_SUCCESS'
  }
  static get ON_BRIDGE_RECEPTION_ERROR () {
    return 'ON_BRIDGE_RECEPTION_ERROR'
  }
  static get ON_AUTH_FAILED () {
    return 'ON_AUTH_FAILED'
  }
  static get ON_AUTH_SUCCESS () {
    return 'ON_AUTH_SUCCESS'
  }
  static get ON_CONNECTION_SUCCESS () {
    return 'ON_CONNECTION_SUCCESS'
  }
  static get ON_CONNECTION_ERROR () {
    return 'ON_CONNECTION_ERROR'
  }
  constructor ({ bridgeSocketPort, bridgeHost, auth = {} }, logger) {
    super()
    const { token, username } = auth
    this._bridgeConfig = { bridgeSocketPort, bridgeHost }
    this._logger = logger
    this._authToken = token
    this._username = username || 'Anonymous'
    this.socket = net.createConnection(bridgeSocketPort, bridgeHost, this.onConnection.bind(this))
    this.socket.on('error', this.onError.bind(this))
    this.socket.on('data', this.onData.bind(this))
    this.socket.on('close', this.onClose.bind(this))
    this.isAuth = false
    this.nextReqLength = 0
    this.accLength = 0
    this.chunks = ''
    this.ready = true
    this.pendingResponses = []
  }
  onConnection () {
    this.emit(SocketConnection.ON_CONNECTION_SUCCESS)
    this._logger.info(
      'Connected to Bridge on'.green,
      `${this._bridgeConfig.bridgeHost}:${this._bridgeConfig.bridgeSocketPort}`.cyan
    )
    if (this._authToken) {
      this.socket.write(socketChunks.buildCommunication({
        auth: { token: this._authToken, username: this._username }
      }))
    }
  }
  onError () { // err
    // const { bridgeHost, bridgeSocketPort } = this._bridgeConfig
    // this._logger.line('info', 'red')
    // this._logger.info(`\nBridge is not accessible on ${bridgeHost}:${bridgeSocketPort}\n`.red)
    // this._logger.verbose(err)
    // this._logger.line('info', 'red')
    // this.emit(SocketConnection.ON_CONNECTION_ERROR)
  }
  onClose () {
    const { bridgeHost, bridgeSocketPort } = this._bridgeConfig
    this._logger.info(`Bridge is not accessible on ${bridgeHost}:${bridgeSocketPort}`.red)
    this.emit(SocketConnection.ON_CONNECTION_ERROR)
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
  onEmissionEnd () {
    if (this.nextReqLength !== this.accLength) {
      this._logger.line('error', 'red')
      this._logger.error('Req length do not match'.red)
      this._logger.error('Expected:'.red, this.nextReqLength)
      this._logger.error('Received:'.red, this.accLength)
      this._logger.line('error', 'red')

      this.onEmissionError()
      return
    }
    try {
      const reqObjBlueprint = JSON.parse(this.chunks)

      this._logger.line('verbose', 'cyan')
      this._logger.verbose('From Bridge blueprint'.cyan)
      this._logger.verbose(`requestId: ${reqObjBlueprint.requestId}`.green)
      this._logger.verbose(reqObjBlueprint)
      this._logger.line('verbose', 'cyan')

      this.nextReqLength = 0
      this.accLength = 0
      this.chunks = ''
      this.socket.write(socketChunks.buildCommunication({ BRIDGE_TO_ADAPTOR_SUCCESS }))
      this._logger.verbose(`Write ${BRIDGE_TO_ADAPTOR_SUCCESS}`.yellow)
      this.emit(SocketConnection.ON_BRIDGE_RECEPTION_SUCCESS, reqObjBlueprint)
    } catch (e) {
      this._logger.line('error', 'red')
      this._logger.error('Failed to parse into JSON'.red)
      this._logger.error(e)
      this._logger.line('error', 'red')
    }
  }
  onEmissionError () {
    this.nextReqLength = 0
    this.accLength = 0
    this.chunks = ''
    this.socket.write(BRIDGE_TO_ADAPTOR_ERROR)
    this._logger.error(`Write ${BRIDGE_TO_ADAPTOR_ERROR}`.red)
    this.emit(SocketConnection.ON_BRIDGE_RECEPTION_ERROR)
  }
  onCommunication (communication) {
    const {
      ADAPTOR_TO_BRIDGE_SUCCESS,
      ADAPTOR_TO_BRIDGE_ERROR,
      BRIDGE_REFUSED_AUTH,
      BRIDGE_ACCEPTED_AUTH,
      BRIDGE_LOG_INFO
    } = communication

    if (BRIDGE_LOG_INFO) {
      const { BRIDGE_LOG_INFO, ...rest } = communication // eslint-disable-line
      this._logger.info(`${this._logger.dateTimeNow()} Bridge`.grey, ...Object.values(rest))
    }

    if (BRIDGE_ACCEPTED_AUTH) {
      this._logger.info(`${this._username}, you are now authenticated (${this._authToken})`.green)
      this.emit(SocketConnection.ON_AUTH_SUCCESS)
    }
    if (BRIDGE_REFUSED_AUTH) {
      this._logger.line('error', 'red')
      this._logger.error(`Auth token "${this._authToken}" is not valid`.red)
      this._logger.line('error', 'red')
      this.emit(SocketConnection.ON_AUTH_FAILED)
    }

    if (ADAPTOR_TO_BRIDGE_SUCCESS) {
      this._logger.verbose(`Receive ${ADAPTOR_TO_BRIDGE_SUCCESS}`.yellow)
    }
    if (ADAPTOR_TO_BRIDGE_ERROR) {
      this._logger.error(`Receive ${ADAPTOR_TO_BRIDGE_ERROR}`.red)
    }
    if (ADAPTOR_TO_BRIDGE_SUCCESS || ADAPTOR_TO_BRIDGE_ERROR) {
      this.ready = true
      this.writeQueue()
    }
  }
  addResponse (resBlueprint) {
    this.pendingResponses.push(resBlueprint)

    const { requestId } = JSON.parse(resBlueprint)
    this._logger.line('verbose', 'cyan')
    this._logger.verbose(`Add response ${requestId} to Socket queue to emit`.cyan)
    this._logger.line('verbose', 'cyan')
    this.writeQueue()
  }
  writeQueue () {
    if (this.ready) {
      const resBlueprint = this.pendingResponses.shift()
      if (resBlueprint) {
        this.ready = false
        const { requestId } = JSON.parse(resBlueprint)

        this._logger.line('verbose', 'cyan')
        this._logger.verbose('Start writing'.cyan, `${requestId}`.green)
        this._logger.verbose('Blueprint length:'.cyan, `${resBlueprint.length}`.green)
        this._logger.line('verbose', 'cyan')

        this.socket.write(socketChunks.buildRequest(resBlueprint))
      }
    }
  }
}

module.exports = SocketConnection
