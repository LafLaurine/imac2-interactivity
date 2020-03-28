var express = require('express');
var app = express();
app.use(express.static('public'));
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(8080);
app.use(express.static('public'));
console.log("Server running on 127.0.0.1:8080");
// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
    // We are given a websocket object in our function
    function (socket) {

        console.log("We have a new client: " + socket.id);

        // When this user emits, client side: socket.emit('otherevent',some data);
        socket.on('mouse',
            function (data) {
                // Data comes in as whatever was sent, including objects
                console.log("Received: 'mouse' " + data.x + " " + data.y);

                // Send it to all other clients
                socket.broadcast.emit('mouse', data);

                // This is a way to send to everyone including sender
                // io.sockets.emit('message', "this goes to everyone");

            }
        );

        socket.on('disconnect', function () {
            console.log("Client has disconnected");
        });
    }
);