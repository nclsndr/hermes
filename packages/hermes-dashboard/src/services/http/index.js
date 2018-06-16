/* ------------------------------------------
   HTTP factory
--------------------------------------------- */
import axios from 'axios'

import appConstants from '../../appConstants'
import { getToken } from '../auth'

export const createRequest = () => axios.create({
  baseURL: appConstants.BACKEND_API_URL,
  timeout: 3000,
  headers: {
    'Access-Control-Allow-Headers': 'Access-control-origin',
    'Access-control-origin': '*',
    'content-type': 'application/json'
  }
})

const defaultInstance = createRequest()

export const makeRequest = ({ method, url, data, isAuthRequired = false }) =>
  defaultInstance({
    method,
    url,
    data,
    headers: {
      ...isAuthRequired ? { Authorization: getToken() } : {}
    }
  })
    .then(res => res.data)
