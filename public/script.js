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

  if (id == "") {
    displayError.style.display = 'block';
    displayError.innerHTML = "<h2>Please enter a valid room ID</h2>";
  } else {
    displayError.style.display = 'none';
    socket.emit('create-room', id);
  }
})

joinRoomBtn.addEventListener("click", function () {
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

  nextPlayer.innerHTML = 'waiting for the other player to join ...'
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

socket.on('mark-cell', (cno, pId) => {
  var sym = pId == 1 ? 'X' : 'O';
  document.querySelector(`[data-cell-index="${cno}"]`).innerHTML = `<p>${sym}</p>`;
})
// socket.on('clear', () => {
//   console.log('Clearing the screen');


// })
socket.on('game-msg', msg => {
  gameNtf.innerHTML = msg;
})
socket.on('game-is-tie', () => {
  gameNtf.innerHTML = 'The game is tie !!';
})
socket.on('display-error', msg => {
  displayError.style.display = 'block';
  displayError.innerHTML = `<h2>${msg}</h2>`;
})
socket.on('whose-turn', () => {
  nextPlayer.innerHTML = "It's your turn";
})
socket.on('clear-whose-turn', () => {
  nextPlayer.innerHTML = "";
})
function handleAnyClick(event) {
  console.log('Clicked')
  socket.emit('make-move', event.target.getAttribute('data-cell-index'), roomId, playerId);
}

