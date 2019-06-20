var c_w = 400;
var c_h = 500;

var direction;
var sq;
var ball;

function setup() {
  createCanvas(c_w, c_h);
  ball = new ball(31,200,60,3,0,0.1);
  sq = new square_obstacle(200, 300, 30);
}

function draw() {
  background(0);

  /*
  Render Square Obstacle
  */

  sq.update();
  sq.show();

  /*
  Render Ball
  */

  ball.update();
  ball.show();


  /*First check for collisions with canvas*/

  //Check for conditions to bounce left or right
  if (ball.x_pos >= c_w - (ball.diameter / 2) || (ball.x_pos <= (ball.diameter / 2))) {
    ball.Collision(true);
  }

  //Check conditions to bounce when it touches the floor
  if (ball.y_pos >= c_h - (ball.diameter / 2)) {
    ball.Collision(false);
  }
  
  /*Check for collisions with other objects*/
  if(ball.Hit(sq)){
    ball.Collision(true);
    console.log("Ball Collision");
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

