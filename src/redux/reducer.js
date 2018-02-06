import {  combineReducers} from 'redux';
import {  routerReducer} from 'react-router-redux';
import bplaenenReducer from './modules/bplaene';
import ehrenamtReducer from './modules/ehrenamt';
import mappingReducer from './modules/mapping';
import gazetteerTopicsReducer from './modules/gazetteerTopics';
import uiStateReducer from './modules/uiState';
import { persistReducer } from 'redux-persist'
import localForage from 'localforage'

const gazetteerTopicsStorageConfig = {
    key: 'gazetteerTopics',
    storage: localForage
   }

const ehrenamtStorageConfig = {
    key: 'ehrenamtOffers',
    storage: localForage,
    whitelist: ['offers','offersMD5', 'globalbereiche','kenntnisse', 'zielgruppen', 'filterX']
   }

   const uiStateStorageConfig = {
    key: 'uiState',
    storage: localForage,
    whitelist: ['applicationMenuVisible','applicationMenuActiveKey']
   }
  

const rootReducer = combineReducers({
  bplaene: bplaenenReducer,
  ehrenamt: persistReducer(ehrenamtStorageConfig,ehrenamtReducer),
  mapping: mappingReducer,
  uiState: persistReducer(uiStateStorageConfig,uiStateReducer),
  routing: routerReducer,
  gazetteerTopics: persistReducer(gazetteerTopicsStorageConfig,gazetteerTopicsReducer),
 // gazetteerTopics: gazetteerTopicsReducer, // uncomment to skip persitent gazetteer data
});
export default rootReducer;
