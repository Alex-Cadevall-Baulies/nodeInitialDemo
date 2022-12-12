const express = require('express');
const app = express();
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
    }
});

app.use(cors())

app.get('/', (req, res) => {
    // we use this method instead of (__dirname + 'desired path) as we need to access client folder
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

io.on('connection', (socket) => {
    console.log(`a user with id ${socket.id} connected`);
});

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`))