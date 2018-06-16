/* ------------------------------------------
   SocketIO to Redux connector
--------------------------------------------- */
import Socket from '../services/Socket'

import { exposeAdaptor } from './modules/adaptors'

export const subscribeToSocketEvents = () => dispatch => {
  Socket.on('adaptorUpdate', adaptor => {
    dispatch(exposeAdaptor(adaptor))
  })
}
