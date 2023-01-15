//socketHandler is called from server.js and is passed both io and socket
const socketHandler = (io, socket) => {
  console.log(`a user with id ${socket.id} connected`);

  socket.on('disconnect', () => {
    console.log(`user with id ${socket.id} disconnected`);
  });

  socket.on('sendMessage', (msg, user, room) => {
    // each time we receive a message from the frontend we log it into backend console
    console.log(`user ${socket.id} message: ${msg}`);
    //we will now emit it to all front end users
    if (room !== "") {
      io.to(room).emit('showMessage', msg, user)
      console.log(`user ${socket.id} joined: ${room}`)
    } else {
      io.emit('showMessage', msg, user)
    }
  });

  socket.on('joinRoom', (room) => {
    socket.join(room)
    console.log(`you joined ${room}`)
  })
}

module.exports = socketHandler