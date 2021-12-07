
const directions = ['f', 'r', 'l'];

function pathDNA(init_x, init_y) {
    this.init_x = init_x;
    this.init_y = init_y;
    this.reached = false;
    this.curr_fitness = 0;

    this.fitness_score;

    this.prev = {
        x: null,
        y: null,
        cost: null
    }

    this.curr = {
        x: init_x,
        y: init_y,
        cost: hill[init_x][init_y]
    }


    this.path = [];

    this.populate = function() {
        for (let i = 0; i < moves; i++) {
            this.path[i] = random(directions)
        }
    }

    this.update_position = function(index) {

        this.prev.x = this.curr.x;
        this.prev.y = this.curr.y;
        this.prev.cost = this.curr.cost;

        if (!(this.reached)) {
            if (this.path[index] === 'f') {
                this.curr.x += 1;
            } else if (this.path[index] === 'b') {
                this.curr.x -= 1;
            } else if (this.path[index] === 'r') {
                this.curr.y += 1;
            } else if (this.path[index] === 'l') {
                this.curr.y -= 1;
            }

            if (this.curr.y < 0) {
                this.curr.y = 0;
            }
            if (this.curr.x < 0) {
                this.curr.x = 0;
            }
            if (this.curr.y >= height) {
                this.curr.y = height - 1;
            }
            if (this.curr.x >= width) {
                this.reached = true;
                this.curr.x = width - 1;
            }

            this.curr.cost = hill[this.curr.x][this.curr.y];

            this.curr_fitness += abs(this.curr.cost - this.prev.cost);
        }

    }

    this.mutate = function(rate) {
        for (let i = 0; i < moves; i++) {
            if (random(1) < rate) {
                this.path[i] = random(directions);
            }

            if (random(1) < rate) {
                this.init_y = floor(random(height));
            }
        }
    }

}


function crossover(climber1, climber2) {
    let index = floor(random(moves));
    let result = climber1.path.slice(0, index).concat(climber2.path.slice(index, moves));
    return result;
}
