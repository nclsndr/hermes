/* ------------------------------------------
   Real time resource controller
--------------------------------------------- */
const {
  emitter,
  ADAPTOR_UPDATE_LISTENING_STATE,
  ADAPTOR_UPDATE_ONLINE_STATE
} = require('../services/emitter')

const createSocketController = io => {
  io.on('connection', socket => {
    // console.log('socket : ', socket)
  })
  emitter.on(ADAPTOR_UPDATE_LISTENING_STATE, adaptor => {
    io.emit('adaptorUpdate', adaptor)
  })
  emitter.on(ADAPTOR_UPDATE_ONLINE_STATE, adaptor => {
    io.emit('adaptorUpdate', adaptor)
  })
}

module.exports = {
  createSocketController
}
