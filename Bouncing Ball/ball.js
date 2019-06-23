function ball(x_pos, y_pos, diameter, v_x, v_y, a) {

    this.x_pos = x_pos;
    this.y_pos = y_pos;
    this.diameter = diameter;
    this.r = diameter/2;
    this.v_x = v_x;
    this.v_y = v_y;
    this.a = a;
    this.pressed_In_ball = false;

    this.show = function () {
        //Drawing The Circle+
        /*Draw Circle*/
        ellipse(this.x_pos, this.y_pos, this.diameter);
        stroke(255, 255, 255);
        strokeWeight(3);
    }

    this.update = function () {
        /*
        Checks if it's on hold or released and updates position
        */
        if (this.pressed_In_ball) {
            fill(255);
        } else {
            fill(0);
        }
        this.Move(v_x, v_y);
    }

    /*
    Move The ball every frame in the direction of velocity
    when it has been pressed and then released
    Also changes fill of circle
    */

    this.Move = function () {
        this.x_pos += this.v_x;
        this.y_pos += this.v_y;
        this.v_y += this.a;  //Acceleration or gravity are always constant
    }

    this.Collision = function (bool) {

        /*
          True if collides horizontally
          False if coillides Vertically
        */

        if (bool) {
            this.v_x *= -1;
        } else {
            this.v_y *= -1;
        }
    }
}




















//y = map(sin(angle), -1, 1, 0 , 400);
  //angle += 0.1;