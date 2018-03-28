let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io').listen(server);
const MAP_WIDTH = 32*24;
const MAP_HEIGHT = 32*17;
const MOVE_SPEED = 2;

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

server.lastPlayderID = 0;

server.listen(process.env.PORT || 8081, function () {
    console.log('Listening on ' + server.address().port);
});

io.on('connection', function (socket) {

    socket.on('newplayer', function () {
        socket.player = {
            id: server.lastPlayderID++,
            nick: null,
            x: randomInt(100, 400),
            y: randomInt(100, 400),
            keyDown: false,
            keyUp: false,
            keyLeft: false,
            keyRight: false,
            attack: false,
            direction: "left",
            health: 10,
            lastAttack: false
        };
        socket.emit('allplayers', getAllPlayers());
        socket.broadcast.emit('newplayer', socket.player);

        socket.on('disconnect', function () {
            io.emit('remove', socket.player.id);
        });

        socket.on('attack', function () {
            attack(socket.player);
        });

        socket.on('move', function (move) {
            switch (move) {
                case "right":
                    socket.player.keyRight = true;
                    break;
                case "left":
                    socket.player.keyLeft = true;
                    break;
                case "down":
                    socket.player.keyDown = true;
                    break;
                case "up":
                    socket.player.keyUp = true;
                    break;
            }
        });

        socket.on('stop', function (move) {
            switch (move) {
                case "right":
                    socket.player.keyRight = false;
                    break;
                case "left":
                    socket.player.keyLeft = false;
                    break;
                case "down":
                    socket.player.keyDown = false;
                    break;
                case "up":
                    socket.player.keyUp = false;
                    break;
            }
        });
    });
});

function mainLoop() {
    Object.keys(io.sockets.connected).forEach(function (socketID) {
        let player = null;
        if (io.sockets.connected[socketID])
            player = io.sockets.connected[socketID].player;

        if (player !== null && player !== undefined) {
            let moved = false;
            if (player.keyLeft) {
                if (player.x-MOVE_SPEED > -15) {
                    player.x -= MOVE_SPEED;
                }
                player.direction = "left";
                moved = true;
            }
            if (player.keyRight) {
                if (player.x+MOVE_SPEED < MAP_WIDTH-40) {
                    player.x += MOVE_SPEED;
                }
                player.direction = "right";
                moved = true;
            }
            if (player.keyDown && player.y+MOVE_SPEED < MAP_HEIGHT-50) {
                player.y += MOVE_SPEED;
                moved = true;
            }
            if (player.keyUp && player.y-MOVE_SPEED > -20) {
                player.y -= MOVE_SPEED;
                moved = true;
            }

            if (moved)
                io.emit('move', player);
        }
    });
}

setInterval(mainLoop, 20);

function getAllPlayers() {
    let players = [];
    Object.keys(io.sockets.connected).forEach(function (socketID) {
        let player = io.sockets.connected[socketID].player;
        if (player) players.push(player);
    });
    return players;
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function attack(player) {
    if (!player.lastAttack || Date.now() - player.lastAttack > 200) {
        player.lastAttack = Date.now();
        Object.keys(io.sockets.connected).forEach(function (socketID) {
            let target = io.sockets.connected[socketID].player;
            if (target) {
                if (player.direction === "right"
                    && target.x > player.x + 4 && target.x < player.x + 50 && target.y < player.y + 10
                    && target.y > player.y - 10 && player.health > 0) {
                    console.log("trafiony z prawej");
                    target.health--;
                    io.emit('hit', player.id, target.id);
                } else if (player.direction === "left"
                    && target.x < player.x - 4 && target.x > player.x - 50 && target.y < player.y + 10
                    && target.y > player.y - 10 && player.health > 0) {
                    console.log("trafiony z lewej");
                    target.health--;
                    io.emit('hit', player.id, target.id);
                }
                else {
                    io.emit('try_hit', player.id);
                }
            }
        });
    }
}
