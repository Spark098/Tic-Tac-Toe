const rooms = {};

const createRoom = (roomId, player1Id) => {
    rooms[roomId] = [player1Id, "", ['', '', '', '', '', '', '', '', ''], 1, true];
}

const joinRoom = (roomId, player2Id) => {
    rooms[roomId][1] = player2Id;
    rooms[roomId][4] = false;
}

const destroyRoom = (roomId) => {
    delete rooms[roomId];
}

module.exports = { rooms, createRoom, joinRoom, destroyRoom };