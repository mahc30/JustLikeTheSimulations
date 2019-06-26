class circle{
    constructor (x,y,r,color){
    this.x = x;
    this.y = y;
    this.r = r/2;
    this.color = color;
    }

    show(){
        fill(this.color);
        ellipse(this.x,this.y,this.r*2);
    }
}