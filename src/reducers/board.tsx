import * as _ from 'lodash';
import * as R from 'ramda';
import { Position } from '../classes/Position';
import { Direction } from '../classes/Direction';
import { DLNode } from '../classes/DLNode';
import { DLList } from '../classes/DLList';
import { BoardActions, BoardActionTypes, MoveSnake, CreateMoveSnake, PlaceFood, CreatePlaceFood, Reset, CreateReset } from '../components/board/actions';

export enum BoardObjectType {
  FOOD,
  BOMB,
  SNAKE
}

export interface BoardObject {
  type: BoardObjectType,
  pos: Position
}

export type BoardObjects = { [pos: string]: BoardObject };

export interface BoardStateShort {
  size: number;
  snake: DLList<Position>;
  food: Position[];
  gameOver: boolean;
  timer: boolean;
  direction: Direction;
}

export interface BoardState extends BoardStateShort {
  objects: BoardObjects;
}

class Board implements BoardState {
  constructor(state?: BoardStateShort) {
    if (!state) {
      this.size = 5;
      this.snake = this.getInitialSnake();
      this.food = [];
      this.gameOver = false;
      this.timer = false;
      this.direction = Direction.RIGHT;
    } else {
      this.size = state.size;
      this.snake = state.snake;
      this.food = state.food;
      this.gameOver = state.gameOver;
      this.timer = state.timer;
      this.direction = state.direction;
    }
    this.updateObjects();
  }

  size: number;
  objects: BoardObjects;
  snake: DLList<Position>;
  food: Position[];
  gameOver: boolean;
  timer: boolean;

  placeFood(): Board {
    const foodCell = this.getFreeCell();
    if (foodCell === undefined) {
      throw new Error('Board is full')
    }
    return new Board({
      size: this.size,
      food: R.append(foodCell, this.food),
      snake: this.snake,
      timer: this.timer,
      gameOver: this.gameOver,
      direction: this.direction
    })
  }

  getInitialSnake(): DLList<Position> {
    const h = Math.floor(this.size / 2);
    return new DLList(new DLNode(new Position(h, h)));
  }

  getFreeCell(): Position | undefined {
    if (_.size(this.objects) === this.size * this.size) {
      return undefined;
    }
    let pos;
    let i = 0;
    do {
      pos = this.getRandomPos();
    } while(this.objects[pos.toString()])
    return pos;
  }

  getRandomPos(): Position {
    return new Position(
      _.random(this.size - 1),
      _.random(this.size - 1),
    ).trim(this.size);
  }

  reducer(positions: Position[], type: BoardObjectType): BoardObjects {
    return positions.reduce((objects: BoardObjects, pos) => {
      objects[pos.toString()] = { type, pos };
      return objects
    }, {})
  }

  updateObjects() {
    this.objects = R.merge(
      this.reducer(this.snake.array.map(node => node.value), BoardObjectType.SNAKE),
      this.reducer(this.food, BoardObjectType.FOOD)
    )
  }

  startTimer(): Board {
      return new Board({
        size: this.size,
        food: this.food,
        snake: this.snake,
        timer: true,
        gameOver: this.gameOver,
        direction: this.direction
      })
  }

  stopTimer(): Board {
      return new Board({
        size: this.size,
        food: this.food,
        snake: this.snake,
        timer: false,
        gameOver: this.gameOver,
        direction: this.direction
      })
  }

  isOpposite(d1: Direction, d2: Direction) {
    return (d1 === Direction.RIGHT && d2 === Direction.LEFT)
    || (d1 === Direction.LEFT && d2 === Direction.RIGHT)
    || (d1 === Direction.UP && d2 === Direction.DOWN)
    || (d1 === Direction.DOWN && d2 === Direction.UP)
  }

  setDirection(direction: Direction): Board {
    if (this.isOpposite(this.direction, direction) && this.snake.array.length !== 1)
      return this;
    return new Board({
      size: this.size,
      food: this.food,
      snake: this.snake,
      timer: this.timer,
      gameOver: this.gameOver,
      direction: direction
    })
  }

  move(): Board {
    return this.moveTo(this.direction);
  }

  moveTo(direction: Direction): Board {
    const newHeadPos = this.snake.head.value.to(direction).trim(this.size);
    const objAt = this.objects[newHeadPos.toString()];
    let newSnake;
    if (
      !objAt ||
      (
        (newHeadPos.isEqual(this.snake.tail.value)) &&
        this.snake.array.length !== 2
      )
    ) {
      return new Board({
        size: this.size,
        food: this.food,
        snake: this.snake.appendToHead(new DLNode(newHeadPos)).deleteTail(),
        timer: this.timer,
        gameOver: this.gameOver,
        direction: this.direction
      })
    }
    if (objAt.type === BoardObjectType.FOOD) {
      return new Board({
        size: this.size,
        food: R.reject(f => f.isEqual(newHeadPos), this.food),
        snake: this.snake.appendToHead(new DLNode(newHeadPos)),
        timer: this.timer,
        gameOver: this.gameOver,
        direction: this.direction
      }).placeFood()
    }
    return new Board({
      size: this.size,
      food: this.food,
      snake: this.snake,
      timer: this.timer,
      gameOver: true,
      direction: this.direction
    })
  }
}

const INITIAL_STATE: BoardState = new Board();

const BoardReducer = (state: BoardState = INITIAL_STATE, action: BoardActionTypes) => {
  switch (action.type) {
    case BoardActions.MOVE_SNAKE:
      return new Board(state).moveTo(action.direction)

    case BoardActions.PLACE_FOOD:
      return new Board(state).placeFood()

    case BoardActions.RESET:
      return new Board().placeFood();
      
    case BoardActions.START_TIMER:
      return new Board(state).startTimer()

    case 'SET_DIRECTION':
      return new Board(state).setDirection(action.direction)

    case 'TICK':
      return new Board(state).move()

    default:
      return state
  }
};

export default BoardReducer;
