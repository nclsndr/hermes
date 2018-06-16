/* ------------------------------------------
   Socket.io service
--------------------------------------------- */
import io from 'socket.io-client'
import appConstants from '../../appConstants'

const Socket = io(appConstants.BACKEND_SOCKET_URL)

export default Socket
