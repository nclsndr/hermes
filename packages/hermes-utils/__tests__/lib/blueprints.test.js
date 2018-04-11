const blueprints = require('../../lib/blueprints')

describe(blueprints.createProviderBlueprint.name, () => {
  test('Create a provider blueprint', () => {
    // Arrange
    const url = 'url'
    const method = 'method'
    const headers = {
      header1: 'header1',
      header2: 'header2'
    }
    const body = 'body'
    const charset = 'charset'

    // Act
    const res = blueprints.createProviderBlueprint(url, method, headers, body, charset)

    // Assert
    expect(res.requestId).not.toBeNull()
    expect(res.body).toEqual(body)
    expect(res.url).toEqual(url)
    expect(res.method).toEqual(method.toUpperCase())
    expect(res.headers).toEqual({
      ...headers,
      'hermes-bridge': `RequestId: ${res.requestId}`
    })
    expect(res.charset).toEqual(charset)
  })

  describe('isJSONBody', () => {
    test('Render isJSONBody to true when we send a JSON body', () => {
      // Arrange
      const url = 'url'
      const method = 'method'
      const headers = 'headers'
      const body = '{"body": "This is an example of body"}'

      // Act
      const res = blueprints.createProviderBlueprint(url, method, headers, body)

      // Assert
      expect(res.isJSONBody).toBeTruthy()
    })

    test('Render isJSONBody to false when we send a non JSON body', () => {
      // Arrange
      const url = 'url'
      const method = 'method'
      const headers = 'headers'
      const body = 'This is an example of body'

      // Act
      const res = blueprints.createProviderBlueprint(url, method, headers, body)

      // Assert
      expect(res.isJSONBody).toBeFalsy()
    })
  })

  describe(blueprints.createLocalServerResBlueprint.name, () => {
    test('Create a local server res blueprint', () => {
      // Arrange
      const requestId = 'requestId'
      const isBuffer = false
      const body = 'This is an example of body'
      const url = 'url'
      const method = 'method'
      const headers = 'headers'
      const statusCode = 'statusCode'

      // Act
      const res = blueprints.createLocalServerResBlueprint(
        requestId,
        isBuffer,
        body,
        url,
        method,
        headers,
        statusCode
      )

      // Assert
      expect(res.requestId).toEqual(requestId)
      expect(res.isBuffer).toEqual(isBuffer)
      expect(res.body).toEqual(body)
      expect(res.url).toEqual(url)
      expect(res.method).toEqual(method)
      expect(res.headers).toEqual(headers)
      expect(res.statusCode).toEqual(statusCode)
    })

    test('Should convert buffer into base64 string', () => {
      // Arrange
      const requestId = 'requestId'
      const isBuffer = true
      const body = Buffer.from('This is an example of body')
      const url = 'url'
      const method = 'method'
      const headers = 'headers'
      const statusCode = 'statusCode'

      // Act
      const res = blueprints.createLocalServerResBlueprint(
        requestId,
        isBuffer,
        body,
        url,
        method,
        headers,
        statusCode
      )

      // Assert
      expect(typeof res.body).toBe('string')
      expect(res.body).toEqual(body.toString('base64'))
    })
  })
})
