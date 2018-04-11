const Request = require('./Request')
const EventEmitter = require('events')

class RequestsQueue extends EventEmitter {
  static get ON_REQUEST_SUCCESS () {
    return 'ON_REQUEST_SUCCESS'
  }
  static get ON_REQUEST_ERROR () {
    return 'ON_REQUEST_ERROR'
  }
  constructor (serverConfig, logger) {
    super()
    this._serverConfig = serverConfig
    this._logger = logger
    this.requests = new Map()
  }
  add (reqObjBlueprint) {
    this._logger.verbose(`Add blueprint ${reqObjBlueprint.requestId} to Request queue`.green)
    const request = new Request(reqObjBlueprint, this._serverConfig, this._logger)
    request.on(Request.REQUEST_ON_SUCCESS, this.onRequestSuccess.bind(this))
    request.on(Request.REQUEST_ON_ERROR, this.onRequestError.bind(this))
    this.requests.set(reqObjBlueprint.requestId, request)
  }
  onRequestSuccess (requestId, resBlueprint) {
    this.requests.delete(requestId)
    this.emit(RequestsQueue.ON_REQUEST_SUCCESS, requestId, resBlueprint)
  }
  onRequestError (requestId, errBlueprint) {
    this.requests.delete(requestId)
    this.emit(RequestsQueue.ON_REQUEST_ERROR, requestId, errBlueprint)
  }
}

module.exports = RequestsQueue
