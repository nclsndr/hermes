/* ------------------------------------------
   Mock requests
--------------------------------------------- */
const axios = require('axios')
const querystring = require('querystring')

const config = require('../constants')

const instance = axios.create({
  baseURL: `http://${config.bridge.host}:${config.bridge.httpPort}`,
  timeout: 30000,
  headers: {
    'provider': 'hermes-dev-env'
  }
});

/* ------------------------------------------
   Generic methods
--------------------------------------------- */
const headMethod = () => instance
  .head('/')
  .then(res => { console.log('getString res: ', res.status) })
  .catch(e => { console.error('getString e: ', e.message) })

const optionsMethod = () => instance
  .options('/')
  .then(res => { console.log('getMethod res: ', res.status) })
  .catch(e => { console.error('getMethod e: ', e.message) })

const getMethod = () => instance
  .get('/')
  .then(res => { console.log('getMethod res: ', res.status) })
  .catch(e => { console.error('getMethod e: ', e.message) })

const deleteMethod = () => instance
  .delete('/')
  .then(res => { console.log('deleteMethod res: ', res.status) })
  .catch(e => { console.error('deleteMethod e: ', e.message) })

/* ------------------------------------------
   String based methods
--------------------------------------------- */
const postString = () => instance
  .post('/', 'string test')
  .then(res => { console.log('postString res: ', res.status) })
  .catch(e => { console.error('postString e: ', e.message) })

const putString = () => instance
  .put('/', 'string test')
  .then(res => { console.log('putString res: ', res.status) })
  .catch(e => { console.error('putString e: ', e.message) })

const patchString = () => instance
  .patch('/', 'string test')
  .then(res => { console.log('putString res: ', res.status) })
  .catch(e => { console.error('putString e: ', e.message) })

/* ------------------------------------------
   JSON based methods
--------------------------------------------- */
const postJSON = () => instance
  .post('/', { test: 'string test' }, { headers: { 'content-type': 'application/json' } })
  .then(res => { console.log('postJSON res: ', res.status) })
  .catch(e => { console.error('postJSON e: ', e.message) })

const putJSON = () => instance
  .put('/', { test: 'string test' }, { headers: { 'content-type': 'application/json' } })
  .then(res => { console.log('putJSON res: ', res.status) })
  .catch(e => { console.error('putJSON e: ', e.message) })

const patchJSON = () => instance
  .patch('/', { test: 'string test' }, { headers: { 'content-type': 'application/json' } })
  .then(res => { console.log('putJSON res: ', res.status) })
  .catch(e => { console.error('putJSON e: ', e.message) })

/* ------------------------------------------
   URL-encoded based methods
--------------------------------------------- */
const postURLEncoded = () => instance
  .post(
    '/',
    querystring.stringify({ test: 'string test' }),
    { headers: { 'content-type': 'application/x-www-form-urlencoded' } }
  )
  .then(res => { console.log('postURLEncoded res: ', res.status) })
  .catch(e => { console.error('postURLEncoded e: ', e.message) })

const putURLEncoded = () => instance
  .put(
    '/',
    querystring.stringify({ test: 'string test' }),
    { headers: { 'content-type': 'application/x-www-form-urlencoded' } }
  )
  .then(res => { console.log('putURLEncoded res: ', res.status) })
  .catch(e => { console.error('putURLEncoded e: ', e.message) })

const patchURLEncoded = () => instance
  .put(
    '/',
    querystring.stringify({ test: 'string test' }),
    { headers: { 'content-type': 'application/x-www-form-urlencoded' } }
  )
  .then(res => { console.log('putURLEncoded res: ', res.status) })
  .catch(e => { console.error('putURLEncoded e: ', e.message) })

module.exports = {
  headMethod,
  optionsMethod,
  getMethod,
  deleteMethod,
  postString,
  putString,
  patchString,
  postJSON,
  putJSON,
  patchJSON,
  postURLEncoded,
  putURLEncoded,
  patchURLEncoded,
}
