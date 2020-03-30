import bboxPolygon from '@turf/bbox-polygon';
import booleanDisjoint from '@turf/boolean-disjoint';
import localForage from 'localforage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import makeDataDuck from '../higherorderduckfactories/dataWithMD5Check';
import makeInfoBoxStateDuck from '../higherorderduckfactories/minifiedInfoBoxState';

//TYPES
//no types bc no local store
export const types = {};

export const constants = {
	DEBUG_ALWAYS_LOADING: false
};

//HIGHER ORDER DUCKS
const dataDuck = makeDataDuck(
	'fnpAenderungsverfahren',
	(state) => state.fnpAenderungsverfahren.dataState,
	convertAEVToFeature
);
const infoBoxStateDuck = makeInfoBoxStateDuck(
	'FNP_AEV',
	(state) => state.fnpAenderungsverfahren.infoBoxState
);

// const dataDuck = makeDataDuck('aev', (state) => state.aev.dataState, convertHauptnutzungToFeature);

///INITIAL STATE
//no localState

///REDUCER
//no localState

const infoBoxStateStorageConfig = {
	key: 'fnpAevInfoBoxMinifiedState',
	storage: localForage,
	whitelist: [ 'minified' ]
};
const dataStateStorageConfig = {
	key: 'aevData',
	storage: localForage,
	whitelist: [][('items', 'md5', 'features')]
};

const reducer = combineReducers({
	dataState: persistReducer(dataStateStorageConfig, dataDuck.reducer),
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
	mappingActions,
	fitAll = true
}) {
	//because mappingActions are created with bindActionCreators don`t call them with dispatch()
	//see also https://github.com/reduxjs/redux-thunk/issues/29#issuecomment-154162983
	return function(dispatch, getState) {
		let selectionIndexWish = 0;

		const state = getState();
		let finalResults = [];

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

			for (let feature of state.fnpAenderungsverfahren.dataState.features) {
				// console.log('feature', feature);
				if (!booleanDisjoint(bboxPoly, feature)) {
					finalResults.push(feature);
				}
			}
		} else if (
			gazObject !== undefined &&
			gazObject[0] !== undefined &&
			gazObject[0].type === 'aenderungsv'
		) {
			if (state.fnpAenderungsverfahren.dataState.features.length === 0) {
				loadAEVs();
			}

			let hit = state.fnpAenderungsverfahren.dataState.features.find((elem, index) => {
				return elem.properties.name === gazObject[0].more.v;
			});
			if (hit) {
				finalResults.push(hit);
			}
		} else if (
			gazObject !== undefined &&
			gazObject[0] !== undefined &&
			gazObject[0].type === 'bplaene'
		) {
			let hit = state.fnpAenderungsverfahren.dataState.features.find((elem, index) => {
				let bplanArr = [];
				if (elem.properties.bplan_nr !== undefined) {
					bplanArr = elem.properties.bplan_nr.split('+');
				}
				let found = false;
				bplanArr.forEach((nr) => {
					found = found || nr === gazObject[0].more.v;
				});
				return found;
			});
			if (hit) {
				finalResults.push(hit);
			}
		}
		if (skipMappingActions === false) {
			mappingActions.setFeatureCollection(finalResults);
			if (finalResults.length > 0) {
				mappingActions.setSelectedFeatureIndex(selectionIndexWish);
				if (fitAll === true) {
					mappingActions.fitAll();
				}
			}
		}
		done(finalResults);
	};
}

//EXPORT ACTIONS
export const actions = {
	loadAEVs,
	searchForAEVs,
	setCollapsedInfoBox: infoBoxStateDuck.actions.setMinifiedInfoBoxState
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
	const featuretype = 'Hauptnutzung';

	const selected = false;
	const geometry = aev.geojson;

	const text = aev.name;

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
		properties: aev
	};
}
