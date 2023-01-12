import { io } from 'socket.io-client';
//const accessToken = localStorage.getItem('token')

const PORT = 8080;
const socket = io(`http://localhost:${PORT}`,
  //we send token to socket
  { query: {token: localStorage.getItem('token')}},
  { autoConnect: false })


socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket