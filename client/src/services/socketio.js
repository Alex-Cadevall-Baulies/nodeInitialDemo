import { io } from 'socket.io-client';

class SocketioService {
    socket;
    constructor() {}
  
    setupSocketConnection() {
      this.socket = io('http://localhost:8080');
    }

    socketMessage(msg) {
      this.socket.emit('message', msg);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
  }
  
  export default new SocketioService();