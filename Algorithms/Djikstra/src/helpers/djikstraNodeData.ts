export class DjikstraNodeData {
    private cost : number;
    private tentativeDistance: number = Math.pow(10,1000);
    constructor(cost : number) {
        this.cost = cost;        
    }

    getCost() : number {
        return this.cost;
    }

    setTentativeDistance(tentativeDistance: number) {
        this.tentativeDistance = tentativeDistance;
    }
}