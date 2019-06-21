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
const dataDuck = makeDataDuck('BAEDER', (state) => state.baeder.dataState);
const markerSizeDuck = makeMarkerSizeDuck('BAEDER', (state) => state.baeder.markerSizeState);
const featureCollectionDuck = makePointFeatureCollectionWithIndexDuck(
	'BAEDER',
	(state) => state.baeder.featureCollectionState,
	(state) => state.mapping.boundingBox,
	convertBadToFeature
);
const infoBoxStateDuck = makeInfoBoxStateDuck('POIS', (state) => state.stadtplan.infoBoxState);

///REDUCER
//no local Reducer needed

const markerSizeStorageConfig = {
	key: 'baederMarkerSize',
	storage: localForage,
	whitelist: [ 'markerSize' ]
};
const dataStateStorageConfig = {
	key: 'baederData',
	storage: localForage,
	whitelist: [] //["items", "md5"]
};
const infoBoxStateStorageConfig = {
	key: 'stadtplaninfoBoxMinifiedState',
	storage: localForage,
	whitelist: [ 'minified' ]
};

const reducer = combineReducers({
	dataState: persistReducer(dataStateStorageConfig, dataDuck.reducer),
	featureCollectionState: featureCollectionDuck.reducer,
	markerSizeState: persistReducer(markerSizeStorageConfig, markerSizeDuck.reducer),
	infoBoxState: persistReducer(infoBoxStateStorageConfig, infoBoxStateDuck.reducer)
});

export default reducer;

///SIMPLEACTIONCREATORS
//no simple actions

//COMPLEXACTIONS
function loadBaeder() {
	const manualReloadRequest = false;
	return (dispatch, getState) => {
		dispatch(
			dataDuck.actions.load({
				manualReloadRequested: manualReloadRequest,
				dataURL: '/data/baeder.data.json',
				done: (dispatch, data, md5) => {
					dispatch(actions.setFeatureCollectionDataSource(data));
					dispatch(actions.createFeatureCollection());
				},
				prepare: (dispatch, data) => {
					let svgResolvingPromises = data.map(function(bad) {
						return addSVGToPOI(bad, manualReloadRequest);
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
	loadBaeder,
	setSelectedBad: featureCollectionDuck.actions.setSelectedItem,
	setSelectedFeatureIndex: featureCollectionDuck.actions.setSelectedIndex,
	setFeatureCollectionDataSource: featureCollectionDuck.actions.setDatasource,
	createFeatureCollection: featureCollectionDuck.actions.createFeatureCollection,
	refreshFeatureCollection: featureCollectionDuck.actions.createFeatureCollection,
	setBadSvgSize: markerSizeDuck.actions.setSize,
	setMinifiedInfoBox: infoBoxStateDuck.actions.setMinifiedInfoBoxState
};

//EXPORT SELECTORS
export const getBaeder = (state) => dataDuck.selectors.getItems(state.dataState);
export const getBaederFeatureCollection = (state) =>
	featureCollectionDuck.selectors.getFeatureCollection(state.featureCollectionState);
export const getBaederFeatureCollectionSelectedIndex = (state) =>
	featureCollectionDuck.selectors.getSelectedIndex(state.featureCollectionState);
export const getBaederMD5 = (state) => dataDuck.selectors.getMD5(state.dataState);
export const getBadSvgSize = (state) =>
	markerSizeDuck.selectors.getMarkerSize(state.markerSizeState);
export const hasMinifiedInfoBox = (state) => state.infoBoxState.minified;

//HELPER FUNCTIONS
function convertBadToFeature(bad, index) {
	const id = bad.id;
	const type = 'Feature';
	const selected = false;
	const geometry = bad.geojson;
	const text = bad.name;

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
		properties: bad
	};
}
