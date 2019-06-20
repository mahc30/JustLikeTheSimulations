function square_obstacle(x,y,a){
    this.x = x;
    this.y = y;

    this.update = function(){

    }

    this.show = function(){
        fill(100,0,0);
        square(this.x,this.y,a)
    }

    this.hit = function (other) {
        if(this.x + this.r > other.x &&
            this.y + this.r > other.y &&
            this.x - this.r < other.x + other.w &&
            this.y - this.r < other.y + other.h)
                return true;
        return false;
    }
}