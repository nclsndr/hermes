/* ------------------------------------------
   StateButton
--------------------------------------------- */
import React from 'react'
// import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import color from '../../../../../utils/styles/color'

// Import constants
// Import services
// Import components

const StateButton = ({ label, isActive, isDisabled, onClick }) => {
  return (
    <Main onClick={onClick} disabled={isDisabled}>
      <Toggleable isActive={isActive} isDisabled={isDisabled}/>
      <Label isActive={isActive} isDisabled={isDisabled}>{label}</Label>
    </Main>
  )
}

StateButton.displayName = 'StateButton'
StateButton.propTypes = {}

const Main = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 34px;
  margin: 0 10px;
`

const Toggleable = styled.span`
  display: block;
  width: 26px;
  height: 24px;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  transition: all 300ms ease-in-out;
  ${p => p.isActive && !p.isDisabled
    ? css`
      background: ${color('main', 'blue')};
      `
    : css`
      background: ${color('gray', 80)};
    `}
  ${p => p.isActive
    ? css`
      transform: translateY(0);
    `
    : css`
      transform: translateY(-8px);
    `}
`
const Label = styled.span`
  display: block;
  margin-top: 12px;
  font-size: 12px;
  font-weight: 600;
  color: ${color('gray', 80)};
  text-align: center;
  letter-spacing: .05em;
  transition: all 300ms ease-in-out;
  ${p => p.isActive && !p.isDisabled
    ? css`
      color: ${color('gray', 'base')};
    `
    : css`
      color: ${color('gray', 80)};
    `}
`

export default StateButton
