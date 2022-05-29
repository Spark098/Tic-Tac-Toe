const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 3000;

const { userConnected, connectedUsers, initializeChoices, moves, makeMove, choices } = require("./utils/users");
const { createRoom, joinRoom, exitRoom, rooms } = require("./utils/rooms");

app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
  res.sendFile('/index.html');
});

io.on('connection', (socket) => {
  console.log('new user');
  // console.log(socket.id + ' ' + socket.client.id)
  socket.on("create-room", (roomId) => {
    if (rooms[roomId]) {
      socket.emit("display-error", "This room already exists !!");
    } else {
      userConnected(socket.id);
      createRoom(roomId, socket.id);
      playerOneConnected = true;
      socket.emit("room-created", roomId);
      // socket.emit("player-1-connected");
      socket.join(roomId);
    }
  })


  socket.on("join-room", roomId => {
    if (!rooms[roomId]) {
      socket.emit("display-error", "This room doesn't exist !!!");
    } else {
      userConnected(socket.id);
      joinRoom(roomId, socket.id);
      socket.join(roomId);

      socket.emit("room-joined", roomId);
      // socket.emit("player-2-connected");
      // socket.broadcast.to(roomId).emit("player-2-connected");
      // initializeChoices(roomId);
      let other = rooms[roomId][0];
      console.log(other);
      io.to(other).emit('clear');
    }
  })

  socket.on('make-move', (cno, rId) => {

    const gameStates = rooms[rId][2];
    // console.log(gameStates);

    if (gameStates[cno] != '') return;
    else
      io.in(rId).emit('reflect', cno);
  })
});

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
})