const express = require('express')
const bodyParser = require('body-parser')

const { localServer } = require('../constants')

const app = express()

app.use(bodyParser.json({
  limit: '30mb'
}))

app.use((req, res) => {
  console.log('Request on', req.url)
  setTimeout(() => {
    res.status(200).json({ fromLocal: true })
  }, 100)
})

app.listen(localServer.port, () => {
  console.log('Local server mock running on port:', localServer.port)
})
