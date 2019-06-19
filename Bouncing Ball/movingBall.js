var x_pos = 31;
var y_pos = 300;
const diameter = 60;
var c_w = 1000;
var c_h = 600;
var v_x = 1;
var v_y = 0;
var a = 0.1;


//var angle = 0;
//var y = 0;
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
    v_x *= -1;
  }

  //Check conditions to bounce when it touches the floor
  if(y_pos >= c_h - (diameter/2)){
    v_y *= -1;
  }

  Move(v_x, v_y);
  v_y += a;

  //y = map(sin(angle), -1, 1, 0 , 400);
  //angle += 0.1;
}

function Move(v_x, v_y) {
  x_pos += v_x;
  y_pos += v_y;
}