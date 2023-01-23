//socketHandler is called from server.js and is passed both io and socket
const socketHandler = (io, socket) => {

  socket.on('new-user', (data) => {
    console.log(`the user ${data} with id ${socket.id} connected`);
    io.emit('login', {username: data, message: 'has joined'})
  })


  socket.on('sendMessage', (data) => {
    // each time we receive a message from the frontend we log it into backend console
    console.log(`user ${socket.id} message: ${data.message}`);

    //we update data received because we need user to become username
    const newData = {
      username: data.user,
      chatroom: data.chatroom,
      message: data.message
    }

    //we will now emit it to all front end users
    if (newData.chatroom !== 'main') {
      io.to(data.chatroom).emit('showMessage', newData)
      console.log(`user ${socket.id} joined: ${newData.chatroom}`)
    } else {
      io.emit('showMessage', newData)
    }
  });

  socket.on('leaveRoom', (data) => {
    try{
      const leaveData = {
      username: data.username,
      chatroom: data.chatroom,
      message: `left ${data.chatroom}`
    }

    io.emit('left', leaveData)
    socket.leave(leaveData.chatroom)
    console.log("left: " + leaveData.chatroom);
    } catch (error) {console.log(error)}
  })

  socket.on('joinRoom', (data) => {
    try {
    const joinData = {
      username: data.username,
      chatroom: data.chatroom,
      message: `joined ${data.chatroom}`
    }

    socket.join(joinData.chatroom)
    console.log("joined: " + joinData.chatroom);
    io.emit('joined', joinData)
    } catch(error) { console.log(error)}
  })

  socket.on('disconnect', () => {
    console.log(`user with id ${socket.id} disconnected`);
  });
}

module.exports = socketHandler