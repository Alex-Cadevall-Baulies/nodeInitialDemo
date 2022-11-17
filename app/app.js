const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app)

app.get('/',(requ, res) => {
    res.send('testing')
});

server.listen(3000, () => {
    console.log('listening on http://localhost::3000')
})