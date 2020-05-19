//Keep trace of socket connection
let socket
let strokeWidth = 4
let user;
let users = [];

function submitUserName() {
    event.preventDefault();
    user = document.getElementById("username").value;

    if (user == '') {
        return false
    };

    var index = users.indexOf(user);

    if (index > -1) {
        alert(user + ' already exists');
        return false
    };

    socket.emit('join', user, function (response) {
        console.log("Join : " + response);
    });

    document.getElementsByClassName('grey-out')[0].style.display = "none";
    document.getElementsByClassName('user')[0].style.display = "none";
    document.getElementsByClassName('guess-input')[0].focus();
}

let userlist = function (names) {
    users = names;
    var html = '<p class="chatbox-header">' + 'Players' + '</p>';
    for (var i = 0; i < names.length; i++) {
        html += '<li>' + names[i] + '</li>';
    };
    document.getElementsByTagName('ul')[0].innerHTML = html;
};


function setUpSketch() {
    // Start a socket connection to the server
    socket = io.connect('http://localhost:3000')
    // We make a named event called 'mouse' and write an
    // anonymous callback function
    socket.on('mouse', data => {
        stroke(data.color)
        strokeWeight(data.strokeWidth)
        line(data.x, data.y, data.px, data.py)
    })
    const stroke_width_picker = select('#stroke-width-picker')
    const stroke_btn = select('#stroke-btn')
    // Adding a mousePressed listener to the button
    stroke_btn.mousePressed(() => {
        const width = parseInt(stroke_width_picker.value())
        if (width > 0) strokeWidth = width
    })
}

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
    console.log(color)
    socket.emit('mouse', data, function (response) {
        console.log(response);
    });
}

//clear Canva
function keyPressed() {
    if (keyCode === ESCAPE) {
        clear();
    }
}