/* ------------------------------------------
   Hermes Bridge Test-env config
--------------------------------------------- */
const createBridgeServer = require('../packages/hermes-bridge/lib/index')
const config = require('./constants')

createBridgeServer({
  httpPort: config.bridge.httpPort,
  socketPort: config.bridge.socketPort,
  loggerLevel: 'verbose',
  clients: {
    adaptors: {
      isAuthRequired: true,
      authTokens: config.adaptor.authTokens
    }
  }
})
