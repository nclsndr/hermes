/* ------------------------------------------
   Adaptors - Container
--------------------------------------------- */
import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// Import actions
import {
  getAllAdaptors,
  createAdaptor,
  deleteAdaptor,
  updateAdaptor,
  setListeningState,
  setExclusiveState,
  setBulkListeningState,
} from '../../state/modules/adaptors'
// Import constants
// Import services
// Import components
import Adaptors from '../../components/Dashboard/Adaptors'

const mapStateToProps = ({ adaptors }) => {
  return {
    adaptors: Object.values(adaptors)
  }
}
const bindActions = {
  getAllAdaptors,
  createAdaptor,
  deleteAdaptor,
  updateAdaptor,
  setListeningState,
  setExclusiveState,
  setBulkListeningState
}
const decorator = connect(mapStateToProps, bindActions)

class AdaptorsContainer extends Component {
  static displayName = 'AdaptorsContainer'
  static propTypes = {}
  componentDidMount() {
    this.props.getAllAdaptors()
  }
  render () {
    return (<Adaptors {...this.props} />)
  }
}

export default decorator(AdaptorsContainer)
