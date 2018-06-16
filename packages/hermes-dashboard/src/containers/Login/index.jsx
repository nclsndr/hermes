/* ------------------------------------------
   Login - Container
--------------------------------------------- */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Import actions
import { login } from '../../state/modules/auth'
// Import constants
// Import services
// Import components
import Login from '../../components/Login';

const mapStateToProps = ({ auth: { isAuthenticated } }) => {
  return {};
};
const bindActions = { login };
const decorator = connect(mapStateToProps, bindActions);

class LoginContainer extends Component {
  static displayName = 'LoginContainer';
  static propTypes = {};
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
  }
  onFormChange = (name, value) => {
    this.setState({
      [name]: value
    })
  }
  onFormSubmit = e => {
    e.preventDefault()
    const { username, password } = this.state
    const { login } = this.props
    login(username, password)
  }
  render () {
    return (
      <Login
        onChange={this.onFormChange}
        onSubmit={this.onFormSubmit}
        formState={this.state}
        {...this.props}
      />
    );
  }
}

export default decorator(LoginContainer);
