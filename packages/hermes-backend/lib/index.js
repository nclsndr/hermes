/* ------------------------------------------
   Hermes backend
--------------------------------------------- */
const db = require('./services/lowDB')
const createServer = require('./server')

module.exports = {
  createServer,
  db
}
