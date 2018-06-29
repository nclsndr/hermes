/* ------------------------------------------
   Backend Manager
--------------------------------------------- */
const { fork } = require('child_process')
const EventEmitter = require('events')
const uuid = require('uuid/v4')
const { backendBridge } = require('hermes-utils')

const { events: {
  CP_ADAPTOR_GET_BY_AUTH_TOKEN,
  CP_ADAPTOR_UPDATE_ONLINE_STATE,
  CP_BACKEND_GET_SETTINGS,
  BE_ADAPTOR_UPDATE_LISTENING_STATE,
  // BE_ADAPTOR_UPDATE_ONLINE_STATE,
  BE_ADAPTOR_BULK_UPDATE_LISTENING_STATE,
  BE_ADAPTOR_UPDATE_EXCLUSIVE_STATE,
  BE_ADAPTOR_UPDATE,
  BE_ADAPTOR_DELETE
} } = backendBridge

const BEE = {
  ADAPTOR_UPDATE_LISTENING_STATE: 'ADAPTOR_UPDATE_LISTENING_STATE',
  ADAPTOR_UPDATE_ONLINE_STATE: 'ADAPTOR_UPDATE_ONLINE_STATE',
  ADAPTOR_BULK_UPDATE_LISTENING_STATE: 'ADAPTOR_BULK_UPDATE_LISTENING_STATE',
  ADAPTOR_UPDATE_EXCLUSIVE_STATE: 'ADAPTOR_UPDATE_EXCLUSIVE_STATE',
  ADAPTOR_UPDATE: 'ADAPTOR_UPDATE',
  ADAPTOR_DELETE: 'ADAPTOR_DELETE'
}

const backendManager = config => {
  if (!config) {
    throw new Error('Backend config not provided')
  }
  const backendEmitter = new EventEmitter()
  backendEmitter.setMaxListeners(30)
  backendEmitter.events = BEE

  const backendCP = fork(require.resolve('hermes-backend/childProcess'), [JSON.stringify(config)])
  backendCP.on('message', ({ type, payload }) => {
    switch (type) {
      case BE_ADAPTOR_UPDATE_LISTENING_STATE: {
        // payload === adaptor
        backendEmitter.emit(BEE.ADAPTOR_UPDATE_LISTENING_STATE, payload)
        break
      }
      case BE_ADAPTOR_BULK_UPDATE_LISTENING_STATE: {
        // payload === adaptors
        backendEmitter.emit(BEE.ADAPTOR_BULK_UPDATE_LISTENING_STATE, payload)
        break
      }
      case BE_ADAPTOR_UPDATE_EXCLUSIVE_STATE: {
        // payload === adaptor
        backendEmitter.emit(BEE.ADAPTOR_UPDATE_EXCLUSIVE_STATE, payload)
        break
      }
      case BE_ADAPTOR_UPDATE: {
        // payload === adaptor
        backendEmitter.emit(BEE.ADAPTOR_UPDATE, payload)
        break
      }
      case BE_ADAPTOR_DELETE: {
        // payload === adaptorId
        backendEmitter.emit(BEE.ADAPTOR_DELETE, payload)
        break
      }
      default: {
        break
      }
    }
  })

  process.on('exit', () => {
    backendCP.kill()
  })

  return {
    getAdaptorByAuthToken: token => new Promise((resolve, reject) => {
      const rId = uuid()
      const onClient = ({ id, type, payload }) => {
        if (rId === id) {
          if (type === CP_ADAPTOR_GET_BY_AUTH_TOKEN.SUCCESS) {
            resolve(payload)
          } else {
            reject(new Error('Adaptor not found'))
          }
          backendCP.removeListener('message', onClient)
        }
      }
      backendCP.on('message', onClient)
      backendCP.send({ id: rId, type: CP_ADAPTOR_GET_BY_AUTH_TOKEN.REQUEST, payload: token })
    }),
    adaptorUpdateOnlineState: (id, isOnline) => new Promise((resolve, reject) => {
      const rId = uuid()
      const onUpdate = ({ id, type, payload }) => {
        if (rId === id) {
          if (type === CP_ADAPTOR_UPDATE_ONLINE_STATE.SUCCESS) {
            resolve(payload)
          } else {
            reject(new Error('Adaptor not found'))
          }
          backendCP.removeListener('message', onUpdate)
        }
      }
      backendCP.on('message', onUpdate)
      backendCP
        .send({ id: rId, type: CP_ADAPTOR_UPDATE_ONLINE_STATE.REQUEST, payload: { id, isOnline } })
    }),
    getSettings: () => new Promise((resolve, reject) => {
      const rId = uuid()
      const onSettings = ({ id, type, payload }) => {
        if (rId === id) {
          if (type === CP_BACKEND_GET_SETTINGS.SUCCESS) {
            resolve(payload)
          } else {
            reject(new Error('Adaptor not found'))
          }
          backendCP.removeListener('message', onSettings)
        }
      }
      backendCP.on('message', onSettings)
      backendCP.send({ id: rId, type: CP_BACKEND_GET_SETTINGS.REQUEST, payload: {} })
    }),
    emitter: backendEmitter
  }
}

module.exports = backendManager
