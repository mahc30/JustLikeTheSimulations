const width = 600;
const height = 400;
var squares = [];
var clickOn = false;
var placeholder;

function setup() {
    createCanvas(width, height);
}

function draw() {
    background(0);
    for (let i = 0; i < squares.length; i++) {
        squares[i].show();
    }

    if (clickOn) {
        placeholder.x = mouseX -15;
        placeholder.y = mouseY - 15;
        placeholder.show();
    }
    
    if(clickOn && mouseIsPressed){
        squares.push(new square(mouseX -25,mouseY-25, 50, 200));
        clickOn = false;
    }
}

$("#Create_Square_Btn").click(function (e) {
    e.preventDefault();
    placeholder = new square(mouseX, mouseY, 30, 200);
    clickOn = true;
});
