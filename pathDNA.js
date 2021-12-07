
const directions = ['f', 'b', 'r', 'l'];

function pathDNA(init_x, init_y) {
    this.init_x = init_x;
    this.init_y = init_y;
    this.reached = false;

    this.x_arr = [];
    this.y_arr = [];

    this.curr_x = this.init_x;
    this.curr_y = this.init_y;

    this.path = [];
    for (let i = 0; i < width * 4; i++) {
        this.path[i] = random(directions)
    }

    this.update_position = function(index) {

        this.x_arr.push(this.curr_x);
        this.y_arr.push(this.curr_y);

        if (this.path[index] === 'f') {
            this.curr_x += 1;
        } else if (this.path[index] === 'b') {
            this.curr_x -= 1;
        } else if (this.path[index] === 'r') {
            this.curr_y += 1;
        } else if (this.path[index] === 'l') {
            this.curr_y -= 1;
        }

        if (this.curr_y < 0) {
            this.curr_y = 0;
        }
        if (this.curr_x < 0) {
            this.curr_x = 0;
        }
        if (this.curr_y >= height) {
            this.curr_y = height - 1;
        }
        if (this.curr_x >= width) {
            this.reached = true;
            this.curr_x = width - 1;
        }

    }


}
