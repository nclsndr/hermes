import { createReducer, composeMutations } from '../../utils/moduleHelpers'

/* ----------------------------------------- *
        Types
* ----------------------------------------- */
const REQUEST = 'requests.REQUEST'
const ERROR = 'requests.ERROR'
const SUCCESS = 'requests.SUCCESS'

export const types = { REQUEST, SUCCESS, ERROR }

/* ----------------------------------------- *
        Reducer
* ----------------------------------------- */
const initialState = {
  isCalling: {},
  errors: {}
}

const setError = bool => (state, { payload: { requestId, error } }) => ({
  ...state,
  errors: {
    ...state.errors,
    [requestId]: bool ? { message: error && error.message } : null
  }
})

const setIsCalling = bool => (state, { payload: { requestId } }) => ({
  ...state,
  isCalling: {
    ...state.isCalling,
    [requestId]: bool
  }
})

export default createReducer(initialState, {
  [REQUEST]: composeMutations(setError(false), setIsCalling(true)),
  [SUCCESS]: composeMutations(setError(false), setIsCalling(false)),
  [ERROR]: composeMutations(setError(true), setIsCalling(false))
})
