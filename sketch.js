
var state = 'no_go';

var capturer = new CCapture(
	{format: 'png',
	 framerate: 60}
 );

// ffmpeg -r 240 -f image2 -s 540x540 -i "%07d.png" -vcodec libx264 -crf 17 -pix_fmt yuv420p output.mp4

var pop_amount = 500;
var mutation_rate = 0.05;

var hill = [];
var population;
var max_hill_height;
var index = 0;
var generation = 1;
var total_pixels;
var moves;

function setup() {
	createCanvas(100, 100);
	background(0);
	frameRate();
	total_pixels = 4 * width * height;
	moves = width * 8;


	// creating the hill;
	max_hill_height = height;
	for (let i = 0; i < height; i++) {
		hill[i] = new Array(width).fill(5);
	}

	// creating the climber_positions;
	for (let i = 0; i < height; i++) {
		climber_positions[i] = new Array(width).fill(0);
	}

	// display the hill;
	display_hill();

	population = new Population(pop_amount);
	population.populate();
	console.log('Gen ' + generation)

}

//function mouse



function draw() {

	if (state === 'no_go') {

		display_hill();
		display_climbers();

	}





	if (state === 'go') {

		if (frameCount === 1) {
			//capturer.start();
		}

		population.move_once(index);
		index ++;

		if (population.all_finished || index === moves) {
			generation++;

			console.log('Gen ' + generation);

			// reset index and climber position display
			index = 0;
			reset_climbers();

			population.best_fitness();

			// find each climber's fitness
			population.find_fitness();

			// reproduce
			population.reproduce();

		}

		display_hill();
		display_climbers();
		capturer.capture(document.getElementById('defaultCanvas0'));

		//noLoop();

		// if (generation == 30) {
		// 	capturer.stop();
		// 	capturer.save();
		// 	noLoop();
		// }



	}



}





function display_hill() {
	pixelDensity(1);
	loadPixels();
	for (let i = 0; i < total_pixels; i+=4) {
		let y = floor((i / 4) / height);
		let x = (i / 4) % width;

		pixels[i]     = map(hill[x][y], 0, max_hill_height, 0, 120);;
		pixels[i + 1] = 0;
		pixels[i + 2] = 0;
		pixels[i + 3] = 255;
	}
}


function display_climbers() {
	pixelDensity(1);
	//loadPixels();
	for (let i = 0; i < total_pixels; i+=4) {
		let y = floor((i / 4) / height);
		let x = (i / 4) % width;

		if (climber_positions[x][y] == 1) { // still moving, white
			set(x, y, 200);
		}

		if (climber_positions[x][y] == 2) { // still moving, blue;
			set(x, y, [0, 180, 225, 255]);
		}
	}
	updatePixels();
}

function reset_climbers() {
	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			climber_positions[x][y] = 0;
		}
	}
}



function keyPressed() {
	if (keyCode === ENTER) {
		state = 'go';
	} else if (keyCode === 67) {
		make_cross();
	} else if (keyCode === 86) {
	 	make_volcano();
 	}
}


function mouseDragged() {
	let rad = floor(height / 50) + 1;
	for (let i = -rad; i < rad; i++) {
		for (let j = -rad; j < rad; j++) {

			hill[mouseX + i][mouseY + j] = random(height);


		}
	}

}



function make_cross() {
	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			let dist_from_vert = width -  abs(width /2 - x) * 2; // at most max_hill_height;

			if (abs(x - y) < height / 10 || (abs(x - (height - y)) < height / 10)) {
				depth = 0;
			} else {
				depth = random(height);
			}

			hill[x][y] = depth;
		}
	}
}



function make_volcano() {

	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {

			let dist_from_hori = height - abs(height/2 - y) * 2; // at most max_hill_height;
			let dist_from_vert = width  - abs(width /2 - x) * 2; // at most max_hill_height;


			let r = random(-2, 2);

			let depth = (dist_from_vert * dist_from_hori) / width +
						(dist_from_vert + dist_from_hori) / 4 + r;

			// ensure depth is valid for mapping later;
			if (depth < 0) depth = 0;
			//if (depth > max_hill_height) depth = max_hill_height;


			hill[x][y] = depth;

		}
	}
}
