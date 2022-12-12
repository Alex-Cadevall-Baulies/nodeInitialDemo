const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const path = require('path');
const io = require("socket.io")({
    cors: {
        origin: `http://localhost:${PORT}`
    }
});

app.get('/', (req, res) => {
    // we use this method instead of (__dirname + 'desired path) as we need to access client folder
    res.sendFile(path.join(__dirname, '../client/index.html'));
  });

  io.on('connection', (socket) => {
    console.log(`a user with id ${socket.id} connected`);
  });

app.listen(PORT, () =>console.log(`Running on http://localhost:${PORT}`))