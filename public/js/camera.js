const val = 5;
let positions;

function drawWebcam() {
    background(50);
    fill(255);
    video.loadPixels();
    for (let cy = 0; cy < video.height; cy += 10) {
        for (let cx = 0; cx < video.width; cx += 5) {
            let offset = ((cy * video.width) + cx) * 4;
            let xpos = (cx / video.width) * width;
            let ypos = (cy / video.height) * height;
            rect(xpos, ypos, 10,
                10 * (video.pixels[offset + 1] / 255));
        }
    }
}