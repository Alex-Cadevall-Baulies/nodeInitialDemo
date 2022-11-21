const express = require('express');
const app = express();
const io = require("socket.io")(3000); //require + server port

io.on('connection', (socket) => {
    console.log(`user ${socket.id} connected`);
});

server.listen(3000, () => {
    console.log('listening on http://localhost:3000')
});

/*io.on('connection', (socket) => {
    console.log('user connected');
    console.log(socket.io);
    
    socket.broadcast.emit('hi')

    socket.on('chat message', (message) => {
        console.log(`message: ${message}`)
    });

    socket.on('ping', n => console.log(n))

    socket.on('disconnect', () => {
        console.log('user disconnected')
    });
});*/