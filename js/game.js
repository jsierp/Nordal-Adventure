/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

var Game = {};

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
    game.load.tilemap('map', 'assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tileset', 'assets/map/tilesheet.png',32,32);
    game.load.image('sprite','assets/sprites/sprite.png');
};

Game.create = function(){
    Game.playerMap = {};
    var testKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    testKey.onDown.add(Client.sendTest, this);

    var moveUp = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    moveUp.onDown.add(Client.sendMove, this);
    moveUp.onUp.add(Client.finishMove, this);

    var moveDown = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    moveDown.onDown.add(Client.sendMove, this);
    moveDown.onUp.add(Client.finishMove, this);

    var moveLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    moveLeft.onDown.add(Client.sendMove, this);
    moveLeft.onUp.add(Client.finishMove, this);

    var moveRight = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    moveRight.onDown.add(Client.sendMove, this);
    moveRight.onUp.add(Client.finishMove, this);

    var map = game.add.tilemap('map');
    map.addTilesetImage('tilesheet', 'tileset'); // tilesheet is the key of the tileset in map's JSON file
    var layer;
    for(var i = 0; i < map.layers.length; i++) {
        layer = map.createLayer(i);
    }
    layer.inputEnabled = true; // Allows clicking on the map ; it's enough to do it on the last layer
    layer.events.onInputUp.add(Game.getCoordinates, this);
    Client.askNewPlayer();
};

Game.getCoordinates = function(layer,pointer){
    Client.sendClick(pointer.worldX,pointer.worldY);
};

Game.addNewPlayer = function(id,x,y){
    Game.playerMap[id] = game.add.sprite(x,y,'sprite');
};

Game.movePlayer = function(id,x,y){
    Game.playerMap[id].x = x;
    Game.playerMap[id].y = y;
    // var distance = Phaser.Math.distance(player.x,player.y,x,y);
    // var tween = game.add.tween(player);
    // var duration = distance*10;
    // tween.to({x:x,y:y}, duration);
    // tween.start();
};

Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};

Game.update = function() {
    if(Client.up)
        Client.socket.emit('move', "UP");
    if(Client.down)
        Client.socket.emit('move', "DOWN");
    if(Client.left)
        Client.socket.emit('move', "LEFT");
    if(Client.right)
        Client.socket.emit('move', "RIGHT");
}
