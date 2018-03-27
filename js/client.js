/**
 * Created by Jerome on 03-03-17.
 */

var Client = {
  up: false,
  down: false,
  left: false,
  right: false
};
Client.socket = io.connect();

Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};

Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
};

Client.sendMove = function(key){
    switch (key.keyCode) {
        case Phaser.KeyCode.UP : Client.up = true; Client.socket.emit('move', "UP"); break;
        case Phaser.KeyCode.DOWN : Client.down = true; Client.socket.emit('move', "DOWN"); break;
        case Phaser.KeyCode.LEFT : Client.left = true; Client.socket.emit('move', "LEFT"); break;
        case Phaser.KeyCode.RIGHT : Client.right = true; Client.socket.emit('move', "RIGHT"); break;
    }
};

Client.finishMove = function(key){
    switch (key.keyCode) {
        case Phaser.KeyCode.UP : Client.up = false; break;
        case Phaser.KeyCode.DOWN : Client.down = false; break;
        case Phaser.KeyCode.LEFT : Client.left = false; break;
        case Phaser.KeyCode.RIGHT : Client.right = false; break;
    }
};

Client.sendClick = function(x,y){
  Client.socket.emit('click',{x:x,y:y});
};

Client.socket.on('newplayer',function(data){
    Game.addNewPlayer(data.id,data.x,data.y);
});

Client.socket.on('allplayers',function(data){
    for(var i = 0; i < data.length; i++){
        Game.addNewPlayer(data[i].id,data[i].x,data[i].y);
    }

    Client.socket.on('move',function(data){
        Game.movePlayer(data.id,data.x,data.y);
    });

    Client.socket.on('remove',function(id){
        Game.removePlayer(id);
    });
});
