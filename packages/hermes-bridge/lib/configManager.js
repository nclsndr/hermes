/* ------------------------------------------
   Config manager
--------------------------------------------- */
const EventEmitter = require('events')

const createConfigManager = clients => {
  const emitter = new EventEmitter()
  emitter.events = {} // keep adaptorInterface consistency

  return {
    adaptorAuth: token => new Promise((resolve, reject) => {
      if (clients.adaptors.authTokens.includes(token)) {
        resolve({
          id: token,
          authToken: token,
          username: token,
          isOnline: true,
          isListening: true,
          isExclusive: false,
          connectionTime: null
        })
      } else {
        reject(new Error('Adaptor not found'))
      }
    }),
    emitter
  }
}

module.exports = createConfigManager
