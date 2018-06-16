/* ------------------------------------------
 Auth reducer
 --------------------------------------------- */
import { createReducer, createAsyncTypes } from '../../utils/moduleHelpers'
import { setToken, getToken, deleteToken } from '../../services/auth'
import { CALL_API } from '../middlewares/createApiMiddleware'

/* ----------------------------------------- *
 Types
 * ----------------------------------------- */
const LOGIN = createAsyncTypes('auth.LOGIN')
const VALIDATE_TOKEN = createAsyncTypes('auth.VALIDATE_TOKEN')
const LOGOUT = createAsyncTypes('auth.LOGOUT')

export const types = { LOGIN, VALIDATE_TOKEN, LOGOUT }

export const requestIds = {
  login: 'login',
  validateToken: 'validateToken'
}

/* ----------------------------------------- *
 Reducer
 * ----------------------------------------- */
const initialState = {
  token: getToken(),
  isAuthenticated: false,
  isAuthenticating: false
}

const onLoginRequest = state => ({
  ...state,
  token: null,
  isAuthenticated: false,
  isAuthenticating: true
})
const onLoginSuccess = (state, { payload: { data } }) => {
  setToken(data.token)
  return {
    ...state,
    token: data.token,
    isAuthenticated: true,
    isAuthenticating: false
  }
}
const onLoginError = () => {
  deleteToken()
  return {
    token: null,
    isAuthenticated: false,
    isAuthenticating: false
  }
}
const onValidateTokenRequest = state => ({
  ...state,
  isAuthenticated: false,
  isAuthenticating: true
})
const onValidateTokenSuccess = state => ({
  ...state,
  isAuthenticated: true,
  isAuthenticating: false
})
const onValidateTokenError = () => {
  deleteToken()
  return {
    token: null,
    isAuthenticated: false,
    isAuthenticating: false
  }
}
const onLogoutRequest = () => ({
  token: null,
  isAuthenticated: false,
  isAuthenticating: false
})

export default createReducer(initialState, {
  [LOGIN.REQUEST]: onLoginRequest,
  [LOGIN.SUCCESS]: onLoginSuccess,
  [LOGIN.ERROR]: onLoginError,
  [VALIDATE_TOKEN.REQUEST]: onValidateTokenRequest,
  [VALIDATE_TOKEN.SUCCESS]: onValidateTokenSuccess,
  [VALIDATE_TOKEN.ERROR]: onValidateTokenError,
  [LOGOUT.SUCCESS]: onLogoutRequest
})

/* ----------------------------------------- *
 Actions
 * ----------------------------------------- */
export const login = (username, password) => {
  deleteToken()
  return {
    type: CALL_API,
    api: {
      requestId: requestIds.login,
      types: LOGIN,
      promise: Api => Api.login(username, password)
    }
  }
}
export const validateToken = () => {
  const token = getToken()
  if (!token) {
    return {
      type: 'NO_TOKEN_FOUND_LOCALLY'
    }
  }
  return {
    type: CALL_API,
    payload: { token },
    api: {
      requestId: requestIds.validateToken,
      types: VALIDATE_TOKEN,
      promise: Api => Api.validateToken()
    }
  }
}

export const logout = () => (dispatch, getState) => {
  const { auth: { token } } = getState()
  deleteToken()
  dispatch({
    type: LOGOUT.SUCCESS,
    payload: {
      token
    }
  })
}
