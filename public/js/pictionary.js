//Keep trace of socket connection
let socket
let strokeWidth = 4
let user;
let users = [];

function windowResized() {
    resizeCanvas(windowWidth / 1.5, windowHeight / 1.5);
    background(255);
}

function submitUserName() {
    event.preventDefault();
    user = document.querySelector("#username").value;

    if (user == '') {
        return false
    };

    let index = users.indexOf(user);

    if (index > -1) {
        alert(user + ' already exists');
        return false
    };

    socket.emit('join', user, function (response) {
        console.log("Join : " + response);
    });

    document.querySelector('.grey-out').style.display = "none";
    document.querySelector('.user').style.display = "none";
    document.querySelector('.guess-input').focus();
}

let userlist = function (names) {
    users = names;
    let html = '<p class="chatbox-header">' + 'Players' + '</p>';
    for (let i = 0; i < names.length; i++) {
        html += '<li>' + names[i] + '</li>';
    };
    document.querySelector('.users').innerHTML = html;
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

    socket.on('userlist', userlist);
    socket.on('guesser', guesser);
    socket.on('guessword', guessword);
    socket.on('draw word', drawWord);
    socket.on('new drawer', newDrawer);
    socket.on('correct answer', correctAnswer);
    socket.on('reset', reset);
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
    socket.emit('mouse', data, function (response) {
        console.log(response);
    });
}

let guesser = function () {
    console.log('You are a guesser');
    document.querySelector('.guess-input').focus();
};

function submitGuess() {
    event.preventDefault();
    let guess = document.querySelector('.guess-input').value;

    if (guess == '') {
        return false
    };
    const element = document.createElement('p');
    let textNode = document.createTextNode(user + "'s guess: " + guess);
    element.appendChild(textNode);
    document.querySelector('.users').appendChild(element);
    console.log(user + "'s guess: " + guess);
    socket.emit('guessword', {
        username: user,
        guessword: guess
    });

    document.querySelector('.guess-input').value = "";
}

let guessword = function (data) {
    document.querySelector('#guesses').innerHTML += data.username + "'s guess: " + data.guessword;
    if (data.guessword === document.querySelector('.word').innerHTML) {
        console.log('guesser: ' + data.username + ' draw-word: ' + document.querySelector('.word').innerHTML);
        socket.emit('correct answer', {
            username: data.username,
            guessword: data.guessword
        });
        socket.emit('swap rooms', {
            from: user,
            to: data.username
        });
    } else {
        document.querySelector('#guesses').innerHTML += data.username + " gave a wrong answer";
        console.log("wrong answer");
    }
};

let drawWord = function (word) {
    document.querySelector('.word').innerHTML = word;
    console.log('Your word to draw is: ' + word);
};

let correctAnswer = function (data) {
    document.querySelector('#guesses').innerHTML += '<p>' + data.username + ' guessed correctly!' + '</p>';
};

let reset = function (name) {
    document.querySelector('#guesses').innerHTML = "";
    console.log('New drawer: ' + name);
    document.querySelector('#guesses').innerHTML += '<p>' + name + ' is the new drawer' + '</p>';
};

let newDrawer = function () {
    socket.emit('new drawer', user);
    clear();
    document.querySelector('#guesses').innerHTML = "";
};