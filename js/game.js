/*
 * Author: Jakub Czyż
 * E-mail: czyz.jakub@op.pl
 *
 *Please do not copy my work of art!
 *Oslo 2018 All rights reserved
 */

var Game = {};

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
    game.load.tilemap('map', 'assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tileset', 'assets/map/tilesheet.png',32,32);
    game.load.image('sprite','assets/sprites/sprite.png');
    game.load.image('bullet', 'assets/bullets/bullet05.png');
};

Game.create = function(){

    Game.playerMap = {};
    //  Creates 30 bullets, using the 'bullet' graphic




    var attackKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    attackKey.onDown.add(Client.sendAttack, this);

    var leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    leftKey.onDown.add(Client.sendMove, this);
    var rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    rightKey.onDown.add(Client.sendMove, this);
    var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    upKey.onDown.add(Client.sendMove, this);
    var downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    downKey.onDown.add(Client.sendMove, this);

    var leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    leftKey.onUp.add(Client.sendStop, this);
    var rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    rightKey.onUp.add(Client.sendStop, this);
    var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    upKey.onUp.add(Client.sendStop, this);
    var downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    downKey.onUp.add(Client.sendStop, this);
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
    Client.sendClick(pointer.worldX-30,pointer.worldY-40);
};

Game.addNewPlayer = function(id,x,y){
    Game.playerMap[id] = game.add.sprite(x,y,'sprite');
    var style = { font: "20px Arial", fill: "#000000", align: "center"};
    tekst= game.add.text(-20, -15, "Player "+(id+1), style);
    weapon = game.add.weapon(30, 'bullet');
    tekst.x = Game.playerMap[id].width/2-tekst.width/2;
    tekst.y = tekst.height*-0.5;
    Game.playerMap[id].addChild(tekst);
    weapon.trackSprite(Game.playerMap[id], 0, 0, true);

    //  The bullet will be automatically killed when it leaves the world bounds
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    //  The speed at which the bullet is fired
    weapon.bulletSpeed = 600;

    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
    weapon.fireRate = 100;

};

Game.movePlayer = function(id,x,y){
    var player = Game.playerMap[id];

    player.x=x;
    player.y=y;

};

Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};
