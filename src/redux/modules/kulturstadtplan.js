import objectAssign from 'object-assign';
import { actions as mappingActions } from './mapping';
import { predicateBy } from '../../utils/stringHelper';
import {
	getAllEinrichtungen,
	classifyMainlocationTypeName
} from '../../utils/kulturstadtplanHelper';
import kdbush from 'kdbush';
import { addSVGToPOI } from '../../utils/stadtplanHelper';
import makeDataDuck from '../higherorderduckfactories/dataWithMD5Check';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import localForage from 'localforage';
import makeInfoBoxStateDuck from '../higherorderduckfactories/minifiedInfoBoxState';

//TYPES
export const types = {
	//   SET_POI_GAZ_HIT: "STADTPLAN/SET_POI_GAZ_HIT",   CLEAR_POI_GAZ_HIT:
	// "STADTPLAN/CLEAR_POI_GAZ_HIT",
	SET_FILTERED_POIS: 'KULTURSTADTPLAN/SET_FILTERED_POIS',
	SET_FILTER: 'KULTURSTADTPLAN/SET_FILTER',

	SET_TYPES: 'KULTURSTADTPLAN/SET_TYPES',
	SET_LEBENSLAGEN: 'KULTURSTADTPLAN/SET_LEBENSLAGEN',
	SET_FILTERMODE: 'KULTURSTADTPLAN/SET_FILTERMODE',
	SET_VERANSTALTUNGSARTEN: 'KULTURSTADTPLAN/SET_VERANSTALTUNGSARTEN',
	SET_MINIFIED_INFO_BOX: 'KULTURSTADTPLAN/SET_MINIFIED_INFO_BOX',

	SET_POI_SVG_SIZE: 'KULTURSTADTPLAN/SET_POI_SVG_SIZE'
};

export const constants = {
	DEBUG_ALWAYS_LOADING: false
};

//HIGHER ORDER DUCKS
const dataDuck = makeDataDuck('VERANSTALTUNGSORTE', (state) => state.kulturstadtplan.dataState);
const infoBoxStateDuck = makeInfoBoxStateDuck(
	'VERANSTALTUNGSORTE',
	(state) => state.kulturstadtplan.infoBoxState
);

///INITIAL STATE
const initialState = {
	poiGazHitId: null,
	filteredPois: [],
	filteredPoisIndex: null,
	lebenslagen: [],
	veranstaltungsarten: [],
	poitypes: [],
	filter: {
		einrichtungen: undefined,
		veranstaltungen: undefined
	},
	filtermode: 'einrichtungen',
	poiSvgSize: 35,
	apps: [
		// {   on: ["Sport"],   name: "Sporthallen",   bsStyle: "default",
		// backgroundColor: null,   link: "/#/ehrenamt",   target: "_hallen" }
	]
};

///REDUCER
const localStadtplanReducer = (state = initialState, action) => {
	let newState;
	switch (action.type) {
		// case types.SET_POIS: {   newState = objectAssign({}, state);   newState.pois
		// = action.pois;   newState.poisMD5 = action.poisMD5;   return newState; } case
		// types.SET_POI_GAZ_HIT: {   newState = objectAssign({}, state);
		// newState.poiGazHitId = action.hitId;   return newState; } case
		// types.CLEAR_POI_GAZ_HIT: {   newState = objectAssign({}, state);
		// newState.poiGazHitId = null;   return newState; }
		case types.SET_FILTERED_POIS: {
			newState = objectAssign({}, state);
			newState.filteredPois = action.filteredPois;
			newState.filteredPoisIndex = kdbush(
				action.filteredPois,
				(p) => p.geojson.coordinates[0],
				(p) => p.geojson.coordinates[1]
			);
			return newState;
		}
		case types.SET_TYPES: {
			newState = objectAssign({}, state);
			newState.poitypes = action.poitypes;
			return newState;
		}
		case types.SET_LEBENSLAGEN: {
			newState = objectAssign({}, state);
			newState.lebenslagen = action.lebenslagen;
			return newState;
		}
		case types.SET_VERANSTALTUNGSARTEN: {
			newState = objectAssign({}, state);
			newState.veranstaltungsarten = action.veranstaltungsarten;
			return newState;
		}
		case types.SET_FILTER: {
			newState = objectAssign({}, state);
			newState.filter = action.filter;
			return newState;
		}
		case types.SET_FILTERMODE: {
			newState = objectAssign({}, state);
			newState.filtermode = action.mode;
			return newState;
		}
		case types.SET_POI_SVG_SIZE: {
			newState = objectAssign({}, state);
			newState.poiSvgSize = action.poiSvgSize;
			return newState;
		}
		default:
			return state;
	}
};

const localStateStorageConfig = {
	key: 'kulturstadtplanPOIs',
	storage: localForage,
	whitelist: [
		'pois',
		'poisMD5',
		'filter',
		'filtermode',
		'poitypes',
		'lebenslagen',
		'veranstaltungsarten',
		'poiSvgSize',
		'minifiedInfoBox'
	]
};
const dataStateStorageConfig = {
	key: 'kulturstadtplanPOIData',
	storage: localForage,
	whitelist: [ 'items', 'md5' ]
};
const infoBoxStateStorageConfig = {
	key: 'kulturstadtplaninfoBoxMinifiedState',
	storage: localForage,
	whitelist: [ 'minified' ]
};

const stadtplanReducer = combineReducers({
	localState: persistReducer(localStateStorageConfig, localStadtplanReducer),
	dataState: persistReducer(dataStateStorageConfig, dataDuck.reducer),
	infoBoxState: persistReducer(infoBoxStateStorageConfig, infoBoxStateDuck.reducer)
});

export default stadtplanReducer;

///SIMPLEACTIONCREATORS
function setPOIs(pois, poisMD5) {
	return { type: types.SET_POIS, pois, poisMD5 };
}
function setFilteredPOIs(filteredPois) {
	return { type: types.SET_FILTERED_POIS, filteredPois };
}
function setTypes(poitypes) {
	return { type: types.SET_TYPES, poitypes };
}
function setLebenslagen(lebenslagen) {
	return { type: types.SET_LEBENSLAGEN, lebenslagen };
}
function setVeranstaltungsarten(veranstaltungsarten) {
	return { type: types.SET_VERANSTALTUNGSARTEN, veranstaltungsarten };
}
function setFilter(filter) {
	return { type: types.SET_FILTER, filter };
}
function setFilterModeValue(mode) {
	return { type: types.SET_FILTERMODE, mode };
}
function setPoiSvgSize(poiSvgSize) {
	return { type: types.SET_POI_SVG_SIZE, poiSvgSize };
}

//COMPLEXACTIONS

function setSelectedPOI(pid) {
	return (dispatch, getState) => {
		let state = getState();
		let poiFeature = state.mapping.featureCollection.find((x) => x.id === pid);
		if (poiFeature) {
			dispatch(mappingActions.setSelectedFeatureIndex(poiFeature.index));
			//dispatch(clearPoiGazHit());
		} else {
			//dispatch(setPoiGazHit(poiFeature.index));
		}
	};
}

function loadPOIs() {
	const manualReloadRequest = false;
	return (dispatch, getState) => {
		const state = getState();

		dispatch(
			dataDuck.actions.load({
				manualReloadRequested: manualReloadRequest,
				dataURL: '/data/veranstaltungsorte.data.json',
				prepare: (dispatch, data) => {
					let lebenslagen = new Set();
					let veranstaltungsarten = new Set();
					let poitypes = [];
					let currentPOI;
					for (let poi of data) {
						currentPOI = poi;
						console.log('poi', poi);

						// poi.point25832 = convertPoint(poi.geo_x, offer.geo_y) zuesrt mainlocationtype
						if (poi.mainlocationtype) {
							let type = poi.mainlocationtype;
							for (let ll of type.lebenslagen) {
								lebenslagen.add(ll);
							}
							let found = poitypes.find((x) => x.id === type.id);
							if (!found) {
								poitypes.push(type);
							}
						}

						if (poi.more && poi.more.veranstaltungsarten) {
							for (let va of poi.more.veranstaltungsarten) {
								veranstaltungsarten.add(va);
							}
						}
					}
					dispatch(setTypes(Array.from(poitypes).sort(predicateBy('name'))));
					dispatch(setLebenslagen(Array.from(lebenslagen).sort()));
					dispatch(setVeranstaltungsarten(Array.from(veranstaltungsarten).sort()));

					let svgResolvingPromises = data.map(function(poi) {
						return addSVGToPOI(poi, manualReloadRequest);
					});
					return svgResolvingPromises;
				},
				done: (dispatch, data, md5) => {
					//if filter undefined setAll
					if (state.kulturstadtplan.localState.filter.einrichtungen === undefined) {
						dispatch(setAllToFilter('einrichtungen'));
					}
					if (state.kulturstadtplan.localState.filter.veranstaltungen === undefined) {
						dispatch(setAllToFilter('veranstaltungen'));
					}
					dispatch(applyFilter());
					dispatch(createFeatureCollectionFromPOIs());
				},
				errorHandler: (err) => {
					console.log(err);
				}
			})
		);
	};
}

function toggleFilter(kind, filter) {
	return (dispatch, getState) => {
		let state = getState();
		let filterState = JSON.parse(JSON.stringify(state.kulturstadtplan.localState.filter));
		let filterGroupSet = new Set(filterState[kind]);
		if (filterGroupSet.has(filter)) {
			filterGroupSet.delete(filter);
		} else {
			filterGroupSet.add(filter);
			if (kind === 'positiv') {
				if (filterState.negativ.indexOf(filter) !== -1) {
					let otherFilterGroupSet = new Set(filterState['negativ']);
					otherFilterGroupSet.delete(filter);
					filterState['negativ'] = Array.from(otherFilterGroupSet);
				}
			} else {
				if (filterState.positiv.indexOf(filter) !== -1) {
					let otherFilterGroupSet = new Set(filterState['positiv']);
					otherFilterGroupSet.delete(filter);
					filterState['positiv'] = Array.from(otherFilterGroupSet);
				}
			}
		}
		filterState[kind] = Array.from(filterGroupSet);
		filterState[kind].sort();
		dispatch(setFilter(filterState));
		dispatch(applyFilter());
	};
}

function clearFilter(kind) {
	return (dispatch, getState) => {
		let state = getState();
		let filterState = JSON.parse(JSON.stringify(state.kulturstadtplan.localState.filter));
		filterState[kind] = [];
		dispatch(setFilter(filterState));
		dispatch(applyFilter());
	};
}
function setAllToFilter(kind) {
	return (dispatch, getState) => {
		let state = getState();
		let filterState = JSON.parse(JSON.stringify(state.kulturstadtplan.localState.filter));

		if (kind === 'veranstaltungen') {
			filterState[kind] = JSON.parse(
				JSON.stringify(state.kulturstadtplan.localState.veranstaltungsarten)
			);
			console.log('new FilterState', filterState);
		} else if (kind === 'einrichtungen') {
			filterState[kind] = getAllEinrichtungen();
		}
		dispatch(setFilter(filterState));
		dispatch(applyFilter());
	};
}

function setFilterMode(mode) {
	return (dispatch, getState) => {
		dispatch(setFilterModeValue(mode));
		dispatch(applyFilter());
	};
}
function setFilterValueFor(kind, item, value) {
	return (dispatch, getState) => {
		let state = getState();
		let filterState = JSON.parse(JSON.stringify(state.kulturstadtplan.localState.filter));
		if (value === true) {
			if (filterState[kind].indexOf(item) === -1) {
				filterState[kind].push(item);
			}
		} else {
			if (filterState[kind].indexOf(item) !== -1) {
				let filterStateSet = new Set(filterState[kind]);
				filterStateSet.delete(item);
				filterState[kind] = Array.from(filterStateSet);
			}
		}
		dispatch(setFilterAndApply(filterState));
	};
}

function addFilterFor(kind, item) {
	return (dispatch, getState) => {
		let state = getState();
		let filterState = JSON.parse(JSON.stringify(state.kulturstadtplan.localState.filter));
		if (filterState[kind].indexOf(item) === -1) {
			filterState[kind].push(item);
		}
		dispatch(setFilterAndApply(filterState));
	};
}

function removeFilterFor(kind, item) {
	return (dispatch, getState) => {
		let state = getState();
		let filterState = JSON.parse(JSON.stringify(state.kulturstadtplan.localState.filter));
		if (filterState[kind].indexOf(item) !== -1) {
			let filterStateSet = new Set(filterState[kind]);
			filterStateSet.delete(item);
			filterState[kind] = Array.from(filterStateSet);
		}
		dispatch(setFilterAndApply(filterState));
	};
}

function setFilterAndApply(filter) {
	return (dispatch, getState) => {
		dispatch(setFilter(filter));
		dispatch(applyFilter());
	};
}

function applyFilter() {
	return (dispatch, getState) => {
		let state = getState();
		let filteredPois = [];
		let filteredPoiSet = new Set(); //avoid duplicates
		const filterState = state.kulturstadtplan.localState.filter;
		const filtermode = state.kulturstadtplan.localState.filtermode;

		for (let poi of state.kulturstadtplan.dataState.items) {
			if (filtermode === 'einrichtungen') {
				//check einrichtungen
				const einrichtungsCategory = classifyMainlocationTypeName(
					poi.mainlocationtype.name
				);

				if (filterState.einrichtungen.indexOf(einrichtungsCategory) !== -1) {
					filteredPoiSet.add(poi);
				}
			} else if (filtermode === 'veranstaltungen') {
				//check veranstaltungen
				for (let veranstaltungsart of poi.more.veranstaltungsarten) {
					if (filterState.veranstaltungen.indexOf(veranstaltungsart) !== -1) {
						filteredPoiSet.add(poi);
						break;
					}
				}
			}
		}

		filteredPois = Array.from(filteredPoiSet);
		//dispatch(setFilteredPOIs(state.kulturstadtplan.dataState.items));
		dispatch(setFilteredPOIs(filteredPois));
		dispatch(createFeatureCollectionFromPOIs());
	};
}
function refreshFeatureCollection() {
	return (dispatch, getState) => {
		dispatch(applyFilter());
	};
}

function createFeatureCollectionFromPOIs(boundingBox) {
	return (dispatch, getState) => {
		let state = getState();
		if (state.kulturstadtplan.localState.filteredPoisIndex) {
			let currentSelectedFeature = {
				id: -1
			};
			if (state.mapping.selectedIndex !== null && state.mapping.selectedIndex >= 0) {
				currentSelectedFeature =
					state.mapping.featureCollection[state.mapping.selectedIndex];
			} else {
				//          console.log("selectedIndex not set");
			}
			let bb;
			if (boundingBox) {
				bb = boundingBox;
			} else {
				bb = state.mapping.boundingBox;
			}

			let resultIds = state.kulturstadtplan.localState.filteredPoisIndex.range(
				bb.left,
				bb.bottom,
				bb.right,
				bb.top
			);
			let resultFC = [];
			let counter = 0;
			let results = [];

			for (let id of resultIds) {
				results.push(state.kulturstadtplan.localState.filteredPois[id]);
			}

			results.sort((a, b) => {
				if (a.geojson.coordinates[1] === b.geojson.coordinates[1]) {
					return a.geojson.coordinates[0] - b.geojson.coordinates[0];
				} else {
					return b.geojson.coordinates[1] - a.geojson.coordinates[1];
				}
			});

			let selectionWish = 0;
			for (let poi of results) {
				let poiFeature = convertPOIToFeature(poi, counter);
				resultFC.push(poiFeature);

				if (poiFeature.id === currentSelectedFeature.id) {
					selectionWish = poiFeature.index;
				}
				counter++;
			}

			dispatch(mappingActions.setFeatureCollection(resultFC));
			//console.log("setPoiGazHit(nactionsull));") dispatch(setPoiGazHit(null));
			dispatch(mappingActions.setSelectedFeatureIndex(selectionWish));
		}
	};
}

//EXPORT ACTIONS
export const actions = {
	loadPOIs,
	setPOIs,
	setSelectedPOI,
	createFeatureCollectionFromPOIs,
	setFilterAndApply,
	toggleFilter,
	///setAllLebenslagenToFilter,
	setAllToFilter,
	setFilterValueFor,
	setFilterMode,
	clearFilter,
	refreshFeatureCollection,
	setPoiSvgSize,
	setMinifiedInfoBox: infoBoxStateDuck.actions.setMinifiedInfoBoxState
};

//EXPORT SELECTORS
export const getPOIs = (state) => dataDuck.selectors.getItems(state.dataState);
export const getPOIGazHitId = (state) => state.localState.poiGazHitId;
export const getPOIsMD5 = (state) => dataDuck.selectors.getMD5(state.dataState);
export const getFilteredPOIs = (state) => state.localState.filteredPois;
export const getFilteredPOIsIndex = (state) => state.localState.filteredPoisIndex;
export const getLebenslagen = (state) => state.localState.lebenslagen;
export const getVeranstaltungsarten = (state) => state.localState.veranstaltungsarten;
export const getPOITypes = (state) => state.localState.poitypes;
export const getFilter = (state) => state.localState.filter;
export const getFilterMode = (state) => state.localState.filtermode;
export const getPoiSvgSize = (state) => state.localState.poiSvgSize;
export const getApps = (state) => state.localState.apps;
export const hasMinifiedInfoBox = (state) => state.infoBoxState.minified;

// import {   getPOIs,   getPOIsMD5,   getPOIGazHitId,   getFilteredPOIs,
// getFilteredPOIsIndex,   getLebenslagen,   getPOITypes,   getFilter,
// getPoiSvgSize,   getApps } from "../redux/modules/stadtplan"; HELPER
// FUNCTIONS
function convertPOIToFeature(poi, index) {
	const id = poi.id;
	const type = 'Feature';
	const selected = false;
	const geometry = poi.geojson;
	const text = poi.name;

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
		properties: poi
	};
}
