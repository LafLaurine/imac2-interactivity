//Keep trace of socket connection
let socket
let color = '#000'
let strokeWidth = 4
let cv
let users = [];
let user;


function mouseDragged() {
    // Draw
    stroke(color)
    strokeWeight(strokeWidth)
    line(mouseX, mouseY, pmouseX, pmouseY)

    // Send the mouse coordinates
    sendMouse(mouseX, mouseY, pmouseX, pmouseY)
}

// Sending data to the socket
function sendMouse(x, y, pX, pY) {
    const data = {
        x: x,
        y: y,
        px: pX,
        py: pY,
        color: color,
        strokeWidth: strokeWidth,
    }

    socket.emit('mouse', data)
}

let userlist = function (names) {
    users = names;
    var html = '<p class="chatbox-header">' + 'Players' + '</p>';
    for (var i = 0; i < names.length; i++) {
        html += '<li>' + names[i] + '</li>';
    };
    document.getElementsByTagName('ul').innerHTML = html;
};


//clear Canva
function keyPressed() {
    if (keyCode === ESCAPE) {
        clear();
    }
}