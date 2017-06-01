import { combineReducers } from 'redux';
import {routerReducer} from 'react-router-redux';
import mappingReducer from './mappingReducer';
import uiStateReducer from './uiStateReducer';
import bplanReducer from './bplanReducer';

const rootReducer = combineReducers({
  mapping: mappingReducer,
  uiState: uiStateReducer,
  routing: routerReducer,
  bplanApp: bplanReducer
});

export default rootReducer;
