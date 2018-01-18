import { combineReducers } from 'redux';
import BoardReducer from './board';

export default combineReducers({
  board: BoardReducer
});
