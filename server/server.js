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

//we setup our socket by passing our http and frontend port
const io = require("socket.io")(http, {
  cors: {
      origins: process.env.FE_CONNECTION
  }
});

const {fireSocket} = require('./middleware/socketMiddleware')
fireSocket(io)

//We require database to connect to our mongodb database
require('./databaseConnection')

//router usage
app.use('/user', require('./routes/user'))
app.use('/chat', require('./routes/chat'))

http.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`))