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



const I = {
    color: "CYAN",
    shape_options:
        [
            [4, 5, 6, 7],
            [1, 5, 9, 13],
            [8, 9, 10, 11],
            [2, 6, 10, 14],
        ],
}

const J = {
    shape_options: [
        [6, 10,13, 14],
        [6, 10, 4, 5],
        [6,5, 9, 13],
        [4, 8, 9, 10],
    ],
    color: "ORANGE"
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
        [4,5,9,13],
        [8, 4, 5, 6],
        [5, 9, 13, 14],
        [8, 9, 10, 6],
    ],
    color: "BLUE"
}

const O = {
    shape_options: [
        [4,8,5,9],
        [4,8,5,9],
        [4,8,5,9],
        [4,8,5,9]
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
        [4, 8, 9, 13    ],
        [9, 10, 14, 15],
        [4, 8, 9, 13],
        [5, 6, 10, 11],
    ],
    color: "GREEN"
}

const T = {
    shape_options: [
        [5,9, 8, 13],
        [8, 9,10, 13],
        [5, 9, 10, 13],
        [8, 9, 10, 5],
    ],
    color: "PURPLE"
}

const figures = [I, O, S, Z, L, J, T]

//Game State
let board;
let tetromino_queue = [];
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
        offset = div.clientHeight;
        div.style.display = "none";

        //Grid should always be squares so
        rows_height = height / NUM_ROWS;
        cols_width = rows_height

        board = new Tetris_Board(1, 0, cols_width * NUM_COLUMNS, height);
        //Value 1 is Padding so it doesn't clip on left border
    }

    setInterval(() => {
        board.tick();
    }, tick_interval);

    s.draw = () => {
        s.background(0)
        board.draw()
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

        /*
        for (let i = 0; i < this.trash.length; i++) {
            this.trash[i].draw()
        }
*/
        this.draw_trash();
        this.check_fast_drop();
        current_tetromino.draw();
    }

    Tetris_Board.prototype.tick = function () {

        //Try Move current Tetromino
        if (!this.will_collision_down())
            current_tetromino.move_down();
        else { //Next Tetromino
            this.create_trash()
            current_tetromino = Tetromino.new_tetromino()
            //Check for complete rows
            let full_rows = this.check_full_row()
            if (full_rows.length > 0) {
                this.delete_rows(full_rows);
            }
            //todo
        }
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

    let Tetromino = function (x, y, shape_options, color, shape) {
        this.x = x;
        this.y = y;
        this.shape_options = shape_options;
        shape ? this.shape = shape : this.shape = shape_options[0]
        this.color = color;
        this.rotation = 0;
    }

    Tetromino.prototype.draw = function () {
        s.fill(this.color)
        let p;
        for (let i = 0; i < TETROMINO_MATRIX_DIMENSIONS; i++) {
            for (let j = 0; j < TETROMINO_MATRIX_DIMENSIONS; j++) {
                p = i * TETROMINO_MATRIX_DIMENSIONS + j

                for (k = 0; k < this.shape.length; k++) { //Contains, max 4 iterations so it should be fine...
                    if (p === this.shape[k]) {
                        s.rect((this.x + i) * cols_width, (this.y + j) * rows_height, cols_width, rows_height)
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

    Tetromino.new_tetromino = () => {
        let rand = Math.floor(Math.random() * figures.length);
        return new Tetromino(3, 0, figures[rand].shape_options, figures[rand].color)
    }

    Tetromino.trash_tetromino = () => {
        return new Tetromino(current_tetromino.x, current_tetromino.y, current_tetromino.shape_options[current_tetromino.rotation], current_tetromino.color)
    }

    Tetromino.setup_queue = () => {
        for (let i = 0; i < 4; i++) {
            tetromino_queue.push(Tetromino.new_tetromino())
        }
    }

    Tetromino.update_current_tetromino = () => {
        current_tetromino = tetromino_queue.splice(0, 1)[0];
        tetromino_queue.push(Tetromino.new_tetromino())
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
            case 81: //E
                if (board.will_collision_rotate_left()) break;
                current_tetromino.rotate_90_left();
                break;

            default:
                break;
        }
    }
}

let myp5 = new p5(sketch);