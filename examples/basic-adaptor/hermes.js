/* ------------------------------------------
   Adaptor runner
--------------------------------------------- */
const createAdaptor = require('hermes-adaptor')

createAdaptor({
  bridgeHost: 'my-hermes-bridge-domain.com', // NB without http://
  bridgeSocketPort: 9000,
  localServerProtocol: 'http',
  localServerHost: 'localhost',
  localServerPort: 8888,
  maxAttempts: 10, // Maximum number of attempts
  attemptDelay: 200, // Delay between two attempts
  auth: {
    token: 'gHmFyUkCSpGRXiWFxvLMpGYbMXvcsi' // token used to auth on Bridge
  },
  verbose: true // logger level
})
