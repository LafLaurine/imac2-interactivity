const http = require('http')
const app = require('./app')
const server = http.Server(app);
const socket_io = require('socket.io');
const io = socket_io(server);
let wordcount = 0;
let users = [];

let words = [
    "world", "letter", "number", "pigeon", "pen", "police", "people"
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

server.on('error', errorHandler)
server.on('listening', () => {
    const address = server.address()
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port
    console.log('Listening on ' + bind)
})


io.on('connection', (socket) => {
    io.emit('userlist', users);
    socket.on('join', function (name) {
        socket.username = name;
        // user automatically joins a room under their own name
        socket.join(name);
        console.log(socket.username + ' has joined. ID: ' + socket.id);

        // save the name of the user to an array called users
        users.push(socket.username);
        console.log('Client connected: ' + socket.id)
        // if the user is first to join OR 'drawer' room has no connections
        if (users.length == 1 || typeof io.sockets.adapter.rooms['drawer'] === 'undefined') {
            console.log(socket.username + ' is a drawer');
            socket.on('mouse', (data) => socket.broadcast.emit('mouse', data));
            io.in(socket.username).emit('draw word', newWord());
        } else {
            console.log("There is not enough player");
            console.log(socket.username + ' is a guesser');
        }
        // update all clients with the list of users
        io.emit('userlist', users);
    });

    // submit each client's guesses to all clients
    socket.on('guessword', function (data) {
        io.emit('guessword', {
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
        console.log(socket.username + ' has disconnected.');
    })
})


server.listen(port)