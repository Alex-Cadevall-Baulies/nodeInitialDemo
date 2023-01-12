const express = require('express');
const app = express();
const PORT = 8080;
const http = require('http').createServer(app);
require('dotenv').config('./.env')

const cors = require('cors')
app.use(cors())

const bodyParser = require("body-parser");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//activate jsonwebtoken
const jwt = require('jsonwebtoken')

//we setup our socket by passing our http and frontend port
const io = require("socket.io")(http, {
  cors: {
      origins: "`http://localhost:5173/`"
  }
});

//we require our socket middleware from where we'll fire the socket.on commands
const socketHandler = require('./sockets/socketHandler')
//set up a function to pass socket and io with hhtp server to use
const fireSocket = (socket) => {
  socketHandler(io, socket)
}

//when user connects io checks jwt and fires and calls for fireSocket
io.use(function(socket, next){
  //we grab the token sent through client (socketio.js)
  const token = socket.handshake.query.token
  //we check if it exist and, if it does we check if valid
  if(token){
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
      if (err) return next(new Error('Authentication error'));
      socket.decoded = decoded;
      next();
    });
  }
  else {
    next(new Error('Authentication error'));
  }    
}).on('connection', fireSocket)

//We require database to connect to our mongodb database
require('./databaseConnection')

//router usage
app.use('/user', require('./routes/user'))
app.use('/chat', require('./routes/chat'))

http.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`))