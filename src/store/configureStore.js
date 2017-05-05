import {createStore, compose, applyMiddleware, combineReducers} from 'redux';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import * as UiStateActions from '../actions/uiStateActions'
import { routerForBrowser } from 'redux-little-router';

import logger from 'redux-logger';

function configureStoreProd(initialState) {
  const middlewares = [
    // Add other middleware on this line...

    // thunk middleware can also accept an extra argument to be passed to each thunk action
    // https://github.com/gaearon/redux-thunk#injecting-a-custom-argument
    thunk,
  ];

  return createStore(rootReducer, initialState, compose(
    applyMiddleware(...middlewares)
    )
  );
}

function configureStoreDev(initialState) {
  const routes = {
  '/messages': {
    title: 'Message'
  },
  '/messages/:user': {
    title: 'Message History'
  },
  // You can also define nested route objects!
  // Just make sure each route key starts with a slash.
  '/': {
    title: 'Home',
    '/bio': {
      title: 'Biographies',
      '/:name': {
        title: 'Biography for:'
      }
    }
  }
};

  const {
  reducer,
  routerMiddleware,
  enhancer
} = routerForBrowser({
  // The configured routes. Required.
  routes,
  // The basename for all routes. Optional.
  basename: '/example'
})


  const middlewares = [
    // Add other middleware on this line...
    logger,
    // Redux middleware that spits an error on you when you try to mutate your state either inside a dispatch or between dispatches.
    reduxImmutableStateInvariant(),
    routerMiddleware, 
    // thunk middleware can also accept an extra argument to be passed to each thunk action
    // https://github.com/gaearon/redux-thunk#injecting-a-custom-argument
    thunk,
  ];

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // add support for Redux dev tools
  const store = createStore(combineReducers({ router: reducer, rootReducer }), initialState, composeEnhancers(enhancer,
    applyMiddleware(...middlewares)
    )
  );
  /*
  const clientOnlyStore = createStore(
    combineReducers({ router: reducer, yourReducer }),
    initialState,
    compose(enhancer, applyMiddleware(middleware))
  );
  */
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default; // eslint-disable-line global-require
      store.replaceReducer(nextReducer);
    });
  }
  window.addEventListener('resize', () => {
    store.dispatch(UiStateActions.screenResize(window.innerHeight, window.innerWidth));
  });
  return store;
}

const configureStore = process.env.NODE_ENV === 'production' ? configureStoreProd : configureStoreDev;

export default configureStore;