var x_pos = 31;
var y_pos = 250;
const diameter = 60;
var c_w = 600;
var c_h = 500;
var v = 5;

function setup() {
  createCanvas(c_w, c_h);
}

function draw() {
  background(0);
  //Drawing The Circle
  ellipse(x_pos, y_pos, diameter);
  stroke(255, 255, 255);
  strokeWeight(3);
  noFill();

  //Check for conditions to bounce left or right
  if (x_pos >= c_w - (diameter / 2) || (x_pos <= (diameter / 2))) {
    v *= -1;
  }
  Move(v);
}

function Move(v) {
  x_pos += v;
}
