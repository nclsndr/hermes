/* ------------------------------------------
   Socket chunks util
--------------------------------------------- */
const isString = require('lodash/isString')
const isObject = require('lodash/isObject')

const SEPARATORS = {
  c: '•###_###•',
  cs: '•--•••--•',
  cm: '•-•••-•',
  ce: '•--•-•-•--•'
}

/**
 * Parse chunk from socket transport
 * @param chunk
 * @returns {{isStartOfRequest: boolean, isEndOfRequest: boolean, requestLength: any, requestContent: string, communication: {}}}
 */
const parse = chunk => {
  const { c, cs, cm, ce } = SEPARATORS
  const chunkMatch = new RegExp(
    `^(?:${c}(.*?)${c})?(?:${cs}(\\d*)${cm})?((?:.|\\n)*?)(${ce})?(?:${c}(.*?)${c})?$`,
    'g'
  )
  const res = chunkMatch.exec(chunk)
  return {
    isStartOfRequest: !!res[2],
    isEndOfRequest: !!res[4],
    requestLength: res[2] ? Number(res[2]) : null,
    requestContent: res[3] || null,
    communication: res[1]
      ? JSON.parse(res[1])
      : res[5]
        ? JSON.parse(res[5])
        : {}
  }
}

/**
 * Build chunk ready request for socket transport
 * @param blueprint
 * @returns {string}
 */
const buildRequest = blueprint => {
  if (!isString(blueprint)) {
    throw new TypeError('blueprint is not a string')
  }
  const { cs, cm, ce } = SEPARATORS
  return `${cs}${blueprint.length}${cm}${blueprint}${ce}`
}

/**
 * Build chunk ready internal communication for socket transport
 * @param obj
 * @returns {string}
 */
const buildCommunication = obj => {
  if (!isObject(obj)) {
    throw new TypeError('obj is not a literal object')
  }
  const { c } = SEPARATORS
  return `${c}${JSON.stringify(obj)}${c}`
}

module.exports = {
  SEPARATORS,
  parse,
  buildRequest,
  buildCommunication
}
