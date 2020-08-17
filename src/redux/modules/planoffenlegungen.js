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
	const manualReloadRequest = true;
	return (dispatch, getState) => {
		dispatch(
			dataDuck.actions.load({
				manualReloadRequested: manualReloadRequest,
				dataURL: '/data/planoffenlegungen-alpha.json',
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
export const getOffenlegungsStatus = (state, kind, nr) => {
	const entries = state.dataState.items[kind];
	if (entries !== undefined) {
		const found = entries.find((e) => e.nr === nr);
		if (found !== undefined) {
			const entry = Object.assign(
				{ art: 'offenlegung', von: '2020-01-01:00:00', bis: '3000-01-01:00:00' },
				found
			);

			const vonDate = new Date(entry.von);
			const bisDate = new Date(entry.bis);
			const now = new Date();

			// console.log('entry vonDate', vonDate);
			// console.log('entry bisDate', bisDate);
			// console.log('entry raw bisDate', new Date(bisDate));
			// console.log('entry now', now);

			if (now > vonDate && now < bisDate) {
				return entry;
			}
		}
	}
	return undefined;
};

//EXPORT ACTIONS
export const actions = {
	loadPlanoffenlegungen
};
