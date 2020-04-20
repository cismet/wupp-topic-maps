import localForage from 'localforage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { addSVGToFeature } from '../../utils/emobHelper';
import makeDataDuck from '../higherorderduckfactories/dataWithMD5Check';
import makePointFeatureCollectionWithIndexDuck from '../higherorderduckfactories/filteredPointFeatureCollectionWithIndex';
import makeMarkerSizeDuck from '../higherorderduckfactories/markerSize';
import makeInfoBoxStateDuck from '../higherorderduckfactories/minifiedInfoBoxState';
import makeSecondaryInfoBoxVisibilityStateDuck from '../higherorderduckfactories/secondaryInfoBoxVisibilityState';

//TYPES
//no types bc no local store
export const types = {};

export const constants = {
	DEBUG_ALWAYS_LOADING: false
};

const filterFunctionFactory = (filter) => {
	return (obj) => {
		let keep = false;

		//Online
		if (filter.nur_online === true) {
			keep = obj.online;
		} else {
			keep = true;
		}
		if (keep === true) {
			keep = false;
			//Öffnungszeiten
			if (filter.oeffnungszeiten === '*') {
				keep = true;
			}
			if (filter.oeffnungszeiten === '24' && obj.oeffnungszeiten.startsWith('24')) {
				keep = true;
			}
		}
		//Stecker
		if (filter.stecker !== undefined) {
			if (keep === true) {
				keep = false;
				for (let steckv of obj.steckerverbindungen) {
					if (filter.stecker.indexOf(steckv.steckdosentyp) !== -1) {
						keep = true;
						break;
					}
				}
			}
		}

		//Grüner Strom
		if (keep === true && filter.nur_gruener_strom === true) {
			keep = obj.gruener_strom === true;
		}

		//Schnelllader
		if (keep === true && filter.nur_schnelllader === true) {
			return obj.schnellladestation === true;
		}

		return keep;
	};
};

//HIGHER ORDER DUCKS
const dataDuck = makeDataDuck('emob', (state) => state.emob.dataState);
const markerSizeDuck = makeMarkerSizeDuck('emob', (state) => state.emob.markerSizeState, 45);
const featureCollectionDuck = makePointFeatureCollectionWithIndexDuck(
	'emob',
	(state) => state.emob.featureCollectionState,
	(state) => state.mapping.boundingBox,
	convertEMOBToFeature,
	filterFunctionFactory,
	{
		nur_online: false,
		oeffnungszeiten: '*',
		stecker: [ 'Schuko', 'Typ 2', 'CHAdeMO', 'CCS', 'Tesla Supercharger', 'Drehstrom' ],
		nur_gruener_strom: false,
		nur_schnelllader: false
	}
);
const infoBoxStateDuck = makeInfoBoxStateDuck('emob', (state) => state.emob.infoBoxState);
const secondaryInfoBoxVisibilityStateDuck = makeSecondaryInfoBoxVisibilityStateDuck(
	'emob',
	(state) => state.emob.secondaryInfoBoxVisibility
);

///INITIAL STATE
//no localState

///REDUCER
//no localState

//Storage Configs
const markerSizeStorageConfig = {
	key: 'emobMarkerSize',
	storage: localForage,
	whitelist: [ 'markerSize' ]
};
const dataStateStorageConfig = {
	key: 'emobData',
	storage: localForage,
	whitelist: [ 'items', 'md5' ]
};
const infoBoxStateStorageConfig = {
	key: 'emobInfoBoxMinifiedState',
	storage: localForage,
	whitelist: [ 'minified' ]
};
const emobFeatureCollectionStateStorageConfig = {
	key: 'emobFeatureCollectionStateConfig',
	storage: localForage,
	whitelist: [ 'filter' ]
};

const reducer = combineReducers({
	dataState: persistReducer(dataStateStorageConfig, dataDuck.reducer),
	featureCollectionState: persistReducer(
		emobFeatureCollectionStateStorageConfig,
		featureCollectionDuck.reducer
	),
	markerSizeState: persistReducer(markerSizeStorageConfig, markerSizeDuck.reducer),
	secondaryInfoBoxVisibility: secondaryInfoBoxVisibilityStateDuck.reducer,
	infoBoxState: persistReducer(infoBoxStateStorageConfig, infoBoxStateDuck.reducer)
});

export default reducer;

//SIMPLEACTIONCREATORS

//COMPLEXACTIONS
function loadEMOBs(finishedHandler = () => {}) {
	const manualReloadRequest = false;
	return (dispatch, getState) => {
		dispatch(
			dataDuck.actions.load({
				manualReloadRequested: manualReloadRequest,
				dataURL: '/data/emob.data.json',
				done: (dispatch, data, md5) => {
					dispatch(actions.setFeatureCollectionDataSource(data));
					dispatch(actions.applyFilter());

					dispatch(actions.createFeatureCollection());
					finishedHandler();
				},
				prepare: (dispatch, data) => {
					let svgResolvingPromises = data.map(function(emob) {
						return addSVGToFeature(emob, manualReloadRequest);
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
	loadEMOBs,
	setSecondaryInfoVisible:
		secondaryInfoBoxVisibilityStateDuck.actions.setSecondaryInfoBoxVisibilityState,
	setSelectedEMOB: featureCollectionDuck.actions.setSelectedItem,
	applyFilter: featureCollectionDuck.actions.applyFilter,
	setFilter: featureCollectionDuck.actions.setFilterAndApply,
	setSelectedFeatureIndex: featureCollectionDuck.actions.setSelectedIndex,
	setFeatureCollectionDataSource: featureCollectionDuck.actions.setDatasource,
	createFeatureCollection: featureCollectionDuck.actions.createFeatureCollection,
	refreshFeatureCollection: featureCollectionDuck.actions.createFeatureCollection,
	setEMOBSvgSize: markerSizeDuck.actions.setSize,
	setMinifiedInfoBox: infoBoxStateDuck.actions.setMinifiedInfoBoxState
};

//EXPORT SELECTORS
export const getEMOBs = (state) => dataDuck.selectors.getItems(state.dataState);
export const getEMOBFeatureCollection = (state) =>
	featureCollectionDuck.selectors.getFeatureCollection(state.featureCollectionState);
export const getEMOBFilter = (state) =>
	featureCollectionDuck.selectors.getFilter(state.featureCollectionState);
export const getEMOBFilteredData = (state) =>
	featureCollectionDuck.selectors.getFilteredData(state.featureCollectionState);
export const getEMOBFeatureCollectionSelectedIndex = (state) =>
	featureCollectionDuck.selectors.getSelectedIndex(state.featureCollectionState);
export const getEMOBMD5 = (state) => dataDuck.selectors.getMD5(state.dataState);
export const getEMOBSvgSize = (state) =>
	markerSizeDuck.selectors.getMarkerSize(state.markerSizeState);
export const hasMinifiedInfoBox = (state) => state.infoBoxState.minified;
export const isSecondaryInfoBoxVisible = (state) => state.secondaryInfoBoxVisibility.visible;

export const getEMOBFilterDescription = (state) =>
	convertEMOBFilterToText(
		featureCollectionDuck.selectors.getFilter(state.featureCollectionState)
	);

//HELPER FUNCTIONS
function convertEMOBToFeature(emob, index) {
	const id = emob.id;
	const type = 'Feature';
	const selected = false;
	const geometry = emob.geojson;
	const text = emob.name;

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
		properties: emob
	};
}

function convertEMOBFilterToText(filter) {
	let filterDescriptions = [];
	if (filter.nur_online === true) {
		filterDescriptions.push('verfügbar');
	}
	if (filter.oeffnungszeiten === '24') {
		filterDescriptions.push('24/7');
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
