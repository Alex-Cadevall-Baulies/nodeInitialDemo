const express = require('express');
const app = express();
const PORT = 8080;
const http = require('http').createServer(app);

const cors = require('cors')
app.use(cors())

//we setup our socket by passing our http and frontend port
const io = require("socket.io")(http, {
  cors: {
      origins: "`http://localhost:5173/`"
  }
});

//we require our socket middleware from where we'll fire the socket.on commands
const socketHandler = require('./socketHandler')
//set up a function to pass socket and io with hhtp server to use
const fireSocket = (socket) => {
  socketHandler(io, socket)
}
//when user connects io fires and calls for fireSocket
io.on('connection', fireSocket)

const bodyParser = require("body-parser");
const mongoose = require("mongoose")

mongoose.set("strictQuery", false);
mongoose.connect(`http://localhost:${PORT}`, () =>{
  console.log(`database connected`)
},
e => console.error(e)
)

http.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`))