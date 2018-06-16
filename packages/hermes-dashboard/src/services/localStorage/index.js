/* ------------------------------------------
   Local Storage Service
   Wrapper around the browser built-in API
--------------------------------------------- */
import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'

export const storageKeys = {
  authToken: 'hds-u'
}

export const setItem = (key, value) => {
  let computed = value
  if (isObject(value) || isArray(value)) {
    computed = JSON.stringify(value)
  }
  window.localStorage.setItem(key, computed)

  return { key: computed }
}

export const removeItem = key => window.localStorage.removeItem(key)

export const getItem = key => {
  const content = window.localStorage.getItem(key)
  try {
    return JSON.parse(content)
  } catch (e) {
    return content
  }
}
