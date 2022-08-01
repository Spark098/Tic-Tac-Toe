const connectedUsers = {};


const userConnected = (userId) => {
    connectedUsers[userId] = true;
}

module.exports = {userConnected};