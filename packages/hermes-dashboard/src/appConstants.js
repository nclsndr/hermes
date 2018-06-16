/* ------------------------------------------
   APP CONSTANTS
--------------------------------------------- */

const base = { // For all environment
}

const development = { // For development environment only
  BACKEND_API_URL: 'http://localhost:8001/api',
  BACKEND_SOCKET_URL: 'http://localhost:8001',
  BASE_URL: '/'
}
const production = { // For production environment only
  BACKEND_API_URL: '/api',
  BACKEND_SOCKET_URL: '/',
  BASE_URL: '/'
}

// Merge configuration constants based on REACT_APP_ENV
// More about env constants : https://goo.gl/r2V3sy
const appConstants = () => {
  switch (process.env.REACT_APP_STACK) {
    case 'production': {
      return Object.assign({
        env: 'production'
      }, base, production)
    }
    default: {
      return Object.assign({
        env: 'development'
      }, base, development)
    }
  }
}

export default appConstants()
