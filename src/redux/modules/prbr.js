import objectAssign from 'object-assign';
import makeDataDuck from '../higherorderduckfactories/dataWithMD5Check';
import makePointFeatureCollectionWithIndexDuck from '../higherorderduckfactories/filteredPointFeatureCollectionWithIndex';
import makeMarkerSizeDuck from '../higherorderduckfactories/markerSize';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import localForage from 'localforage';
import makeInfoBoxStateDuck from '../higherorderduckfactories/minifiedInfoBoxState';
import makeSecondaryInfoBoxVisibilityStateDuck from '../higherorderduckfactories/secondaryInfoBoxVisibilityState';

import { addSVGToPRBR } from '../../utils/prbrHelper';

//TYPES
//no types bc no local store
export const types = {};

export const constants = {
	DEBUG_ALWAYS_LOADING: false
};

const filterFunctionFactory = (filter) => {
	return (obj) => {
		let keep = false;

		if (filter.envZoneWithin === true && obj.inUZ === true) {
			keep = true;
		}
		if (filter.envZoneOutside === true && obj.inUZ === false) {
			keep = true;
		}

		if (keep === true) {
			keep = false;
			if (obj.schluessel === 'P' && filter.pandr === true) {
				keep = true;
			}
			if (obj.schluessel === 'B' && filter.bandr === true) {
				keep = true;
			}
		}
		return keep;
	};
};

//HIGHER ORDER DUCKS
const dataDuck = makeDataDuck('PRBR', (state) => state.prbr.dataState);
const markerSizeDuck = makeMarkerSizeDuck('PRBR', (state) => state.prbr.markerSizeState, 45);
const featureCollectionDuck = makePointFeatureCollectionWithIndexDuck(
	'PRBR',
	(state) => state.prbr.featureCollectionState,
	(state) => state.mapping.boundingBox,
	convertPRBRToFeature,
	filterFunctionFactory,
	{
		envZoneWithin: true,
		envZoneOutside: true,
		bandr: true,
		pandr: true
	}
);
const infoBoxStateDuck = makeInfoBoxStateDuck('PRBR', (state) => state.prbr.infoBoxState);
const secondaryInfoBoxVisibilityStateDuck = makeSecondaryInfoBoxVisibilityStateDuck(
	'PRBR',
	(state) => state.prbr.secondaryInfoBoxVisibility
);

///INITIAL STATE
//no localState

///REDUCER
//no localState

//Storage Configs
const markerSizeStorageConfig = {
	key: 'prbrMarkerSize',
	storage: localForage,
	whitelist: [ 'markerSize' ]
};
const dataStateStorageConfig = {
	key: 'prbrData',
	storage: localForage,
	whitelist: [] //["items", "md5"]
};
const infoBoxStateStorageConfig = {
	key: 'prbrInfoBoxMinifiedState',
	storage: localForage,
	whitelist: [ 'minified' ]
};
const prbrFeatureCollectionStateStorageConfig = {
	key: 'prbrFeatureCollectionStateConfig',
	storage: localForage,
	whitelist: [ 'filter' ]
};

const reducer = combineReducers({
	dataState: persistReducer(dataStateStorageConfig, dataDuck.reducer),
	featureCollectionState: persistReducer(
		prbrFeatureCollectionStateStorageConfig,
		featureCollectionDuck.reducer
	),
	markerSizeState: persistReducer(markerSizeStorageConfig, markerSizeDuck.reducer),
	secondaryInfoBoxVisibility: secondaryInfoBoxVisibilityStateDuck.reducer,
	infoBoxState: persistReducer(infoBoxStateStorageConfig, infoBoxStateDuck.reducer)
});

export default reducer;

//SIMPLEACTIONCREATORS
function setSecondaryInfoVisible(secondaryInfoShown) {
	return { type: types.SET_PRBR_SECONDARY_INFO_VISIBLE, secondaryInfoShown };
}
//COMPLEXACTIONS
function loadPRBRs() {
	const manualReloadRequest = false;
	return (dispatch, getState) => {
		dispatch(
			dataDuck.actions.load({
				manualReloadRequested: manualReloadRequest,
				dataURL: '/data/prbr.data.json',
				done: (dispatch, data, md5) => {
					dispatch(actions.setFeatureCollectionDataSource(data));
					dispatch(actions.applyFilter());

					dispatch(actions.createFeatureCollection());
				},
				prepare: (dispatch, data) => {
					let svgResolvingPromises = data.map(function(prbr) {
						return addSVGToPRBR(prbr, manualReloadRequest);
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

//EXPORT ACTIONS
export const actions = {
	loadPRBRs,
	setSecondaryInfoVisible:
		secondaryInfoBoxVisibilityStateDuck.actions.setSecondaryInfoBoxVisibilityState,
	setSelectedPRBR: featureCollectionDuck.actions.setSelectedItem,
	applyFilter: featureCollectionDuck.actions.applyFilter,
	setFilter: featureCollectionDuck.actions.setFilterAndApply,
	setSelectedFeatureIndex: featureCollectionDuck.actions.setSelectedIndex,
	setFeatureCollectionDataSource: featureCollectionDuck.actions.setDatasource,
	createFeatureCollection: featureCollectionDuck.actions.createFeatureCollection,
	refreshFeatureCollection: featureCollectionDuck.actions.createFeatureCollection,
	setPRBRSvgSize: markerSizeDuck.actions.setSize,
	setMinifiedInfoBox: infoBoxStateDuck.actions.setMinifiedInfoBoxState
};

//EXPORT SELECTORS
export const getPRBRs = (state) => dataDuck.selectors.getItems(state.dataState);
export const getPRBRFeatureCollection = (state) =>
	featureCollectionDuck.selectors.getFeatureCollection(state.featureCollectionState);
export const getPRBRFilter = (state) =>
	featureCollectionDuck.selectors.getFilter(state.featureCollectionState);
export const getPRBRFilteredData = (state) =>
	featureCollectionDuck.selectors.getFilteredData(state.featureCollectionState);
export const getPRBRFeatureCollectionSelectedIndex = (state) =>
	featureCollectionDuck.selectors.getSelectedIndex(state.featureCollectionState);
export const getPRBRMD5 = (state) => dataDuck.selectors.getMD5(state.dataState);
export const getPRBRSvgSize = (state) =>
	markerSizeDuck.selectors.getMarkerSize(state.markerSizeState);
export const hasMinifiedInfoBox = (state) => state.infoBoxState.minified;
export const isSecondaryInfoBoxVisible = (state) => state.secondaryInfoBoxVisibility.visible;

//HELPER FUNCTIONS
function convertPRBRToFeature(prbr, index) {
	const id = prbr.id;
	const type = 'Feature';
	const selected = false;
	const geometry = prbr.geojson;
	const text = prbr.name;

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
		properties: prbr
	};
}
