/* ------------------------------------------
   PureExample
--------------------------------------------- */
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

// Import constants
// Import services
// Import components

const PureExample = props => {
  const { test } = props
  return (
    <Main>
      <p>PureExample</p>
      <p>{test}</p>
    </Main>
  )
}

PureExample.displayName = 'PureExample'
PureExample.propTypes = {
  test: PropTypes.string.isRequired,
}

const Main = styled.div`
  display: block
`

export default PureExample
