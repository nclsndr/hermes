/* ------------------------------------------
   Dashboard - Container
--------------------------------------------- */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Import actions
import { logout } from '../../state/modules/auth'
// Import constants
// Import services
// Import components
import Dashboard from '../../components/Dashboard';

const mapStateToProps = () => {
  return {};
};
const bindActions = { logout };
const decorator = connect(mapStateToProps, bindActions);

class DashboardContainer extends Component {
  static displayName = 'DashboardContainer';
  static propTypes = {};
  render () {
    return (<Dashboard {...this.props} />);
  }
}

export default decorator(DashboardContainer);
