//socketHandler is called from server.js and is passed both io and socket
const socketHandler = (io, socket) => {

  socket.on('new-user', (data) => {
    console.log(`the user ${data.username} with id ${socket.id} connected`);
    socket.join(data.chatroom)

    const loginData = {
      username: data.username, 
      message: 'has joined'
    }
    
    io.to(data.chatroom).emit('login', loginData)
  })


  socket.on('sendMessage', (data) => {
    // each time we receive a message from the frontend we log it into backend console
    console.log(`user ${socket.id} message: ${data.message}`);

    //we will now emit it to all front end users
      io.to(data.chatroom).emit('showMessage', data)
  });

  socket.on('leaveRoom', (data) => {
    try{
      const leaveData = {
        username: data.username,
        chatroom: data.chatroom,
        message: `has left ${data.chatroom}`
      }

    io.to(data.chatroom).emit('left', leaveData)
    socket.leave(leaveData.chatroom)
    console.log("left: " + leaveData.chatroom);
    } catch (error) {console.log(error)}
  })

  socket.on('joinRoom', (data) => {
    try {
    const joinData = {
      username: data.username,
      chatroom: data.chatroom,
      message: `has joined ${data.chatroom}`
    }
    socket.join(joinData.chatroom)
    console.log("joined: " + joinData.chatroom);
    io.to(data.chatroom).emit('joined', joinData)
    } catch(error) { console.log(error)}
  })

  socket.on('disconnect', () => {
    console.log(`user with id ${socket.id} disconnected`);
  });
}

module.exports = socketHandler