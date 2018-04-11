/* ------------------------------------------
   Hermes Bridge config
--------------------------------------------- */
const dotEnv = require('dotenv').config()
const createBridgeServer = require('hermes-bridge')

let tokens = []
if (dotEnv.parsed) {
  tokens = Object
    .entries(dotEnv.parsed)
    .filter(([k, v]) => k.includes('AUTH_TOKEN')) // eslint-disable-line no-unused-vars
    .map(([k, v]) => v) // eslint-disable-line no-unused-vars
}

createBridgeServer({
  httpPort: 8000,
  socketPort: 9000,
  loggerLevel: 'verbose',
  clients: {
    adaptors: {
      isAuthRequired: true,
      authTokens: tokens
    }
  }
})
