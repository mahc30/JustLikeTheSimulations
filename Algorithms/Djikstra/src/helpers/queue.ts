export class Queue<T> {
    private storage: T[] = [];
  
    constructor(private capacity: number = Infinity) {}
  
    push(item: T): void {
      if (this.size() === this.capacity) {
        throw Error("Queue has reached max capacity, you cannot add more items");
      }
      this.storage.push(item);
    }

    pop(): T | undefined {
      return this.storage.shift();
    }

    size(): number {
      return this.storage.length;
    }

    isEmpty(): boolean {
        return this.storage.length === 0;
    }
  }
  
  const queue = new Queue<string>();
  
  queue.push("A");
  queue.push("B");
  
  queue.size();    // Output: 2
  queue.pop(); // Output: "A"
  queue.size();    // Output: 1
  