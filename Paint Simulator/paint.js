const width = 600;
const height = 400;
var figures = [];
var clickOn = false;
var lineclickOn = false;
var quadclickOn = false;
var placeholder;

function setup() {
    createCanvas(width, height);
}

function draw() {
    background(0);
    drawPoints();

    for (let i = 0; i < figures.length; i++) {
        figures[i].show();
    }

    if (clickOn) {
        placeholder.x = mouseX;
        placeholder.y = mouseY;
        placeholder.show();
    }

    if (lineclickOn) {
        placeholder.x1 = mouseX;
        placeholder.y1 = mouseY;
        placeholder.x2 = width / 2;
        placeholder.y2 = height / 2;
        placeholder.show();
    }

    if(quadclickOn){
        placeholder.x1 = mousePositions[0];
        placeholder.y1 = mousePositions[1];
        placeholder.x2 = mousePositions[2];
        placeholder.y2 = mousePositions[3];
        placeholder.x3 = mousePositions[4];
        placeholder.y3 = mousePositions[5];
        placeholder.x4 = mouseX;
        placeholder.y4 = mouseY;
        placeholder.show();

    }

    if ((clickOn || lineclickOn || quadclickOn) && mouseIsPressed) {
        figures.push(placeholder);
        clickOn = false;
        lineclickOn = false;
        quadclickOn = false;
        placeholder = null;
        cont = 0;
    }
}

$("#Create_Square_Btn").click(function (e) {
    e.preventDefault();
    placeholder = new square(mouseX, mouseY, 30, 200);
    clickOn = true;
});

$("#Create_Circle_Btn").click(function (e) {
    e.preventDefault();
    placeholder = new circle(mouseX, mouseY, 30, 200);
    clickOn = true;
});

$("#Create_Line_Btn").click(function (e) {
    e.preventDefault();
    placeholder = new pline(width / 2, height / 2, mouseX, mouseY);
    lineclickOn = true;
});

$("#Create_Quad_Btn").click(function (e) {
    e.preventDefault();
    cont = 5;
    placeholder = new fquad(mousePositions[cont-5],mousePositions[cont-4],mousePositions[cont-3],mousePositions[cont-2],mousePositions[cont-1],mousePositions[cont],mouseX, mouseY);
    quadclickOn = true;
});

var mousePositions = [0,0,100,100,200,200,150,150];
var cont = 0;
function mousePressed() {
    mousePositions[cont] = mouseX;
    cont+=1;
    mousePositions[cont] = mouseY;
    cont += 1;
    if(cont >= 6){
        cont = 0;
    }
}

function drawPoints(){
    fill(255);
    point(mousePositions[0], mousePositions[1]);
    point(mousePositions[2], mousePositions[3]);
    point(mousePositions[4], mousePositions[5]);
}