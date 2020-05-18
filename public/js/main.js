let video;


let pages = [{
        state: false,
        draw: function () {
            background(205);
            textAlign(LEFT, CENTER);
            stroke(153);
            strokeWeight(2);
        }
    },
    {
        state: false,
        draw: function () {
            drawWebcam();
        }
    }
]

function setup() {
    cnv = createCanvas(windowWidth / 2, windowHeight / 2);
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();

    // Start a socket connection to the server
    socket = io.connect('http://localhost:3000')
    // We make a named event called 'mouse' and write an
    // anonymous callback function
    socket.on('mouse', data => {
        stroke(data.color)
        strokeWeight(data.strokeWidth)
        line(data.x, data.y, data.px, data.py)
    })

    socket.on('userlist', userlist);

    // Getting our buttons and the holder through the p5.js dom
    const color_picker = select('#pickcolor')
    const color_btn = select('#color-btn')
    const color_holder = select('#color-holder')

    const stroke_width_picker = select('#stroke-width-picker')
    const stroke_btn = select('#stroke-btn')

    // Adding a mousePressed listener to the button
    color_btn.mousePressed(() => {
        // Checking if the input is a valid hex color
        if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color_picker.value())) {
            color = color_picker.value()
            color_holder.style('background-color', color);
        } else {
            console.log('Enter a valid hex value');
        }
    })

    // Adding a mousePressed listener to the button
    stroke_btn.mousePressed(() => {
        const width = parseInt(stroke_width_picker.value())
        if (width > 0) strokeWidth = width
    })
}

function showPage(index) {
    pages.forEach(el => el.state = false);
    pages[index].state = true;
}

function draw() {
    for (i = 0; i < pages.length; i++) {
        if (pages[i].state == true) {
            background(205);
            pages[i].draw();
        }
    }
}