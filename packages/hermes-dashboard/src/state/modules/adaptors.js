/* ------------------------------------------
 Auth reducer
 --------------------------------------------- */
import shortId from 'shortid'

import { createReducer, createAsyncTypes, flatNormalizer } from '../../utils/moduleHelpers'
import { CALL_API } from '../middlewares/createApiMiddleware'

export const defaultSchema = {
  id: null,
  username: '',
  authToken: null,
  isOnline: false,
  isListening: false,
  isExclusive: false,
  connectionTime: null
}

export const orderByUsername = arr => arr.sort((a, b) => {
  if (a.username < b.username) return -1
  if (a.username > b.username) return 1
  return 0
})

/* ----------------------------------------- *
 Types
 * ----------------------------------------- */
const GET_ALL = createAsyncTypes('adaptors.GET_ALL')
const CREATE = createAsyncTypes('adaptors.CREATE')
const UPDATE = createAsyncTypes('adaptors.UPDATE')
const SET_LISTENING = createAsyncTypes('adaptors.SET_LISTENING')
const SET_BULK_LISTENING = createAsyncTypes('adaptors.SET_BULK_LISTENING')
const SET_EXCLUSIVE = createAsyncTypes('adaptors.SET_EXCLUSIVE')
const DELETE = createAsyncTypes('adaptors.DELETE')

export const types = { GET_ALL, CREATE, UPDATE, SET_LISTENING, SET_EXCLUSIVE, DELETE }

export const requestIds = {
  getAll: 'getAll',
  create: 'create',
  update: 'update',
  setListeningState: 'setListeningState',
  setBulkListeningState: 'setBulkListeningState',
  setExclusiveState: 'setExclusiveState',
  delete: 'delete'
}

/* ----------------------------------------- *
 Reducer
 * ----------------------------------------- */
const initialState = {}

const onGetAllSuccess = (state, { payload: { data } }) => ({
  ...state,
  ...flatNormalizer(orderByUsername(data))
})

const onCreateRequest = (state, { payload: { optimistic } }) => {
  return {
    ...state,
    [optimistic.id]: optimistic
  }
}

const onCreateSuccess = (state, { payload: { data, optimistic } }) => {
  return Object
    .values(state)
    .filter(a => a.id !== optimistic.id)
    .reduce((acc, c, i, xs) => ({
      ...acc,
      [c.id]: c,
      ...i === xs.length - 1 ? { [data.id]: data } : {}
    }), {})
}

const onUpdateSuccess = (state, { payload: { data } }) => {
  return Object
    .values(state)
    .map(c => (c.id === data.id ? data : c))
    .reduce((acc, c) => ({ ...acc, [c.id]: c }), {})
}

const onDeleteSuccess = (state, { payload: { id } }) => {
  return Object
    .values(state)
    .reduce((acc, c) => ({
      ...acc,
      ...c.id !== id ? { [c.id]: c } : {}
    }), {})
}

const onSetListeningSuccess = (state, { payload: { data } }) => {
  return Object
    .values(state)
    .map(c => (data.isListening ? { ...c, isExclusive: false } : c))
    .map(c => (c.id === data.id ? data : c))
    .reduce((acc, c) => ({ ...acc, [c.id]: c }), {})
}

const onSetExclusiveSuccess = (state, { payload: { data } }) => {
  return Object
    .values(state)
    .map(c => ({
      ...c,
      ...c.id === data.id ? { isExclusive: true } : { isExclusive: false },
      isListening: false
    }))
}

const onSetBulkListeningSuccess = (state, { payload: { data } }) => {
  return {
    ...flatNormalizer(orderByUsername(data))
  }
}

export default createReducer(initialState, {
  [GET_ALL.SUCCESS]: onGetAllSuccess,
  [CREATE.REQUEST]: onCreateRequest,
  [CREATE.SUCCESS]: onCreateSuccess,
  [UPDATE.SUCCESS]: onUpdateSuccess,
  [SET_LISTENING.SUCCESS]: onSetListeningSuccess,
  [SET_EXCLUSIVE.SUCCESS]: onSetExclusiveSuccess,
  [DELETE.SUCCESS]: onDeleteSuccess,
  [SET_BULK_LISTENING.SUCCESS]: onSetBulkListeningSuccess
})

/* ----------------------------------------- *
 Actions
 * ----------------------------------------- */
export const getAllAdaptors = () => {
  return {
    type: CALL_API,
    api: {
      requestId: requestIds.getAll,
      types: GET_ALL,
      promise: Api => Api.getAdaptors()
    }
  }
}
export const createAdaptor = (username, authToken) => {
  const optimistic = {
    id: shortId.generate(),
    username,
    authToken,
    isOnline: false,
    isListening: false,
    isExclusive: false,
    connectionTime: null
  }
  return {
    type: CALL_API,
    api: {
      requestId: requestIds.create,
      types: CREATE,
      promise: Api => Api.createAdaptor(username, authToken)
    },
    payload: { optimistic }
  }
}
export const updateAdaptor = (id, username, authToken) => {
  return {
    type: CALL_API,
    api: {
      requestId: requestIds.update,
      types: UPDATE,
      promise: Api => Api.updateAdaptor(id, username, authToken)
    },
    payload: { optimistic: { id, username, authToken } }
  }
}
export const setListeningState = (id, isListening) => {
  return {
    type: CALL_API,
    api: {
      requestId: requestIds.setListeningState,
      types: SET_LISTENING,
      promise: Api => Api.updateAdaptorListeningState(id, isListening)
    }
  }
}
export const setBulkListeningState = isListening => {
  return {
    type: CALL_API,
    api: {
      requestId: requestIds.setBulkListeningState,
      types: SET_BULK_LISTENING,
      promise: Api => Api.bulkUpdateAdaptorListeningState(isListening)
    }
  }
}
export const setExclusiveState = id => {
  return {
    type: CALL_API,
    api: {
      requestId: requestIds.setExclusiveState,
      types: SET_EXCLUSIVE,
      promise: Api => Api.setExclusiveAdaptor(id)
    }
  }
}
export const deleteAdaptor = id => {
  return {
    type: CALL_API,
    api: {
      requestId: requestIds.delete,
      types: DELETE,
      promise: Api => Api.deleteAdaptor(id)
    },
    payload: { id }
  }
}
export const exposeAdaptor = adaptor => ({
  type: UPDATE.SUCCESS,
  payload: { data: adaptor }
})
