/* ------------------------------------------
   Auth Service
--------------------------------------------- */
import {
  setItem,
  removeItem,
  getItem,
  storageKeys
} from '../localStorage'

export const setToken = token => setItem(storageKeys.authToken, token)
export const getToken = () => getItem(storageKeys.authToken)
export const deleteToken = () => removeItem(storageKeys.authToken)
