const http = require('http')
const app = require('./app')
let connectCounter = 0;

let users = [];
let wordcount;

const words = [
    "word", "letter", "number", "person", "pen", "police", "people",
    "sound", "water", "breakfast", "place", "man", "men", "woman", "women", "boy",
    "girl", "serial killer", "Oregon Trail", "week", "month", "name", "sentence", "line", "air",
    "land", "home", "hand", "house", "picture", "animal", "mother", "father",
    "big foot", "sister", "world", "head", "page", "country", "question",
    "shiba inu", "school", "plant", "food", "sun", "state", "eye", "city", "tree",
    "farm", "story", "sea", "night", "day", "life", "north", "south", "east",
    "west", "child", "children", "example", "paper", "music", "river", "car",
    "Power Rangers", "feet", "book", "science", "room", "friend", "idea", "fish",
    "mountain", "horse", "watch", "color", "face", "wood", "list", "bird",
    "body", "fart", "family", "song", "door", "forest", "wind", "ship", "area",
    "rock", "Captain Planet", "fire", "problem", "airplane", "top", "bottom", "king",
    "space", "whale", "unicorn", "narwhal", "furniture", "sunset", "sunburn", "Grumpy cat", "feather", "pigeon"
];

function newWord() {
    wordcount = Math.floor(Math.random() * (words.length));
    return words[wordcount];
};


const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
        default:
            throw error;
    }
}

const server = http.createServer(app)

server.on('error', errorHandler)
server.on('listening', () => {
    const address = server.address()
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port
    console.log('Listening on ' + bind)
})


// Web sockets
const io = require('socket.io')(server)

io.sockets.on('connection', (socket) => {
    io.emit('userlist', users);
    socket.on('join', function (name) {
        socket.username = name;
        // user automatically joins a room under their own name
        socket.join(name);
        connectCounter++;
        console.log(socket.username + ' has joined ' + "number of player : " + connectCounter);
        // save the name of the user to an array called users
        users.push(socket.username);
        // if the user is first to join OR 'drawer' room has no connections
        if (typeof io.sockets.adapter.rooms['drawer'] === 'undefined') {
            // place user into 'drawer' room
            socket.join('drawer');
            // server submits the 'drawer' event to this user
            socket.broadcast.to(socket.username).emit('drawer', socket.username);
            console.log(socket.username + ' is a drawer');

            // send the random word to the user inside the 'drawer' room
            socket.broadcast.to(socket.username).emit('draw word', newWord());
            console.log(newWord());
            socket.on('mouse', (data) => socket.broadcast.emit('mouse', data));

        } else {
            // additional users will join the 'guesser' room
            socket.join('guesser');
            // server submits the 'guesser' event to this user
            socket.broadcast.to(socket.username).emit('guesser', socket.username);
            console.log(socket.username + ' is a guesser');
        }

        // update all clients with the list of users
        io.emit('userlist', users);

    });

    // submit each client's guesses to all clients
    socket.on('guessword', function (data) {
        socket.broadcast.emit('guessword', {
            username: data.username,
            guessword: data.guessword
        })
        console.log('guessword event triggered on server from: ' + data.username + ' with word: ' + data.guessword);
    });


    socket.on('set', function (status, callback) {
        console.log(status);
        callback('ok');
    });

    socket.on('correct answer', function (data) {
        socket.broadcast.emit('correct answer', data);
        console.log(data.username + ' guessed correctly with ' + data.guessword);
    });


    socket.on('disconnect', () => {
        for (var i = 0; i < users.length; i++) {

            // remove user from users list
            if (users[i] == socket.username) {
                users.splice(i, 1);
            };
        };
        connectCounter--;
        console.log(socket.username + ' has disconnected, number of player : ' + connectCounter);
        // submit updated users list to all clients
        io.emit('userlist', users);
    });
});

server.listen(port);