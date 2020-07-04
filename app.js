const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3000
var socket = require('socket.io')
const server = app.listen(PORT, () => console.log(`connected at ${PORT}`))
const io = socket(server)




app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat', (data) => {
    io.sockets.emit('chat', (data))
  });
  socket.on('userTyping', (name) => {

    io.sockets.emit('userTyping', (name))
  });
  socket.on('doneTyping', () => {

    io.sockets.emit('doneTyping')
  });
});


