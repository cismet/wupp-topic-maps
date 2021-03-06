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
export const types = {
	SET_ENV_ZONE_VISIBILITY: 'PRBR/SET_ENV_ZONE_VISIBILITY'
};

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
const initialState = {
	envZoneVisibility: true
};

///REDUCER
const localReducer = (state = initialState, action) => {
	let newState = objectAssign({}, state);

	switch (action.type) {
		case types.SET_ENV_ZONE_VISIBILITY: {
			newState.envZoneVisibility = action.visible;
			return newState;
		}
		default:
			return state;
	}
};

//Storage Configs
const markerSizeStorageConfig = {
	key: 'prbrMarkerSize',
	storage: localForage,
	whitelist: [ 'markerSize' ]
};
const dataStateStorageConfig = {
	key: 'prbrData',
	storage: localForage,
	whitelist: [ 'items', 'md5' ]
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
const localStateStorageConfig = {
	key: 'prbrlocal',
	storage: localForage,
	whitelist: [ 'envZoneVisibility' ]
};

const reducer = combineReducers({
	dataState: persistReducer(dataStateStorageConfig, dataDuck.reducer),
	featureCollectionState: persistReducer(
		prbrFeatureCollectionStateStorageConfig,
		featureCollectionDuck.reducer
	),
	localState: persistReducer(localStateStorageConfig, localReducer),
	markerSizeState: persistReducer(markerSizeStorageConfig, markerSizeDuck.reducer),
	secondaryInfoBoxVisibility: secondaryInfoBoxVisibilityStateDuck.reducer,
	infoBoxState: persistReducer(infoBoxStateStorageConfig, infoBoxStateDuck.reducer)
});

export default reducer;

//SIMPLEACTIONCREATORS
function setEnvZoneVisible(visible) {
	return { type: types.SET_ENV_ZONE_VISIBILITY, visible };
}
//COMPLEXACTIONS
function loadPRBRs(finishedHandler = () => {}) {
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
					finishedHandler();
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
	setMinifiedInfoBox: infoBoxStateDuck.actions.setMinifiedInfoBoxState,
	setEnvZoneVisible
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
export const getPRBRFilterDescription = (state) =>
	convertPRBRFilterToText(
		featureCollectionDuck.selectors.getFilter(state.featureCollectionState)
	);
export const isEnvZoneVisible = (state) => state.localState.envZoneVisibility;

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

function convertPRBRFilterToText(filter) {
	let filterDescription = '';
	if (filter.bandr === true && filter.pandr === true) {
		filterDescription = 'alle Anlagen';
	} else if (filter.bandr === true) {
		filterDescription = 'nur B+R Anlagen';
	} else if (filter.pandr === true) {
		filterDescription = 'nur P+R Anlagen';
	}

	if (filter.envZoneWithin === false || filter.envZoneOutside === false) {
		if (filter.envZoneWithin === true) {
			filterDescription += ' innerhalb einer Umweltzone';
		} else if (filter.envZoneOutside === true) {
			filterDescription += ' außerhalb einer Umweltzone';
		}
	}
	return filterDescription;
}
