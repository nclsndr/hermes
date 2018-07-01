const createServer = require('./lib/server')
const db = require('./lib/services/lowDB')
const { backendBridge } = require('hermes-utils')

const {
  emitter,
  ADAPTOR_UPDATE_LISTENING_STATE,
  ADAPTOR_UPDATE_ONLINE_STATE,
  ADAPTOR_BULK_UPDATE_LISTENING_STATE,
  ADAPTOR_UPDATE_EXCLUSIVE_STATE,
  ADAPTOR_UPDATE,
  ADAPTOR_DELETE
} = require('./lib/services/emitter')

const { events: {
  CP_ADAPTOR_GET_BY_AUTH_TOKEN,
  CP_ADAPTOR_UPDATE_ONLINE_STATE,
  CP_BACKEND_GET_SETTINGS,
  BE_ADAPTOR_UPDATE_LISTENING_STATE,
  BE_ADAPTOR_BULK_UPDATE_LISTENING_STATE,
  BE_ADAPTOR_UPDATE_EXCLUSIVE_STATE,
  BE_ADAPTOR_UPDATE,
  BE_ADAPTOR_DELETE
} } = backendBridge

if (process.argv[2]) {
  createServer(JSON.parse(process.argv[2]))

  // From Backend API
  emitter.on(ADAPTOR_UPDATE_LISTENING_STATE, adaptor => {
    process.send({ type: BE_ADAPTOR_UPDATE_LISTENING_STATE, payload: adaptor })
  })
  emitter.on(ADAPTOR_BULK_UPDATE_LISTENING_STATE, adaptors => {
    process.send({ type: BE_ADAPTOR_BULK_UPDATE_LISTENING_STATE, payload: adaptors })
  })
  emitter.on(ADAPTOR_UPDATE_EXCLUSIVE_STATE, adaptor => {
    process.send({ type: BE_ADAPTOR_UPDATE_EXCLUSIVE_STATE, payload: adaptor })
  })
  emitter.on(ADAPTOR_UPDATE, adaptor => {
    process.send({ type: BE_ADAPTOR_UPDATE, payload: adaptor })
  })
  emitter.on(ADAPTOR_DELETE, adaptorId => {
    process.send({ type: BE_ADAPTOR_DELETE, payload: { id: adaptorId } })
  })

  // From Bridge process
  process.on('message', args => {
    const { id, type, payload } = args
    switch (type) {
      case CP_ADAPTOR_GET_BY_AUTH_TOKEN.REQUEST: {
        try {
          const client = db.getAdaptorByAuthToken(payload)
          if (client) {
            process.send({ id, type: CP_ADAPTOR_GET_BY_AUTH_TOKEN.SUCCESS, payload: client })
          } else {
            process.send({ id, type: CP_ADAPTOR_GET_BY_AUTH_TOKEN.FAILURE, payload: null })
          }
        } catch (e) {
          process.send({ id, type: CP_ADAPTOR_GET_BY_AUTH_TOKEN.FAILURE, payload: e.message })
        }
        break
      }
      case CP_ADAPTOR_UPDATE_ONLINE_STATE.REQUEST: {
        try {
          const adaptor = db.updateAdaptorOnlineState(payload.id, payload.isOnline)
          emitter.emit(ADAPTOR_UPDATE_ONLINE_STATE, adaptor)
          if (adaptor) {
            process.send({ id, type: CP_ADAPTOR_UPDATE_ONLINE_STATE.SUCCESS, payload: adaptor })
          } else {
            process.send({ id, type: CP_ADAPTOR_UPDATE_ONLINE_STATE.FAILURE, payload: null })
          }
        } catch (e) {
          process.send({ id, type: CP_ADAPTOR_UPDATE_ONLINE_STATE.FAILURE, payload: e.message })
        }
        break
      }
      case CP_BACKEND_GET_SETTINGS.REQUEST: {
        try {
          const settings = db.getSettings()
          if (settings) {
            process.send({ id, type: CP_BACKEND_GET_SETTINGS.SUCCESS, payload: settings })
          } else {
            process.send({ id, type: CP_BACKEND_GET_SETTINGS.FAILURE, payload: null })
          }
        } catch (e) {
          process.send({ id, type: CP_BACKEND_GET_SETTINGS.FAILURE, payload: e.message })
        }
        break
      }
    }
  })
} else {
  console.log('createServer received bad config')
  process.exit(1)
}
