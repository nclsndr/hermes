/* ------------------------------------------
   Validate config util
--------------------------------------------- */

const validateConfig = config => {
  if (!config.adminAuth) {
    throw new Error('config.adminAuth is required')
  }
  if (!config.adminAuth.username) {
    throw new Error('config.adminAuth.username is required')
  }
  if (!config.adminAuth.password) {
    throw new Error('config.adminAuth.password is required')
  }
  if (!config.adminAuth.jwtSecret) {
    throw new Error('config.adminAuth.jwtSecret is required')
  }
  return {
    ...config,
    port: config.port || 3000
  }
}

module.exports = validateConfig
