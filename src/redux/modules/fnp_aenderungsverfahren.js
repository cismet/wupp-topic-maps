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
const dataDuck = makeDataDuck(
	'fnpAenderungsverfahren',
	(state) => state.fnpAenderungsverfahren.dataState,
	convertAEVToFeature
);
// const dataDuck = makeDataDuck('aev', (state) => state.aev.dataState, convertHauptnutzungToFeature);

///INITIAL STATE
//no localState

///REDUCER
//no localState

const dataStateStorageConfig = {
	key: 'aevData',
	storage: localForage,
	whitelist: [] //[ 'items', 'md5', 'features' ]
};

const reducer = combineReducers({
	dataState: persistReducer(dataStateStorageConfig, dataDuck.reducer)
});

export default reducer;

//SIMPLEACTIONCREATORS

//COMPLEXACTIONS
function loadAEVs() {
	const manualReloadRequest = false;
	return (dispatch, getState) => {
		dispatch(
			dataDuck.actions.load({
				manualReloadRequested: manualReloadRequest,
				dataURL: '/data/aenderungsv.data.json',
				errorHandler: (err) => {
					console.log(err);
				}
			})
		);
	};
}

export function searchForAEVs({
	gazObject,
	overriddenWKT,
	boundingBox,
	point,
	skipMappingActions = false,
	done = () => {},
	mappingActions
}) {
	return function(dispatch, getState) {
		let selectionIndexWish = 0;
		if (gazObject === undefined && (boundingBox !== undefined || point !== undefined)) {
			let bboxPoly;
			if (boundingBox !== undefined) {
				bboxPoly = bboxPolygon([
					boundingBox.left,
					boundingBox.top,
					boundingBox.right,
					boundingBox.bottom
				]);
			} else if (point !== undefined) {
				bboxPoly = bboxPolygon([
					point.x - 0.05,
					point.y - 0.05,
					point.x + 0.05,
					point.y + 0.05
				]);
			}

			//Simple
			const state = getState();
			let finalResults = [];

			for (let feature of state.fnpAenderungsverfahren.dataState.features) {
				// console.log('feature', feature);
				if (!booleanDisjoint(bboxPoly, feature)) {
					finalResults.push(feature);
				}
			}
			dispatch(mappingActions.setFeatureCollection(finalResults));
			if (finalResults.length > 0) {
				dispatch(mappingActions.setSelectedFeatureIndex(selectionIndexWish));
			}
		} else if (point !== undefined) {
		}
	};
}

//EXPORT ACTIONS
export const actions = {
	loadAEVs,
	searchForAEVs
};

//EXPORT SELECTORS
export const getAEVs = (state) => dataDuck.selectors.getItems(state.dataState);
export const getAEVFeatures = (state) => dataDuck.selectors.getFeatures(state.dataState);
export const getAEVMD5 = (state) => dataDuck.selectors.getMD5(state.dataState);

//HELPER FUNCTIONS
function convertAEVToFeature(aev, index) {
	if (aev === undefined) {
		return undefined;
	}
	const id = aev.id;
	const type = 'Feature';
	const selected = false;
	const geometry = aev.geojson;

	const text = aev.verfahren !== 'B' ? aev.name : aev.name + '_B';

	return {
		id,
		index,
		text,
		type,
		selected,
		geometry,
		crs: {
			type: 'name',
			properties: {
				name: 'urn:ogc:def:crs:EPSG::25832'
			}
		},
		properties: aev
	};
}
