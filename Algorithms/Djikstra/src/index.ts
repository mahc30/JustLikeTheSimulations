import { GraphFactory } from "./classes/Graph";
import { DjikstraNodeData } from "./helpers/djikstraNodeData";
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

let linearGraph = graphFactory.generateLinearGraph();
//linearGraph.breadthFirstSearch();
//console.log("======================================")

let randomGraph = graphFactory.generateRandomGraph();
//randomGraph.breadthFirstSearch();
//console.log("======================================")

let initialPoint = new Point(0,0);
let finalPoint = new Point(1,3);
let pointMap = new Map<Point, Object>([
    [initialPoint, new DjikstraNodeData(1)],
    [new Point(0,1), new DjikstraNodeData(1)],
    [new Point(0,2), new DjikstraNodeData(1)],
    [new Point(1,2), new DjikstraNodeData(1)],
    [new Point(2,2), new DjikstraNodeData(1)],
    [new Point(2,3), new DjikstraNodeData(1)],
    [finalPoint, new DjikstraNodeData(1)]
]);

let pointGraphFactory = new GraphFactory<Point>(Point.comparator, pointMap);

let linearPointGraph = pointGraphFactory.generateLinearGraph();
//linearPointGraph.breadthFirstSearch();
linearPointGraph.djikstraPathFinding(initialPoint, finalPoint);
//console.log("======================================")
let randomPointGraph = pointGraphFactory.generateRandomGraph();
randomPointGraph.djikstraPathFinding(initialPoint, finalPoint)//randomPointGraph.breadthFirstSearch();
//console.log("======================================")
//randomPointGraph.depthFirstSearch();
