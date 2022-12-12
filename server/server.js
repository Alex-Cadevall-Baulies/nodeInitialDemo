const express = require('express');
const app = express();
const http = require('http').createServer(app);
const PORT = process.env.PORT || 8080;
const path = require('path');
const io = require("socket.io")(http, {
    cors: {
        origin: `http://localhost:5173/`
    }
});

app.get('/', (req, res) => {
    // we use this method instead of (__dirname + 'desired path) as we need to access client folder
    res.sendFile(path.join(__dirname, '../client/index.html'));
  });

  io.on('connection', (socket) => {
    console.log(`a user with id ${socket.id} connected`);
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

app.listen(PORT, () =>console.log(`Running on http://localhost:${PORT}`))