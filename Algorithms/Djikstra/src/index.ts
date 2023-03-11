import { GraphFactory } from "./classes/Graph";
import { Point } from "./helpers/point";
//number comparator because keys are numbers...
function comparator(a: number, b: number) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}


let map = new Map<number, string>([
    [1,"a"],
    [2,"b"],
    [3,"c"],
    [4,"d"],
    [5,"e"],
    [6,"f"]
]);

let graphFactory = new GraphFactory<number>(comparator, map);
console.log("======================================")

let linearGraph = graphFactory.generateLinearGraph();
//linearGraph.breadthFirstSearch();
//console.log("======================================")

let randomGraph = graphFactory.generateRandomGraph();
//randomGraph.breadthFirstSearch();
//console.log("======================================")

let pointMap = new Map<Point, Object>([
    [new Point(0,0), { cost: 1}],
    [new Point(0,1), { cost: 1}],
    [new Point(0,2), { cost: 1}],
    [new Point(1,2), { cost: 1}],
    [new Point(2,2), { cost: 1}],
    [new Point(2,3), { cost: 1}]
]);

let pointGraphFactory = new GraphFactory<Point>(Point.comparator, pointMap);

let linearPointGraph = pointGraphFactory.generateLinearGraph();
linearPointGraph.breadthFirstSearch();

//console.log("======================================")
//let randomPointGraph = pointGraphFactory.generateRandomGraph();
//randomPointGraph.breadthFirstSearch();
//console.log("======================================")
//randomPointGraph.depthFirstSearch();
