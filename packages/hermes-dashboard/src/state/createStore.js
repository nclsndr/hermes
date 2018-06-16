import { createStore as createReduxStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'

import rootReducer from './reducers'
import apiRequestsMiddleware from './middlewares/createApiMiddleware'
import apiRequests from '../services/httpApi'

const env = process.env.NODE_ENV

export default function createStore(history, initialState = {}) {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && env !== 'production'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose
  const storeEnhancer = composeEnhancers(
    applyMiddleware(
      thunkMiddleware,
      routerMiddleware(history),
      apiRequestsMiddleware(apiRequests)
    ))
  return createReduxStore(rootReducer, initialState, storeEnhancer)
}
