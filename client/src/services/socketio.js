import { io } from 'socket.io-client';

const PORT = 8080;
const socket = io(`http://localhost:${PORT}`,{ autoConnect: false })

socket.onAny((event, ...args) => {
  console.log(event, args);
});

  export default socket