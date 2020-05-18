const http = require('http')
const app = require('./app')
let connectCounter = 0;


let users = [];

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

let wordcount;

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
    console.log('Client connected: ' + socket.id)
    connectCounter++;
    console.log(connectCounter);
    socket.broadcast.emit('userlist', users);
    socket.on('join', function (name) {
        socket.username = name;

        // user automatically joins a room under their own name
        socket.join(name);

        console.log(socket.username + ' has joined. ID: ' + socket.id);

        // save the name of the user to an array called users
        users.push(socket.username);
    })

    if (connectCounter !== 2) {
        console.log("There is not enough player");
    } else {
        socket.on('mouse', (data) => socket.broadcast.emit('mouse', data));
    }

    socket.on('disconnect', () => {
        connectCounter--;
        console.log('Disconnected, number of player : ' + connectCounter);
    })

    socket.on('set', function (status, callback) {
        console.log(status);
        callback('ok');
    });
})

server.listen(port)