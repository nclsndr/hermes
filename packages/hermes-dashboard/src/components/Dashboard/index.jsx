/* ------------------------------------------
   Dashboard
--------------------------------------------- */
import React from 'react'
// import PropTypes from 'prop-types'
import styled from 'styled-components'

// Import constants
// Import services
// Import components
import Header from './Header'
import AdaptorsContainer from '../../containers/Adaptors'

const Dashboard = ({ logout }) => {
  return (
    <Main>
      <Content>
        <Header onLogout={logout}/>
        <AdaptorsContainer />
      </Content>
    </Main>
  )
}

Dashboard.displayName = 'Dashboard'
Dashboard.propTypes = {}

const Main = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  overflow: hidden;
`

const Content = styled.div`
  display: flex;
  flex: 1;
  height: 100vh;
  flex-direction: column;
`

export default Dashboard
