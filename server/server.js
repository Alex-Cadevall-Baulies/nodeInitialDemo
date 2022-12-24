const express = require('express');
const app = express();
const PORT = 8080;
const http = require('http').createServer(app);
require('dotenv').config('./.env')

const cors = require('cors')
app.use(cors())

//we setup our socket by passing our http and frontend port
const io = require("socket.io")(http, {
  cors: {
      origins: "`http://localhost:5173/`"
  }
});

//we require our socket middleware from where we'll fire the socket.on commands
const socketHandler = require('./handlers/socketHandler')
//set up a function to pass socket and io with hhtp server to use
const fireSocket = (socket) => {
  socketHandler(io, socket)
}
//when user connects io fires and calls for fireSocket
io.on('connection', fireSocket)

//We require mongoose and connect database
const mongoose = require("mongoose")
mongoose.set("strictQuery", false);
//database address on .env in main folder
mongoose.connect(process.env.DATABASE_USER, {useNewUrlParser: true})
const db = mongoose.connection

db.on('error', (error) => console.log(error))
db.once('open', () => console.log(`database connected`))

const bodyParser = require("body-parser");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

http.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`))