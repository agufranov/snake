export class DLNode<T> {
  constructor(
    public value: T
  ) {
  }

  public prev: DLNode<T> | null;
  public next: DLNode<T> | null;

  public append(node: DLNode<T>, isNext: boolean): DLNode<T> {
    if (isNext) {
      DLNode.link(node, this);
    } else {
      DLNode.link(this, node);
    }
    return node;
  }

  public delete() {
    DLNode.link(this.next, this.prev);
    this.next = this.prev = null;
  }
  
  public static link<T>(next: DLNode<T> | null, prev: DLNode<T> | null) {
    if (next) {
      next.prev = prev;
    }
    if (prev) {
      prev.next = next;
    }
  }
}
