/* ------------------------------------------
   Backend event emitter
--------------------------------------------- */
const EventEmitter = require('events')

const emitter = new EventEmitter()

module.exports = {
  ADAPTOR_UPDATE_LISTENING_STATE: 'ADAPTOR_UPDATE_LISTENING_STATE',
  ADAPTOR_UPDATE_ONLINE_STATE: 'ADAPTOR_UPDATE_ONLINE_STATE',
  ADAPTOR_BULK_UPDATE_LISTENING_STATE: 'ADAPTOR_BULK_UPDATE_LISTENING_STATE',
  ADAPTOR_UPDATE_EXCLUSIVE_STATE: 'ADAPTOR_UPDATE_EXCLUSIVE_STATE',
  ADAPTOR_UPDATE: 'ADAPTOR_UPDATE',
  ADAPTOR_DELETE: 'ADAPTOR_DELETE',
  emitter
}
