import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Board from './components/board';
import { Provider } from 'react-redux';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <div>
      <Board/>
    </div>
  </Provider>,
  document.getElementById('container')
);
