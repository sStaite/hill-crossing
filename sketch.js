
var pop_amount = 200;

var hill = [];
var population;
var max_hill_height;
var index = 0;
var generation = 1;
var total_pixels;

function setup() {
	createCanvas(100, 100);
	background(0);
	frameRate(60);
	total_pixels = 4 * width * height;

	// creating the hill;
	max_hill_height = height;
	for (let i = 0; i < height; i++) {
		hill[i] = new Array(width).fill(0);
	}

	// creating the climber_positions;
	for (let i = 0; i < height; i++) {
		climber_positions[i] = new Array(width).fill(0);
	}


	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			let dist_from_cent = width - abs(width/2 - x) * 2; // at most max_hill_height;
			let r = random(-2, 2);

			let depth = dist_from_cent + r;

			// ensure depth is valid for mapping later;
			if (depth < 0) depth = 0;
			if (depth > max_hill_height) depth = max_hill_height;

			hill[x][y] = depth;
		}

		// create a valley through the mountain
		let x_val = width / 2 - x; // suppose the grid is a cartesian plane;
		let y_val = floor((pow(x_val, 3))/200) + height/2;
		if (y_val < height && y_val >= 0) {
			hill[x][y_val]   = floor(random(5, max_hill_height / 2));
			for (let num = 1; num < (height / 30) + 1; num++) {
				hill[x][y_val + num] = floor(random(5, max_hill_height / 2));
				hill[x][y_val + num] = floor(random(5, max_hill_height / 2));
			}


		}

	}

	// display the hill;
	display_hill();

	population = new Population(pop_amount);
	console.log('Gen ' + generation)

}

function draw() {
	population.move_once(index);
	index ++;

	if (index >= population.population[0].path.length) {
		generation++;

		// evaluate fitness
		// reproduce
		index = 0;
		console.log('Gen ' + generation);
	}

	display_hill();
	display_climbers();

	// noLoop();
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
	updatePixels();
}


function display_climbers() {
	pixelDensity(1);
	for (let i = 0; i < total_pixels; i+=4) {
		let y = floor((i / 4) / height);
		let x = (i / 4) % width;

		if (climber_positions[x][y] != 0) {
			set(x, y, 200);
		}


	}
	updatePixels();
}
