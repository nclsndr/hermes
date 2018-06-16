/* ------------------------------------------
   AddButton
--------------------------------------------- */
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

// Import constants
// Import services
import color from '../../utils/styles/color'
// Import components

const AddButton = ({ label, onClick }) => {
  return (
    <Main onClick={onClick}>
      <Plus />
      <Label>{label}</Label>
    </Main>
  )
}

AddButton.displayName = 'AddButton'
AddButton.propTypes = {}

const Main = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 20px auto;
`
const Plus = styled.span`
  position: relative;
  display: block;
  width: 16px;
  height: 16px;
  &::before, &::after {
    content: '';
    display: block;
    position: absolute;
    background: ${color('main', 'blue')};
    border-radius: 1px;
  }
  &::before {
    width: 2px;
    height: 16px;
    left: 7px;
  }
  &::after {
    width: 16px;
    height: 2px;
    top: 7px;
  }
`

const Label = styled.span`
  display: inline-block;
  color: ${color('main', 'blue')};
  font-size: 16px;
  margin-left: 8px;
`

export default AddButton
