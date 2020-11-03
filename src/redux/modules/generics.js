import { addSVGToPOI } from '../../utils/stadtplanHelper';
import makeDataDuck from '../higherorderduckfactories/dataWithMD5Check';
import makePointFeatureCollectionWithIndexDuck from '../higherorderduckfactories/pointFeatureCollectionWithIndex';
import makeMarkerSizeDuck from '../higherorderduckfactories/markerSize';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import localForage from 'localforage';
import makeInfoBoxStateDuck from '../higherorderduckfactories/minifiedInfoBoxState';

//TYPES
export const types = {
	SET_MARKER_SVG_SIZE: 'STADTPLAN/SET_POI_SVG_SIZE'
};

export const constants = {
	DEBUG_ALWAYS_LOADING: false
};

//HIGHER ORDER DUCKS
const dataDuck = makeDataDuck('GENERICS', (state) => state.generics.dataState);
const markerSizeDuck = makeMarkerSizeDuck('GENERICS', (state) => state.generics.markerSizeState);
const featureCollectionDuck = makePointFeatureCollectionWithIndexDuck(
	'GENERICS',
	(state) => state.generics.featureCollectionState,
	(state) => state.mapping.boundingBox,
	(featureInAsFeatureOut) => featureInAsFeatureOut,
	(p) => p.geometry.coordinates
);
const infoBoxStateDuck = makeInfoBoxStateDuck('GENERICS', (state) => state.generics.infoBoxState);

///REDUCER
//no local Reducer needed

const markerSizeStorageConfig = {
	key: 'genericsMarkerSize',
	storage: localForage,
	whitelist: [ 'markerSize' ]
};
const dataStateStorageConfig = {
	key: 'genericsData',
	storage: localForage,
	whitelist: []
};
const infoBoxStateStorageConfig = {
	key: 'genericsInfoBoxMinifiedState',
	storage: localForage,
	whitelist: [ 'minified' ]
};

const reducer = combineReducers({
	dataState: dataDuck.reducer,
	featureCollectionState: featureCollectionDuck.reducer,
	markerSizeState: persistReducer(markerSizeStorageConfig, markerSizeDuck.reducer),
	infoBoxState: persistReducer(infoBoxStateStorageConfig, infoBoxStateDuck.reducer)
});

export default reducer;
const debugLog = false;
///SIMPLEACTIONCREATORS
//no simple actions

//COMPLEXACTIONS

// function loadGenerics(finishedHandler = () => {}) {

// 	const manualReloadRequest = false;
// 	return (dispatch, getState) => {
// 		dispatch(
// 			dataDuck.actions.load({
// 				manualReloadRequested: manualReloadRequest,
// 				dataURL: '/data/baeder.data.json',
// 				done: (dispatch, data, md5) => {
// 					if (debugLog) {
// 						console.log('baeder:before.setFeatureCollectionDataSource' + data);
// 					}
// 					dispatch(actions.setFeatureCollectionDataSource(data));
// 					dispatch(actions.createFeatureCollection());
// 					finishedHandler();
// 				},
// 				prepare: (dispatch, data) => {
// 					let svgResolvingPromises = data.map(function(bad) {
// 						return addSVGToPOI(bad, manualReloadRequest);
// 					});
// 					return svgResolvingPromises;
// 				},
// 				errorHandler: (err) => {
// 					console.log(err);
// 				}
// 			})
// 		);
// 	};
// }

//EXPORT ACTIONS
export const actions = {
	setSelectedItem: featureCollectionDuck.actions.setSelectedItem,
	setSelectedFeatureIndex: featureCollectionDuck.actions.setSelectedIndex,
	setFeatureCollectionDataSource: featureCollectionDuck.actions.setDatasource,
	createFeatureCollection: featureCollectionDuck.actions.createFeatureCollection,
	refreshFeatureCollection: featureCollectionDuck.actions.createFeatureCollection,
	setGenericItemSvgSize: markerSizeDuck.actions.setSize,
	setMinifiedInfoBox: infoBoxStateDuck.actions.setMinifiedInfoBoxState
};

//EXPORT SELECTORS
export const getGenericItems = (state) => dataDuck.selectors.getItems(state.dataState);
export const getGenericsFeatureCollection = (state) =>
	featureCollectionDuck.selectors.getFeatureCollection(state.featureCollectionState);
export const getGenericsFeatureCollectionSelectedIndex = (state) =>
	featureCollectionDuck.selectors.getSelectedIndex(state.featureCollectionState);

export const getGenericItemSvgSize = (state) =>
	markerSizeDuck.selectors.getMarkerSize(state.markerSizeState);
export const hasMinifiedInfoBox = (state) => state.infoBoxState.minified;
