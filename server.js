const http = require('http')
const app = require('./app')
let connectCounter = 0;

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
    console.log(connectCounter)

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