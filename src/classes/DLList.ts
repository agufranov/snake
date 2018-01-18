import { DLNode } from './DLNode';

export class DLList<T> {
  // Assume that list is not empty
  constructor(
    public readonly head: DLNode<T>
  ) {
    this.array = [this.head];
    let node: DLNode<T> | null = this.head;
    while(node = node.prev) {
      this.array.push(node);
    }
    this.tail = this.array[this.array.length - 1];
  }

  public readonly tail: DLNode<T>;

  public readonly array: DLNode<T>[];

  public appendToHead(node: DLNode<T>): DLList<T> {
    return new DLList(this.head.append(node, true));
  }

  public appendToTail(node: DLNode<T>): DLList<T> {
    this.tail.append(node, false);
    return new DLList(this.head);
  }

  public deleteHead(): DLList<T> {
    if (!this.head.prev) {
      throw new Error('Cannot delete head because it\'s only node');
    }
    const newHead = this.head.prev;
    this.head.delete();
    return new DLList(this.head);
  }

  public deleteTail(): DLList<T> {
    if (!this.tail.next) {
      throw new Error('Cannot delete tail because it\'s only node');
    }
    const newTail = this.tail.next;
    this.tail.delete();
    return new DLList(this.head);
  }
}
