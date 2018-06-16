/* ------------------------------------------
   App entry point
--------------------------------------------- */
import React from 'react'
import ReactDOM from 'react-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'

import createStore from './state/createStore'
import Layer from './containers/Layer'

import './styles/reset.css'
import './styles/global.css'

const history = createBrowserHistory()
const store = createStore(history, {})

ReactDOM.render((
  <Provider history={history} store={store}>
    <ConnectedRouter history={history}>
      <Layer history={history} />
    </ConnectedRouter>
  </Provider>),
document.getElementById('root')
)
