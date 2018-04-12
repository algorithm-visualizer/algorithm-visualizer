import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore } from 'redux';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { routerReducer } from 'react-router-redux';
import App from '/components/App';
import * as reducers from '/reducers';

const MOUNT_NODE = document.getElementById('root');

const store = createStore(combineReducers({ ...reducers, routing: routerReducer }));

const render = (Component) => {
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <Component />
      </BrowserRouter>
    </Provider>,
    MOUNT_NODE
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./components/App/index.jsx', () => {
    const NextApp = require('/components/App').default;
    try {
      render(NextApp);
    } catch (error) {
      const RedBox = require('redbox-react').default;
      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE);
    }
  });
}