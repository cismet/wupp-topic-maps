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
	'fnpHauptnutzungen',
	(state) => state.fnpHauptnutzungen.dataState,
	convertHauptnutzungToFeature
);

///INITIAL STATE
//no localState

///REDUCER
//no localState

const dataStateStorageConfig = {
	key: 'fnpHNData',
	storage: localForage,
	whitelist: [] //[ 'items', 'md5', 'features' ]
};

const reducer = combineReducers({
	dataState: persistReducer(dataStateStorageConfig, dataDuck.reducer)
});

export default reducer;

//SIMPLEACTIONCREATORS

//COMPLEXACTIONS
function loadHauptnutzungen() {
	const manualReloadRequest = false;
	return (dispatch, getState) => {
		dispatch(
			dataDuck.actions.load({
				manualReloadRequested: manualReloadRequest,
				dataURL: '/data/hauptnutzungen.data.json',
				errorHandler: (err) => {
					console.log(err);
				}
			})
		);
	};
}

export function searchForHauptnutzungen({
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

			for (let feature of state.fnpHauptnutzungen.dataState.features) {
				// console.log('feature', feature);
				if (!booleanDisjoint(bboxPoly, feature)) {
					finalResults.push(feature);
				}
			}
			console.log('finalResults', finalResults);

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
	loadHauptnutzungen,
	searchForHauptnutzungen
};

//EXPORT SELECTORS
export const getHauptnutzungen = (state) => dataDuck.selectors.getItems(state.dataState);
export const getHauptnutzungsFeatures = (state) => dataDuck.selectors.getFeatures(state.dataState);
export const getHauptnutzungenMD5 = (state) => dataDuck.selectors.getMD5(state.dataState);

//HELPER FUNCTIONS

function convertHauptnutzungToFeature(hn, index) {
	if (hn === undefined) {
		return undefined;
	}
	const id = hn.id;
	const type = 'Feature';
	const featuretype = 'Hauptnutzung';
	const selected = false;
	const geometry = hn.geojson;

	const text = hn.name;

	return {
		id,
		index,
		text,
		type,
		featuretype,
		selected,
		geometry,
		crs: {
			type: 'name',
			properties: {
				name: 'urn:ogc:def:crs:EPSG::25832'
			}
		},
		properties: hn
	};
}
