/* ------------------------------------------
   Adaptor runner
--------------------------------------------- */
const createAdaptor = require('hermes-adaptor')

createAdaptor({
  bridgeHost: 'YOUR_SERVER_IP', // NB without http:// | if set to 0.0.0.0 in the Bridge config
  bridgeSocketPort: 9000, // the port you chose previously
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
