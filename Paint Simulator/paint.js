const width = 600;
const height = 400;
var figures = [];
var clickOn = false;
var lineclickOn = false;
var quadclickOn = false;
var triangleclickOn = false;
var placeholder;
var mousePositions;
var cont = 0;
var canvas;

function setup() {
    canvas = createCanvas(width, height);
    canvas.parent('paint');
    mousePositions = [10,10,300,300,200,200,100,100];
}

function draw() {
    background(0);
    fill(255);
    stroke(255);
    point(mousePositions[0], mousePositions[1]);
    point(mousePositions[2], mousePositions[3]);
    point(mousePositions[4], mousePositions[5]);

    for (let i = 0; i < figures.length; i++) {
        figures[i].show();
    }

    /*
    Gotta check for what kind of figure is being created
    so i can create a different placeholder and then push
    it into the array that draws everything
    */
   
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

    if(triangleclickOn){
        placeholder.x1 = mousePositions[0];
        placeholder.y1 = mousePositions[1];
        placeholder.x2 = mousePositions[2];
        placeholder.y2 = mousePositions[3];
        placeholder.x3 = mousePositions[4];
        placeholder.y3 = mousePositions[5];
        placeholder.show();
    }

    if ((clickOn || lineclickOn || quadclickOn || triangleclickOn) && mouseIsPressed) {
        figures.push(placeholder);
        clickOn = false;
        lineclickOn = false;
        quadclickOn = false;
        triangleclickOn = false;
        placeholder = null;
        cont = 0;
    }
}

//Getting buttons Input

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
    placeholder = new fquad(mousePositions[0],mousePositions[1],mousePositions[2],mousePositions[3],mousePositions[4],mousePositions[5],mouseX, mouseY);
    quadclickOn = true;
});

$("#Create_Triangle_Btn").click(function (e) {
    e.preventDefault();
    placeholder = new ptriangle(mousePositions[0],mousePositions[1],mousePositions[2],mousePositions[3],mousePositions[4],mousePositions[5]);
    triangleclickOn = true;
});

$("#Delete_Last_Figure").click(function (e) {
    e.preventDefault();
    figures.pop();
});
//Whenever mouse is pressed, position is saved, it's a bit buggy but
//the 3 dots make it easier

function mousePressed() {
    mousePositions[cont] = mouseX;
    cont+=1;
    mousePositions[cont] = mouseY;
    cont += 1;
    if(cont >= 9){
        cont = 0;
    }
}
