/**
 * Created by Jerome on 03-03-17.
 */

var Client = {};
Client.socket = io.connect();

Client.sendTest = function () {
    console.log("test sent");
    Client.socket.emit('test');
};

Client.sendMove = function (key) {
    var move;
    switch (key.keyCode) {
        case Phaser.KeyCode.LEFT:
            move = "left";
            break;
        case Phaser.KeyCode.RIGHT:
            move = "right";
            break;
        case Phaser.KeyCode.UP:
            move = "up";
            break;
        case Phaser.KeyCode.DOWN:
            move = "down";
            break;

    }
    Client.socket.emit('move', move);

};

Client.sendAttack = function () {

    Client.socket.emit('attack');
};

Client.sendStop = function (key) {
    var move;
    switch (key.keyCode) {
        case Phaser.KeyCode.LEFT:
            move = "left";
            break;
        case Phaser.KeyCode.RIGHT:
            move = "right";
            break;
        case Phaser.KeyCode.UP:
            move = "up";
            break;
        case Phaser.KeyCode.DOWN:
            move = "down";
            break;

    }
    Client.socket.emit('stop', move);

};

Client.askNewPlayer = function () {
    Client.socket.emit('newplayer');
};

Client.sendClick = function (x, y) {
    Client.socket.emit('click', {x: x, y: y});
};

Client.socket.on('newplayer', function (data) {
    Game.addNewPlayer(data.id, data.x, data.y, data.health);
    players[data.id] = data;
});

Client.socket.on('allplayers', function (data) {

    for (var i = 0; i < data.length; i++) {
        Game.addNewPlayer(data[i].id, data[i].x, data[i].y, data[i].health);
        players[data[i].id] = data;
    }

    Client.socket.on('move', function (data) {
        Game.movePlayer(data.id, data.x, data.y);
        players[data.id] = data;
    });

    Client.socket.on('remove', function (id) {
        Game.removePlayer(id);
    });

    Client.socket.on('hit', function (id_attacker, id_receiver) {
        if (players[id_receiver].health > 0) {
            players[id_receiver].health--;
            Game.playerMap[id_receiver].lives[players[id_receiver].health].kill();
            if (players[id_receiver].health === 0) Game.playerMap[id_receiver].axe.kill();
        }

        axe = Game.playerMap[id_attacker].axe;
        if (Game.playerMap[id_attacker].direction === "right") {
            tween = game.add.tween(axe).to({angle: 45}, 100, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(axeBackRight, this, id_attacker);
        } else {
            tween = game.add.tween(axe).to({angle: -45}, 100, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(axeBackLeft, this, id_attacker);
        }
    });

    Client.socket.on('try_hit', function (id_attacker) {
        axe = players[id_attacker].axe;
        if (players[id_attacker].direction === "right") {
            tween = game.add.tween(axe).to({angle: 45}, 100, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(axeBackRight, this, id_attacker);
        } else {
            tween = game.add.tween(axe).to({angle: -45}, 100, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(axeBackLeft, this, id_attacker);
        }
    });
});

function axeBackLeft() {
    tween = game.add.tween(axe).to({angle: 0}, 100, Phaser.Easing.Linear.None, true);
}

function axeBackRight() {
    tween = game.add.tween(axe).to({angle: 0}, 100, Phaser.Easing.Linear.None, true);
}

