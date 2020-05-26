let getColor;


function setup() {
	const cav = createCanvas(window.innerWidth, window.innerHeight);
	cav.addClass('test');
}

function preload() {
	colorWheel = loadImage("/assets/img/colorwheel.png");
}

function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function draw() {
	background(100);
	push();
	image(colorWheel, 10, 10);
	getColor = colorWheel.get(mouseX, mouseY);

	push();
	stroke(getColor[0], getColor[1], getColor[2]);
	fill(getColor[0], getColor[1], getColor[2], 100);
	ellipse(width - 180, height * 0.5 + 100, 50, 50);
	pop();


	fill(getColor);
	ellipse(mouseX, mouseY, 33, 33);
	pop();

	push();
	fill(217);
	noStroke();
	textSize(33);
	textFont('Source Code Pro');
	textAlign(LEFT, CENTER);
	textStyle(BOLD);
	text(rgbToHex(getColor[0], getColor[1], getColor[2]), width * 0.5, height * 0.8);
	pop();
}
