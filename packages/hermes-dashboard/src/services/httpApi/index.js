/* ------------------------------------------
   HTTP API Service
--------------------------------------------- */
import { makeRequest } from '../http'

const apiRequests = {
  login: (username, password) => {
    return makeRequest({
      method: 'post',
      url: '/auth/login',
      data: { username, password }
    })
  },
  validateToken: () => {
    return makeRequest({
      method: 'get',
      url: '/auth/validate',
      isAuthRequired: true
    })
  },
  getAdaptors: () => {
    return makeRequest({
      method: 'get',
      url: '/adaptors',
      isAuthRequired: true
    })
  },
  createAdaptor: (username, authToken) => {
    return makeRequest({
      method: 'post',
      url: '/adaptors',
      isAuthRequired: true,
      data: { username, authToken }
    })
  },
  updateAdaptor: (id, username, authToken) => {
    return makeRequest({
      method: 'put',
      url: '/adaptors',
      isAuthRequired: true,
      data: { id, username, authToken }
    })
  },
  updateAdaptorListeningState: (id, isListening) => {
    return makeRequest({
      method: 'put',
      url: '/adaptors/listen',
      isAuthRequired: true,
      data: { id, isListening }
    })
  },
  bulkUpdateAdaptorListeningState: isListening => {
    return makeRequest({
      method: 'post',
      url: '/adaptors/bulk-listening',
      isAuthRequired: true,
      data: { isListening }
    })
  },
  setExclusiveAdaptor: id => {
    return makeRequest({
      method: 'put',
      url: '/adaptors/exclusive',
      isAuthRequired: true,
      data: { id }
    })
  },
  deleteAdaptor: id => {
    return makeRequest({
      method: 'delete',
      url: '/adaptors',
      isAuthRequired: true,
      data: { id }
    })
  }
}

export default apiRequests
