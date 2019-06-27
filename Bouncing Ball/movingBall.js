var c_w = document.getElementById("bouncinS").offsetWidth;
var c_h = document.getElementById("bouncinS").offsetHeight + 100;

var direction;
var line_vertical_obs_1;
var ball;

var canvas;

function setup() {
  canvas = createCanvas(c_w, c_h);
  canvas.parent('bouncinS');
  ball = new ball(31,200,60,3,0,0.1);
  line_vertical_obs_1 = new line_obstacle(200, 200, 200,300);
}

function draw() {
  background(0);

  /*
  Render Square Obstacle
  */

  line_vertical_obs_1.update();
  line_vertical_obs_1.show();

  /*
  Render Ball
  */

  ball.update();
  ball.show();


  /*First check for collisions with canvas*/

  //Check for conditions to bounce left or right for canvas
  if (ball.x_pos >= c_w - (ball.diameter / 2) || (ball.x_pos <= (ball.diameter / 2))) {
    ball.Collision(true);
  }

  //Check conditions to bounce when it touches the floor
  if (ball.y_pos >= c_h - (ball.diameter / 2)) {
    ball.Collision(false);
  }
  
  /*Check for collisions with other objects*/
  if(line_vertical_obs_1.check_Collision(ball)){
    ball.Collision(true);
  }
}

/*
Un contador que necesito por fuera
a lo mejor lo puedo utilizar luego
             si no
    ver cómo se puede optimizar
*/

var count = 0;
function mouseClicked() {

  //Save actual v_x on Click
  if (count === 0) {
    count++;
    direction = ball.v_x;
  }

  /* 
    Checks the position of the mouse
       when it is pressed, then:
   if it is in the ball when pressed
        stops it horizontally
 else it is out of the ball when pressed
    continues in the same direction
  */

  //The next if actually gives me a square, but it is not that noticeable so i guess it doesn't matter for this simulation/game.
  if (mouseX < ball.x_pos + (ball.diameter / 2) && mouseX > ball.x_pos - (ball.diameter / 2) && mouseY < ball.y_pos + (ball.diameter / 2) && mouseY > ball.y_pos - (ball.diameter / 2)) {
    console.log("click");
    ball.pressed_In_ball = true;
    ball.v_x = 0;
    ball.v_y = 0;
  }
  else {
    console.log("Nope");
    ball.pressed_In_ball = false;
    ball.v_x = direction;
    ball.v_y += ball.a;
    count = 0;
  }
}
