/* ------------------------------------------
   InputText
--------------------------------------------- */
import React from 'react'
// import PropTypes from 'prop-types'
import styled from 'styled-components'
import shortid from 'shortid'

const InputText = ({ name, value, onChange, label, placeholder = '', type = 'text' }) => {
  const id = shortid.generate()
  const synthetic = e => {
    onChange(name, e.target.value)
  }
  return (
    <Wrapper>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        name={name}
        onChange={synthetic}
        placeholder={placeholder}
      />
    </Wrapper>
  )
}

InputText.displayName = 'InputText'
InputText.propTypes = {}

const Wrapper = styled.div`
  margin-bottom: 1rem;
  width: 100%;
`
const Label = styled.label`
  color: #FFF;
  display: block;
  margin-bottom: .5rem;
  font-size: 16px;
`
const Input = styled.input`
  display: block;
  width: 100%;
  background: #FFF;
  border-radius: 3px;
  padding: .5rem .8rem;
  font-size: 16px;
`

export default InputText
