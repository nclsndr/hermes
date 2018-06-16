/* ------------------------------------------
   FromNow - Component
--------------------------------------------- */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

// Import constants
// Import services
import { timeFrom } from '../../../../../utils/time'
// Import components

class FromNow extends Component {
  static displayName = 'FromNow'
  static propTypes = {
    connectionTime: PropTypes.number.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      fromNow: timeFrom(props.connectionTime)
    }
    this.interval = null
  }
  componentDidMount() {
    this.interval = setInterval(this.refresh, 20000)
  }
  componentWillUnmount() {
    clearInterval(this.interval)
  }
  refresh = () => {
    this.setState({
      fromNow: timeFrom(this.props.connectionTime)
    })
  }
  render() {
    const { fromNow } = this.state
    return (
      <Main>{fromNow}</Main>
    )
  }
}

const Main = styled.span`
  
`

export default FromNow
