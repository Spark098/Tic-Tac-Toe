var socket = io();

socket.on('reflect', attr=> {
  console.log(attr);
  var sym='X';
  document.querySelector(`[data-cell-index="${attr}"]`).innerHTML=`<p>${sym}</p>`;
})

document.querySelectorAll(".cell").forEach((cell) => {
  cell.addEventListener("click", handleAnyClick);
});

function handleAnyClick(event) {
  // const cellNumber = parseInt(event.target.getAttribute("data-cell-index"));

  // // Invalid Click or game is inactive
  // if (gameStates[cellNumber] != "" || !isGameActive) return;

  // mark the cell and validate
  // event.target.innerHTML = currentPlayer;
  // console.log(event.target.getAttribute('data-cell-index'));
  // console.log(typeof event.target.getAttribute('data-cell-index'));

  socket.emit('change', event.target.getAttribute('data-cell-index'));
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
