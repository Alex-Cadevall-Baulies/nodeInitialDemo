const express = require('express');
const app = express();
<<<<<<< HEAD
const http = require('http');
const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);

const path = require('path');
const PORT = process.env.PORT || 8080;
const cors = require('cors')

const io = require("socket.io")(server, {
    cors: {
        origin: 'http://localhost'
=======
const http = require('http').createServer(app);
const PORT = process.env.PORT || 8080;
const path = require('path');
const io = require("socket.io")(http, {
    cors: {
        origin: `http://localhost:5173/`
>>>>>>> 672c333bc2e65c01767c1dc0d39b0f5cd65ce67c
    }
});

app.use(cors())

app.get('/', (req, res) => {
    // we use this method instead of (__dirname + 'desired path) as we need to access client folder
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

io.on('connection', (socket) => {
    console.log(`a user with id ${socket.id} connected`);
<<<<<<< HEAD
});
=======
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
>>>>>>> 672c333bc2e65c01767c1dc0d39b0f5cd65ce67c

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`))