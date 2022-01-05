//Styles
const COLORS =
    [{ "name": "Pale Spring Bud", "hex": "#eeefc8", "light": "#D9DC8A", "dark": "#8a8b6a" }, // Beach
    { "name": "Wisteria", "hex": "#BA9EDC", "light": "#c1a8e0", "dark": "#826f9a" }, //Light Purple
    { "name": "Radical Red", "hex": "#FD3F60", "light": "#fd5270", "dark": "#b12c43" }, //Red
    { "name": "Star Command Blue", "hex": "#117EBE", "light": "#298bc5", "dark": "#0c5885" }, //Blue
    { "name": "Sky Blue Crayola", "hex": "#10b2da", "light": "#58c9e5", "dark": "#0b7d99" }, // Light Blue
    { "name": "Orange", "hex": "#ff6205", "light": "#ff8137", "dark": "#b34504" }, //Orange
    { "name": "Green", "hex": "#60FD3F", "light": "#80fd65", "dark": "#3a9826" }, //Green
    { "name": "Complementary Beach", "hex": "#B1E8CF", "light": "#c1edd9", "dark": "#7ca291" }, //Complementary Beach
    ];


const BACKGROUND_COLOR = COLORS[7].light;
const BOARD_BACKGROUND_COLOR = COLORS[7].hex
const BORDER_COLOR = COLORS[7].dark;
const BOARD_GRID_COLOR = COLORS[7].dark;

//Tetris rules
const DEATH_ZONE_SIZE = 2;
const NUM_COLUMNS = 10;
const NUM_ROWS = 20 + DEATH_ZONE_SIZE;
const GRID_EMPTY_VALUE = -1;
const GRID_DEATH_ZONE_VALUE = -2;
const TETROMINO_START_X = 3;
const TETROMINO_START_Y = -1;
const TETROMINO_MATRIX_DIMENSIONS = 4;
const STARTING_TICK_INTERVAL = 200;
const TETROMINO_START_ROTATION = 0;

//Gameplay Options
let tick_interval = STARTING_TICK_INTERVAL;
let tick_handler;
let grace_period_time = 400;
let grace_period = false;
let grace_period_handler;

/*
LEGEND
| 0 | 4 | 8 | 12 |
| 1 | 5 | 9 | 13 |
| 2 | 6 |10 | 14 |
| 3 | 7 |11 | 15 |
*/

const I = {
    color: 4,
    shape_options:
        [
            [8, 9, 10, 11],
            [1, 5, 9, 13],
            [8, 9, 10, 11],
            [2, 6, 10, 14],
        ],
}

const J = {
    shape_options: [
        [5, 9, 13, 12],
        [6, 10, 4, 5],
        [6, 5, 9, 13],
        [4, 8, 9, 10],
    ],
    color: 5
}

/*
LEGEND
| 0 | 4 | 8 | 12 |
| 1 | 5 | 9 | 13 |
| 2 | 6 |10 | 14 |
| 3 | 7 |11 | 15 |
*/
const L = {
    shape_options: [
        [4, 5, 9, 13],
        [8, 4, 5, 6],
        [5, 9, 13, 14],
        [8, 9, 10, 6],
    ],
    color: 3
}

const O = {
    shape_options: [
        [5, 9, 4, 8],
        [5, 9, 4, 8],
        [5, 9, 4, 8],
        [5, 9, 4, 8],
    ],
    color: 0
}

const S = {
    shape_options: [
        [4, 8, 9, 13],
        [12, 13, 9, 10],
        [0, 4, 5, 9],
        [8, 9, 5, 6],
    ],
    color: 2
}

const Z = {
    shape_options: [
        [12, 8, 9, 5],
        [8, 9, 13, 14],
        [8, 4, 5, 1],
        [4, 5, 9, 10],
    ],
    color: 6
}

const T = {
    shape_options: [
        [5, 9, 8, 13],
        [8, 9, 10, 13],
        [5, 9, 10, 13],
        [8, 9, 10, 5],
    ],
    color: 1
}

const figures = [I, O, S, Z, L, J, T]

//Status Bar
let status_bar_x;
let status_bar_w;
let status_bar;

//Game State
let board;
let tetromino_queue = [];
let tetromino_hold;
let can_swap_hold = true;
let current_tetromino;

//Others
let cols_width;
let rows_height;

//helpers for swipe detection for mobile gameplay
var xDown = null;
var yDown = null;


const sketch = (s) => {
    s.setup = () => {

        //Mobile Ver
        if (s.windowHeight > s.windowWidth) {
            cols_width = (s.windowWidth * 2 / 3) / NUM_COLUMNS; //Divide 2/3 of screen by number of cols
        } else {
            cols_width = s.windowHeight / NUM_ROWS - 1 // -1 is a small offset so game doesn't takes the entire window
        }

        rows_height = cols_width;  //Grid should always be squares

        let board_w = cols_width * NUM_COLUMNS
        let board_h = rows_height * NUM_ROWS;

        status_bar_w = board_w / 2;
        status_bar_x = cols_width * NUM_COLUMNS + 1

        board = new Tetris_Board(1, 0, board_w, board_h); //Value 1 is Padding so it doesn't clip on left border
        status_bar = new Status_Bar(status_bar_x, 0, status_bar_w, board_h);

        let canvas = s.createCanvas(board_w + status_bar_w, board_h);
        canvas.parent("tetris_viewport");
        tick_handler = start_tick_interval()
    }


    s.draw = () => {
        s.background(BACKGROUND_COLOR)

        board.draw()
        status_bar.draw()
    }

    let Tetris_Board = function (x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.grid = new Array(NUM_COLUMNS)
        this.trash = [];

        for (let i = 0; i < NUM_COLUMNS; i++) {
            this.grid[i] = new Array(NUM_ROWS).fill(GRID_EMPTY_VALUE)
            this.grid[i][0] = GRID_DEATH_ZONE_VALUE;
            this.grid[i][1] = GRID_DEATH_ZONE_VALUE;
        }

        for (let i = 0; i < NUM_COLUMNS; i++) {
            for (let j = 0; j <= DEATH_ZONE_SIZE; j++) {
                this.grid[i][j] = GRID_DEATH_ZONE_VALUE;
                this.grid[i][j] = GRID_DEATH_ZONE_VALUE;
            }
        }

        Tetromino.update_tetromino_queue();
        Tetromino.update_current_tetromino();
    }

    Tetris_Board.prototype.draw = function () {
        s.stroke(BORDER_COLOR)
        s.fill(BOARD_BACKGROUND_COLOR)
        s.strokeWeight(4);

        //Borders
        s.rect(this.x, this.y, this.w, this.h)

        //Grid
        s.stroke(BOARD_GRID_COLOR)
        s.strokeWeight(1)
        for (let i = 0; i < NUM_COLUMNS; i++) {
            s.line(this.x + (cols_width * i), this.y, this.x + (cols_width * i), this.h);
        }

        for (let i = 0; i < NUM_ROWS; i++) {
            s.line(this.x, this.y + (rows_height * i), this.w, this.y + (rows_height * i));
        }

        this.draw_trash();
        this.check_fast_drop();
        current_tetromino.draw();
    }

    Tetris_Board.prototype.tick = function () {

        //Try Move current Tetromino
        if (!this.will_collision_down(current_tetromino)) {
            current_tetromino.move_down();
            restart_grace_period_timeout();
            return;
        }

        if (grace_period) return;

        if (this.create_trash()) {
            this.game_over();
            return;
        }
        //Check for complete rows
        let full_rows = this.check_full_row()

        if (full_rows.length > 0) {
            this.delete_rows(full_rows);
        }

        Tetromino.update_current_tetromino()

        grace_period = false;
        can_swap_hold = true;
    }

    Tetris_Board.prototype.will_collision_right = function () {

        let board_offset = current_tetromino.x;
        let p;
        for (let i = 0; i < TETROMINO_MATRIX_DIMENSIONS; i++) {
            for (let j = 0; j < TETROMINO_MATRIX_DIMENSIONS; j++) {
                p = i * TETROMINO_MATRIX_DIMENSIONS + j
                for (let k = 0; k < current_tetromino.shape.length; k++) {
                    if (p === current_tetromino.shape[k]) {
                        //Si esta posición es parte de una figura
                        let relative_offset_x = board_offset + i + 1;
                        let relative_offset_y = current_tetromino.y + j;

                        if (relative_offset_x >= NUM_COLUMNS) return true;//Out of bounds

                        let nextBlockRight = this.grid[relative_offset_x][relative_offset_y];
                        if (nextBlockRight !== GRID_EMPTY_VALUE &&
                            nextBlockRight !== GRID_DEATH_ZONE_VALUE) return true;
                    }
                }
            }
        }
    }

    Tetris_Board.prototype.will_collision_left = function () {

        let board_offset = current_tetromino.x;
        let p;
        for (let i = 0; i < TETROMINO_MATRIX_DIMENSIONS; i++) {
            for (let j = 0; j < TETROMINO_MATRIX_DIMENSIONS; j++) {
                p = i * TETROMINO_MATRIX_DIMENSIONS + j
                for (let k = 0; k < current_tetromino.shape.length; k++) {
                    if (p === current_tetromino.shape[k]) {
                        //Si esta posición es parte de una figura
                        let relative_offset_x = board_offset + i - 1;
                        let relative_offset_y = current_tetromino.y + j;
                        if (relative_offset_x < 0) return true;  //Out of bounds

                        let nextBlockLeft = this.grid[relative_offset_x][relative_offset_y];
                        if (nextBlockLeft !== GRID_EMPTY_VALUE &&
                            nextBlockLeft !== GRID_DEATH_ZONE_VALUE) return true;  //Hay basura 
                    }
                }
            }
        }
    }

    Tetris_Board.prototype.will_collision_down = function (current_tetromino) {
        let p;

        for (let i = 0; i < TETROMINO_MATRIX_DIMENSIONS; i++) {
            for (let j = 0; j < TETROMINO_MATRIX_DIMENSIONS; j++) {
                p = i * TETROMINO_MATRIX_DIMENSIONS + j
                for (let k = 0; k < current_tetromino.shape.length; k++) {
                    if (p === current_tetromino.shape[k]) {
                        //Si esta posición es parte de una figura
                        let relative_offset_x = current_tetromino.x + i;
                        let relative_offset_y = current_tetromino.y + j + 1;
                        if (relative_offset_y >= NUM_ROWS) return true  //Out of bounds

                        let nextBlockDown = this.grid[relative_offset_x][relative_offset_y];
                        if (
                            nextBlockDown !== GRID_EMPTY_VALUE &&
                            nextBlockDown !== GRID_DEATH_ZONE_VALUE
                        ) return true;

                    }
                }
            }
        }

        return false;
    }

    Tetris_Board.prototype.will_collision_rotate_right = function () {

        let next_rotation = current_tetromino.rotation;
        next_rotation === 3 ? next_rotation = 0 : next_rotation++;

        let next_shape = current_tetromino.shape_options[next_rotation];

        let p;

        for (let i = 0; i < TETROMINO_MATRIX_DIMENSIONS; i++) {
            for (let j = 0; j < TETROMINO_MATRIX_DIMENSIONS; j++) {
                p = i * TETROMINO_MATRIX_DIMENSIONS + j
                for (let k = 0; k < current_tetromino.shape.length; k++) {
                    if (p === next_shape[k]) {
                        //Si esta posición es parte de una figura
                        let relative_offset_x = current_tetromino.x + i;
                        let relative_offset_y = current_tetromino.y + j;
                        if (relative_offset_y >= NUM_ROWS) return true  //Out of bounds
                        if (relative_offset_x >= NUM_COLUMNS || relative_offset_x < 0) return true  //Out of bounds

                        let nextBlockDown = this.grid[relative_offset_x][relative_offset_y];
                        if (
                            nextBlockDown !== GRID_EMPTY_VALUE &&
                            nextBlockDown !== GRID_DEATH_ZONE_VALUE//Hay basura 
                        ) return true;

                    }
                }
            }
        }

    }

    Tetris_Board.prototype.will_collision_rotate_left = function () {

        let next_rotation = current_tetromino.rotation;
        next_rotation === 0 ? next_rotation = 3 : next_rotation--;

        let next_shape = current_tetromino.shape_options[next_rotation];

        let p;

        for (let i = 0; i < TETROMINO_MATRIX_DIMENSIONS; i++) {
            for (let j = 0; j < TETROMINO_MATRIX_DIMENSIONS; j++) {
                p = i * TETROMINO_MATRIX_DIMENSIONS + j
                for (let k = 0; k < current_tetromino.shape.length; k++) {
                    if (p === next_shape[k]) {
                        //Si esta posición es parte de una figura
                        let relative_offset_x = current_tetromino.x + i;
                        let relative_offset_y = current_tetromino.y + j;
                        if (relative_offset_y >= NUM_ROWS) return true  //Out of bounds
                        if (relative_offset_x >= NUM_COLUMNS || relative_offset_x < 0) return true  //Out of bounds

                        let nextBlockDown = this.grid[relative_offset_x][relative_offset_y];
                        if (
                            nextBlockDown !== GRID_EMPTY_VALUE &&
                            nextBlockDown !== GRID_DEATH_ZONE_VALUE//Hay basura

                        ) return true;

                    }
                }
            }
        }
    }

    Tetris_Board.prototype.will_collision_rotate_180 = function () {

        let next_rotation = current_tetromino.rotation;
        next_rotation === 0 ? next_rotation = 3 : next_rotation--;
        next_rotation === 0 ? next_rotation = 3 : next_rotation--;

        let next_shape = current_tetromino.shape_options[next_rotation];

        let p;

        for (let i = 0; i < TETROMINO_MATRIX_DIMENSIONS; i++) {
            for (let j = 0; j < TETROMINO_MATRIX_DIMENSIONS; j++) {
                p = i * TETROMINO_MATRIX_DIMENSIONS + j
                for (let k = 0; k < current_tetromino.shape.length; k++) {
                    if (p === next_shape[k]) {
                        //Si esta posición es parte de una figura
                        let relative_offset_x = current_tetromino.x + i;
                        let relative_offset_y = current_tetromino.y + j + 1;
                        if (relative_offset_y >= NUM_ROWS) return true  //Out of bounds
                        if (relative_offset_x >= NUM_COLUMNS || relative_offset_x < 0) return true  //Out of bounds

                        let nextBlockDown = this.grid[relative_offset_x][relative_offset_y];
                        if (
                            nextBlockDown !== GRID_EMPTY_VALUE &&
                            nextBlockDown !== GRID_DEATH_ZONE_VALUE//Hay basura 
                        ) return true;

                    }
                }
            }
        }
    }

    Tetris_Board.prototype.hard_drop = function () {
        let ghost = new Tetromino(current_tetromino.x, current_tetromino.y, current_tetromino.w, current_tetromino.shape_options, current_tetromino.color, current_tetromino.shape)

        while (!this.will_collision_down(ghost)) {
            ghost.move_down();
        }

        current_tetromino.hard_drop(ghost.x, ghost.y);
    }

    Tetris_Board.prototype.create_trash = function () {
        let p;
        for (let i = 0; i < TETROMINO_MATRIX_DIMENSIONS; i++) {
            for (let j = 0; j < TETROMINO_MATRIX_DIMENSIONS; j++) {
                p = i * TETROMINO_MATRIX_DIMENSIONS + j
                for (let k = 0; k < current_tetromino.shape.length; k++) {
                    if (p === current_tetromino.shape[k]) {
                        //Si esta posición es parte de una figura
                        let x_offset = current_tetromino.x + i;
                        let y_offset = current_tetromino.y + j;
                        if (x_offset < 0) x_offset = 0;
                        if (y_offset >= NUM_ROWS) y_offset = NUM_ROWS - 1;
                        this.grid[x_offset][y_offset] = current_tetromino.color
                        if (y_offset <= DEATH_ZONE_SIZE) return true //Attempting to create trash above death zone will cause game to end
                    }
                }
            }
        }
    }

    Tetris_Board.prototype.draw_trash = function () {
        s.strokeWeight(2)
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[0].length; j++) {
                if (this.grid[i][j] === GRID_EMPTY_VALUE) continue;
                let color_code = Math.abs(this.grid[i][j])
                s.fill(COLORS[color_code].light);
                s.stroke(COLORS[color_code].dark)
                s.rect(cols_width * i, rows_height * j, cols_width, rows_height)
            }
        }
    }

    Tetris_Board.prototype.check_full_row = function () {
        let full_rows = [];
        for (let j = 0; j < this.grid[0].length; j++) { // Rows
            let full = true;
            for (let i = 0; i < this.grid.length; i++) { //Columns
                if (this.grid[i][j] === GRID_EMPTY_VALUE) {
                    full = false;
                    break;
                }
            }

            if (full) full_rows.push(j)
        }

        return full_rows;
    }

    Tetris_Board.prototype.delete_rows = function (row_indexes) {
        //Will delete from top to bottom so rows must be sorted
        row_indexes.sort(function (a, b) { return b - a });
        let next_row;
        while (row_indexes.length > 0) {
            next_row = row_indexes.pop();
            for (let i = next_row; i > DEATH_ZONE_SIZE + 1; i--) {
                for (let j = 0; j < NUM_COLUMNS; j++) {
                    this.grid[j][i] = this.grid[j][i - 1];
                }
            }
        }
    }

    Tetris_Board.prototype.check_fast_drop = function () {
        if (s.keyIsDown(s.DOWN_ARROW)) {

            if (board.will_collision_down(current_tetromino)) return
            current_tetromino.move_down();
        }
    }

    Tetris_Board.prototype.game_over = function () {
        for (let i = 0; i < NUM_COLUMNS; i++) {
            this.grid[i] = new Array(NUM_ROWS).fill(GRID_EMPTY_VALUE)
            this.grid[i][0] = GRID_DEATH_ZONE_VALUE;
            this.grid[i][1] = GRID_DEATH_ZONE_VALUE;
        }

        for (let i = 0; i < NUM_COLUMNS; i++) {
            for (let j = 0; j <= DEATH_ZONE_SIZE; j++) {
                this.grid[i][j] = GRID_DEATH_ZONE_VALUE;
                this.grid[i][j] = GRID_DEATH_ZONE_VALUE;
            }
        }

        tetromino_hold = null;
        tick_interval = STARTING_TICK_INTERVAL;
        Tetromino.update_current_tetromino()
    }

    let Tetromino = function (x, y, w, shape_options, color, shape) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.shape_options = shape_options;
        shape ? this.shape = shape : this.shape = shape_options[0]
        this.color = color;
        this.rotation = 0;
    }

    Tetromino.prototype.draw = function () {
        s.fill(COLORS[this.color].hex)
        s.stroke(COLORS[this.color].dark);
        s.strokeWeight(1)

        let p;
        for (let i = 0; i < TETROMINO_MATRIX_DIMENSIONS; i++) {
            for (let j = 0; j < TETROMINO_MATRIX_DIMENSIONS; j++) {
                p = i * TETROMINO_MATRIX_DIMENSIONS + j

                for (let k = 0; k < this.shape.length; k++) { //Contains, max 4 iterations so it should be fine...
                    if (p === this.shape[k]) {
                        s.rect((this.x + i) * this.w, (this.y + j) * this.w, this.w, this.w)
                        continue;
                    }
                }
            }
        }
    }

    Tetromino.prototype.move_down = function () {
        this.y++;
    }

    Tetromino.prototype.move_left = function () {
        this.x--;
    }

    Tetromino.prototype.move_right = function () {
        this.x++;
    }

    Tetromino.prototype.hard_drop = function (x, y) {
        this.x = x;
        this.y = y;
    }

    Tetromino.prototype.rotate_90_right = function () {

        if (this.rotation === 3) {
            this.rotation = 0;
        }
        else {
            this.rotation++;
        }

        this.shape = this.shape_options[this.rotation]
    }

    Tetromino.prototype.rotate_90_left = function () {

        if (this.rotation === 0) {
            this.rotation = 3;
        }
        else {
            this.rotation--;
        }

        this.shape = this.shape_options[this.rotation]
    }

    Tetromino.prototype.rotate_180 = function () {

        for (let i = 1; i <= 2; i++) {

            if (this.rotation === 3) {
                this.rotation = 0;
            }
            else {
                this.rotation++;
            }
        }

        this.shape = this.shape_options[this.rotation]
    }

    Tetromino.update_tetromino_queue = () => {
        let set = [];
        for (let i = 0; i < figures.length; i++) {
            set.push(new Tetromino(TETROMINO_START_X, TETROMINO_START_Y, cols_width, figures[i].shape_options, figures[i].color))
        }
        //Shuffle set
        for (let i = 0; i < set.length; i++) {
            let rand = Math.random() * (set.length - 1);
            rand = Math.round(rand);
            //Swap
            let temp = set[i];
            set[i] = set[rand]
            set[rand] = temp
        }
        tetromino_queue.push(...set)
    }

    Tetromino.update_current_tetromino = () => {
        current_tetromino = tetromino_queue.splice(0, 1)[0];
        if (tetromino_queue.length <= 4) Tetromino.update_tetromino_queue();
        increase_tick_speed()
    }

    Tetromino.hold = () => {
        can_swap_hold = false;
        if (!tetromino_hold) {
            tetromino_hold = current_tetromino;
            tetromino_hold = current_tetromino;
            tetromino_hold.shape = tetromino_hold.shape_options[TETROMINO_START_ROTATION]
            tetromino_hold.rotation = TETROMINO_START_ROTATION;

            Tetromino.update_current_tetromino()
            return;
        }

        //If there is already one, swap and reset
        let temp = tetromino_hold;
        tetromino_hold = current_tetromino;
        tetromino_hold.shape = tetromino_hold.shape_options[TETROMINO_START_ROTATION]
        tetromino_hold.rotation = TETROMINO_START_ROTATION;

        current_tetromino = temp;
        current_tetromino.x = 3;
        current_tetromino.y = 0;
    }

    let Status_Bar = function (x, y, w, h) {
        this.x = x;
        this.y = y;
        this.h = h;
        this.w = w;
    }

    Status_Bar.prototype.draw = function () {
        s.noFill()
        s.stroke(BORDER_COLOR);
        s.strokeWeight(4);
        s.rect(this.x, this.y, this.w - 4, this.h) //Border width has -4 offset because canvas is drawn short
        s.strokeWeight(2);

        this.display_queue()
        this.display_hold()
    }

    Status_Bar.prototype.display_queue = function () {
        let container_x = this.x + this.w / 4;
        let container_y = this.h / 16;
        let container_w = this.w / 2;
        let tetromino_cell_w = container_w / 4 - 4;
        let container_h = tetromino_cell_w * 22;

        s.rect(container_x, container_y, container_w, container_h)

        //Custom Draw for tetrominos so they fit in status bar without messing with game logic
        //Only drawing first 4 tetros
        for (let z = 0; z < 4; z++) {
            s.fill(COLORS[tetromino_queue[z].color].hex)
            s.stroke(COLORS[tetromino_queue[z].color].dark)

            let p;
            for (let i = 0; i < TETROMINO_MATRIX_DIMENSIONS; i++) {
                for (let j = 0; j < TETROMINO_MATRIX_DIMENSIONS; j++) {
                    p = i * TETROMINO_MATRIX_DIMENSIONS + j

                    for (let k = 0; k < tetromino_queue[z].shape.length; k++) {
                        if (p === tetromino_queue[z].shape[k]) {
                            /*
                                Y Explanation: Container_y = relative to status bar
                                + container_h / 22 = padding top
                                + 5 * z * tetromino_cell_w = padding top the size of 5 tetromino cells for every tetromino
                                + tetromino_cell_w * j = square on every cell where tetromino should be vertical-wise 

                            */
                            s.rect(container_x + tetromino_cell_w * i, container_y + container_h / 22 + (5 * z * tetromino_cell_w) + (tetromino_cell_w * j), tetromino_cell_w, tetromino_cell_w)
                            continue;
                        }
                    }
                }
            }
        };

    }

    Status_Bar.prototype.display_hold = function () {
        let container_x = this.x + this.w / 4;
        let container_y = this.h * 4 / 5;
        let container_w = this.w / 2;
        let tetromino_cell_w = container_w / 4 - 4;
        let container_h = tetromino_cell_w * 6;

        s.noFill()
        s.stroke(BORDER_COLOR);
        s.rect(container_x, container_y, container_w, container_h)

        if (!tetromino_hold) return;

        if (can_swap_hold) {
            s.stroke(COLORS[tetromino_hold.color].dark);
            s.fill(COLORS[tetromino_hold.color].hex)
        } else s.fill("gray")


        let p;
        for (let i = 0; i < TETROMINO_MATRIX_DIMENSIONS; i++) {
            for (let j = 0; j < TETROMINO_MATRIX_DIMENSIONS; j++) {
                p = i * TETROMINO_MATRIX_DIMENSIONS + j

                for (let k = 0; k < tetromino_hold.shape.length; k++) {
                    if (p === tetromino_hold.shape[k]) {
                        s.rect(container_x + tetromino_cell_w * i, container_y + container_h / 5 + (tetromino_cell_w * j), tetromino_cell_w, tetromino_cell_w)
                        continue;
                    }
                }
            }
        }

        s.fill(BACKGROUND_COLOR)

    }

    //Gameplay
    function increase_tick_speed() {
        let ds = 1;
        if (tick_interval >= 100)
            tick_interval -= ds;
    }

    function start_tick_interval() {
        return window.setInterval(() => {
            board.tick();
        }, tick_interval);
    }

    function start_grace_period_timeout() {
        grace_period = true;
        grace_period_handler = window.setTimeout(() => {
            grace_period = false;
        }, grace_period_time)
    }

    function restart_grace_period_timeout() {
        window.clearTimeout(grace_period_handler)
        start_grace_period_timeout()
    }

    function skip_grace_period() {
        window.clearTimeout(grace_period_handler)
        grace_period = false;
        board.tick();
    }

    // CONTROLS
    s.keyPressed = () => {

        switch (s.keyCode) {
            case s.RIGHT_ARROW:
                if (board.will_collision_right()) break;
                current_tetromino.move_right();
                restart_grace_period_timeout(grace_period_handler)
                break;
            case s.LEFT_ARROW:
                if (board.will_collision_left()) break;
                current_tetromino.move_left();
                restart_grace_period_timeout(grace_period_handler)
                break;
            case s.DOWN_ARROW:
                if (board.will_collision_down(current_tetromino)) break;
                current_tetromino.move_down();
                restart_grace_period_timeout(grace_period_handler)
                break;
            case 69: //E
                if (board.will_collision_rotate_right()) break;
                current_tetromino.rotate_90_right();
                restart_grace_period_timeout(grace_period_handler)
                break;
            case 81: //Q
                if (board.will_collision_rotate_left()) break;
                current_tetromino.rotate_90_left();
                restart_grace_period_timeout(grace_period_handler)
                break;
            case 87: //W
                if (board.will_collision_rotate_left()) break;
                current_tetromino.rotate_180();
                restart_grace_period_timeout(grace_period_handler)
                break;
            case 32: //Spacebar
                board.hard_drop();
                skip_grace_period()
                break;
            case 16: //Shift
                if (!can_swap_hold) break;
                Tetromino.hold()
                break;

            default:
                break;
        }
    }

    s.mousePressed = () => {

        if (grace_period) {
            restart_grace_period_timeout(grace_period_handler)
        }

        if (board.will_collision_rotate_right()) return;
        current_tetromino.rotate_90_right();
    }

    //Swipe detection for mobile gameplay
    function getTouches(evt) {
        return evt.touches ||             // browser API
            evt.originalEvent.touches; // jQuery
    }

    s.touchStarted = (evt) => {
        const firstTouch = getTouches(evt)[0];
        xDown = firstTouch.clientX;
        yDown = firstTouch.clientY;
    };

    s.touchMoved = (evt) => {
        if (!xDown || !yDown) {
            return;
        }

        var xUp = evt.touches[0].clientX;
        var yUp = evt.touches[0].clientY;

        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
            if (xDiff > 0) {
                if (!board.will_collision_left())
                    current_tetromino.move_left();

            } else {
                if (!board.will_collision_right())
                    current_tetromino.move_right();
            }
        } else {
            if (yDiff > 0) {
                //Swipe Up
                if (can_swap_hold)
                    Tetromino.hold()
            } else {
                //Swipe down
                if (!board.will_collision_rotate_right())
                    current_tetromino.rotate_90_right();
            }
        }
        /* reset values */
        xDown = null;
        yDown = null;
    };

}



let myp5 = new p5(sketch);