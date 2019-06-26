class square {
    constructor(x, y, s, color) {
        this.s = s;
        this.x = x;
        this.y = y
        this.color = color;
    }

    show() {
        strokeWeight(4);
        fill(this.color);
        rect(this.x, this.y, this.s, this.s);
    }
}