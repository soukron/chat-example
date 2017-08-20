var random_name = require('node-random-name');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

// set render engine
app.engine('html', require('ejs').renderFile);

// offer static files under public/
app.use(express.static(__dirname + '/public'));

// health check
app.get('/health', function(req, res) {
  res.sendStatus(200);
});

// Send index
app.get('/', function(req, res){
  res.render(__dirname + '/index.html', 
    { 
      backend: process.env.BACKEND_URL || '/',
      btncolor: process.env.BCOLOR || 'rgb(130, 224, 255)',
      servername: process.env.HOSTNAME
    }
  );
});

// Create sockets
io.on('connection', function(socket){
  var nickname = random_name();

  console.log('>> ' + nickname + ' has joined');
  socket.broadcast.emit('chat message', '>> ' + nickname + ' has joined');
  socket.emit('chat message', '>> Welcome, your name is ' + nickname);

  socket.on('chat message', function(msg){
    console.log(nickname + ' ' + msg);
    socket.broadcast.emit('chat message', nickname + ' ' + msg);
    socket.emit('chat message', 'Me ' + msg);
  });

  socket.on('disconnect', function() {
    console.log('>> ' + nickname + ' has left!');
    socket.broadcast.emit('chat message', '>> ' + nickname + ' has left!');
  });
});

// Startup server
http.listen(port, function(){
  console.log('listening on *:' + port);
});
