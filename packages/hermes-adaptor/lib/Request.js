require('colors')
const EventEmitter = require('events')
const request = require('request')
const { blueprints: { createLocalServerResBlueprint } } = require('hermes-utils')

class RequestEmitter extends EventEmitter {
  static get REQUEST_ON_ERROR () {
    return 'REQUEST_ON_ERROR'
  }
  static get REQUEST_ON_SUCCESS () {
    return 'REQUEST_ON_SUCCESS'
  }
  constructor (objBlueprint, serverConfig, logger) {
    super()
    this.id = objBlueprint.requestId
    this._objBlueprint = objBlueprint
    this._serverConfig = serverConfig
    this._logger = logger
    this.send()
    this.isCalling = false

    this._logger.line('verbose', 'cyan')
    this._logger.verbose(`new Request ${this.id}`.cyan)
    this._logger.verbose(objBlueprint)
    this._logger.line('verbose', 'cyan')
  }
  send () {
    const { localServerProtocol, localServerHost, localServerPort } = this._serverConfig
    this.isCalling = true
    // TODO manage request timeout
    request(
      {
        baseUrl: `${localServerProtocol}://${localServerHost}:${localServerPort}`,
        url: this._objBlueprint.url,
        headers: this._objBlueprint.headers,
        method: this._objBlueprint.method,
        ...this._objBlueprint.method !== 'HEAD'
          ? { body: this._objBlueprint.body }
          : {}
      },
      (err, res, body) => {
        this.isCalling = false
        if (err) {
          // manage error
          this._logger.line('error', 'red')
          this._logger.error(`Request ${this.id} on error`.red)
          this._logger.error(err.message, err)
          this._logger.error('Blueprint', this._objBlueprint)
          this._logger.line('error', 'red')

          const errBlueprint = JSON.stringify(createLocalServerResBlueprint(
            this._objBlueprint.requestId,
            false,
            null,
            this._objBlueprint.url,
            this._objBlueprint.method,
            null,
            null,
            true,
            Object.assign({}, err)
          ))
          return this.emit(
            RequestEmitter.REQUEST_ON_ERROR, this._objBlueprint.requestId, errBlueprint)
        }
        const isBuffer = Buffer.isBuffer(body)
        const resBlueprint = JSON.stringify(createLocalServerResBlueprint(
          this._objBlueprint.requestId,
          isBuffer,
          body,
          this._objBlueprint.url,
          this._objBlueprint.method,
          res.headers,
          res.statusCode
        ))
        this._logger.line('verbose', 'cyan')
        this._logger.verbose(`Request ${this.id} on success`.cyan)
        this._logger.verbose(resBlueprint)
        this._logger.line('verbose', 'cyan')
        this.emit(RequestEmitter.REQUEST_ON_SUCCESS, this._objBlueprint.requestId, resBlueprint)
      }
    )
  }
}

module.exports = RequestEmitter
