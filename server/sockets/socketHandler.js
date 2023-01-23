//socketHandler is called from server.js and is passed both io and socket
const socketHandler = (io, socket) => {

  socket.on('new-user', (data) => {
    console.log(`a user with id ${socket.id} connected`);
    socket.emit('login', {user: data, message: 'has joined'})
  })


  socket.on('sendMessage', (data) => {
    // each time we receive a message from the frontend we log it into backend console
    console.log(`user ${socket.id} message: ${data.message}`);

    //we will now emit it to all front end users
    if (data.chatroom !== 'main') {
      socket.to(data.chatroom).emit('showMessage', data)
      console.log(`user ${socket.id} joined: ${data.chatroom}`)
    } else {
      console.log('I am on main')
      socket.emit('showMessage', data)
    }
  });

  /*socket.on('leaveRoom', (data) => {
    try{
      const leaveData = {
      username: data.username,
      chatroom: data.chatroom,
      message: `left ${data.chatroom}`
    }
    console.log("left: " + leaveData.chatroom);
    io.to(leaveData.chatroom).emit('left', leaveData)
    } catch (error) {console.log(error)}
  })

  socket.on('joinRoom', (data) => {
    try {
    const joinData = {
      username: data.username,
      chatroom: data.chatroom,
      message: `joined ${data.chatroom}`
    }

    users[socket.id] = joinData.user
    console.log("joined: " + joinData.chatroom);
    socket.emit('joined', joinData)
    } catch(error) { console.log(error)}
  })*/


  socket.on('disconnect', () => {
    console.log(`user with id ${socket.id} disconnected`);
  });
}

module.exports = socketHandler