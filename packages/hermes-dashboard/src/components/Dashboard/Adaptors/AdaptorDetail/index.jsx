/* ------------------------------------------
   AdaptorDetail - Component
--------------------------------------------- */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

// Import constants
// Import services
import color from '../../../../utils/styles/color'
// Import components
import StateButton from './StateButton'
import FromNow from './FromNow'

const guessStatus = (isOnline, isListening, isExclusive) => {
  return isOnline
    ? isExclusive
      ? 'EXCLUSIVE'
      : isListening
        ? 'LISTENING'
        : 'NOT_LISTENING'
    : 'OFFLINE'
}

class AdaptorDetail extends Component {
  static displayName = 'AdaptorDetail'
  static propTypes = {
    onClose: PropTypes.func
  }
  static defaultProps = {
    onClose: () => {}
  }
  constructor(props) {
    super()
    this.state = {
      isEditable: props.isEditable || false,
      needUpdateConfirmation: false,
      needDeleteConfirmation: false,
      username: props.adaptor.username || '',
      authToken: props.adaptor.authToken || '',
      isDataValid: !props.adaptor.username || !props.adaptor.authToken
    }
  }
  onOffClick = () => {
    const { onListenChange, adaptor } = this.props
    if (adaptor.isOnline) {
      onListenChange(adaptor.id, false)
    }
  }
  onOnClick = () => {
    const { onListenChange, adaptor } = this.props
    if (adaptor.isOnline) {
      onListenChange(adaptor.id, true)
    }
  }
  onExclusiveClick = () => {
    const { onExclusive, adaptor } = this.props
    if (adaptor.isOnline) {
      onExclusive(adaptor.id)
    }
  }
  onToggleEditableClick = e => {
    this.setState(prevState => ({
      isEditable: !prevState.isEditable
    }))
  }
  onUpdateUsername = e => {
    const { value } = e.target
    this.setState(prevState => ({
      username: value,
      isDataValid: !prevState.authToken || !value
    }))
  }
  onUpdateAuthToken = e => {
    const { value } = e.target
    this.setState(prevState => ({
      authToken: value,
      isDataValid: !prevState.username || !value
    }))
  }
  onCancelClick = e => {
    this.props.onClose()
    this.setState({
      isEditable: false,
      needUpdateConfirmation: false,
      needDeleteConfirmation: false,
      username: this.props.adaptor.username,
      authToken: this.props.adaptor.authToken,
    })
  }
  onSaveClick = e => {
    const { adaptor } = this.props;
    if (!adaptor.id || !adaptor.isOnline) {
      this.onSave()
    } else {
      this.setState({
        needUpdateConfirmation: true
      })
    }
  }
  onDeleteClick = e => {
    this.setState({
      isEditable: false,
      needDeleteConfirmation: true
    })
  }
  onConfirmUpdateClick = e => {
    this.onSave()
  }
  onConfirmDeleteClick = e => {
    const { onDelete, adaptor } = this.props
    onDelete(adaptor.id)
  }

  onSave = () => {
    const { onSave, onClose, adaptor } = this.props;
    const { username, authToken } = this.state;
    if (!adaptor.id) {
      onSave(username, authToken)
      onClose()
    } else {
      onSave(adaptor.id, username, authToken)
      this.setState({
        needUpdateConfirmation: false,
        isEditable: false
      })
    }
  }

  render() {
    const {
      adaptor: {
        id,
        isOnline,
        isListening,
        isExclusive,
        connectionTime
      },
    } = this.props
    const {
      isEditable,
      needUpdateConfirmation,
      needDeleteConfirmation,
      username,
      authToken,
      isDataValid
    } = this.state
    const status = guessStatus(isOnline, isListening, isExclusive)

    return (
      <Main>
        <Top>
          <Status status={status} />
          <Information>
            {isEditable
              ? (<UsernameInput type="text" value={username} onChange={this.onUpdateUsername}/>)
              : (<Username isOnline={isOnline}>{username}</Username>)
            }
            {isOnline
              ? (
                <ConnectionStatus isOnline={isOnline}>
                  <span>
                    Online&nbsp;—&nbsp;
                  </span>
                  <FromNow connectionTime={connectionTime}/>
                </ConnectionStatus>)
              : <ConnectionStatus isOnline={isOnline}>Offline</ConnectionStatus>
            }
          </Information>
          <StateControllers>
            <StateButton
              label="OFF"
              isActive={!isListening && !isExclusive}
              isDisabled={!isOnline}
              onClick={this.onOffClick}
            />
            <StateButton
              label="ON"
              isActive={isListening && !isExclusive}
              isDisabled={!isOnline}
              onClick={this.onOnClick}
            />
            <StateButton
              label="EXCL."
              isActive={isExclusive}
              isDisabled={!isOnline}
              onClick={this.onExclusiveClick}
            />
          </StateControllers>
          {!isEditable && (
            <DisplaySettings onClick={this.onToggleEditableClick}>
              <span /><span /><span />
            </DisplaySettings>
          )}
        </Top>
        {isEditable && (
          <Editable>
            <ConfirmShuttle confirmed={needUpdateConfirmation}>
              <EditForm>
                <AuthToken>
                  <label>Authentication token</label>
                  <input
                    type="text"
                    value={authToken}
                    onChange={this.onUpdateAuthToken}
                  />
                </AuthToken>
                <FormControls>
                  <FormControlsLeft>
                    {id && (<DeleteButton onClick={this.onDeleteClick}>Delete</DeleteButton>)}
                  </FormControlsLeft>
                  <FormControlsRight>
                    <CancelButton onClick={this.onCancelClick}>cancel</CancelButton>
                    <SaveButton onClick={this.onSaveClick} disabled={isDataValid}>Save</SaveButton>
                  </FormControlsRight>
                </FormControls>
              </EditForm>
              <ConfirmBox>
                <p>
                  <span>Be careful!</span><br/>{`This action will disconnect ${username}'s adaptor`}
                </p>
                <div>
                  <CancelButton onClick={this.onCancelClick}>Cancel</CancelButton>
                  <ValidateButton onClick={this.onConfirmUpdateClick}>Go ahead</ValidateButton>
                </div>
              </ConfirmBox>
            </ConfirmShuttle>
          </Editable>
        )}
        <ConfirmDelete isDiplayed={needDeleteConfirmation}>
          <p>{`Are you sure you want to delete ${username}'s adaptor?`}</p>
          <div>
            <button onClick={this.onCancelClick}>cancel</button>
            <button onClick={this.onConfirmDeleteClick}>I'm sure!</button>
          </div>
        </ConfirmDelete>
      </Main>
    )
  }
}

const Main = styled.div`
  margin: 20px 0;
  padding: 16px;
  background: #FFF;
  box-shadow: 0 0 6px 0 rgba(113,113,113,0.07), 0 2px 7px 0 rgba(0,0,0,0.12);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
`

const Top = styled.div`
 display: flex;
 flex-direction: row;
 align-items: center;
`
const Editable = styled.div`
  margin-top: 14px;
  overflow: hidden;
  position: relative;
  height: 85px;
`
const ConfirmShuttle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transition: all 300ms ease-in-out;
  transform: ${p => p.confirmed ? 'translateY(-85px)' :  'translateY(0)'}
`

const EditForm = styled.div`
  padding-left: 20px;
`

const ConfirmBox = styled.div`
  height: 85px;
  display: flex;
  flex-direction: column;
  p {
    color: ${color('gray', 50)};
    text-align: center;
    font-weight: 300;
    padding: 0 20px;
    line-height: 1.3em;
    margin-top: 5px;
    span {
      color: ${color('gray', 50)};
    }
  }
  div {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: 0;
    margin-top: auto;
  }
`

const ValidateButton = styled.button`
  border-radius: 3px;
  font-weight: 500;
  color: ${color('main', 'blue')};
  margin-left: 30px;
`

const Status = styled.span`
  display: block;
  flex-shrink: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-shadow: 0 0 6px 0 rgba(113,113,113,0.07);
  transition: background 300ms ease-in-out;
  ${p => css`
    background: ${color('adaptor', p.status)};
  `}
`

const Information = styled.div`
  margin-left: 14px;
`

const UsernameInput = styled.input`
  display: block;
  border-bottom: 1px solid ${color('gray', 80)};
  margin-bottom: 4px;
  font-size: 18px;
  padding: 0 0 3px 0;
  width: 100%;
  font-weight: 500;
`

const Username = styled.p`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
  ${p => p.isOnline
    ? css`
      color: ${color('gray', 'base')};
      `
    : css`
      color: ${color('gray', 60)};
    `
  }
`

const ConnectionStatus = styled.p`
    font-size: 12px;
    font-weight: 300;
    ${p => p.isOnline
      ? css`
        color: ${color('gray', 'base')};
        `
      : css`
        color: ${color('gray', 70)};
      `
    }
`

const StateControllers = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 10px;
  margin-left: auto;
  position: relative;
  top: -16px;
`

const DisplaySettings = styled.button`
  position: absolute;
  right: 8px;
  top: 8px;
  width: 14px;
  span {
    display: block;
    width: 4px;
    height: 4px;
    background: ${color('gray', 60)};
    margin: 3px auto;
    border-radius: 50%;
  }
`

const AuthToken = styled.div`
  label {
    font-size: 12px;
    color: ${color('gray', 70)};
    display: block;
  }
  input {
    display: block;
    width: 100%;
    margin-top: 5px;
    padding: 5px;
    border: 1px solid ${color('gray', 90)};
    border-radius: 3px;
  }
`

const FormControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-top: 14px;
`
const FormControlsLeft = styled.div`
    
`
const FormControlsRight = styled.div`
  margin-right: 0;
  margin-left: auto;
`

const DeleteButton = styled.button`
  display: block;
  color: ${color('main', 'red')};
  font-size: 12px;
  margin-top: 10px;
`
const CancelButton = styled.button`
  display: inline-block;
  margin-right: 20px;
  color: ${color('gray', 70)};
  font-size: 12px;
`
const SaveButton = styled.button`
  display: inline-block;
  color: ${color('main', 'blue')};
  font-weight: 500;
  &:disabled {
    color: ${color('gray', 70)};
  }
`

const ConfirmDelete = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 3px;
  position: absolute;
  background: ${color('main', 'red')};
  transition: all 300ms ease-in-out;
  transition-delay: 80ms;
  ${p => p.isDiplayed
    ? css`
      opacity: 1;
      pointer-events: auto;
      transform: scale(1) translateY(0);
    `
    : css`
      opacity: 0;
      pointer-events: none;
      transform: scale(1.12) translateY(-6%);
    `
  }
  p {
    margin-top: 20px;
    text-align: center;
    color: #FFF;
    font-weight: 300;
  }
  div {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-end;
    margin-top: 14px;
    button:first-of-type {
      color: rgba(255,255,255, .6);
      font-weight: 300;
      font-size: 12px;
    }
    button:last-of-type {
      color: #FFF;
      margin-left: 30px;
      font-weight: 500;
    }
  }
`


export default AdaptorDetail
