// Keep track of our socket connection
var socket;

function setup() {
    createCanvas(800, 800);
    background(0);
    // Start a socket connection to the server
    // Some day we would run this server somewhere else
    socket = io.connect('http://127.0.0.1:8080/');
    // We make a named event called 'mouse' and write an
    // anonymous callback function
    socket.on('mouse',
        // When we receive data
        function (data) {
            // Draw a blue circle
            fill(0, 0, 255);
            noStroke();
            ellipse(data.x, data.y, 20, 20);
        }
    );
}

function draw() {
    // Nothing
}

function mouseDragged() {
    // Draw some white circles
    fill(255);
    noStroke();
    ellipse(mouseX, mouseY, 20, 20);
    // Send the mouse coordinates
    sendmouse(mouseX, mouseY);
}

// Function for sending to the socket
function sendmouse(xpos, ypos) {
    // We are sending!
    console.log("sendmouse: " + xpos + " " + ypos);

    // Make a little object with  and y
    var data = {
        x: xpos,
        y: ypos
    };

    // Send that object to the socket
    socket.emit('mouse', data);
}