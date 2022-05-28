let isGameActive = true;
let currentPlayer = "X";
let gameStates = ["", "", "", "", "", "", "", "", ""];
let cellsRemaining = 9;
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

const winningMsg = () => `Player ${currentPlayer} has won !!`;
const drawMsg = () => "Game ended in draw  :D";
const playersTurn = () => `It's ${currentPlayer}'s turn .. `;

document.querySelectorAll(".cell").forEach((cell) => {
  cell.addEventListener("click", handleAnyClick);
});

function handleAnyClick(event) {
  const cellNumber = parseInt(event.target.getAttribute("data-cell-index"));

  // Invalid Click or game is inactive
  if (gameStates[cellNumber] != "" || !isGameActive) return;

  // mark the cell and validate
  event.target.innerHTML = currentPlayer;
  gameStates[cellNumber] = currentPlayer;
  cellsRemaining = cellsRemaining - 1;
  validateCell();
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
