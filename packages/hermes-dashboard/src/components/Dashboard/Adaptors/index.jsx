/* ------------------------------------------
   Adaptors - Component
--------------------------------------------- */
import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import styled, { css, keyframes } from 'styled-components'

// Import constants
// Import services
import color from '../../../utils/styles/color'
// Import components
import SliderButton from './SliderButton'
import AdaptorDetail from './AdaptorDetail'
import AddButton from '../../AddButton'

const defaultAdaptorSchema = {
  id: null,
  username: '',
  authToken: null,
  isOnline: false,
  isListening: false,
  isExclusive: false,
  connectionTime: null
}

const guessSliderButtonStatus = adaptors => {
  if (adaptors.some(c => c.isExclusive)) {
    return 'MISC'
  }
  if (adaptors.every(c => !c.isListening)) {
    return 'OFF'
  }
  if (adaptors.every(c => c.isListening)) {
    return 'ON'
  }
  return 'MISC'
}

class Adaptors extends Component {
  static displayName = 'Adaptors'
  static propTypes = {}
  constructor() {
    super()
    this.state = {
      displayNewAdaptor: false
    }
  }
  onActivate = () => {
    this.props.setBulkListeningState(true)
  }
  onDeactivate = () => {
    this.props.setBulkListeningState(false)
  }
  onAddAdaptorClick = () => {
    if (!this.state.displayNewAdaptor) {
      this.setState({
        displayNewAdaptor: true
      })
    }
  }
  onCloseNewAdaptor = () => {
    this.setState({
      displayNewAdaptor: false
    })
  }
  render() {
    const {
      adaptors,
      createAdaptor,
      deleteAdaptor,
      updateAdaptor,
      setListeningState,
      setExclusiveState
    } = this.props
    const { displayNewAdaptor } = this.state

    const onlineAdaptors = adaptors.filter(a => a.isOnline)
    const offlineAdaptors = adaptors.filter(a => !a.isOnline)
    const hasAlmostOneExclusive = onlineAdaptors.some(c => c.isExclusive)

    return (
      <Main>
        <Header>
          <Title>Adaptors</Title>
          <SliderButton
            state={guessSliderButtonStatus(onlineAdaptors)}
            onActivate={this.onActivate}
            onDeactivate={this.onDeactivate}
          />
          <Exclusive isExclusive={hasAlmostOneExclusive}>
            <i />
            <span>exclusive</span>
          </Exclusive>
        </Header>
        <AdaptorsList>
          {onlineAdaptors.map(a => (
            <AdaptorDetail
              key={a.id}
              adaptor={a}
              onDelete={deleteAdaptor}
              onSave={updateAdaptor}
              onListenChange={setListeningState}
              onExclusive={setExclusiveState}
            />)
          )}
          {displayNewAdaptor
            ? (<AdaptorDetail
              adaptor={defaultAdaptorSchema}
              onSave={createAdaptor}
              onClose={this.onCloseNewAdaptor}
              onDelete={deleteAdaptor}
              isEditable
            />)
            : (<AddButton label="New adaptor" onClick={this.onAddAdaptorClick}/>)
          }
          {offlineAdaptors.map(a => (
            <AdaptorDetail
              key={a.id}
              adaptor={a}
              onDelete={deleteAdaptor}
              onSave={updateAdaptor}
              onListenChange={setListeningState}
              onExclusive={setExclusiveState}
            />
          ))}
        </AdaptorsList>
      </Main>
    )
  }
}

const Main = styled.div`
  width: 440px;
  flex: 1;
  display: flex;
  flex-direction: column;
`

const Header = styled.header`
  display: flex;
  margin: 1.5rem 1.5rem 0 1.5rem;
  flex-direction: row;
  padding-bottom: 1rem;
  border-bottom: solid 1px ${color('gray', 80)};
  flex: 0 1 34px;
`

const Title = styled.h2`
  font-size: 18px;
  font-weight: 300;
  flex: 2;
`

const exclusiveButtonMotion = keyframes`
  0% {
    transform: scale(.8);
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(.8);
  }
`;

const Exclusive = styled.p`
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 0;
  margin-left: auto;
  i {
    position: absolute;
    display: block;
    width: 12px;
    height: 12px;
    top: 4px;
    left: 4px;
    border-radius: 50%;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
    ${p => p.isExclusive
    ? css`
      background: ${color('main', 'exclusive')};
      animation-name: ${exclusiveButtonMotion};
    `
    : css`
      background: ${color('gray', 70)};
    `
    }
  }
  span {
    display: inline-block;
    margin-left: 20px;
    position: relative;
    font-size: 12px;
    ${p => p.isExclusive
    ? css`
      color: ${color('main', 'exclusive', 0.8)};
    `
    : css`
      color: ${color('gray', 70)};
    `
    }
  }
`

const AdaptorsList = styled.div`
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 1.5rem 1rem 1.5rem;
`

export default Adaptors
