const rooms = {};

const createRoom = (roomId, player1Id) => {
    rooms[roomId] = [player1Id, "", ['', '', '', '', '', '', '', '', ''], 1, true];
}

const joinRoom = (roomId, player2Id) => {
    rooms[roomId][1] = player2Id;
    rooms[roomId][4]=false;
}

const exitRoom = (roomId, player) => {
    if (player === 1) {
        delete rooms[roomId];
    }
    else {
        rooms[roomId][1] = "";
    }
}

module.exports = { rooms, createRoom, joinRoom, exitRoom };