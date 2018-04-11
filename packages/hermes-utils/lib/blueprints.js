/* ------------------------------------------
   Blueprints utils
--------------------------------------------- */
const uuid = require('uuid/v4')
const isJSON = require('is-json')

const createProviderBlueprint = (url, method, headers, body, charset = 'utf-8') => {
  const requestId = uuid()
  return {
    requestId,
    body,
    url,
    method: method.toUpperCase(),
    headers: {
      ...headers,
      'hermes-bridge': `RequestId: ${requestId}`
    },
    isJSONBody: isJSON(body),
    charset // TODO manage charset
  }
}

const createLocalServerResBlueprint = (
  requestId,
  isBuffer,
  body,
  url,
  method,
  headers,
  statusCode,
  hasError = false,
  error = {}
) => ({
  requestId: requestId,
  isBuffer,
  body: isBuffer
    ? body.toString('base64')
    : body,
  url: url,
  method: method,
  headers: headers,
  statusCode: statusCode,
  hasError,
  error
})

module.exports = {
  createProviderBlueprint,
  createLocalServerResBlueprint
}
