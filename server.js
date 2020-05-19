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
    const port = parseInt(val, 10)

    if (isNaN(port)) {
        return val
    }
    if (port >= 0) {
        return port
    }
    return false
}

const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error
    }
    const address = server.address()
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.')
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.')
            process.exit(1)
            break
        default:
            throw error
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
    socket.broadcast.emit('userlist', users);
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
            socket.in(socket.username).emit('drawer', socket.username);
            console.log(socket.username + ' is a drawer');

            // send the random word to the user inside the 'drawer' room
            socket.in(socket.username).emit('draw word', newWord());
            socket.on('mouse', (data) => socket.broadcast.emit('mouse', data));
        } else {
            // additional users will join the 'guesser' room
            socket.join('guesser');
            // server submits the 'guesser' event to this user
            socket.in(socket.username).emit('guesser', socket.username);
            console.log(socket.username + ' is a guesser');
        }

        // update all clients with the list of users
        socket.broadcast.emit('userlist', users);

    });



    // submit each client's guesses to all clients
    socket.on('guessword', function (data) {
        socket.broadcast.emit('guessword', {
            username: data.username,
            guessword: data.guessword
        })
        console.log('guessword event triggered on server from: ' + data.username + ' with word: ' + data.guessword);
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
        socket.broadcast.emit('userlist', users);
    })

    socket.on('set', function (status, callback) {
        console.log(status);
        callback('ok');
    });

    socket.on('new drawer', function (name) {

        // remove user from 'guesser' room
        socket.leave('guesser');

        // place user into 'drawer' room
        socket.join('drawer');
        console.log('new drawer emit: ' + name);

        // submit 'drawer' event to the same user
        socket.broadcast.emit('drawer', name);

        // send a random word to the user connected to 'drawer' room
        io.in('drawer').emit('draw word', newWord());

    });

    // initiated from drawer's 'dblclick' event in Player list
    socket.on('swap rooms', function (data) {

        // drawer leaves 'drawer' room and joins 'guesser' room
        socket.leave('drawer');
        socket.join('guesser');

        // submit 'guesser' event to this user
        socket.broadcast.emit('guesser', socket.username);

        // submit 'drawer' event to the name of user that was doubleclicked
        io.in(data.to).emit('drawer', data.to);

        // submit random word to new user drawer
        io.in(data.to).emit('draw word', newWord());

        socket.broadcast.emit('reset', data.to);

    });

    socket.on('correct answer', function (data) {
        socket.broadcast.emit('correct answer', data);
        console.log(data.username + ' guessed correctly with ' + data.guessword);
    });


})

server.listen(port)