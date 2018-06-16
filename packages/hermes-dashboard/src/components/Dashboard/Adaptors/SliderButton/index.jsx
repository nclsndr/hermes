/* ------------------------------------------
   SliderButton
--------------------------------------------- */
import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

// Import constants
// Import services
// Import components

const SliderButton = ({ state, onActivate, onDeactivate }) => {
  return (
    <Main>
      <Button onClick={onDeactivate}>
        <Off />
      </Button>
      <Shuttle state={state}/>
      <Button onClick={onActivate}>
        <On />
      </Button>
    </Main>
  )
}

SliderButton.displayName = 'SliderButton'
SliderButton.propTypes = {
  state: PropTypes.string.isRequired
}

const Main = styled.div`
  margin-right: 28px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const Button = styled.button`
  display: block;
  flex-shrink: 0;
  width: 24px;
`

const Off = styled.span`
  display: block;
  margin: 0 auto;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border-color: #676767;
  border-width: 3px;
  border-style: solid;
`

const On = styled.span`
  display: block;
  margin: 0 auto;
  flex-shrink: 0;
  width: 3px;
  height: 16px;
  border-radius: 1.5px;
  background: #676767;
`

const Shuttle = styled.div`
  flex-shrink: 0;
  width: 36px;
  height: 18px;
  background: #B3B3B3;
  border-radius: 9px;
  position: relative;
  transition: all 200ms ease-in-out;
  &::after {
    content: '';
    display: block;
    position: absolute;
    background: #FFFFFF;
    box-shadow: 0 0 2px 0 rgba(0,0,0,0.11);
    height: 12px;
    width: 12px;
    left: 12px;
    top: 3px;
    border-radius: 50%;
    transition: all 200ms ease-in-out;
  }
  ${p => p.state === 'ON'
    ? css`
      background: #4FEB89;
      &::after {
        transform: translateX(9px);
      }
    `
    : null
  }
  ${p => p.state === 'OFF'
    ? css`
      background: #F45068;
      &::after {
        transform: translateX(-9px);
      }
    `
    : null
  }
`

export default SliderButton
