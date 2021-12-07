
var climber_positions = [];

function Population(amount) {
    this.amount = amount;

    this.population = [];

    this.best_route;

    this.populate = function() {
        for (let i = 0; i < this.amount; i++) {
            this.population[i] = new pathDNA(0, floor(random(height)));
            this.population[i].populate();
        }
    }

    this.move_once = function(index) {
        this.all_finished = false;
        this.finished = 0;

        for (let i = 0; i < this.amount; i++) {

            if (!(this.population[i].reached)) {
                this.population[i].update_position(index);
            } else {
                this.finished++;
                if (this.finished >= this.amount) {
                    this.all_finished = true;
                }
            }

            // display the path
            let curr_x = this.population[i].curr.x;
            let curr_y = this.population[i].curr.y;

            let prev_x = this.population[i].prev.x;
            let prev_y = this.population[i].prev.y;

            climber_positions[curr_x][curr_y] = 1; // i.e. there is something there;
            climber_positions[prev_x][prev_y] = 0; // i.e. remove old climber pos;
            if (this.population[i].reached) {
                climber_positions[curr_x][curr_y] = 2; // finished, set to blue;
            }

        }

        return this.all_finished;
    }

    this.sum = 0;

    this.find_fitness = function() {

        for (let i = 0; i < this.amount; i++) {
            let curr_fitness = (100 ** 5) / (this.population[i].curr_fitness ** 5);


            // // major penalty for not reaching the end;
            // if (!(this.population[i].reached)) {
            //     curr_fitness *= 0.1;
            //
            //     // further gone gives more score
            //     curr_fitness *= (this.population[i].curr.x / width);
            // }

            this.population[i].fitness_score = curr_fitness;

            this.sum += this.population[i].fitness_score;
        }

    }

    this.reproduce = function() {
        let new_pop = new Population(pop_amount);

        for (let n = 0; n < pop_amount; n+=2) {
            let climber1 = rand_climber(this.sum);
            let climber2 = rand_climber(this.sum);

            let c1 = new pathDNA(climber1.init_x, climber1.init_y);
            let c2 = new pathDNA(climber2.init_x, climber2.init_y);

            c1.path = crossover(climber1, climber2);
            c2.path = crossover(climber2, climber1);

            c1.mutate(mutation_rate);
            c2.mutate(mutation_rate);

            new_pop.population[n]     = c1;
            new_pop.population[n + 1] = c2;
        }

        population = new_pop;


    }

    function rand_climber(sum) {
        let idx = 0;
        let r = random(sum);

        while (r > 0) {
            r -= population.population[idx].fitness_score;
            idx++;
        }

        idx--;

        return population.population[idx];

    }

    this.best_fitness = function() {
        let max_fitness = {
            score: -1,
            idx: 0,
            print: false
        };

        for (let i = 0; i < this.amount; i++) {
            let fitness = this.population[i].curr_fitness;

            if ((fitness < max_fitness.score || max_fitness.score < 0) &&
                (population.population[i].reached)) {
                max_fitness.score = fitness;
                max_fitness.idx = i;
                max_fitness.print = true;
            }
        }
        if (max_fitness.print) {
            console.log('best fitness: ' + max_fitness.score);
        }

        if (max_fitness.score == 0) {
            this.best_route = this.population[max_fitness.idx];
            climber_best();
            noLoop();
        }
    }


}


function climber_best() {
    population.best_route.find_xypath();

    let best_path = population.best_route.xypath;

    reset_climbers();

    for (let i = 0; i < best_path.length; i++) {
        climber_positions[best_path[i][0]][best_path[i][1]] = 1;
    }




}
