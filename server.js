// initialize all variables
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const config = require('./config');

const app = express();
const server = http.createServer(app);

// setup express options
app.set('port', config.express.port);
app.use(bodyParser.json());
app.use(express.static(path.join(path.join(__dirname, config.express.public))));

// start the server
server.listen(app.get('port'), () => {
  // eslint-disable-next-line no-console
  console.log(`Express server listening on port ${app.get('port')}`);
});
exports.server = server;

// load all routes
const shouts = require('./routes/shouts');

app.get('/shouts', shouts.getAll);
app.get('/healthcheck', (_req, res) => res.send('OK'));
