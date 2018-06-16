import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Router,
  Switch,
  Route
} from 'react-router-dom'

import appConstants from '../../appConstants'

import { validateToken } from '../../state/modules/auth'
import { subscribeToSocketEvents } from '../../state/socket'

import Login from '../../containers/Login'
import Dashboard from '../../containers/Dashboard'

const mapStateToProps = ({ auth: { isAuthenticated } }) => {
  return {
    isAuthenticated
  }
}
const bindActions = { validateToken, subscribeToSocketEvents }
const decorator = connect(mapStateToProps, bindActions)

class Layer extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    validateToken: PropTypes.func.isRequired,
    subscribeToSocketEvents: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    const { validateToken, subscribeToSocketEvents } = this.props
    validateToken()
    subscribeToSocketEvents()
  }

  render () {
    const { history, isAuthenticated } = this.props
    const authenticatedRender = (
      <Switch>
       <Route path={appConstants.BASE_URL} exact component={Dashboard} />
      </Switch>
    )
    return (
      <Router history={history}>
        {isAuthenticated
          ? authenticatedRender
          : (<Login/>)
        }
      </Router>
    )
  }
}

export default decorator(Layer)