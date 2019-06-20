function square_obstacle(x,y,a){
    this.x = x;
    this.y = y;
    this.a = a;
    
    this.update = function(){

    }

    this.show = function(){
        fill(100,0,0);
        square(this.x,this.y,a)
    }
    
}