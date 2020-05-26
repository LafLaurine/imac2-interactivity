let positions;


function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function windowResized() {
    resizeCanvas(windowWidth / 1.5, windowHeight / 1.5);
}

function setUpCamera() {
    song = random(sounds);
    song.play();
    song.amp(0.3);
}

function drawWebcam() {
    image(prevFrame, 0, 0);

    loadPixels();
    video.loadPixels();
    prevFrame.loadPixels();
    const rvb = hexToRgb(color);

    // Begin loop to walk through every pixel
    for (let x = 0; x < video.width; x++) {
        for (let y = 0; y < video.height; y++) {

            // Step 1, what is the location into the array
            let loc = (x + y * video.width) * 4;

            // Step 2, what is the previous color
            let r1 = prevFrame.pixels[loc];
            let g1 = prevFrame.pixels[loc + 1];
            let b1 = prevFrame.pixels[loc + 2];

            // Step 3, what is the current color
            let r2 = video.pixels[loc];
            let g2 = video.pixels[loc + 1];
            let b2 = video.pixels[loc + 2];

            // Step 4, compare colors (previous vs. current)
            const diff = dist(r1, g1, b1, r2, g2, b2);
            // Step 5, How different are the colors?
            // If the color at that pixel has changed, then there is motion at that pixel.
            if (diff > threshold) {
                // If motion, display red
                pixels[loc] = rvb.r;
                pixels[loc + 1] = rvb.g;
                pixels[loc + 2] = rvb.b;
                //  pixels[loc + 3] = 255;
            }
            /*else {
                           // If not, display white
                           pixels[loc] = 250;
                           pixels[loc + 1] = 250;
                           pixels[loc + 2] = 250;
                           pixels[loc + 3] = 250;
                       }*/
        }
    }
    updatePixels();

    // Save frame for the next cycle
    //if (video.canvas) {
    prevFrame.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height); // Before we read the new frame, we always save the previous frame for comparison!
    //}
}