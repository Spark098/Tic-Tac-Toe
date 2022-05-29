var socket = io();

const startScreen = document.getElementById('start-screen');
const newGame = document.getElementById('new-game');
const inputRoomId = document.getElementById('room-id');
const createRoomBtn = document.getElementById('create-room-btn');
const joinGame = document.getElementById('join-game');
const inputJoinId = document.getElementById('join-room-id');
const joinRoomBtn = document.getElementById('join-room-btn');
const displayError = document.getElementById('display-error');
const gameScreen = document.getElementById('game-screen');
const nextPlayer = document.getElementById('next-player');
const gameNtf = document.getElementById('game-notification');

let canChoose = false;
let playerOneConnected = false;
let playerTwoConnected = false;
let playerId = 0;
let roomId = "";
let myChoice = "";
let enemyChoice = "";


document.querySelectorAll(".cell").forEach((cell) => {

  cell.addEventListener("click", handleAnyClick);
});

createRoomBtn.addEventListener('click', () => {
  let id = inputRoomId.value;

  console.log(id);
  if (id == "") {
    displayError.style.display = 'block';
    displayError.innerHTML = "<h2>Please enter a valid room ID</h2>";
  } else {
    displayError.style.display = 'none';
    socket.emit('create-room', id);
  }
})

joinRoomBtn.addEventListener("click", function(){
  let id = inputJoinId.value;

  // errorMessage.innerHTML = "";
  displayError.style.display = "none";

  socket.emit("join-room", id);
})




socket.on("room-created", id => {
  playerId = 1;
  roomId = id;

  startScreen.style.display = "none";
  gameScreen.style.display = "block";

  nextPlayer.innerHTML='waiting for the other player to join ...'
})

socket.on("room-joined", id => {
  playerId = 2;
  roomId = id;

  playerOneConnected = true;
  playerTwoConnected = true;
  // playerJoinTheGame(1);
  // setWaitMessage(false);

  startScreen.style.display = "none";
  gameScreen.style.display = "block";
})

socket.on('reflect', attr => {
  console.log(attr);
  var sym = 'X';
  document.querySelector(`[data-cell-index="${attr}"]`).innerHTML = `<p>${sym}</p>`;
})
socket.on('clear', ()=> {
  console.log('Clearing the screen')
  nextPlayer.innerHTML='';
})

function handleAnyClick(event) {
  // const cellNumber = parseInt(event.target.getAttribute("data-cell-index"));

  // // Invalid Click or game is inactive
  // if (gameStates[cellNumber] != "" || !isGameActive) return;

  // mark the cell and validate
  // event.target.innerHTML = currentPlayer;
  // console.log(event.target.getAttribute('data-cell-index'));
  // console.log(typeof event.target.getAttribute('data-cell-index'));
  console.log('Clicked')
  
  socket.emit('make-move', event.target.getAttribute('data-cell-index'), roomId);
  // gameStates[cellNumber] = currentPlayer;
  // cellsRemaining = cellsRemaining - 1;
  // validateCell();
}

function validateCell() {
  const gameStatus = document.querySelector(".game-status");
  for (let i = 0; i < 7; i++) {
    let winningPos = winningPositions[i];
    let x = gameStates[winningPos[0]];
    let y = gameStates[winningPos[1]];
    let z = gameStates[winningPos[2]];

    if (x == "" || y == "" || z == "") continue;
    else if (x == y && y == z) {
      document.querySelector(".player").innerHTML = "";
      gameStatus.innerHTML = winningMsg();
      isGameActive = false;
      return;
    }
  }

  if (cellsRemaining == 0) {
    document.querySelector(".player").innerHTML = "";
    gameStatus.innerHTML = drawMsg();
    isGameActive = false;
    return;
  }

  // further moves can be played
  findNextPlayer();
}

function findNextPlayer() {
  currentPlayer = currentPlayer == "X" ? "O" : "X";
  document.querySelector(".player").innerHTML = playersTurn();
  return currentPlayer;
}
