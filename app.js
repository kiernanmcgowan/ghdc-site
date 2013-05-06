
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    shove = require('shove');

var app = express();

// set up the client code
shove.init();

// create the bundle
shove.createBundle(__dirname + '/public/javascripts/main.js', [
    __dirname + '/public/javascripts/utils/',
    __dirname + '/public/javascripts/models/',
    __dirname + '/public/javascripts/views/',
    __dirname + '/public/javascripts/templates/'
  ], function(bundle) {
    app.use(bundle);
});

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('less-middleware')({src: __dirname + '/public'}));
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(shove.middleware);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

app.get('/', routes.index);

app.get('/d3.js', function(req, res) {
  var d3Loc = require.resolve('d3');
  res.sendfile(path.dirname(d3Loc) + '/d3.js');
});

var server = http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});


// sockets away!
var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
  socket.on('model-sync', function(data, cb) {
    console.log('sync sync');
    cb(null, {list: [
          {word: 'Javascript', count: 100},
          {word: 'Javascript1', count: 80},
          {word: 'Javascript2', count: 60},
          {word: 'Javascript3', count: 40},
          {word: 'Javascript4', count: 20}
        ]});
  });
  console.log('connected');
});
