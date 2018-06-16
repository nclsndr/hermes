import { types as requestTypes } from '../modules/requests'

/* ----------------------------------------- *
        Types
* ----------------------------------------- */
export const CALL_API = 'middleware.api.CALL'

/* ----------------------------------------- *
        Middleware
* ----------------------------------------- */
const unNest = (object, key = '') =>
  (object
    ? (Object.prototype.hasOwnProperty.call(object, key) && key !== ''
      ? object[key]
      : object)
    : {})

const createApiMiddleware = Api => ({ getState }) => next => action => {
  if (action.type !== CALL_API) return next(action)

  const { api: apiPayload, payload = {} } = action

  if (!apiPayload) {
    throw new Error(`
      You have to specify a 'api' payload property on your CALL_API action,
      example: {
        type,
        api: {
          requestId: '',
          types: ASYNC_TYPE,
          promise: Api => Api.method(),
          nestedKey: '' // Optional
        }
      }
    `)
  }

  const { types, promise, requestId, nestedKey } = apiPayload

  if (!types) {
    throw new Error(`
      You have to specify a 'types' object in your CALL_API action 'api' payload,
      example: { type, api: { types: { REQUEST, SUCCESS, ERROR } } }
    `)
  } else if (!promise) {
    throw new Error(`
      You have to specify a 'promise' property in your CALL_API action 'api' payload
      example: { type, api: { promise: Api => Api.getThings() } }
    `)
  } else if (!requestId) {
    throw new Error(`
      You have to specify a 'requestId' string property in your CALL_API action 'api' payload
      example: { type, api: { requestId: 'getThings' } }
    `)
  } else if (typeof promise !== 'function') {
    throw new TypeError(`
      Your 'promise' property should be a function
      example: { type, api: { promise: Api => Api.getThings() } }
    `)
  }

  next({
    type: requestTypes.REQUEST,
    payload: {
      requestId
    }
  })

  next({
    type: types.REQUEST,
    payload: { ...payload }
  })

  // return the promise so you can get it as returned value of dispatch(...)
  return promise(Api, getState()).then(
    response => {
      const res = next({
        type: types.SUCCESS,
        payload: { ...payload, data: unNest(response, nestedKey) }
      })

      next({
        type: requestTypes.SUCCESS,
        payload: {
          requestId
        }
      })

      return res
    },
    error => {
      const res = next({
        type: types.ERROR,
        payload: { ...payload, ...error },
        message: error.message,
        error: true
      })

      next({
        type: requestTypes.ERROR,
        payload: {
          requestId,
          error
        }
      })
      return res
    }
  )
}

export default createApiMiddleware
