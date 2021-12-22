const { Server } = require('socket.io');
const { server: httpServer } = require('../server');

const io = new Server(httpServer);
const shouts = [];

exports.getAll = (_req, res) => {
  res.send(shouts);
};

io.on('connection', (socket) => {
  socket.on('shout', (data, res) => {
    if (data.name && data.text) {
      shouts.push(data);
      res('ok');
      socket.broadcast.emit('update', data);
    } else {
      res('error');
    }
  });
});
