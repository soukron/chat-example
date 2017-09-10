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
    { btncolor: process.env.BCOLOR || 'rgb(130, 224, 255)',
      servername: process.env.HOSTNAME
    }
  );
});

// Create sockets
io.on('connection', function(socket){
  console.log('Client connected');
  socket.on('chat message', function(msg){
    console.log('chat message', msg);
    io.emit('chat message', msg);
  });
});

// Startup server
http.listen(port, function(){
  console.log('listening on *:' + port);
});
