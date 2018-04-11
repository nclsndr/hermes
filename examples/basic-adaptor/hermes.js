/* ------------------------------------------
   Adaptor runner
--------------------------------------------- */
const createAdaptor = require('hermes-adaptor')

createAdaptor({
  bridgeHost: 'my-hermes-bridge-domain.com',
  bridgeSocketPort: 9000,
  localServerProtocol: 'http',
  localServerHost: 'localhost',
  localServerPort: 8888,
  maxAttempts: 10,
  attemptDelay: 200,
  auth: {
    token: 'gHmFyUkCSpGRXiWFxvLMpGYbMXvcsi',
    username: 'Nico'
  },
  verbose: true
})
