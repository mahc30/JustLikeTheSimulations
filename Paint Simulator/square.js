class square {
    constructor(obj,x, y, s) {
        this.obj = obj;
        this.s = s;
        this.x = x;
        this.y = y
    }

    show() {
        this.obj.rect(this.x, this.y, this.s, this.s);
    }
}