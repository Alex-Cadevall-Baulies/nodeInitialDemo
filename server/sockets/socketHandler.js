//socketHandler is called from server.js and is passed both io and socket
const socketHandler = (io, socket) => {
  console.log(`a user with id ${socket.id} connected`);

  
  socket.on('sendMessage', (msg, user, room) => {
    // each time we receive a message from the frontend we log it into backend console
    console.log(`user ${socket.id} message: ${msg}`);
    //we will now emit it to all front end users

    const data = {
      "user": user,
      "message": msg
    }

    if (room !== 'main') {
      io.to(room).emit('showMessage', `${user}: ${msg}`)
      console.log(`user ${socket.id} joined: ${room}`)
    } else {
      io.emit('showMessage', data)
    }
  });
  
  socket.on('joinRoom', (room) => {
    socket.join(room)
    console.log(`you joined ${room}`)
  })

  socket.on('disconnect', () => {
    console.log(`user with id ${socket.id} disconnected`);
  });
}

module.exports = socketHandler