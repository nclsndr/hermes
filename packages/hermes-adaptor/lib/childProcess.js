/* ------------------------------------------
   Hermes adaptor childProcess
--------------------------------------------- */
require('colors')

const RequestsQueue = require('./RequestsQueue')
const SocketConnection = require('./SocketConnection')
const createLogger = require('./utils/logger')

process.on('message', args => {
  let shouldRestart = true
  const {
    config: {
      bridgeHost,
      bridgeSocketPort,
      localServerProtocol,
      localServerHost,
      localServerPort,
      auth,
      verbose
    }
  } = args
  const logger = createLogger(verbose ? 'verbose' : 'info')
  const connection = new SocketConnection({ bridgeHost, bridgeSocketPort, auth }, logger)
  const queue = new RequestsQueue({ localServerProtocol, localServerHost, localServerPort }, logger)

  const onReceptionSuccess = reqObjBlueprint => {
    queue.add(reqObjBlueprint)
  }
  connection.on(SocketConnection.ON_BRIDGE_RECEPTION_SUCCESS, onReceptionSuccess)
  connection.on(SocketConnection.ON_BRIDGE_RECEPTION_ERROR, () => {})
  connection.on(SocketConnection.ON_CONNECTION_SUCCESS, () => {
    process.send({ connectionSuccess: true })
  })
  connection.on(SocketConnection.ON_CONNECTION_ERROR, () => {
    process.send({ connectionError: true, shouldRestart })
  })
  connection.on(SocketConnection.ON_AUTH_FAILED, () => {
    shouldRestart = false
  })
  connection.on(SocketConnection.ON_AUTH_SUCCESS, () => {
    shouldRestart = true
  })
  queue.on(RequestsQueue.ON_REQUEST_SUCCESS, (requestId, resBlueprint) => {
    connection.addResponse(resBlueprint)
  })
  const onRequestError = (requestId, errBlueprint) => {
    connection.addResponse(errBlueprint)
  }
  queue.on(RequestsQueue.ON_REQUEST_ERROR, onRequestError)
})
