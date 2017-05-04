import { combineReducers } from 'redux';
import {routerReducer} from 'react-router-redux';
import mappingReducer from './mappingReducer';
import uiStateReducer from './uiStateReducer';

const rootReducer = combineReducers({
  mapping: mappingReducer,
  uiState: uiStateReducer,
  routing: routerReducer
});

export default rootReducer;
