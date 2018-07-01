const {
  parse,
  buildRequest,
  buildCommunication
} = require('../../lib/socketChunks')

describe('SocketChunks util', () => {
  describe(buildRequest.name, () => {
    test('Should return valid template', () => {
      const req = JSON.stringify({ test: true })
      const res = buildRequest(req)
      expect(res).toBe('•--•••--•13•-•••-•{"test":true}•--•-•-•--•')
    })
    test('Should throw an error on invalid input', () => {
      expect(() => {
        buildRequest({ test: true })
      }).toThrowError('blueprint is not a string')
    })
  })
  describe(buildCommunication.name, () => {
    test('Should return valid template', () => {
      const res = buildCommunication({ test: true })
      expect(res).toBe('•###_###•{"test":true}•###_###•')
    })
    test('Should throw an error on invalid input', () => {
      expect(() => {
        buildCommunication('I am a string')
      }).toThrowError('obj is not a literal object')
    })
  })
  describe(parse.name, () => {
    test('Parse all', () => {
      const communicationInput = buildCommunication({ hermes: true })
      const request = buildRequest('request content')
      const {
        isStartOfRequest,
        isEndOfRequest,
        requestLength,
        requestContent,
        communication,
        error
      } = parse(`${communicationInput}${request}`)
      expect(error).toBe(false)
      expect(isStartOfRequest).toBe(true)
      expect(isEndOfRequest).toBe(true)
      expect(requestLength).toBe('request content'.length)
      expect(requestContent).toBe('request content')
      expect(communication).toEqual(expect.objectContaining({ hermes: true }))
    })
    test('Parse communication only', () => {
      const communicationInput = buildCommunication({ hermes: true })
      const {
        isStartOfRequest,
        isEndOfRequest,
        requestLength,
        requestContent,
        communication
      } = parse(`${communicationInput}`)
      expect(isStartOfRequest).toBe(false)
      expect(isEndOfRequest).toBe(false)
      expect(requestLength).toBe(null)
      expect(requestContent).toBe(null)
      expect(communication).toEqual(expect.objectContaining({ hermes: true }))
    })
    test('Parse communication and random string', () => {
      const communicationInput = buildCommunication({ hermes: true })
      const {
        isStartOfRequest,
        isEndOfRequest,
        requestLength,
        requestContent,
        communication
      } = parse(`${communicationInput}random message`)
      expect(isStartOfRequest).toBe(false)
      expect(isEndOfRequest).toBe(false)
      expect(requestLength).toBe(null)
      expect(requestContent).toBe('random message')
      expect(communication).toEqual(expect.objectContaining({ hermes: true }))
    })
    test('Parse mono-chunk request', () => {
      const request = buildRequest('request content')
      const {
        isStartOfRequest,
        isEndOfRequest,
        requestLength,
        requestContent,
        communication
      } = parse(request)
      expect(isStartOfRequest).toBe(true)
      expect(isEndOfRequest).toBe(true)
      expect(requestLength).toBe('request content'.length)
      expect(requestContent).toBe('request content')
      expect(communication).toEqual(expect.objectContaining({}))
    })
    test('Parse start of chunk request', () => {
      const request = buildRequest('request content')
      const {
        isStartOfRequest,
        isEndOfRequest,
        requestLength,
        requestContent,
        communication
      } = parse(request.slice(0, 25))
      expect(isStartOfRequest).toBe(true)
      expect(isEndOfRequest).toBe(false)
      expect(requestLength).toBe('request content'.length)
      expect(requestContent).toBe('request')
      expect(communication).toEqual(expect.objectContaining({}))
    })
    test('Parse end of chunk request', () => {
      const request = buildRequest('request content')
      const {
        isStartOfRequest,
        isEndOfRequest,
        requestLength,
        requestContent,
        communication
      } = parse(request.slice(-19))
      expect(isStartOfRequest).toBe(false)
      expect(isEndOfRequest).toBe(true)
      expect(requestLength).toBe(null)
      expect(requestContent).toBe(' content')
      expect(communication).toEqual(expect.objectContaining({}))
    })
    test('Parse middle of chunk request', () => {
      const {
        isStartOfRequest,
        isEndOfRequest,
        requestLength,
        requestContent,
        communication
      } = parse('I am a random central chunk')
      expect(isStartOfRequest).toBe(false)
      expect(isEndOfRequest).toBe(false)
      expect(requestLength).toBe(null)
      expect(requestContent).toBe('I am a random central chunk')
      expect(communication).toEqual(expect.objectContaining({}))
    })
    test('Parse middle of chunk with newline request', () => {
      const {
        isStartOfRequest,
        isEndOfRequest,
        requestLength,
        requestContent,
        communication
      } = parse('I am a random central \n chunk')
      expect(isStartOfRequest).toBe(false)
      expect(isEndOfRequest).toBe(false)
      expect(requestLength).toBe(null)
      expect(requestContent).toBe('I am a random central \n chunk')
      expect(communication).toEqual(expect.objectContaining({}))
    })
    test('Parse non-regular line break', () => {
      const content = 'one\ntwo\r\nthree\rfour'
      const request = buildRequest(content)
      const {
        isStartOfRequest,
        isEndOfRequest,
        requestLength,
        requestContent,
        error
      } = parse(request)
      expect(error).toBe(false)
      expect(isStartOfRequest).toBe(true)
      expect(isEndOfRequest).toBe(true)
      expect(requestLength).toBe(content.length)
      expect(requestContent).toBe(content)
    })
  })
})
