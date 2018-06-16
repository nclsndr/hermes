/* ------------------------------------------
   Socket.io provider
--------------------------------------------- */
const socketIO = require('socket.io')

let io

const createSocketServer = controller => server => {
  io = socketIO(server)
  controller(io)
  return io
}

const getIO = () => {
  if (!io) {
    const err = new TypeError('createGetIO is unable to find IO')
    console.error(__filename, getIO.name, err.message, err)
    throw err
  }
  return io
}

module.exports = {
  createSocketServer,
  getIO
}
