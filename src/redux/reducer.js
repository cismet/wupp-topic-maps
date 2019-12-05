import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import bplaenenReducer from './modules/bplaene';
import ehrenamtReducer from './modules/ehrenamt';
import stadtplanReducer from './modules/stadtplan';
import kulturstadtplanReducer from './modules/kulturstadtplan';
import baederReducer from './modules/baeder';
import prbrReducer from './modules/prbr';
import emobReducer from './modules/emob';
import fnp_aenderungsverfahrenReducer from './modules/fnp_aenderungsverfahren';
import fnp_hauptnutzungenReducer from './modules/fnp_hauptnutzungen';
import starkregenReducer from './modules/starkregen';
import hitzeReducer from './modules/hitze';
import kitasReducer from './modules/kitas';
import mappingReducer from './modules/mapping';
import gazetteerTopicsReducer from './modules/gazetteerTopics';
import uiStateReducer from './modules/uiState';
import docsReducer from './modules/docs';

import { persistReducer } from 'redux-persist';
import localForage from 'localforage';

const gazetteerTopicsStorageConfig = {
	key: 'gazetteerTopics',
	storage: localForage
};

const ehrenamtStorageConfig = {
	key: 'ehrenamtOffers',
	storage: localForage,
	whitelist: [
		'offers',
		'offersMD5',
		'globalbereiche',
		'kenntnisse',
		'zielgruppen',
		'filterX',
		'cart'
	]
};

const kitasStorageConfig = {
	key: 'kitas',
	storage: localForage,
	whitelist: [
		'kitas',
		'kitasMD5',
		'filter',
		'kitaSvgSize',
		'featureRendering',
		'minifiedInfoBox'
	] //['kitas','kitasMD5']
};

const starkregenStorageConfig = {
	key: 'starkregen',
	storage: localForage,
	whitelist: [ 'selectedBackground', 'selectedSimulation', 'minifiedInfoBox' ]
};
const hitzeStorageConfig = {
	key: 'hitze',
	storage: localForage,
	whitelist: [ 'selectedBackground', 'selectedSimulations', 'minifiedInfoBox' ]
};

const uiStateStorageConfig = {
	key: 'uiState',
	storage: localForage,
	whitelist: [ 'applicationMenuVisible', 'applicationMenuActiveKey' ]
};

const appReducer = combineReducers({
	bplaene: bplaenenReducer,
	starkregen: persistReducer(starkregenStorageConfig, starkregenReducer),
	ehrenamt: persistReducer(ehrenamtStorageConfig, ehrenamtReducer),
	stadtplan: stadtplanReducer,
	kulturstadtplan: kulturstadtplanReducer,
	baeder: baederReducer,
	prbr: prbrReducer,
	emob: emobReducer,
	fnpAenderungsverfahren: fnp_aenderungsverfahrenReducer,
	fnpHauptnutzungen: fnp_hauptnutzungenReducer,
	kitas: persistReducer(kitasStorageConfig, kitasReducer),
	mapping: mappingReducer,
	uiState: persistReducer(uiStateStorageConfig, uiStateReducer),
	routing: routerReducer,
	gazetteerTopics: persistReducer(gazetteerTopicsStorageConfig, gazetteerTopicsReducer),
	// gazetteerTopics: gazetteerTopicsReducer, // uncomment to skip persitent gazetteer data,
	docs: docsReducer,
	hitze: persistReducer(hitzeStorageConfig, hitzeReducer)
});

const rootReducer = (state, action) => {
	if (action.type === 'RESET_ALL') {
		Object.keys(state).forEach((key) => {
			localForage.removeItem(`persist:${key}`);
		});

		return appReducer(undefined, action);
	}

	return appReducer(state, action);
};

export function resetAll() {
	console.log('RESET_ALL');
	return (dispatch) => {
		dispatch({
			type: 'RESET_ALL'
		});
	};
}

export default rootReducer;
