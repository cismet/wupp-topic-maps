import * as turfHelpers from '@turf/helpers';
import inside from '@turf/inside';
import center from '@turf/center';
import localForage from 'localforage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { INFO_DOC_DATEINAMEN_NAME, INFO_DOC_DATEINAMEN_URL } from '../../constants/bplaene';
import { WUNDAAPI } from '../../constants/services';
import { getPolygonfromBBox } from '../../utils/gisHelper';
import makeInfoBoxStateDuck from '../higherorderduckfactories/minifiedInfoBoxState';
import { actions as mappingActions, constants as mappingConstants } from './mapping';
import makeDataDuck from '../higherorderduckfactories/dataWithMD5Check';
import booleanDisjoint from '@turf/boolean-disjoint';
import bboxPolygon from '@turf/bbox-polygon';

///TYPES
export const types = {
	SET_DOCUMENT_LOADING_INDICATOR: 'BPLAENE/SET_DOCUMENT_LOADING_INDICATOR',
	SET_DOCUMENT_HAS_LOADING_ERROR: 'BPLAENE/SET_DOCUMENT_HAS_LOADING_ERROR',
	SET_PREPARED_DOWNLOAD: 'BPLAENE/SET_PREPARED_DOWNLOAD'
};
//HIGHER ORDER DUCKS
const infoBoxStateDuck = makeInfoBoxStateDuck('BPLAENE', (state) => state.bplaene.infoBoxState);
const dataDuck = makeDataDuck('bplaene', (state) => state.bplaene.dataState, convertBPlanToFeature);
///REDUCER
//no local Reducer needed

const infoBoxStateStorageConfig = {
	key: 'bplaeneInfoBoxMinifiedState',
	storage: localForage,
	whitelist: [ 'minified' ]
};
const dataStateStorageConfig = {
	key: 'bplaeneData',
	storage: localForage,
	whitelist: [ 'items', 'md5', 'features' ]
};
const reducer = combineReducers({
	infoBoxState: persistReducer(infoBoxStateStorageConfig, infoBoxStateDuck.reducer),
	dataState: persistReducer(dataStateStorageConfig, dataDuck.reducer)
});
export default reducer;
///SIMPLEACTIONCREATORS

//COMPLEXACTIONS
function loadBPlaene(finishedHandler = () => {}) {
	const manualReloadRequest = true;
	return (dispatch, getState) => {
		dispatch(
			dataDuck.actions.load({
				manualReloadRequested: manualReloadRequest,
				dataURL: '/data/bplaene.data.json',
				errorHandler: (err) => {
					console.log(err);
				},
				done: finishedHandler
			})
		);
	};
}

export function getPlanFeatureByGazObject(gazObjects, done) {
	const gazObject = gazObjects[0];
	const nr = gazObject.more.v;
	let status = undefined;
	if (gazObject.string.includes('(nicht rechtskräftig)')) {
		status = 'nicht rechtskräftig';
	} else if (gazObject.string.includes('(rechtskräftig)')) {
		status = 'rechtskräftig';
	}
	//use status if ambiguous

	return function(dispatch, getState) {
		dispatch(getPlanFeature(nr, status, done));
	};
}

export function getPlanFeature(nr, status, done) {
	return function(dispatch, getState) {
		dispatch(mappingActions.setSearchProgressIndicator(true));

		const state = getState();
		if (state.bplaene.dataState.features.length === 0) {
			loadBPlaene();
		}
		const hit = state.bplaene.dataState.features.find((elem, index) => {
			if (status !== undefined) {
				return elem.text === nr && elem.properties.status === status;
			} else {
				return elem.text === nr;
			}
		});
		done(hit);
		dispatch(mappingActions.setSearchProgressIndicator(false));
	};
}
export function getPlanFeatures({ boundingBox, point, done }) {
	return function(dispatch, getState) {
		dispatch(mappingActions.setSearchProgressIndicator(true));
		let bboxPoly;
		let finalResults = [];

		const state = getState();
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

		for (const feature of state.bplaene.dataState.features) {
			if (!booleanDisjoint(bboxPoly, feature)) {
				feature.searchDistance = distance(
					getXYFromPointFeature(center(bboxPoly)),
					getXYFromPointFeature(center(feature))
				);
				finalResults.push(feature);
			}
		}
		finalResults.sort((a, b) => a.searchDistance - b.searchDistance);

		done(finalResults);

		dispatch(mappingActions.setSearchProgressIndicator(false));
	};
}

function getXYFromPointFeature(feature) {
	return { x: feature.geometry.coordinates[0], y: feature.geometry.coordinates[1] };
}
function distance(p, q) {
	var dx = p.x - q.x;
	var dy = p.y - q.y;
	var dist = Math.sqrt(dx * dx + dy * dy);
	return dist;
}
export function searchForPlans(
	gazObject,
	overriddenWKT,
	cfg = { skipMappingActions: false, done: () => {} }
) {
	console.log('gazObject', gazObject);

	return function(dispatch, getState) {
		if (!cfg.skipMappingActions) {
			dispatch(mappingActions.setSearchProgressIndicator(true));
		}
		const state = getState();
		let wkt;
		if (overriddenWKT) {
			wkt = overriddenWKT;
		} else if (Array.isArray(gazObject) && gazObject[0].more.v) {
			wkt = `POINT (${gazObject[0].x} ${gazObject[0].y} )`;
		} else {
			wkt = getPolygonfromBBox(state.mapping.boundingBox);
		}
		let query = {
			list: [
				{
					key: 'wktString',
					value: wkt
				},
				{
					key: 'status',
					value: ''
				},
				{
					key: 'srs',
					value: 25832
				},
				{
					key: 'urlprefix',
					value: 'https://wunda-geoportal-docs.cismet.de'
				}
			]
		};
		//console.log(WUNDAAPI + '/searches/WUNDA_BLAU.BPlanAPISearch/results?role=all&limit=100&offset=0')
		//console.log(JSON.stringify(query));
		fetch(
			WUNDAAPI + '/searches/WUNDA_BLAU.BPlanAPISearch/results?role=all&limit=100&offset=0',
			{
				method: 'post',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(query)
			}
		).then(function(response) {
			if (response.status >= 200 && response.status < 300) {
				response.json().then(function(result) {
					let featureArray = [];
					let counter = 0;
					let lastFeature = null;
					let selectionIndexWish = 0;
					let planMatch = false;
					let gazPoint;
					if (gazObject != null && gazObject.length === 1 && gazObject[0] != null) {
						gazPoint = turfHelpers.point([ gazObject[0].x, gazObject[0].y ]);
					}
					for (let objArr of result.$collection) {
						let feature = convertPropArrayToFeature(objArr, counter);

						if (
							lastFeature != null &&
							JSON.stringify(feature.geometry) ===
								JSON.stringify(lastFeature.geometry)
						) {
							lastFeature.twin = counter;
							feature.twin = counter - 1;
						}

						//check whether the gazetteer-object has a property verfahrensnummer
						//if this verfahrensnummer matches the nummer of the feature this
						//should be the only feature in the resultset

						if (gazObject != null && gazObject.length === 1 && gazObject[0] != null) {
							const gazHitWithStatus = gazObject[0].string.indexOf('(') !== -1;
							const gazHitMatchesObjectVerfahrensnummer =
								gazObject[0].more.v === feature.properties.nummer;
							const embeddedStatusInGazHit = gazObject[0].string.substring(
								gazObject[0].string.indexOf('(') + 1,
								gazObject[0].string.indexOf(')')
							);
							const gazHitMatchesEmbeddedStatus =
								embeddedStatusInGazHit === feature.properties.status;
							if (
								(!gazHitWithStatus && gazHitMatchesObjectVerfahrensnummer) ||
								(gazHitWithStatus &&
									gazHitMatchesObjectVerfahrensnummer &&
									gazHitMatchesEmbeddedStatus)
							) {
								featureArray = [ feature ];
								selectionIndexWish = 0; // set it to 0  (again) because it could have been set to another value
								planMatch = true;
								break;
							}
						}

						if (gazPoint != null && inside(gazPoint, feature)) {
							selectionIndexWish = counter;
						}

						featureArray.push(feature);
						lastFeature = feature;
						counter++;
					}
					cfg.done(featureArray);
					if (!cfg.skipMappingActions) {
						dispatch(mappingActions.setSearchProgressIndicator(false));
						dispatch(mappingActions.setFeatureCollection(featureArray));
						if (featureArray.length > 0) {
							dispatch(mappingActions.setSelectedFeatureIndex(selectionIndexWish));
						}

						if (gazObject != null && gazObject.length === 1 && gazObject[0] != null) {
							//let p=turf.point([gazObject[0].x,gazObject[0].y]);
							if (planMatch) {
								//vorher turf.inside(p,featureArray[selectionIndexWish])
								dispatch(
									mappingActions.fitFeatureBounds(
										featureArray[selectionIndexWish],
										mappingConstants.AUTO_FIT_MODE_STRICT
									)
								);
							}
						}
					}
				});
			} else if (response.status === 401) {
				if (!cfg.skipMappingActions) {
					dispatch(mappingActions.setSearchProgressIndicator(false));
				}
			}
		});
	};
}

function convertPropArrayToFeature(propArray, counter) {
	let plaene_rk;
	let geom = JSON.parse(propArray[6]);

	if (propArray[3] != null) {
		plaene_rk = JSON.parse(propArray[3]);
	} else {
		plaene_rk = [];
	}
	let plaene_nrk;
	if (propArray[4] != null) {
		plaene_nrk = JSON.parse(propArray[4]);
	} else {
		plaene_nrk = [];
	}
	let docs = [];
	if (propArray[5] != null) {
		docs.push({
			file: INFO_DOC_DATEINAMEN_NAME,
			url: INFO_DOC_DATEINAMEN_URL
		});
		const zusatzDocs = JSON.parse(propArray[5]);
		for (const zd of zusatzDocs) {
			docs.push(zd);
		}
		//docs.push(zusatzDocs);
	} else {
		docs = [];
	}
	// console.log('plaene_rk', JSON.stringify(plaene_rk));
	// console.log('plaene_nrk', JSON.stringify(plaene_nrk));
	// console.log('docs', JSON.stringify(docs));
	const featuretype = 'B-Plan';

	return {
		id: propArray[0] + '.' + counter,
		featuretype,
		type: 'Feature',
		selected: false,
		geometry: geom,
		crs: {
			type: 'name',
			properties: {
				name: 'urn:ogc:def:crs:EPSG::25832'
			}
		},
		properties: {
			nummer: propArray[0],
			name: propArray[1],
			status: propArray[2],
			plaene_rk: plaene_rk,
			plaene_nrk: plaene_nrk,
			docs: docs,
			twin: null
		}
	};
}

function convertBPlanToFeature(bplan, index) {
	if (bplan === undefined) {
		return undefined;
	}
	const id = index;
	const type = 'Feature';
	const featuretype = 'B-Plan';

	const selected = false;
	const geometry = bplan.geojson;

	const text = bplan.nummer;

	if (bplan.docs.length > 0) {
		bplan.docs = [
			{
				file: INFO_DOC_DATEINAMEN_NAME,
				url: INFO_DOC_DATEINAMEN_URL
			}
		].concat(bplan.docs);
	}

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
		properties: bplan
	};
}

//EXPORT ACTIONS
export const actions = {
	searchForPlans,
	getPlanFeatures,
	loadBPlaene,
	setCollapsedInfoBox: infoBoxStateDuck.actions.setMinifiedInfoBoxState,
	getPlanFeatureByGazObject
};
