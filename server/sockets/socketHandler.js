//socketHandler is called from server.js and is passed both io and socket
const socketHandler = (io, socket) => {
  console.log(`a user with id ${socket.id} connected`);

  
  socket.on('sendMessage', (data) => {
    // each time we receive a message from the frontend we log it into backend console
    console.log(`user ${socket.id} message: ${data.message}`);
    
    //we will now emit it to all front end users
    if (data.chatroom !== 'main') {
      io.to(data.chatroom).emit('showMessage', data)
      console.log(`user ${socket.id} joined: ${data.chatroom}`)
    } else {
      console.log('I am on main')
      io.emit('showMessage', data)
    }
  });

  socket.on('leaveRoom', (data) => {
    console.log("left: " + data.chatroom);
    socket.join(data.chatroom);
    io.emit('left', data)
  })
  
  socket.on('joinRoom', (data) => {
    console.log("joined: " + data.chatroom);
    socket.join(data.chatroom);
    io.emit('joined', data)
  })


  socket.on('disconnect', () => {
    console.log(`user with id ${socket.id} disconnected`);
  });
}

module.exports = socketHandler