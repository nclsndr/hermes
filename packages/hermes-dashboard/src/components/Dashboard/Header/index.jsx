/* ------------------------------------------
   DashboardHeader
--------------------------------------------- */
import React from 'react'
// import PropTypes from 'prop-types'
import styled from 'styled-components'
import { color } from '../../../utils/styles'

// Import constants
// Import services
// Import components

const DashboardHeader = ({ onLogout }) => {
  return (
    <Main>
      <h1>Hermes<br/>dashboard</h1>
      <button onClick={onLogout}>Logout</button>
    </Main>
  )
}

DashboardHeader.displayName = 'DashboardHeader'
DashboardHeader.propTypes = {}

const Main = styled.div`
  background: ${color('main', 'blue')};
  height: 120px;
  position: relative;
  flex-shrink: 0;
  h1 {
    position: fixed;
    left: 1rem;
    top: 1rem;
    color: #FFF;
    font-size: 30px;
    line-height: 39px;
    font-weight: 300;
  }
  button {
    position: absolute;
    color: #FFF;
    right: 1rem;
    top: 1rem;
  }
`

export default DashboardHeader
