
var capturer = new CCapture(
	{format: 'png',
	 framerate: 60}
 );

// ffmpeg -r 240 -f image2 -s 540x540 -i "%07d.png" -vcodec libx264 -crf 17 -pix_fmt yuv420p output.mp4

var pop_amount = 1000;
var mutation_rate = 0.01;

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

	//
	// for (let x = 0; x < width; x++) {
	// 	for (let y = 0; y < height; y++) {
	// 		//
	// 		// if (abs(x_pos - x) < r && abs(y_pos - y) < r) {
	// 		// 	depth = random(50, 100);
	// 		// }
	//
	// 		let depth = 0;
	//
	// 		if (abs(abs(floor(height*tan(x)))-y) < 2) {
	// 			let r = random(50, 100);
	// 			depth = r;
	// 		} else if (abs(abs(floor(height*sin(y)))-x) < 2) {
	// 			let r = random(50, 100);
	// 			depth = r;
	// 		}
	//
	//
	//
	// 		hill[x][y] += depth;
	// 	}
	// }



	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			let dist_from_vert = width -  abs(width /2 - x) * 2; // at most max_hill_height;
			let dist_from_hori = height - abs(height/2 - y) * 2; // at most max_hill_height;

			let r = random(-2, 2);

			let depth = (dist_from_vert * dist_from_hori) / width +
						(dist_from_vert + dist_from_hori) / 4 + r;

			// ensure depth is valid for mapping later;
			if (depth < 0) depth = 0;
			//if (depth > max_hill_height) depth = max_hill_height;

			if (abs(x - y) < height / 10 || (abs(x - (100 - y)) < height / 10)) {
				depth = 0;
			} else {
				depth = random(100);
			}

			hill[x][y] = depth;
		}
	}



		// // create a valley through the mountain
		//
		// let x_val = width / 2 - x; // suppose the grid is a cartesian plane;
		// let y_val = floor((pow(x_val, 3))/200) + height/2;
		// if (y_val < height && y_val >= 0) {
		// 	hill[x][y_val]   = floor(random(5, max_hill_height / 2));
		// 	for (let num = 1; num < (height / 30) + 1; num++) {
		// 		hill[x][y_val + num] = floor(random(5, max_hill_height / 2));
		// 		hill[x][y_val + num] = floor(random(5, max_hill_height / 2));
		// 	}
		// }

	// }

	// display the hill;
	display_hill();

	population = new Population(pop_amount);
	population.populate();
	console.log('Gen ' + generation)

}

//function mouse



function draw() {

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
			set(x, y, blue);
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
