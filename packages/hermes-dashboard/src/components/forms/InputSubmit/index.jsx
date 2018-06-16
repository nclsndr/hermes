/* ------------------------------------------
   InputSubmit
--------------------------------------------- */
import React from 'react'
// import PropTypes from 'prop-types'
import styled from 'styled-components'

const InputSubmit = ({ value, onClick = () => {} }) => {
  return (
    <Button type="submit" value={value} onClick={onClick} />
  )
}

InputSubmit.displayName = 'InputSubmit'
InputSubmit.propTypes = {}

const Button = styled.input`
  display: block;
  background: transparent;
  color: #FFF;
  text-align:center;
  width: 100%;
  font-size: 18px;
  margin-top: 2rem;
  cursor: pointer;
`

export default InputSubmit
