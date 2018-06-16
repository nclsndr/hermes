/* ------------------------------------------
   Example - Component
--------------------------------------------- */
import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import styled from 'styled-components'

// Import constants
// Import services
// Import components

class Example extends Component {
  static displayName = 'Example'
  static propTypes = {}
  constructor() {
    super()
  }
  render() {
    return (
      <Main>
        <p>Example</p>
      </Main>
    )
  }
}

const Main = styled.div`
  display: block;
`

export default Example
