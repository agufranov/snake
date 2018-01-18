import * as React from 'react';
import * as _ from 'lodash';
import * as R from 'ramda';
import * as classNames from 'classnames';
import autobind from 'autobind-decorator';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Direction } from '../../classes/Direction';
import { BoardObjectType, BoardObjects } from '../../reducers/board';
import { State } from '../../State.interface';
import {
  MoveSnake, CreateMoveSnake,
  PlaceFood, CreatePlaceFood,
  Reset, CreateReset,
  StartTimer, CreateStartTimer
} from './actions';

require('./style.less');

interface BoardProps {
  size: number;
  objects: BoardObjects;
  gameOver: boolean;
  timer: boolean;
}

interface BoardDispatch {
  moveSnake: (direction: Direction) => MoveSnake;
  placeFood: () => PlaceFood;
  reset: () => Reset;
  startTimer: () => StartTimer;
};

type BoardFullProps = BoardProps & BoardDispatch;

interface BoardInternalState {
  timer: boolean;
}

class Board extends React.Component<BoardFullProps, BoardInternalState> {
  constructor(props: BoardFullProps) {
    super(props);
    this.state = {
      timer: props.timer
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
    this.props.reset();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  componentWillReceiveProps(props: BoardFullProps) {
    if (this.state.timer !== props.timer) {
      if (props.timer) {
        this.interval = setInterval(() => {
          this.props.tick();
        }, 500);
      } else {
        clearInterval(this.interval);
      }
      this.setState({ timer: props.timer });
    }
  }

  private interval: number;

  render() {
    const { size, objects } = this.props;
    return <div className="board">
      <div className="board__grid">
        {_.range(size).map(i =>
          <div className="board__grid-row" key={i}>
            {_.range(size).map(j =>
              <div className="board__grid-cell" key={j}>
              </div>
            )}
          </div>
        )}
      </div>
      {_.map(objects, (o, pos) => {
        const d = 20;
        return <div
          className={classNames(
            "board__object",
            {
              "board__object_food": o.type === BoardObjectType.FOOD,
              "board__object_bomb": o.type === BoardObjectType.BOMB,
              "board__object_snake": o.type === BoardObjectType.SNAKE
            }
          )}
          style={{
            top: d * o.pos.y,
            left: d * o.pos.x
          }}
          key={o.pos.toString()}
        ></div>
      })}
      {this.props.gameOver && <div>GameOver</div>}
      <button onClick={() => this.props.reset()}>Reset</button>
    </div>
  }

  @autobind
  private onKeyDown(e: KeyboardEvent) {
    if (this.props.gameOver) {
      return;
    }
    let direction;
    switch (e.key) {
      case 'w': direction = Direction.UP; break;
      case 's': direction = Direction.DOWN; break;
      case 'a': direction = Direction.LEFT; break;
      case 'd': direction = Direction.RIGHT; break;
    }
    if (direction !== undefined) {
      this.props.setDirection(direction);
    }
  }
}

const mapStateToProps = (state: State): BoardProps => ({
  size: state.board.size,
  objects: state.board.objects,
  gameOver: state.board.gameOver,
  timer: state.board.timer
});

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  tick: () => dispatch({ type: 'TICK' }),
  setDirection: (direction: Direction): any => dispatch({ type: 'SET_DIRECTION', direction }),
  moveSnake: (direction: Direction): MoveSnake => dispatch(CreateMoveSnake(direction)),
  placeFood: (): PlaceFood => dispatch(CreatePlaceFood()),
  reset: (): Reset => dispatch(dispatch => {
    dispatch(CreateReset());
    dispatch(CreateStartTimer());
  }),
  startTimer: (): StartTimer => dispatch(CreateStartTimer())
});

export default connect(mapStateToProps, mapDispatchToProps)(Board);
