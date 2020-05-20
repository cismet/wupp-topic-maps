import localForage from 'localforage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { addSVGToFeature } from '../../utils/ebikesHelper';
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

		// const example = {
		// 	stationsart: [ 'Ladestation', 'Verleihstation' ],
		// 	nur_online: false,
		// 	halb_oeffentlich: false,
		// 	gruener_strom: false,
		// 	ladebox: false
		// };

		// keep = filter.stationsart.includes(obj.typ);

		// if (obj.typ === 'Ladestation') {
		// 	if (filter.nur_online === true) {
		// 		keep = obj.online;
		// 	} else {
		// 		keep = true;
		// 	}
		// 	if (keep === true) {
		// 		keep = false;
		// 		//Öffnungszeiten
		// 		if (filter.halb_oeffentlich === true) {
		// 			keep = obj.halb_oeffentlich;
		// 		}
		// 	}
		// 	//Grüner Strom
		// 	if (keep === true && filter.gruener_strom === true) {
		// 		keep = obj.gruener_strom === true;
		// 	}

		// 	//Ladebox
		// 	if (keep === true && filter.ladebox === true) {
		// 		keep = obj.ladebox;
		// 	}
		// }
		return true;
		return keep;
	};
};

//HIGHER ORDER DUCKS
const dataDuck = makeDataDuck('ebikes', (state) => state.ebikes.dataState);
const markerSizeDuck = makeMarkerSizeDuck('ebikes', (state) => state.ebikes.markerSizeState, 45);
const featureCollectionDuck = makePointFeatureCollectionWithIndexDuck(
	'ebikes',
	(state) => state.ebikes.featureCollectionState,
	(state) => state.mapping.boundingBox,
	convertEBikesToFeature,
	filterFunctionFactory,
	{
		stationsart: [ 'Ladestation', 'Verleihstation' ],
		nur_online: false,
		halb_oeffentlich: false,
		gruener_strom: false,
		ladebox: false
	}
);
const infoBoxStateDuck = makeInfoBoxStateDuck('ebikes', (state) => state.ebikes.infoBoxState);
const secondaryInfoBoxVisibilityStateDuck = makeSecondaryInfoBoxVisibilityStateDuck(
	'ebikes',
	(state) => state.ebikes.secondaryInfoBoxVisibility
);

///INITIAL STATE
//no localState

///REDUCER
//no localState

//Storage Configs
const markerSizeStorageConfig = {
	key: 'ebikesMarkerSize',
	storage: localForage,
	whitelist: [ 'markerSize' ]
};
const dataStateStorageConfig = {
	key: 'ebikesData',
	storage: localForage,
	whitelist: [] //[ 'items', 'md5' ]
};
const infoBoxStateStorageConfig = {
	key: 'ebikesInfoBoxMinifiedState',
	storage: localForage,
	whitelist: [ 'minified' ]
};
const ebikesFeatureCollectionStateStorageConfig = {
	key: 'ebikesFeatureCollectionStateConfig',
	storage: localForage,
	whitelist: [ 'filter' ]
};

const reducer = combineReducers({
	dataState: persistReducer(dataStateStorageConfig, dataDuck.reducer),
	featureCollectionState: persistReducer(
		ebikesFeatureCollectionStateStorageConfig,
		featureCollectionDuck.reducer
	),
	markerSizeState: persistReducer(markerSizeStorageConfig, markerSizeDuck.reducer),
	secondaryInfoBoxVisibility: secondaryInfoBoxVisibilityStateDuck.reducer,
	infoBoxState: persistReducer(infoBoxStateStorageConfig, infoBoxStateDuck.reducer)
});

export default reducer;

//SIMPLEACTIONCREATORS

//COMPLEXACTIONS
function loadEBikes(finishedHandler = () => {}) {
	const manualReloadRequest = false;
	return (dispatch, getState) => {
		dispatch(
			dataDuck.actions.load({
				manualReloadRequested: manualReloadRequest,
				dataURL: '/data/ebikes.data.json',
				done: (dispatch, data, md5) => {
					dispatch(actions.setFeatureCollectionDataSource(data));
					dispatch(actions.applyFilter());

					dispatch(actions.createFeatureCollection());
					finishedHandler();
				},
				prepare: (dispatch, data) => {
					let svgResolvingPromises = data.map(function(ebikes) {
						return addSVGToFeature(ebikes, manualReloadRequest);
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
	loadEBikes,
	setSecondaryInfoVisible:
		secondaryInfoBoxVisibilityStateDuck.actions.setSecondaryInfoBoxVisibilityState,
	setSelectedEBike: featureCollectionDuck.actions.setSelectedItem,
	applyFilter: featureCollectionDuck.actions.applyFilter,
	setFilter: featureCollectionDuck.actions.setFilterAndApply,
	setSelectedFeatureIndex: featureCollectionDuck.actions.setSelectedIndex,
	setFeatureCollectionDataSource: featureCollectionDuck.actions.setDatasource,
	createFeatureCollection: featureCollectionDuck.actions.createFeatureCollection,
	refreshFeatureCollection: featureCollectionDuck.actions.createFeatureCollection,
	setEBikesSvgSize: markerSizeDuck.actions.setSize,
	setMinifiedInfoBox: infoBoxStateDuck.actions.setMinifiedInfoBoxState
};

//EXPORT SELECTORS
export const getEBikes = (state) => dataDuck.selectors.getItems(state.dataState);
export const getEBikesFeatureCollection = (state) =>
	featureCollectionDuck.selectors.getFeatureCollection(state.featureCollectionState);
export const getEBikesFilter = (state) =>
	featureCollectionDuck.selectors.getFilter(state.featureCollectionState);
export const getEBikesFilteredData = (state) =>
	featureCollectionDuck.selectors.getFilteredData(state.featureCollectionState);
export const getEBikesFeatureCollectionSelectedIndex = (state) =>
	featureCollectionDuck.selectors.getSelectedIndex(state.featureCollectionState);
export const getEBikesMD5 = (state) => dataDuck.selectors.getMD5(state.dataState);
export const getEBikesSvgSize = (state) =>
	markerSizeDuck.selectors.getMarkerSize(state.markerSizeState);
export const hasMinifiedInfoBox = (state) => state.infoBoxState.minified;
export const isSecondaryInfoBoxVisible = (state) => state.secondaryInfoBoxVisibility.visible;

export const getEBikesFilterDescription = (state) =>
	convertEBikesFilterToText(
		featureCollectionDuck.selectors.getFilter(state.featureCollectionState)
	);

//HELPER FUNCTIONS
function convertEBikesToFeature(ebike, index) {
	const id = ebike.id;
	const type = 'Feature';
	const selected = false;
	const geometry = ebike.geojson;
	const text = ebike.typ === 'Ladestation' ? ebike.standort : ebike.standort;

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
		properties: ebike
	};
}

function convertEBikesFilterToText(filter) {
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
