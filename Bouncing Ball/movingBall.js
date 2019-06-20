var x_pos = 31;
var y_pos = 300;
const diameter = 60;
var c_w = 600;
var c_h = 600;
var v_x = 2;
var v_y = 0;
var a = 0.1;
var pressed_In_ball = false;
var direction;

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

  //Check for conditions to bounce left or right
  if (x_pos >= c_w - (diameter / 2) || (x_pos <= (diameter / 2))) {
    v_x *= -1;
  }

  //Check conditions to bounce when it touches the floor
  if (y_pos >= c_h - (diameter / 2)) {
    v_y *= -1;
  }

  //Move The ball every frame in the direction of velocity
  
  

  //Change inner color when clicked
  
  //y = map(sin(angle), -1, 1, 0 , 400);
  //angle += 0.1;
  if (pressed_In_ball) {
    fill(255);
    Move(v_x, v_y);
  } else {
    fill(0);
    Move(v_x, v_y);
  }

  v_y += a;
}

function Move(v_x, v_y) {
  x_pos += v_x;
  y_pos += v_y;
}

/*
Un contador que necesito por fuera
a lo mejor lo puedo utilizar luego
             si no
    ver cómo se puede optimizar
*/

var count = 0;
function mouseClicked(){
  if(count === 0){
    count++;
    direction = v_x;
  }
  
  /* 
  Checks the position of the mouse
  when it is pressed, then:
  if it is in the ball when pressed
    stops it horizontally
  else it is out of the ball when pressed
    continues in the same direction
  */

  if (mouseX < x_pos + (diameter / 2) && mouseX > x_pos - (diameter / 2) && mouseY < y_pos + (diameter / 2) && mouseY > y_pos - (diameter / 2)) {
    console.log("click");
    pressed_In_ball = true;  
    v_x = 0;
    v_y = 0;
  }
  else {
    console.log("Nope");
    pressed_In_ball = false;
    v_x = direction;
    v_y += a;
    count = 0;
  }
}