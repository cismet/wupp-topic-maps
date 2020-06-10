import bboxPolygon from '@turf/bbox-polygon';
import booleanDisjoint from '@turf/boolean-disjoint';
import localForage from 'localforage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import makeDataDuck from '../higherorderduckfactories/dataWithMD5Check';
//TYPES
//no types bc no local store
export const types = {};

export const constants = {
	DEBUG_ALWAYS_LOADING: false
};

//HIGHER ORDER DUCKS
const dataDuck = makeDataDuck('planoffenlegungen', (state) => state.planoffenlegungen.dataState);

///INITIAL STATE
//no localState

///REDUCER
//no localState

export function loadPlanoffenlegungen(finishedHandler = () => {}) {
	const manualReloadRequest = false;
	return (dispatch, getState) => {
		dispatch(
			dataDuck.actions.load({
				manualReloadRequested: manualReloadRequest,
				dataURL: '/data/planoffenlegungen.json',
				errorHandler: (err) => {
					console.log(err);
				},
				done: finishedHandler
			})
		);
	};
}

const dataStateStorageConfig = {
	key: 'planoffenlegungen',
	storage: localForage,
	whitelist: [ 'items', 'md5' ]
};

const reducer = combineReducers({
	dataState: persistReducer(dataStateStorageConfig, dataDuck.reducer)
});

export default reducer;

//EXPORT SELECTORS
export const getPlanoffenlegungen = (state) => dataDuck.selectors.getItems(state.dataState);

//EXPORT ACTIONS
export const actions = {
	loadPlanoffenlegungen
};
