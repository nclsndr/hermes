/* ------------------------------------------
   Low DB service
--------------------------------------------- */
const path = require('path')
const fs = require('fs')
const low = require('lowdb')
const shortId = require('shortid')
const FileSync = require('lowdb/adapters/FileSync')

const DB_FILE_PATH = path.resolve(__dirname, '..', '..', 'data', 'db.json')

const ERRORS = {
  ADAPTOR_ALREADY_EXISTS: 'ADAPTOR_ALREADY_EXISTS',
  ADAPTOR_DOES_NOT_EXISTS: 'ADAPTOR_DOES_NOT_EXISTS'
}

// Create db file if not exits!
if (!fs.existsSync(DB_FILE_PATH)) {
  fs.writeFileSync(DB_FILE_PATH, '')
}
const adapter = new FileSync(DB_FILE_PATH)
const db = low(adapter)
db.defaults({ adaptors: [], servers: [], settings: {} }).write()

/* ------------------------------------------
   Adaptors
--------------------------------------------- */
const defaultAdaptor = {
  id: null,
  username: '',
  authToken: null,
  isOnline: false,
  isListening: true,
  isExclusive: false,
  connectionTime: null
}

const getAdaptors = () => db
  .get('adaptors')
  .value()

const getAdaptorByAuthToken = authToken => db
  .get('adaptors')
  .find({ authToken })
  .value()

const isAuthTokenExists = authToken => !!db
  .get('adaptors')
  .find({ authToken })
  .value()

const isAdaptorExists = id => !!db
  .get('adaptors')
  .find({ id })
  .value()

const setAdaptor = (username, authToken) => {
  if (isAuthTokenExists(authToken)) {
    throw new Error(ERRORS.ADAPTOR_ALREADY_EXISTS)
  }
  const newAdaptor = { ...defaultAdaptor, id: shortId.generate(), username, authToken }
  db.get('adaptors').push(newAdaptor).write()
  return newAdaptor
}

const updateAdaptor = (id, username, authToken) => {
  if (!isAdaptorExists(id)) {
    throw new Error(ERRORS.ADAPTOR_DOES_NOT_EXISTS)
  }
  return db
    .get('adaptors')
    .find({ id })
    .assign({ username, authToken, isOnline: false, isListening: false, isExclusive: false })
    .write()
}

const updateAdaptorOnlineState = (id, isOnline) => {
  if (!isAdaptorExists(id)) {
    throw new Error(ERRORS.ADAPTOR_DOES_NOT_EXISTS)
  }
  return db
    .get('adaptors')
    .find({ id })
    .assign({
      isOnline,
      isListening: false,
      isExclusive: false,
      connectionTime: isOnline ? Date.now() : null
    })
    .write()
}

const bulkUpdateAdaptorListeningState = isListening => {
  const adaptors = db.get('adaptors').value()
  const updated = adaptors
    .map(a => ({
      ...a,
      ...a.isOnline ? { isExclusive: false, isListening } : {}
    }))
  db.set('adaptors', updated).write()
  return updated
}

const updateAdaptorListeningState = (id, isListening) => {
  if (!isAdaptorExists(id)) {
    throw new Error(ERRORS.ADAPTOR_DOES_NOT_EXISTS)
  }
  const adaptors = db.get('adaptors').value()
  db
    .set(
      'adaptors',
      adaptors
        .map(a => ({
          ...a,
          isExclusive: false,
          ...a.id === id ? { isListening } : {}
        }))
    )
    .write()

  return db
    .get('adaptors')
    .find({ id })
    .value()
}

const setExclusiveAdaptor = id => {
  if (!isAdaptorExists(id)) {
    throw new Error(ERRORS.ADAPTOR_DOES_NOT_EXISTS)
  }
  const adaptors = db.get('adaptors').value()
  db
    .set(
      'adaptors',
      adaptors
        .map(a => ({
          ...a,
          isListening: false,
          isExclusive: a.id === id
        }))
    )
    .write()

  return db
    .get('adaptors')
    .find({ id })
    .value()
}

const deleteAdaptor = id => {
  if (!isAdaptorExists(id)) {
    throw new Error(ERRORS.ADAPTOR_DOES_NOT_EXISTS)
  }
  db
    .get('adaptors')
    .remove({ id })
    .write()
  return id
}

/* ------------------------------------------
   Settings
--------------------------------------------- */
const setSettings = settings => db
  .set('settings', settings)
  .write()

const getSettings = () => db
  .get('settings')
  .value()

module.exports = {
  getAdaptors,
  getAdaptorByAuthToken,
  setAdaptor,
  updateAdaptor,
  updateAdaptorOnlineState,
  bulkUpdateAdaptorListeningState,
  updateAdaptorListeningState,
  setExclusiveAdaptor,
  deleteAdaptor,
  isAuthTokenExists,
  setSettings,
  getSettings,
  ERRORS
}
