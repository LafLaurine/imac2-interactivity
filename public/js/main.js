let video;
let cv;
// Previous Frame
let prevFrame;
// How different must a pixel be to be a "motion" pixel
let threshold = 80;
let color = '#000000';
let amp;

let song;
let button;
let volhistory = [];

let pages = [{
        state: true,
        setup: function () {
            setUpSketch()
        },
        draw: function () {}
    },
    {
        state: false,
        setup: function () {},
        draw: function () {
            drawWebcam();
        }
    }
]

function toggleSong() {
    if (song.isPlaying()) {
      song.pause();
    } else {
      song.play();
    }
}
  
function preload() {
    song = loadSound('/assets/audio/Purple Planet Music - The Big Sky.mp3');
}
  
function centerCanvas() {
    const x = (windowWidth - width) / 2
    const y = (windowHeight - height) / 2
    cv.position(x, y)
}

function globalSetup() {
    cv = createCanvas(windowWidth/ 1.5, windowHeight / 1.5);
    pixelDensity(1);
    background(255);
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();
    centerCanvas();

    button = createButton('toggle');
    button.mousePressed(toggleSong);
    song.play();
    amp = new p5.Amplitude();
  
    // Create an empty image the same size as the video
    prevFrame = createImage(video.width, video.height);

    // Getting our buttons and the holder through the p5.js dom
    const color_picker = select('#pickcolor')
    const color_btn = select('#color-btn')
    const color_holder = select('#color-holder')

    // Adding a mousePressed listener to the button
    color_btn.mousePressed(() => {
        // Checking if the input is a valid hex color
        if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color_picker.value())) {
            color = color_picker.value()
            color_holder.style('background-color', color)
        } else {
            console.log('Enter a valid hex value')
        }
    })

}

function showPage(index) {
    globalSetup();
    pages.forEach(el => el.state = false);
    pages[index].state = true;
}

function drawSound() {
    let vol = amp.getLevel();
    volhistory.push(vol);
    stroke(255);
    noFill();
    push();
    let currentY = map(vol, 0, 1, height, 0);
    translate(0, height / 2 - currentY);
    beginShape();
    for (let i = 0; i < volhistory.length; i++) {
        let y = map(volhistory[i], 0, 1, height, 0);
        vertex(i, y);
    }
    endShape();
    pop();
    if (volhistory.length > width - 50) {
        volhistory.splice(0, 1);
    }

    stroke(255, 0, 0);
    line(volhistory.length, 0, volhistory.length, height);
}

function draw() {
    for (i = 0; i < pages.length; i++) {
        if (pages[i].state == true) {
            pages[i].draw();
        }
    }
}

function setup() {
    for (i = 0; i < pages.length; i++) {
        if (pages[i].state == true) {
            globalSetup();
            pages[i].setup();
        }
    }
}