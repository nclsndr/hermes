/* ------------------------------------------
   Test series
--------------------------------------------- */
const async = require('async')

const requests = require('./provider/requests')

const { queue } = async
const delay = (delay = 1000) => () => new Promise(resolve => {
  setTimeout(() => {
    console.log(`after delay: ${delay}ms`)
    resolve()
  }, delay)
})

const delayedFunctions = Object
  .values(requests)
  .reduce((acc, c) => ([
    ...acc,
    c,
    delay(500)
  ]), [])

const q = queue((task, callback) => {
  task()
    .then(r => callback(null, r))
    .catch(err => callback(err))
}, 1)

q.drain = () => {
  console.log('all items have been processed')
}

delayedFunctions
  .forEach(f => {
    q.push(f)
  })
