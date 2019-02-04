import objectAssign from 'object-assign';
import { actions as mappingActions } from './mapping';
import * as turfHelpers from '@turf/helpers';
import inside from '@turf/inside';
import { constants as mappingConstants } from './mapping';
import { getPolygonfromBBox } from '../../utils/gisHelper';

import { WUNDAAPI } from '../../constants/services';

///TYPES
export const types = {
	SET_DOCUMENT_LOADING_INDICATOR: 'BPLAENE/SET_DOCUMENT_LOADING_INDICATOR',
	SET_DOCUMENT_HAS_LOADING_ERROR: 'BPLAENE/SET_DOCUMENT_HAS_LOADING_ERROR',
	SET_PREPARED_DOWNLOAD: 'BPLAENE/SET_PREPARED_DOWNLOAD'
};

///INITIAL STATE
const initialState = {
	documentsLoading: false,
	documentsLoadingError: false,
	preparedDownload: null,
	docPackage: [
		{
			group: 'rechtskräftig',
			docs: [
				{
					file: 'B1179V_TEIL1.pdf',
					url: 'bplandocs/bplaene/rechtswirksam/B1179V_TEIL1.pdf'
				},
				{
					file: 'B1179V_TEIL2.pdf',
					url: 'bplandocs/bplaene/rechtswirksam/B1179V_TEIL2.pdf'
				}
			]
		},
		{ group: 'nicht rechtskräftig', docs: [] },
		{
			group: 'Zusatzdokumente',
			docs: [
				{
					file: 'BPL_1179V_0_PB_Artenschutzgutachten_08-2010.pdf',
					url: 'bplandocs/bplaene_dokumente/rechtsverbindlich/BPL_1179V_0_PB_Artenschutzgutachten_08-2010.pdf'
				},
				{
					file: 'BPL_1179V_0_PB_Drs_05-2013.pdf',
					url: 'bplandocs/bplaene_dokumente/rechtsverbindlich/BPL_1179V_0_PB_Drs_05-2013.pdf'
				},
				{
					file: 'BPL_1179V_0_PB_Drs_05-2013_Abwägung.pdf',
					url: 'bplandocs/bplaene_dokumente/rechtsverbindlich/BPL_1179V_0_PB_Drs_05-2013_Abwägung.pdf'
				},
				{
					file: 'BPL_1179V_0_PB_Drs_05-2013_Bebauungsplan-Ansichten.pdf',
					url:
						'bplandocs/bplaene_dokumente/rechtsverbindlich/BPL_1179V_0_PB_Drs_05-2013_Bebauungsplan-Ansichten.pdf'
				},
				{
					file: 'BPL_1179V_0_PB_Drs_05-2013_Bebauungsplan-Festsetzungen.pdf',
					url:
						'bplandocs/bplaene_dokumente/rechtsverbindlich/BPL_1179V_0_PB_Drs_05-2013_Bebauungsplan-Festsetzungen.pdf'
				},
				{
					file: 'BPL_1179V_0_PB_Drs_05-2013_Bebauungsplan.pdf',
					url: 'bplandocs/bplaene_dokumente/rechtsverbindlich/BPL_1179V_0_PB_Drs_05-2013_Bebauungsplan.pdf'
				},
				{
					file: 'BPL_1179V_0_PB_Drs_05-2013_Begründung.pdf',
					url: 'bplandocs/bplaene_dokumente/rechtsverbindlich/BPL_1179V_0_PB_Drs_05-2013_Begründung.pdf'
				},
				{
					file: 'BPL_1179V_0_PB_Drs_05-2013_Demografiecheck.pdf',
					url: 'bplandocs/bplaene_dokumente/rechtsverbindlich/BPL_1179V_0_PB_Drs_05-2013_Demografiecheck.pdf'
				},
				{
					file: 'BPL_1179V_0_PB_Drs_05-2013_FNP-Berichtigung.pdf',
					url: 'bplandocs/bplaene_dokumente/rechtsverbindlich/BPL_1179V_0_PB_Drs_05-2013_FNP-Berichtigung.pdf'
				},
				{
					file: 'BPL_1179V_0_PB_Drs_05-2013_FNP-Bestand.pdf',
					url: 'bplandocs/bplaene_dokumente/rechtsverbindlich/BPL_1179V_0_PB_Drs_05-2013_FNP-Bestand.pdf'
				},
				{
					file: 'BPL_1179V_0_PB_Drs_05-2013_FNP-Legende.pdf',
					url: 'bplandocs/bplaene_dokumente/rechtsverbindlich/BPL_1179V_0_PB_Drs_05-2013_FNP-Legende.pdf'
				},
				{
					file: 'BPL_1179V_0_PB_Drs_05-2013_Grünfestsetzungen.pdf',
					url:
						'bplandocs/bplaene_dokumente/rechtsverbindlich/BPL_1179V_0_PB_Drs_05-2013_Grünfestsetzungen.pdf'
				},
				{
					file: 'BPL_1179V_0_PB_Drs_05-2013_Textliche-Festsetzungen.pdf',
					url:
						'bplandocs/bplaene_dokumente/rechtsverbindlich/BPL_1179V_0_PB_Drs_05-2013_Textliche-Festsetzungen.pdf'
				},
				{
					file: 'BPL_1179V_0_PB_Einzelhandelsgutachten_01-2013.pdf',
					url:
						'bplandocs/bplaene_dokumente/rechtsverbindlich/BPL_1179V_0_PB_Einzelhandelsgutachten_01-2013.pdf'
				},
				{
					file: 'BPL_1179V_0_PB_Stadtbote_05-2013.pdf',
					url: 'bplandocs/bplaene_dokumente/rechtsverbindlich/BPL_1179V_0_PB_Stadtbote_05-2013.pdf'
				},
				{
					file: 'BPL_1179V_0_PB_Verkehrsgutachten_02-2013.pdf',
					url: 'bplandocs/bplaene_dokumente/rechtsverbindlich/BPL_1179V_0_PB_Verkehrsgutachten_02-2013.pdf'
				},
				{
					file: 'BPL_1179V_0_PB_Vorprüfung_04-2009.pdf',
					url: 'bplandocs/bplaene_dokumente/rechtsverbindlich/BPL_1179V_0_PB_Vorprüfung_04-2009.pdf'
				},
				{
					file: '_Info_BPlan-Zusatzdokumente_WUP_1-0.pdf',
					url: 'bplandocs/bplaene_dokumente/Info_BPlan-Zusatzdokumente_WUP_1-0.pdf'
				}
			]
		}
	],
	checkedDocs: [
		{
			file: 'B1179V_TEIL1.pdf',
			url: 'bplandocs/bplaene/rechtswirksam/B1179V_TEIL1.pdf',
			height: 2384,
			width: 2891,
			numPages: 1,
			fileSize: 4641772
		},
		{
			file: 'B1179V_TEIL2.pdf',
			url: 'bplandocs/bplaene/rechtswirksam/B1179V_TEIL2.pdf',
			height: 2041,
			width: 3370,
			numPages: 1,
			fileSize: 3662629
		}
	],
	checkedFirstDoc: {
		group: 'rechtskräftig',
		doc: {
			file: 'B1179V_TEIL1.pdf',
			url: 'bplandocs/bplaene/rechtswirksam/B1179V_TEIL1.pdf',
			height: 2384,
			width: 3370,
			numPages: 1,
			fileSize: 3662629
		}
	}
};

///REDUCER
export default function bplanReducer(state = initialState, action) {
	let newState;
	switch (action.type) {
		case types.SET_DOCUMENT_LOADING_INDICATOR: {
			newState = objectAssign({}, state);
			newState.documentsLoading = action.isLoading;
			if (newState.documentsLoading === false) {
				newState.documentsLoadingError = false;
			}
			return newState;
		}
		case types.SET_DOCUMENT_HAS_LOADING_ERROR: {
			newState = objectAssign({}, state);
			newState.documentsLoadingError = action.hasError;
			return newState;
		}
		case types.SET_PREPARED_DOWNLOAD: {
			newState = objectAssign({}, state);
			newState.preparedDownload = action.download;
			return newState;
		}

		default:
			return state;
	}
}

///SIMPLEACTIONCREATORS
function setDocumentLoadingIndicator(isLoading) {
	return {
		type: types.SET_DOCUMENT_LOADING_INDICATOR,
		isLoading
	};
}
function setDocumentHasLoadingError(hasError) {
	return {
		type: types.SET_DOCUMENT_HAS_LOADING_ERROR,
		hasError
	};
}
function setPreparedDownload(download) {
	return {
		type: types.SET_PREPARED_DOWNLOAD,
		download
	};
}

//COMPLEXACTIONS

export function searchForPlans(gazObject, overriddenWKT, cfg = { skipMappingActions: false, done:()=>{} }) {

	return function(dispatch, getState) {
    if (!cfg.skipMappingActions){
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
		fetch(WUNDAAPI + '/searches/WUNDA_BLAU.BPlanAPISearch/results?role=all&limit=100&offset=0', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(query)
		}).then(function(response) {
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
							JSON.stringify(feature.geometry) === JSON.stringify(lastFeature.geometry)
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
							const gazHitMatchesEmbeddedStatus = embeddedStatusInGazHit === feature.properties.status;
							if (
								(!gazHitWithStatus && gazHitMatchesObjectVerfahrensnummer) ||
								(gazHitWithStatus && gazHitMatchesObjectVerfahrensnummer && gazHitMatchesEmbeddedStatus)
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
        if (!cfg.skipMappingActions){
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
	let docs;
	if (propArray[5] != null) {
		docs = JSON.parse(propArray[5]);
		docs.push({
			file: '_Info_BPlan-Zusatzdokumente_WUP_1-0.pdf',
			url: 'https://wunda-geoportal-docs.cismet.de/bplaene_dokumente/Info_BPlan-Zusatzdokumente_WUP_1-0.pdf'
		});
	} else {
		docs = [];
	}
	// console.log('plaene_rk', JSON.stringify(plaene_rk));
	// console.log('plaene_nrk', JSON.stringify(plaene_nrk));
	// console.log('docs', JSON.stringify(docs));
	return {
		id: propArray[0] + '.' + counter,
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

//EXPORT ACTIONS
export const actions = {
	setDocumentLoadingIndicator,
	setDocumentHasLoadingError,
	setPreparedDownload,
	searchForPlans
};
