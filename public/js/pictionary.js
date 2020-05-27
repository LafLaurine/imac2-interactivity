// Start a socket connection to the server
let socket = io.connect('http://localhost:3000');
let strokeWidth = 4;
let user;
let users = [];

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
    song = random(sounds);
    song.play();
    song.amp(0.3);
    song.loop();
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
    document.querySelector('.draw').style.display = 'none';
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
    socket.emit('guessword', {
        username: user,
        guessword: guess
    });

    document.querySelector('.guess-input').value = "";
}

let guessword = function (data) {
    document.querySelector('#guesses').innerHTML += data.username + "'s guess: " + data.guessword;
    if (data.guessword === document.querySelector('.word').innerHTML) {
        socket.emit('correct answer', {
            username: data.username,
            guessword: data.guessword
        });
        socket.emit('swap rooms', {
            from: user,
            to: data.username
        });
    } else {
        const element = document.createElement('p');
        let textNode = document.createTextNode(data.username + " gave a wrong answer");
        element.appendChild(textNode);
        document.querySelector('#guesses').appendChild(element);
    }
};

let drawWord = function (word) {
    document.querySelector('.draw').style.display = 'block';
    document.querySelector('.word').innerHTML = word;
};

let correctAnswer = function (data) {
    document.querySelector('#guesses').innerHTML += '<p>' + data.username + ' guessed correctly!' + '</p>';
};

let reset = function (name) {
    clear();
    background(255);
    document.querySelector('#guesses').innerHTML = " ";
    document.querySelector('.draw').style.display = 'block';
    console.log('New drawer: ' + name);
    document.querySelector('#guesses').innerHTML += '<p>' + name + ' is the new drawer' + '</p>';
};

let newDrawer = function () {
    document.querySelector('#guesses').innerHTML = " ";
    document.querySelector('.word').innerHTML = " ";
    socket.emit('new drawer', user);
    clear();
};