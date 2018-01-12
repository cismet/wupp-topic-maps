import {  combineReducers} from 'redux';
import {  routerReducer} from 'react-router-redux';
import bplaenenReducer from './modules/bplaene';
import ehrenamtReducer from './modules/ehrenamt';
import mappingReducer from './modules/mapping';
import gazetteerTopicsReducer from './modules/gazetteerTopics';
import uiStateReducer from './modules/uiState';
import { persistReducer } from 'redux-persist'
import localForage from 'localforage'

const config = {
  key: 'primary',
  storage: localForage
 }

const rootReducer = combineReducers({
  bplaene: bplaenenReducer,
  ehrenamt: ehrenamtReducer,
  mapping: mappingReducer,
  uiState: uiStateReducer,
  routing: routerReducer,
  gazetteerTopics: persistReducer(config,gazetteerTopicsReducer),
 // gazetteerTopics: gazetteerTopicsReducer, // uncomment to skip persitent gazetteer data
});
export default rootReducer;
