import {  combineReducers} from 'redux';
import {  routerReducer} from 'react-router-redux';
import bplaenenReducer from './modules/bplaene';
import ehrenamtReducer from './modules/ehrenamt';
import mappingReducer from './modules/mapping';
import uiStateReducer from './modules/uiState';

const rootReducer = combineReducers({
  bplaene: bplaenenReducer,
  ehrenamt: ehrenamtReducer,
  mapping: mappingReducer,
  uiState: uiStateReducer,
  routing: routerReducer,
});
export default rootReducer;