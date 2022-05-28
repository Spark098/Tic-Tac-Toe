const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
  res.sendFile('/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.join('groom');

  socket.on('change', attr=> {
    io.in('groom').emit('reflect',attr);
  })
});

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});