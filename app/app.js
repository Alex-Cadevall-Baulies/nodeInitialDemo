const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

app.get('/',(req, res) => {
    res.sendFile(__dirname + '/helpers/index.html')
});

io.on('connection', (socket) => {
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
});

server.listen(3000, () => {
    console.log('listening on http://localhost:3000')
});