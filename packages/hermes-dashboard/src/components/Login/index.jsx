import React from 'react'
import styled from 'styled-components'

import { color } from '../../utils/styles'

import InputText from '../forms/InputText'
import InputSubmit from '../forms/InputSubmit'

const Login = ({ onChange, onSubmit, formState }) => {
  return (
    <Main>
      <h1>Hermes<br/>dashboard</h1>
      <Shuttle>
        <form onSubmit={onSubmit}>
          <InputText
            label={'Username'}
            type="text"
            name="username"
            onChange={onChange}
            value={formState.username}
          />
          <InputText
            label={'Password'}
            type="password"
            name="password"
            onChange={onChange}
            value={formState.password}
          />
          <InputSubmit value="Login" />
        </form>
      </Shuttle>
    </Main>
  )
}

const Main = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  background: ${color('main', 'blue')};
  display: flex;
  justify-content: center;
  align-items: center;
  h1 {
    position: fixed;
    left: 1rem;
    top: 1rem;
    color: #FFF;
    font-size: 30px;
    line-height: 39px;
    font-weight: 300;
  }
`

const Shuttle = styled.div`
  width: 320px;
  padding: 50px;
  background: ${color('main', 'blue')};
  box-shadow: 0 0 4px 0 rgba(25,78,128,0.10), 0 3px 14px 0 rgba(25,78,128,0.26);
  border-radius: 3px;
`

export default Login
