/* ------------------------------------------
   Adaptors resource
--------------------------------------------- */
const Router = require('express').Router
const isBoolean = require('lodash/isBoolean')

const auth = require('../services/auth')
const lowDB = require('../services/lowDB')
const {
  emitter,
  ADAPTOR_UPDATE_LISTENING_STATE,
  ADAPTOR_BULK_UPDATE_LISTENING_STATE,
  ADAPTOR_UPDATE_EXCLUSIVE_STATE,
  ADAPTOR_UPDATE_ONLINE_STATE,
  ADAPTOR_UPDATE,
  ADAPTOR_DELETE
} = require('../services/emitter')

const createAdaptorsRouter = () => {
  const router = Router()

  router.get('/adaptors', auth.isAuthMiddleware, (req, res) => {
    const adaptors = lowDB.getAdaptors()
    res.json(adaptors)
  })

  router.post('/adaptors', auth.isAuthMiddleware, (req, res) => {
    const { body: { username, authToken } } = req
    try {
      const adaptor = lowDB.setAdaptor(username, authToken)
      res.json(adaptor)
    } catch (e) {
      if (e.message === lowDB.ERRORS.ADAPTOR_ALREADY_EXISTS) {
        res
          .status(400)
          .json({
            error: true,
            type: lowDB.ERRORS.ADAPTOR_ALREADY_EXISTS,
            message: 'Adaptor authToken already exists'
          })
      }
    }
  })

  router.post('/adaptors/bulk-listening', auth.isAuthMiddleware, (req, res) => {
    const { body: { isListening } } = req
    if (!isBoolean(isListening)) {
      res
        .status(400)
        .json({
          error: true,
          type: 'BAD_PARAMS_PROVIDED',
          message: 'Adaptor bulk update listening state requires isListening'
        })
      return
    }
    try {
      const adaptors = lowDB.bulkUpdateAdaptorListeningState(isListening)
      emitter.emit(ADAPTOR_BULK_UPDATE_LISTENING_STATE, adaptors)
      res.json(adaptors)
    } catch (e) {
      if (e.message === lowDB.ERRORS.ADAPTOR_ALREADY_EXISTS) {
        res
          .status(400)
          .json({
            error: true,
            type: lowDB.ERRORS.ADAPTOR_ALREADY_EXISTS,
            message: 'Adaptor authToken already exists'
          })
      }
    }
  })

  router.put('/adaptors', auth.isAuthMiddleware, (req, res) => {
    const { body: { id, username, authToken } } = req
    if (!id || !username || !authToken) {
      res
        .status(400)
        .json({
          error: true,
          type: 'BAD_PARAMS_PROVIDED',
          message: 'Adaptor update requires id, username and authToken'
        })
      return
    }
    try {
      const adaptor = lowDB.updateAdaptor(id, username, authToken)
      emitter.emit(ADAPTOR_UPDATE, adaptor)
      res.json(adaptor)
    } catch (e) {
      if (e.message === lowDB.ERRORS.ADAPTOR_DOES_NOT_EXISTS) {
        res
          .status(400)
          .json({
            error: true,
            type: lowDB.ERRORS.ADAPTOR_DOES_NOT_EXISTS,
            message: 'Adaptor was not found'
          })
      }
    }
  })

  router.put('/adaptors/online', auth.isAuthMiddleware, (req, res) => {
    const { body: { id, isOnline } } = req
    if (!id || !isBoolean(isOnline)) {
      res
        .status(400)
        .json({
          error: true,
          type: 'BAD_PARAMS_PROVIDED',
          message: 'Adaptor update online state requires id, isOnline'
        })
      return
    }
    try {
      const adaptor = lowDB.updateAdaptorOnlineState(id, isOnline)
      emitter.emit(ADAPTOR_UPDATE_ONLINE_STATE, adaptor)
      res.json(adaptor)
    } catch (e) {
      if (e.message === lowDB.ERRORS.ADAPTOR_DOES_NOT_EXISTS) {
        res
          .status(400)
          .json({
            error: true,
            type: lowDB.ERRORS.ADAPTOR_DOES_NOT_EXISTS,
            message: 'Adaptor was not found'
          })
      }
    }
  })

  router.put('/adaptors/listen', auth.isAuthMiddleware, (req, res) => {
    const { body: { id, isListening } } = req
    if (!id || !isBoolean(isListening)) {
      res
        .status(400)
        .json({
          error: true,
          type: 'BAD_PARAMS_PROVIDED',
          message: 'Adaptor update online state requires id, isListening'
        })
      return
    }
    try {
      const adaptor = lowDB.updateAdaptorListeningState(id, isListening)
      emitter.emit(ADAPTOR_UPDATE_LISTENING_STATE, adaptor)
      res.json(adaptor)
    } catch (e) {
      if (e.message === lowDB.ERRORS.ADAPTOR_DOES_NOT_EXISTS) {
        res
          .status(400)
          .json({
            error: true,
            type: lowDB.ERRORS.ADAPTOR_DOES_NOT_EXISTS,
            message: 'Adaptor was not found'
          })
      }
    }
  })

  router.put('/adaptors/exclusive', auth.isAuthMiddleware, (req, res) => {
    const { body: { id } } = req
    if (!id) {
      res
        .status(400)
        .json({
          error: true,
          type: 'BAD_PARAMS_PROVIDED',
          message: 'Adaptor update online state requires id'
        })
      return
    }
    try {
      const adaptor = lowDB.setExclusiveAdaptor(id)
      emitter.emit(ADAPTOR_UPDATE_EXCLUSIVE_STATE, adaptor)
      res.json(adaptor)
    } catch (e) {
      if (e.message === lowDB.ERRORS.ADAPTOR_DOES_NOT_EXISTS) {
        res
          .status(400)
          .json({
            error: true,
            type: lowDB.ERRORS.ADAPTOR_DOES_NOT_EXISTS,
            message: 'Adaptor was not found'
          })
      }
    }
  })

  router.delete('/adaptors', auth.isAuthMiddleware, (req, res) => {
    const { body: { id } } = req
    if (!id) {
      res
        .status(400)
        .json({
          error: true,
          type: 'BAD_PARAMS_PROVIDED',
          message: 'Adaptor delete requires id'
        })
      return
    }
    try {
      const delId = lowDB.deleteAdaptor(id)
      emitter.emit(ADAPTOR_DELETE, delId)
      res.json({ success: true, id: delId })
    } catch (e) {
      if (e.message === lowDB.ERRORS.ADAPTOR_DOES_NOT_EXISTS) {
        res
          .status(400)
          .json({
            error: true,
            type: lowDB.ERRORS.ADAPTOR_DOES_NOT_EXISTS,
            message: 'Adaptor was not found'
          })
      }
    }
  })

  return router
}

module.exports = createAdaptorsRouter
