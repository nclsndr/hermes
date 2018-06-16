import { combineReducers } from 'redux'

import auth from './modules/auth'
import requests from './modules/requests'
import adaptors from './modules/adaptors'

export default combineReducers({
  auth,
  adaptors,
  requests
})
