import { format } from "util";
import { Queue } from "../helpers/queue";

export class Node<T> {
    private adjacent: Node<T>[] = [];
    private key: T;
    private data: T | undefined;

    comparator: (a: T, b: T) => number;

    getData(): T | undefined {
        return this.data;
    }

    setData(data: T): void {
        this.data = data;
    }

    getKey(): T {
        return this.key;
    }

    setKey(key: T): void {
        this.key = key;
    }

    getAdjacent(): Node<T>[] {
        return this.adjacent;
    }

    constructor(comparator: (a: T, b: T) => number, key: T,  data?: T) {
        this.comparator = comparator;
        this.key = key;
        if (typeof data !== undefined) this.data = data;
    }

    addAdjacent(node: Node<T>): void {
        this.adjacent.push(node);
    }

    removeAdjacent(key: T): Node<T> | null {
        const index = this.adjacent.findIndex(
            (node) => this.comparator(node.getKey(), key) === 0
        );
        if (index > -1) {
            return this.adjacent.splice(index, 1)[0];
        }
        return null;
    }
}

export class Graph<T> {
    private nodes: Map<T, Node<T>> = new Map();
    comparator: (a: T, b: T) => number;
    constructor(comparator: (a: T, b: T) => number) {
        this.comparator = comparator;
    }

    /**
     * Add a new node if it was not added before
     *
     * @param {T} key
     * @returns {Node<T>}
     */
    addNode(key: T, data?: T): Node<T> {
        let node = this.nodes.get(key);
        if (node) return node;

        node = new Node(this.comparator, key, data);
        this.nodes.set(key, node);
        return node;
    }
    /**
     * Remove a node, also remove it from other nodes adjacency list
     *
     * @param {T} key
     * @returns {Node<T> | null}
     */
    removeNode(key: T): Node<T> | null {
        const nodeToRemove = this.nodes.get(key);
        if (!nodeToRemove) return null;

        this.nodes.forEach((node) => {
            node.removeAdjacent(nodeToRemove.getKey());
        });
        this.nodes.delete(key);
        return nodeToRemove;
    }

    /**
     * Create an edge between two nodes
     *
     * @param {T} source
     * @param {T} destination
     */

    addEdge(source: T, destination: T): void {
        const sourceNode = this.addNode(source);
        const destinationNode = this.addNode(destination);
        sourceNode.addAdjacent(destinationNode);
    }

    /**
     * Remove an edge between two nodes
     *
     * @param {T} source
     * @param {T} destination
     */
    removeEdge(source: T, destination: T): void {
        const sourceNode = this.nodes.get(source);
        const destinationNode = this.nodes.get(destination);
        if (sourceNode && destinationNode) {
            sourceNode.removeAdjacent(destination);
        }
    }

    /**
     * Depth-first search
     *
     * @param {T} key
     * @param {Map<T, boolean>} visited
     * @returns
     */

    private depthFirstSearchAux(node: Node<T>, visited: Map<T, boolean>): void {
        if (!node) return;
        visited.set(node.getKey(), true);

        console.log(node);

        node.getAdjacent().forEach((node) => {
            if (!visited.has(node.getKey())) {
                this.depthFirstSearchAux(node, visited);
            }
        });
    }
    depthFirstSearch() {
        const visited: Map<T, boolean> = new Map();
        this.nodes.forEach((node) => {
            if (!visited.has(node.getKey())) {
                this.depthFirstSearchAux(node, visited);
            }
        });
    }

    /**
     * Breadth-first search
     *
     * @param {T} key
     * @returns
     */

    private breadthFirstSearchAux(node: Node<T> | undefined, visited: Map<T, boolean>): void {
        if (!node) return;
        const queue: Queue<Node<T>> = new Queue();
        queue.push(node);
        visited.set(node.getKey(), true);
        while (!queue.isEmpty()) {
            node = queue.pop();
            if (!node) continue;

            //console.log(format('(%d %s) ->', node.getKey(), node.getData()));
            console.log(node)
            node.getAdjacent().forEach((item) => {
                if (!visited.has(item.getKey())) {
                    visited.set(item.getKey(), true);
                    console.log(item.getKey())
                    queue.push(item);
                }
            });
        }
    }

    breadthFirstSearch() {
        const visited: Map<T, boolean> = new Map();
        this.nodes.forEach((node) => {
            if (!visited.has(node.getKey())) {
                this.breadthFirstSearchAux(node, visited);
            }
        });
    }
}

export class GraphFactory<T> {

    comparator: (a: T, b: T) => number;
    object: Map<T, any>;

    constructor(comparator: (a: T, b: T) => number, object: Map<T, any>) {
        this.comparator = comparator;
        this.object = object;
    }

    generateLinearGraph(): Graph<T> {
        let graph: Graph<T> = new Graph<T>(this.comparator);
        let nodes: Node<T>[] = [];

        let objectIterator = this.object.keys();
        let head = objectIterator.next();

        while (head.value) {
            nodes.push(graph.addNode(head.value, this.object.get(head.value)))
            head = objectIterator.next();
        }

        let last_node = nodes[0];
        for(let i = 1; i < nodes.length; i++){
            let current = nodes[i];
            graph.addEdge(last_node.getKey(), current.getKey())
            last_node = current;
        }

        return graph;
    }

    generateRandomGraph() : Graph<T>{
        let graph: Graph<T> = new Graph<T>(this.comparator);
        let nodes : Node<T>[] = []; 

        let objectIterator = this.object.keys();
        let head = objectIterator.next();

        while (head.value) {
            nodes.push(graph.addNode(head.value, this.object.get(head.value)))
            head = objectIterator.next();
        }

        
        for(let i = 0; i < nodes.length; i++){
            let randNode = Math.floor(Math.random() * nodes.length);
            graph.addEdge(nodes[i].getKey(), nodes[randNode].getKey())
        }

        return graph;
    }
}