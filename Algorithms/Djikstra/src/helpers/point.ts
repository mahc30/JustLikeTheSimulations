export class Point {
    private x: number;
    private y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    getX() : number {
        return this.x;
    }

    getY() : number {
        return this.y;
    }

    static comparator(a : Point, b: Point) {
        if(a.y != b.y) return -1;
        if(a.x != b.x) return 1;
        return 0;
    }
}