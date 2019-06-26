class circle{
    constructor (x,y,r){
    this.x = x;
    this.y = y;
    this.r = r/2;
    }

    show(){
        ellipse(this.x,this.y,this.r*2);
    }
}