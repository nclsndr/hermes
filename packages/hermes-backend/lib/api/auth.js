/* ------------------------------------------
   Auth resource
--------------------------------------------- */
const Router = require('express').Router

const auth = require('../services/auth')

const createAuthRouter = adminAuth => {
  const router = Router()

  router.post('/auth/login', (req, res) => {
    const { body: { username, password } } = req
    if (username === adminAuth.username && password === adminAuth.password) {
      const token = auth.makeToken(username)
      res.json({ token })
    } else {
      res.status(401).json({
        error: true,
        type: 'AUTH_LOGIN_FAILED',
        message: 'Username or password is wrong'
      })
    }
  })
  router.get('/auth/validate', auth.isAuthMiddleware, (req, res) => {
    res.json({ success: true })
  })
  return router
}

module.exports = createAuthRouter
