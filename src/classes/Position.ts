import { Direction } from './Direction';

export class Position {
  constructor(
    public x: number,
    public y: number
  ) {
  }

  public static trimCoordinate(x: number, n: number): number {
    return (n + (x % n)) % n;
  }

  public trim(n: number): Position {
    return new Position(
      Position.trimCoordinate(this.x, n),
      Position.trimCoordinate(this.y, n)
    );
  }

  public to(direction: Direction): Position {
    const { x, y } = this;
    let newPos;
    switch (direction) {
      case Direction.UP: newPos = [x, y - 1]; break;
      case Direction.DOWN: newPos = [x, y + 1]; break;
      case Direction.RIGHT: newPos = [x + 1, y]; break;
      case Direction.LEFT: newPos = [x - 1, y]; break;
      default: throw new Error('Unknown direction');
    }
    return new Position(newPos[0], newPos[1]);
  }

  public toString() {
    return `(${this.x}|${this.y})`;
  }

  public isEqual(pos: Position) {
    return (pos.x === this.x) && (pos.y === this.y)
  }
}
