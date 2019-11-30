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
const markerSizeDuck = makeMarkerSizeDuck('aev', (state) => state.aev.markerSizeState, 45);
// const featureCollectionDuck = makeFeatureCollectionWithoutIndexDuck(
// 	'aev',
// 	(state) => state.aev.featureCollectionState,
// 	(state) => state.mapping.boundingBox,
// 	convertAEVToFeature,
// 	filterFunctionFactory,
// 	{
// 		nur_online: false,
// 		oeffnungszeiten: '*',
// 		stecker: [ 'Schuko', 'Typ 2', 'CHAdeMO', 'CCS', 'Tesla Supercharger', 'Drehstrom' ],
// 		nur_gruener_strom: false,
// 		nur_schnelllader: false
// 	}
// );

const infoBoxStateDuck = makeInfoBoxStateDuck('aev', (state) => state.aev.infoBoxState);
const secondaryInfoBoxVisibilityStateDuck = makeSecondaryInfoBoxVisibilityStateDuck(
	'aev',
	(state) => state.aev.secondaryInfoBoxVisibility
);

///INITIAL STATE
//no localState

///REDUCER
//no localState

//Storage Configs
const markerSizeStorageConfig = {
	key: 'aevMarkerSize',
	storage: localForage,
	whitelist: [ 'markerSize' ]
};
const dataStateStorageConfig = {
	key: 'aevData',
	storage: localForage,
	whitelist: [] //["items", "md5"]
};
const infoBoxStateStorageConfig = {
	key: 'aevInfoBoxMinifiedState',
	storage: localForage,
	whitelist: [ 'minified' ]
};
// const aevFeatureCollectionStateStorageConfig = {
// 	key: 'aevFeatureCollectionStateConfig',
// 	storage: localForage,
// 	whitelist: [ 'filter_' ]
// };

const reducer = combineReducers({
	dataState: persistReducer(dataStateStorageConfig, dataDuck.reducer),
	markerSizeState: persistReducer(markerSizeStorageConfig, markerSizeDuck.reducer),
	secondaryInfoBoxVisibility: secondaryInfoBoxVisibilityStateDuck.reducer,
	infoBoxState: persistReducer(infoBoxStateStorageConfig, infoBoxStateDuck.reducer)
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
				done: (dispatch, data, md5) => {
					// dispatch(actions.setFeatureCollectionDataSource(data));
					// dispatch(actions.applyFilter());
					// dispatch(actions.createFeatureCollection());
				},
				prepare: (dispatch, data) => {
					let svgResolvingPromises = data.map(function(aev) {
						return addSVGToFeature(aev, manualReloadRequest);
					});
					return svgResolvingPromises;
				},
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
		// if (!cfg.skipMappingActions) {
		// 	dispatch(mappingActions.setSearchProgressIndicator(true));
		// }
		// const state = getState();
		// let wkt;
		// if (overriddenWKT) {
		// 	wkt = overriddenWKT;
		// } else if (Array.isArray(gazObject) && gazObject[0].more.v) {
		// 	wkt = `POINT (${gazObject[0].x} ${gazObject[0].y} )`;
		// } else {
		// 	wkt = getPolygonfromBBox(state.mapping.boundingBox);
		// }
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
	searchForAEVs,
	setSecondaryInfoVisible:
		secondaryInfoBoxVisibilityStateDuck.actions.setSecondaryInfoBoxVisibilityState,
	// setSelectedAEV: featureCollectionDuck.actions.setSelectedItem,
	// applyFilter: featureCollectionDuck.actions.applyFilter,
	// setFilter: featureCollectionDuck.actions.setFilterAndApply,
	// setSelectedFeatureIndex: featureCollectionDuck.actions.setSelectedIndex,
	// setFeatureCollectionDataSource: featureCollectionDuck.actions.setDatasource,
	// createFeatureCollection: featureCollectionDuck.actions.createFeatureCollection,
	// refreshFeatureCollection: featureCollectionDuck.actions.createFeatureCollection,
	setAEVSvgSize: markerSizeDuck.actions.setSize,
	setMinifiedInfoBox: infoBoxStateDuck.actions.setMinifiedInfoBoxState
};

//EXPORT SELECTORS
export const getAEVs = (state) => dataDuck.selectors.getItems(state.dataState);
export const getAEVFeatures = (state) => dataDuck.selectors.getFeatures(state.dataState);
// export const getAEVFeatureCollection = (state) =>
// 	featureCollectionDuck.selectors.getFeatureCollection(state.featureCollectionState);
// export const getAEVFilter = (state) =>
// 	featureCollectionDuck.selectors.getFilter(state.featureCollectionState);
// export const getAEVFilteredData = (state) =>
// 	featureCollectionDuck.selectors.getFilteredData(state.featureCollectionState);
// export const getAEVFeatureCollectionSelectedIndex = (state) =>
// 	featureCollectionDuck.selectors.getSelectedIndex(state.featureCollectionState);
export const getAEVMD5 = (state) => dataDuck.selectors.getMD5(state.dataState);
export const getAEVSvgSize = (state) =>
	markerSizeDuck.selectors.getMarkerSize(state.markerSizeState);
export const hasMinifiedInfoBox = (state) => state.infoBoxState.minified;
export const isSecondaryInfoBoxVisible = (state) => state.secondaryInfoBoxVisibility.visible;

// export const getAEVFilterDescription = (state) =>
// 	convertAEVFilterToText(featureCollectionDuck.selectors.getFilter(state.featureCollectionState));

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
