const socketHandler = require('../sockets/socketHandler')

//activate jsonwebtoken
const jwt = require('jsonwebtoken')

//when user connects io checks jwt and fires and calls for fireSocket
const fireSocket = (io) => {
    io.use(function (socket, next) {
        //we grab the token sent through client (socketio.js)
        const token = socket.handshake.query.token
        //we check if it exist and, if it does we check if valid
        if (token) {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
                if (err) return next(new Error('Authentication error'));
                socket.decoded = decoded;
                next();
            });
        }
        else {
            next(new Error('Authentication error'));
        }
    }).on('connection', (socket) => {
        socketHandler(io, socket)
    })
}

module.exports = {fireSocket}