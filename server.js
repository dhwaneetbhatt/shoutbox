// initialize all variables
var express = require('express'),
bodyParser = require('body-parser'),
    config = require('./config'),
    path = require('path'),
    app = express(),
    server = require('http').createServer(app);

// setup express options
app.set('port', config.express.port);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname + config.express.public)));

// start the server
server.listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});
exports.server = server;

// load all routes
var shouts = require('./routes/shouts');
app.get('/shouts', shouts.getAll);