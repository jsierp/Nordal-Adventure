var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

server.lastPlayderID = 0;

server.listen(process.env.PORT || 8081,function(){
    console.log('Listening on '+server.address().port);
});

io.on('connection',function(socket){

    socket.on('newplayer',function(){
        socket.player = {
            id: server.lastPlayderID++,
            nick: null,
            x: randomInt(100,400),
            y: randomInt(100,400),
            keyDown: false,
            keyUp: false,
            keyLeft: false,
            keyRight: false,
            attack: false,
            direction: "right";
        };
        socket.emit('allplayers',getAllPlayers());
        socket.broadcast.emit('newplayer',socket.player);


        socket.on('disconnect',function(){
            io.emit('remove',socket.player.id);
        });
    });

    socket.on('test',function(){
        console.log('test received');
    });

    socket.on('attack',function(){
        console.log('attack recived');
        socket.player.attack = true;
    });
    socket.on('move',function(move){

        switch(move)
        {
          case "right": socket.player.keyRight = true; break;
          case "left": socket.player.keyLeft = true; break;
          case "down": socket.player.keyDown = true; break;
          case "up": socket.player.keyUp = true; break;
        }

    });
    socket.on('stop',function(move){
        console.log('move recived '+move);
        switch(move)
        {
          case "right": socket.player.keyRight =false; break;
          case "left": socket.player.keyLeft = false; break;
          case "down": socket.player.keyDown = false; break;
          case "up": socket.player.keyUp = false; break;

        }

    });
});

function mainLoop(){
  Object.keys(io.sockets.connected).forEach(function(socketID){
      var player = io.sockets.connected[socketID].player;
      if(player)
      {
        if(player.keyLeft) player.x-=2;
        if(player.keyRight) player.x+=2;
        if(player.keyDown) player.y+=2;
        if(player.keyUp) player.y-=2;

        if(player.attack){

          player.attack=false;
        }
        io.emit('move',player);
      }


  });

}




setInterval(mainLoop, 20);


function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
