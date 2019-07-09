class circle{
    constructor (obj,x,y,r){
    this.obj = obj;
    this.x = x;
    this.y = y;
    this.r = r/2;
    }

    show(){
        this.obj.ellipse(this.x,this.y,this.r*2);
    }
}