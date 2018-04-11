/* ------------------------------------------
   Clients config formatter util
--------------------------------------------- */
const isObject = require('lodash/isObject')

const clientsConfigFormatter = config => {
  if (!isObject(config)) {
    return {
      adaptors: {
        isAuthRequired: false,
        authTokens: []
      }
    }
  }
  return {
    ...config,
    adaptors: {
      isAuthRequired: false,
      authTokens: [],
      ...config.adaptors || {}
    }
  }
}

module.exports = clientsConfigFormatter
