const shouts = [];
const socketio = require('socket.io');
const { server } = require('../server');

const io = socketio(server);

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
