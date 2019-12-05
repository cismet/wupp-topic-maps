import objectAssign from 'object-assign';
import makeDataDuck from '../higherorderduckfactories/dataWithMD5Check';
import makeFeatureCollectionWithoutIndexDuck from '../higherorderduckfactories/filteredFeatureCollectionWithoutIndex';
import makeMarkerSizeDuck from '../higherorderduckfactories/markerSize';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import localForage from 'localforage';
import makeInfoBoxStateDuck from '../higherorderduckfactories/minifiedInfoBoxState';
import makeSecondaryInfoBoxVisibilityStateDuck from '../higherorderduckfactories/secondaryInfoBoxVisibilityState';
import booleanDisjoint from '@turf/boolean-disjoint';
import bboxPolygon from '@turf/bbox-polygon';
import { addSVGToFeature } from '../../utils/emobHelper';

//TYPES
//no types bc no local store
export const types = {};

export const constants = {
	DEBUG_ALWAYS_LOADING: false
};

const filterFunctionFactory = (filter) => {
	return (obj) => {
		return true;
	};
};

//HIGHER ORDER DUCKS
const dataDuck = makeDataDuck('aev', (state) => state.aev.dataState, convertAEVToFeature);
// const dataDuck = makeDataDuck('aev', (state) => state.aev.dataState, convertHauptnutzungToFeature);

const infoBoxStateDuck = makeInfoBoxStateDuck('aev', (state) => state.aev.infoBoxState);

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

			for (let feature of state.aev.dataState.features) {
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

function convertHauptnutzungToFeature(hn, index) {
	if (hn === undefined) {
		return undefined;
	}
	const id = hn.id;
	const type = 'Feature';
	const selected = false;
	const geometry = hn.geojson;

	const text = hn.name;

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
		properties: hn
	};
}
function convertAEVFilterToText(filter) {
	let filterDescriptions = [];
	if (filter.nur_online === true) {
		filterDescriptions.push('verfügbar');
	}
	if (filter.stecker.length < 6) {
		filterDescriptions.push('passender Stecker');
	}
	if (filter.nur_gruener_strom === true) {
		filterDescriptions.push('Ökostrom');
	}
	if (filter.nur_schnelllader === true) {
		filterDescriptions.push('Schnelllader');
	}
	return filterDescriptions.join(' | ');
}
