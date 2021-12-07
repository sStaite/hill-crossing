
var climber_positions = [];

function Population(amount) {
    this.amount = amount;

    this.population = [];
    for (let i = 0; i < this.amount; i++) {
        this.population[i] = new pathDNA(0, floor(random(width)));
    }

    this.move_once = function(index) {
        for (let i = 0; i < this.amount; i++) {
            this.population[i].update_position(index);

            // display the path
            let x = this.population[i].curr_x;
            let y = this.population[i].curr_y;

            climber_positions[x][y] = 1; // i.e. there is something there;

            if (this.population[i].x_arr.length > 1) {
                let val = this.population[i].x_arr.length - 2;
                climber_positions[this.population[i].x_arr[val]]
                                 [this.population[i].y_arr[val]] = 0;
            }
        }
    }

}
