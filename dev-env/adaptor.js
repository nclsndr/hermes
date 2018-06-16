/* ------------------------------------------
   Adaptor runner
--------------------------------------------- */
const createAdaptor = require('../packages/hermes-adaptor/lib/index')
const config = require('./constants')

// const pickRand = arr => {
//   const int = Math.round(Math.random() * (arr.length - 1))
//   return arr[int]
// }

createAdaptor({
  bridgeHost: config.bridge.host,
  bridgeSocketPort: config.bridge.socketPort,
  localServerProtocol: config.localServer.protocol,
  localServerHost: config.localServer.host,
  localServerPort: config.localServer.port,
  maxAttempts: config.adaptor.maxAttempts,
  attemptDelay: config.adaptor.attemptDelay,
  auth: {
    token: 'MbhJ3SymD98byPs7zB6rEJRnG8NwCu'
  },
  verbose: true
})
