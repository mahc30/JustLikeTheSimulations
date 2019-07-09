class pline {
    constructor(obj, x1, y1, x2, y2) {
        this.obj = obj;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    show() {
        this.obj.line(this.x1, this.y1, this.x2, this.y2);
    }
}