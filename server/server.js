const express = require('express');
const app = express();
const PORT = 8080;
const http = require('http').createServer(app);
const path = require('path');
const io = require("socket.io")(http, {
    cors: {
        origins: "`http://localhost:5173/`"
    }
});

const cors = require('cors')
app.use(cors())

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

http.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`))