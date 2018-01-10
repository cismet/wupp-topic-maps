import {
    createStore,
    applyMiddleware,
    compose
} from 'redux';
import {
    routerMiddleware
} from 'react-router-redux';
import thunk from 'redux-thunk';
//import createHistory from 'history/createHashHistory';
import { createHashHistory } from 'history';
import rootReducer from './reducer';
//import logger from 'redux-logger';
import { createLogger } from 'redux-logger'
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import {
    actions as UiStateActions
} from './modules/uiState';


export const history = createHashHistory();

const logger = createLogger({
   collapsed:true,
  // diff:true

});

const initialState = {};
const enhancers = [];
const middleware = [
    thunk,
    logger,
    reduxImmutableStateInvariant(),
    routerMiddleware(history)
];



if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.devToolsExtension;

    if (typeof devToolsExtension === 'function') {
        enhancers.push(devToolsExtension());
    }
}

const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers
);

const store = createStore(
    rootReducer,
    initialState,
    composedEnhancers
);

window.addEventListener('resize', () => {
    store.dispatch(UiStateActions.screenResize(window.innerHeight, window.innerWidth));
});
//Fire a first screenResize to initially fill the uiState
store.dispatch(UiStateActions.screenResize(window.innerHeight, window.innerWidth));


export default store;
