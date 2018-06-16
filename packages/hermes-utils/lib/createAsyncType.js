/* ------------------------------------------
   Create async request type flag
--------------------------------------------- */
module.exports = type => ({
  REQUEST: `${type}.REQUEST`,
  SUCCESS: `${type}.SUCCESS`,
  FAILURE: `${type}.FAILURE`
})
