/* ------------------------------------------
   Server mock
--------------------------------------------- */
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

app.use((req, res) => {
  setTimeout(() => { // Mock loading response
    res.status(200).json({ fromLocal: true })
  }, 100)
})

app.listen(8888, () => {
  console.log('Local server mock running on port:', 8888)
})
