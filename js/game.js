/*
 * Author: Jakub Czyż no i Janek...
 * E-mail: czyz.jakub@op.pl
 *
 *Please do not copy my work of art!
 *Oslo 2018 All rights reserved
 */

var Game = {};
var players = {};

Game.init = function () {
    game.stage.disableVisibilityChange = true;
};

Game.preload = function () {
    game.load.tilemap('map', 'assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tileset', 'assets/map/tilesheet.png', 32, 32);
    game.load.image('sprite', 'assets/sprites/sprite.png');
    game.load.image('bullet', 'assets/bullets/bullet05.png');
    game.load.image('health', 'assets/sprites/health.png');
    game.load.image('axe1', 'assets/sprites/axe.png');
};

Game.create = function () {
    Game.playerMap = {};
    //  Creates 30 bullets, using the 'bullet' graphic

    var attackKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    attackKey.onDown.add(Client.sendAttack, this);

    var leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    var rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    var downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);

    leftKey.onDown.add(Client.sendMove, this);
    rightKey.onDown.add(Client.sendMove, this);
    upKey.onDown.add(Client.sendMove, this);
    downKey.onDown.add(Client.sendMove, this);

    leftKey.onUp.add(Client.sendStop, this);
    rightKey.onUp.add(Client.sendStop, this);
    upKey.onUp.add(Client.sendStop, this);
    downKey.onUp.add(Client.sendStop, this);

    var map = game.add.tilemap('map');
    map.addTilesetImage('tilesheet', 'tileset'); // tilesheet is the key of the tileset in map's JSON file
    var layer;
    for (var i = 0; i < map.layers.length; i++) {
        layer = map.createLayer(i);

    }
    layer.inputEnabled = true; // Allows clicking on the map ; it's enough to do it on the last layer
    layer.events.onInputUp.add(Game.getCoordinates, this);
    Client.askNewPlayer();
};

Game.getCoordinates = function (layer, pointer) {
    Client.sendClick(pointer.worldX - 30, pointer.worldY - 40);
};

Game.addNewPlayer = function (id, x, y, h) {
    Game.playerMap[id] = game.add.sprite(x, y, 'sprite');
    var style = {font: "20px Arial", fill: "#000000", align: "center"};
    var tekst = game.add.text(-20, -15, "Player " + (id + 1), style);
    var weapon = game.add.weapon(30, 'bullet');
    tekst.x = Game.playerMap[id].width / 2 - tekst.width / 2;
    tekst.y = tekst.height * -0.5;
    Game.playerMap[id].addChild(tekst);
    Game.playerMap[id].direction = "left";

    Game.playerMap[id].axe = game.add.sprite(33, 20, 'axe1');
    Game.playerMap[id].addChild(Game.playerMap[id].axe);

    Game.playerMap[id].axe.anchor.setTo(1.3, 0);

    Game.playerMap[id].lives = {};
    for (var i = 0; i < h; i++) {
        Game.playerMap[id].lives[i] = game.add.sprite(Game.playerMap[id].width / 2 - 12 * h / 2 + 12 * i, 9, 'health');
        Game.playerMap[id].addChild(Game.playerMap[id].lives[i]);
    }
};

Game.movePlayer = function (id, x, y) {
    var player = Game.playerMap[id];

    player.x = x;
    player.y = y;

    if (players[id].direction !== Game.playerMap[id].direction) {
        Game.playerMap[id].direction = players[id].direction;
        Game.playerMap[id].axe.anchor.setTo(1.3, 0);

        Game.playerMap[id].axe.scale.x *= -1;
        // Game.playerMap[id].addChild(Game.playerMap[id].axe);
    }
};

Game.removePlayer = function (id) {
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};
