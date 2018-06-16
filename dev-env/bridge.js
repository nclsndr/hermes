/* ------------------------------------------
   Hermes Bridge Test-env config
--------------------------------------------- */
const createBridgeServer = require('../packages/hermes-bridge/lib/index')
const config = require('./constants')

createBridgeServer({
  httpPort: config.bridge.httpPort,
  socketPort: config.bridge.socketPort,
  loggerLevel: 'verbose',
  // clients: { // TODO @Nico : prepare dashboardless version
  //   adaptors: {
  //     authTokens: config.adaptor.authTokens
  //   }
  // },
  dashboard: {
    port: config.backend.port,
    adminAuth: {
      username: 'admin',
      password: 'admin',
      jwtSecret: 'jiReKLKbTVA2qnjHun8ma2hgDcApuZ'
    }
  }
})
