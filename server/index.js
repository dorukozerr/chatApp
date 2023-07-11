const express = require('express')
const app = express()
const cors = require('cors')
const http = require('http')
const PORT = 4000
const { Server } = require('socket.io')

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:1234',
    methods: ['GET', 'POST']
  }
})

let users = []

io.on('connection', socket => {
  socket.on('message', data => {
    io.emit('messageResponse', data)
  })

  socket.on('typing', data => socket.broadcast.emit('typingResponse', data))

  socket.on('newUser', data => {
    users.push(data)
    io.emit('newUserResponse', users)
  })

  socket.on('disconnect', () => {
    users = users.filter(user => user.socketID !== socket.id)
    io.emit('newUserResponse', users)
    socket.disconnect()
  })
})

server.listen(PORT, () => {
  console.log(`Server started on PORT:${PORT}`)
})
