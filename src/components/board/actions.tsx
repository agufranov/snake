import { Direction } from '../../classes/Direction';

export enum BoardActions {
  MOVE_SNAKE = 'MOVE_SNAKE',
  PLACE_FOOD = 'PLACE_FOOD',
  RESET = 'RESET',
  START_TIMER = 'START_TIMER',
  TEST = 'TEST'
}

export interface MoveSnake {
  type: BoardActions.MOVE_SNAKE;
  direction: Direction;
}

export const CreateMoveSnake = (direction: Direction): MoveSnake => ({
  type: BoardActions.MOVE_SNAKE,
  direction
})

export interface PlaceFood {
  type: BoardActions.PLACE_FOOD;
}

export const CreatePlaceFood = (): PlaceFood => ({
  type: BoardActions.PLACE_FOOD
})

export interface Reset {
  type: BoardActions.RESET;
}

export const CreateReset = (): Reset => ({
  type: BoardActions.RESET
})

export interface StartTimer {
  type: BoardActions.START_TIMER;
}

export const CreateStartTimer = (): StartTimer => ({
  type: BoardActions.START_TIMER
})

export type BoardActionTypes = MoveSnake | PlaceFood | Reset | StartTimer;
