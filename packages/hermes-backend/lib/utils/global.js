/* ------------------------------------------
   Set globals util
--------------------------------------------- */
const isArray = require('lodash/isArray')

const registerGlobals = (...args) => {
  args
    .forEach(arr => {
      if (!isArray(arr)) {
        throw new Error('Global should be set using arrays like registerGlobals([key, value], ...)')
      }
      const [k, v] = arr
      if (!k || !v) {
        throw new Error('Global should be set using arrays like registerGlobals([key, value], ...)')
      }
      if (global[k]) {
        throw new Error(`Global ${k} already set: ${global[k]}`)
      }
      global[k] = v
    })
}

module.exports = {
  registerGlobals
}
