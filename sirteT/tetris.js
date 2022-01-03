//Dom
let width;
let height;

//Styles
const BACKGROUND_COLOR = 0
const BOARD_BORDER_COLOR = "#FFFFFF"
const BOARD_GRID_COLOR = "GRAY"
const COLORS = ["CYAN", "ORANGE", "BLUE", "RED", "GREEN", "PURPLE", "YELLOW"]

//Tetris rules
const NUM_COLUMNS = 10;
const NUM_ROWS = 20;
const TETROMINO_START_POSITION = 6;
const GRID_EMPTY_VALUE = -2;
const GRID_CURRENT_TETROMINO_VALUE = -2;

const TETROMINO_MATRIX_DIMENSIONS = 4;

//Gameplay Options
let dy = 1;
let dx = 1;
let tick_interval = 1000;


/*
LEGEND
| 0 | 4 | 8 | 12 |
| 1 | 5 | 9 | 13 |
| 2 | 6 |10 | 14 |
| 3 | 7 |11 | 15 |
*/

const I = {
    color: "CYAN",
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
        [6, 10, 13, 14],
        [6, 10, 4, 5],
        [6, 5, 9, 13],
        [4, 8, 9, 10],
    ],
    color: "ORANGE"
}

const L = {
    shape_options: [
        [4, 5, 9, 13],
        [8, 4, 5, 6],
        [5, 9, 13, 14],
        [8, 9, 10, 6],
    ],
    color: "BLUE"
}

const O = {
    shape_options: [
        [8, 12, 9, 13],
        [8, 12, 9, 13],
        [8, 12, 9, 13],
        [8, 12, 9, 13]
    ],
    color: "YELLOW"
}

const S = {
    shape_options: [
        [12, 8, 9, 5],
        [12, 13, 9, 10],
        [14, 10, 11, 7],
        [11, 10, 14, 13],
    ],
    color: "RED"
}

const Z = {
    shape_options: [
        [4, 8, 9, 13],
        [9, 10, 14, 15],
        [4, 8, 9, 13],
        [5, 6, 10, 11],
    ],
    color: "GREEN"
}

const T = {
    shape_options: [
        [5, 9, 8, 13],
        [8, 9, 10, 13],
        [5, 9, 10, 13],
        [8, 9, 10, 5],
    ],
    color: "PURPLE"
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

const sketch = (s) => {


    s.preload = () => {

    }

    s.setup = () => {

        //Board
        width = document.getElementById("tetris_viewport").clientWidth;
        height = document.getElementById("tetris_viewport").clientHeight;
        let canvas = s.createCanvas(width, height);
        canvas.parent("tetris_viewport");

        //Setup Board Canvas
        let div = document.getElementById("game_board");
        div.style.display = "none";

        rows_height = height / NUM_ROWS;
        cols_width = rows_height //Grid should always be squares so
        let board_w = cols_width * NUM_COLUMNS

        //Status board DOM position 
        status_bar_w = board_w / 3
        status_bar_x = cols_width * NUM_COLUMNS + 1

        board = new Tetris_Board(1, 0, board_w, height); //Value 1 is Padding so it doesn't clip on left border
        status_bar = new Status_Bar(status_bar_x, 0, status_bar_w, height);
    }

    setInterval(() => {
        board.tick();
    }, tick_interval);

    s.draw = () => {
        s.background(0)
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
        }

        Tetromino.setup_queue();
        Tetromino.update_current_tetromino();
    }

    Tetris_Board.prototype.draw = function () {
        s.stroke(BOARD_BORDER_COLOR)
        s.fill(BACKGROUND_COLOR)

        //Borders
        s.rect(this.x, this.y, this.x + this.w, this.y + this.h)

        //Grid
        s.stroke(BOARD_GRID_COLOR)
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
        if (!this.will_collision_down()) {
            current_tetromino.move_down();
            return;
        }

        if (this.create_trash()) this.game_over();
        //Check for complete rows
        let full_rows = this.check_full_row()

        if (full_rows.length > 0) {
            this.delete_rows(full_rows);
        }

        Tetromino.update_current_tetromino() //Spawn Tetromino (3,-2)
        can_swap_hold = true;


    }

    Tetris_Board.prototype.will_collision_right = function () {

        let board_offset = current_tetromino.x;

        for (let i = 0; i < TETROMINO_MATRIX_DIMENSIONS; i++) {
            for (let j = 0; j < TETROMINO_MATRIX_DIMENSIONS; j++) {
                p = i * TETROMINO_MATRIX_DIMENSIONS + j
                for (k = 0; k < current_tetromino.shape.length; k++) {
                    if (p === current_tetromino.shape[k]) {
                        //Si esta posición es parte de una figura
                        let relative_offset_x = board_offset + i + 1;
                        let relative_offset_y = current_tetromino.y + j;

                        if (relative_offset_x >= NUM_COLUMNS) return true;//Out of bounds

                        let nextBlockRight = this.grid[relative_offset_x][relative_offset_y];
                        if (nextBlockRight != GRID_EMPTY_VALUE) return true;
                    }
                }
            }
        }
    }

    Tetris_Board.prototype.will_collision_left = function () {

        let board_offset = current_tetromino.x;

        for (let i = 0; i < TETROMINO_MATRIX_DIMENSIONS; i++) {
            for (let j = 0; j < TETROMINO_MATRIX_DIMENSIONS; j++) {
                p = i * TETROMINO_MATRIX_DIMENSIONS + j
                for (k = 0; k < current_tetromino.shape.length; k++) {
                    if (p === current_tetromino.shape[k]) {
                        //Si esta posición es parte de una figura
                        let relative_offset_x = board_offset + i - 1;
                        let relative_offset_y = current_tetromino.y + j;
                        if (relative_offset_x < 0) return true;  //Out of bounds

                        let nextBlockLeft = this.grid[relative_offset_x][relative_offset_y];
                        if (nextBlockLeft != GRID_EMPTY_VALUE) return true;  //Hay basura 
                    }
                }
            }
        }
    }

    Tetris_Board.prototype.will_collision_down = function () {
        let p;

        for (let i = 0; i < TETROMINO_MATRIX_DIMENSIONS; i++) {
            for (let j = 0; j < TETROMINO_MATRIX_DIMENSIONS; j++) {
                p = i * TETROMINO_MATRIX_DIMENSIONS + j
                for (k = 0; k < current_tetromino.shape.length; k++) {
                    if (p === current_tetromino.shape[k]) {
                        //Si esta posición es parte de una figura
                        let relative_offset_x = current_tetromino.x + i;
                        let relative_offset_y = current_tetromino.y + j + 1;
                        if (relative_offset_y >= NUM_ROWS) return true  //Out of bounds

                        let nextBlockDown = this.grid[relative_offset_x][relative_offset_y];
                        if (
                            nextBlockDown != GRID_EMPTY_VALUE //Hay basura 
                        ) return true;

                    }
                }
            }
        }
    }

    Tetris_Board.prototype.will_collision_rotate_right = function () {

        let next_rotation = current_tetromino.rotation;
        next_rotation === 3 ? next_rotation = 0 : next_rotation++;

        let next_shape = current_tetromino.shape_options[next_rotation];

        let p;

        for (let i = 0; i < TETROMINO_MATRIX_DIMENSIONS; i++) {
            for (let j = 0; j < TETROMINO_MATRIX_DIMENSIONS; j++) {
                p = i * TETROMINO_MATRIX_DIMENSIONS + j
                for (k = 0; k < current_tetromino.shape.length; k++) {
                    if (p === next_shape[k]) {
                        //Si esta posición es parte de una figura
                        let relative_offset_x = current_tetromino.x + i;
                        let relative_offset_y = current_tetromino.y + j + 1;
                        if (relative_offset_y >= NUM_ROWS) return true  //Out of bounds
                        if (relative_offset_x >= NUM_COLUMNS || relative_offset_x < 0) return true  //Out of bounds

                        let nextBlockDown = this.grid[relative_offset_x][relative_offset_y];
                        if (
                            nextBlockDown != GRID_EMPTY_VALUE //Hay basura 
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
                for (k = 0; k < current_tetromino.shape.length; k++) {
                    if (p === next_shape[k]) {
                        //Si esta posición es parte de una figura
                        let relative_offset_x = current_tetromino.x + i;
                        let relative_offset_y = current_tetromino.y + j + 1;
                        if (relative_offset_y >= NUM_ROWS) return true  //Out of bounds
                        if (relative_offset_x >= NUM_COLUMNS || relative_offset_x < 0) return true  //Out of bounds

                        let nextBlockDown = this.grid[relative_offset_x][relative_offset_y];
                        if (
                            nextBlockDown != GRID_EMPTY_VALUE //Hay basura 
                        ) return true;

                    }
                }
            }
        }

    }

    Tetris_Board.prototype.create_trash = function () {

        for (let i = 0; i < TETROMINO_MATRIX_DIMENSIONS; i++) {
            for (let j = 0; j < TETROMINO_MATRIX_DIMENSIONS; j++) {
                p = i * TETROMINO_MATRIX_DIMENSIONS + j
                for (k = 0; k < current_tetromino.shape.length; k++) {
                    if (p === current_tetromino.shape[k]) {
                        //Si esta posición es parte de una figura
                        let x_offset = current_tetromino.x + i;
                        let y_offset = current_tetromino.y + j;
                        if (x_offset < 0) x_offset = 0;
                        if (y_offset >= NUM_ROWS) y_offset = NUM_ROWS - 1;
                        this.grid[x_offset][y_offset] = current_tetromino.color
                        //this.trash.push(current_tetromino)
                        if (y_offset <= 0) return true //Attempting to create trash on top will cause game to end
                    }
                }
            }
        }
    }

    Tetris_Board.prototype.draw_trash = function () {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[0].length; j++) {
                if (this.grid[i][j] === GRID_EMPTY_VALUE) continue;
                s.fill(this.grid[i][j]);
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
            for (let i = next_row; i >= 1; i--) {
                for (let j = 0; j < NUM_COLUMNS; j++) {
                    this.grid[j][i] = this.grid[j][i - 1];
                }
            }
        }
    }

    Tetris_Board.prototype.check_fast_drop = function () {
        if (s.keyIsDown(s.DOWN_ARROW)) {
            if (board.will_collision_down()) return
            current_tetromino.move_down();
        }
    }

    Tetris_Board.prototype.game_over = function () {
        alert("Gg")
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[0].length; j++) {
                this.grid[i][j] = GRID_EMPTY_VALUE;
            }
        }
        tetromino_hold = null;
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
        s.fill(this.color)
        s.stroke("PINK");
        s.strokeWeight(3)

        let p;
        for (let i = 0; i < TETROMINO_MATRIX_DIMENSIONS; i++) {
            for (let j = 0; j < TETROMINO_MATRIX_DIMENSIONS; j++) {
                p = i * TETROMINO_MATRIX_DIMENSIONS + j

                for (k = 0; k < this.shape.length; k++) { //Contains, max 4 iterations so it should be fine...
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

    Tetromino.new_random_tetromino = () => {
        let rand = Math.floor(Math.random() * figures.length);

        //New Tetrominos are spawned to status bar first so X and Y correspond to queue container, values are updated when current Tetromino is updated
        return new Tetromino(3, 0, cols_width, figures[rand].shape_options, figures[rand].color)
    }

    Tetromino.setup_queue = () => {
        for (let i = 0; i < 4; i++) {
            tetromino_queue.push(Tetromino.new_random_tetromino())
        }
    }

    Tetromino.update_current_tetromino = () => {
        current_tetromino = tetromino_queue.splice(0, 1)[0];
        tetromino_queue.push(Tetromino.new_random_tetromino())
    }

    Tetromino.hold = () => {
        can_swap_hold = false;
        if(!tetromino_hold){
            tetromino_hold = current_tetromino;
            Tetromino.update_current_tetromino()
            return;
        }

        //If there is already one, swap and reset
        let temp = tetromino_hold;
        tetromino_hold = current_tetromino;
        current_tetromino = temp;
        current_tetromino.x = 3;
        current_tetromino.y = 0;
    }

    s.keyPressed = () => {
        switch (s.keyCode) {
            case s.RIGHT_ARROW:
                if (board.will_collision_right()) break;
                current_tetromino.move_right();
                break;
            case s.LEFT_ARROW:
                if (board.will_collision_left()) break;
                current_tetromino.move_left();
                break;
            case s.DOWN_ARROW:
                if (board.will_collision_down()) break;
                current_tetromino.move_down();
                break;
            case 69: //E
                if (board.will_collision_rotate_right()) break;
                current_tetromino.rotate_90_right();
                break;
            case 81: //Q
                if (board.will_collision_rotate_left()) break;
                current_tetromino.rotate_90_left();
                break;
                case 16: //Shift
                if(!can_swap_hold) break;
                    Tetromino.hold()
                break;

            default:
                break;
        }
    }

    let Status_Bar = function (x, y, w, h) {
        this.x = x;
        this.y = y;
        this.h = h;
        this.w = w;
    }

    Status_Bar.prototype.draw = function () {
        s.noFill()
        s.rect(this.x, this.y, this.w, this.h) //Border

        this.display_queue()
        this.display_hold()
    }

    Status_Bar.prototype.display_queue = function () {
        let container_x = this.x + this.w / 4;
        let container_y = this.h / 16;
        let container_w = this.w / 2;
        let tetromino_cell_w = container_w / 4 - 4;
        let container_h = tetromino_cell_w * 22;

        s.stroke("WHITE");
        s.strokeWeight(3);
        s.rect(container_x, container_y, container_w, container_h)

        //Custom Draw for tetrominos so they fit in status bar without messing with game logic
        tetromino_queue.forEach((t, z) => {
            s.fill(t.color)
            let p;
            for (let i = 0; i < TETROMINO_MATRIX_DIMENSIONS; i++) {
                for (let j = 0; j < TETROMINO_MATRIX_DIMENSIONS; j++) {
                    p = i * TETROMINO_MATRIX_DIMENSIONS + j

                    for (k = 0; k < t.shape.length; k++) {
                        if (p === t.shape[k]) {
                            //Don't expect to understand this
                            s.rect(container_x + tetromino_cell_w * i, container_h / 22 + (container_y + 5 * z * tetromino_cell_w) + (tetromino_cell_w * j), tetromino_cell_w, tetromino_cell_w)
                            continue;
                        }
                    }
                }
            }
        });

    }

    Status_Bar.prototype.display_hold = function () {


        let container_x = this.x + this.w / 4;
        let container_y = this.h / 2;
        let container_w = this.w / 2;
        let tetromino_cell_w = container_w / 4 - 4;
        let container_h = tetromino_cell_w * 5;

        s.stroke("WHITE");
        s.strokeWeight(3);
        s.noFill()
        s.rect(container_x, container_y, container_w, container_h)

        if (!tetromino_hold) return;

        can_swap_hold ? s.fill(tetromino_hold.color) : s.fill("gray")
        
        let p;
        for (let i = 0; i < TETROMINO_MATRIX_DIMENSIONS; i++) {
            for (let j = 0; j < TETROMINO_MATRIX_DIMENSIONS; j++) {
                p = i * TETROMINO_MATRIX_DIMENSIONS + j

                for (k = 0; k < tetromino_hold.shape.length; k++) {
                    if (p === tetromino_hold.shape[k]) {
                        //Don't expect to understand this
                        s.rect(container_x + tetromino_cell_w * i, container_y + container_h / 4 + (tetromino_cell_w * j), tetromino_cell_w, tetromino_cell_w)
                        continue;
                    }
                }
            }
        }

    }
}

let myp5 = new p5(sketch);