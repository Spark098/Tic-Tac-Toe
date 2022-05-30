const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 3000;

const { userConnected, connectedUsers, initializeChoices, moves, makeMove, choices } = require("./utils/users");
const { createRoom, joinRoom, exitRoom, rooms } = require("./utils/rooms");
const { pid } = require('process');

app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
  res.sendFile('/index.html');
});

io.on('connection', (socket) => {
  console.log('new user');
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
      let playerAlreadyPresent = rooms[roomId][0];
      // io.to(playerAlreadyPresent).emit('clear'); 
      io.to(playerAlreadyPresent).emit('whose-turn');
    }
  })

  socket.on('make-move', (cno, rId, pId) => {

    const gameStates = rooms[rId][2];
    const whoseTurn = rooms[rId][3];

    if (pId != whoseTurn) return;

    if (gameStates[cno] != '') return;
    else {
      gameStates[cno] = (pId == 1) ? 'X' : 'O';

      io.in(rId).emit('mark-cell', cno, pId);
    }

    validateCell(rId, cno);
  })
});


const winningPositions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function validateCell(rId, cno) {
  const gameStates = rooms[rId][2];
  for (let i = 0; i < 7; i++) {
    let winningPos = winningPositions[i];
    let x = gameStates[winningPos[0]];
    let y = gameStates[winningPos[1]];
    let z = gameStates[winningPos[2]];

    if (x == "" || y == "" || z == "") continue;
    else if (x == y && y == z) {
      
      // winning 
      let pId = x == 'X' ? 1 : 2;
      console.log('winner: '+ pId);
      let winner = rooms[rId][pId - 1];
      pId = pId == 1 ? 2 : 1;
      let loser = rooms[rId][pId - 1];
      // winning msg
      io.in(rId).emit('clear-whose-turn');
      io.to(winner).emit('game-msg', "You've won !! 🎉🎉");
      // losing msg
      io.to(loser).emit('game-msg', "You Lose");
      return;
    }
  }

  const roundDraw = gameStates.includes('');
  if (!roundDraw) {
    io.in(rId).emit('clear-whose-turn');
    io.in(rId).emit('game-is-tie');
    return;
  }

  let currentPlayer = rooms[rId][3];
  io.to(rooms[rId][currentPlayer-1]).emit('clear-whose-turn');
  currentPlayer = currentPlayer == 1 ? 2 : 1;
  rooms[rId][3] = currentPlayer;
  io.to(rooms[rId][currentPlayer-1]).emit('whose-turn');

  console.log(gameStates);
  console.log(currentPlayer);
}


server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
})