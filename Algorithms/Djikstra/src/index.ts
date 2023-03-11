import { GraphFactory } from "./classes/Graph";
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
]);

let graphFactory = new GraphFactory<number>(comparator, map);

let linearGraph = graphFactory.generateLinearGraph();
linearGraph.breadthFirstSearch();