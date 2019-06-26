class square {
    constructor(x, y, s) {
        this.s = s;
        this.x = x;
        this.y = y
    }

    show() {
        rect(this.x, this.y, this.s, this.s);
    }
}