/* ------------------------------------------
   Auth service
--------------------------------------------- */
const jwt = require('jsonwebtoken')

const INTERNAL_KEY = 'AkthhXCEsYB7YzdV9H5bxrJN59EjSh'

const makeToken = () => {
  return jwt.sign({ INTERNAL_KEY }, global.JWT_SECRET)
}

const validateToken = token => {
  const parsed = jwt.verify(token, global.JWT_SECRET)
  if (parsed.INTERNAL_KEY !== INTERNAL_KEY) {
    throw new Error('Token is not valid')
  }
  return true
}

const pickTokenInHeaders = headers => {
  return headers.authorization || null
}

const isAuthMiddleware = (req, res, next) => {
  const token = pickTokenInHeaders(req.headers)
  try {
    validateToken(token)
    next()
  } catch (e) {
    res.status(401).json({
      error: true,
      type: 'AUTH_VALIDATE_TOKEN_FAILED',
      message: 'The provided token is not valid'
    })
  }
}

module.exports = {
  makeToken,
  validateToken,
  pickTokenInHeaders,
  isAuthMiddleware
}
