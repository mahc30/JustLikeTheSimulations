class ball {
    constructor(obj, x_pos, y_pos, diameter, v_x, v_y, a) {
        this.obj = obj;
        this.x_pos = x_pos;
        this.y_pos = y_pos;
        this.diameter = diameter;
        this.r = diameter / 2;
        this.v_x = v_x;
        this.v_y = v_y;
        this.a = a;
        this.pressed_In_ball = false;
    }

    show() {
        //Drawing The Circle+
        /*Draw Circle*/
        this.obj.ellipse(this.x_pos, this.y_pos, this.diameter);
        this.obj.stroke(255, 255, 255);
        this.obj.strokeWeight(3);
    }

    update() {
        /*
        Checks if it's on hold or released and updates position
        */
        if (this.obj.pressed_In_ball) {
            this.obj.fill(255);
        } else {
            this.obj.fill(0);
        }
        this.move(this.v_x, this.v_y);
    }

    /*
    move The ball every frame in the direction of velocity
    when it has been pressed and then released
    Also changes fill of circle
    */

    move() {
        this.x_pos += this.v_x;
        this.y_pos += this.v_y;
        this.v_y += this.a;  //Acceleration or gravity are always constant
    }

    collision(bool) {

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
