/* ------------------------------------------
   Hermes backend dev env
--------------------------------------------- */
const { createServer } = require('../packages/hermes-backend/lib')

createServer({
  port: 8001,
  adminAuth: {
    username: 'admin',
    password: 'admin',
    jwtSecret: 'jiReKLKbTVA2qnjHun8ma2hgDcApuZ'
  }
})
