import objectAssign from 'object-assign';
import {actions as mappingActions} from './mapping';
import {routerActions} from 'react-router-redux'
import {predicateBy} from '../../utils/stringHelper';
import kdbush from 'kdbush';



//TYPES
export const types = {
    SET_POIS: 'STADTPLAN/SET_POIS',
    SET_FILTERED_POIS: 'STADTPLAN/SET_FILTERED_POIS',
    SET_TYPES: 'STADTPLAN/SET_TYPES',
    SET_LEBENSLAGEN: 'STADTPLAN/SET_LEBENSLAGEN',
}


export const constants = {
    DEBUG_ALWAYS_LOADING: false
}


///INITIAL STATE
const initialState = {
    pois: [],
    poisMD5: "",
    filteredPois: [],
    filteredPoisIndex: null,
    lebenslagen: [],
    poitypes: [],

}
///REDUCER
export default function ehrenamtReducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case types.SET_POIS:
        {
            newState = objectAssign({}, state);
            newState.pois=action.pois;
            newState.poisMD5=action.poisMD5;
            return newState;
        }
        case types.SET_FILTERED_POIS:
        {
            newState = objectAssign({}, state);
            newState.filteredPois=action.filteredPois;
            newState.filteredPoisIndex=kdbush(action.filteredPois, (p)=>p.geojson.coordinates[0], (p) => p.geojson.coordinates[1]);
            return newState;
        }
        case types.SET_TYPES:
        {
            newState = objectAssign({}, state);
            newState.poitypes=action.poitypes;
            return newState;
        }
        case types.SET_LEBENSLAGEN:
        {
            newState = objectAssign({}, state);
            newState.lebenslagen=action.lebenslagen;
            return newState;
        }
        default:
            return state;
    }
}

///SIMPLEACTIONCREATORS
function setPOIs(pois,poisMD5) {
    return {type: types.SET_POIS, pois, poisMD5};
}
function setFilteredPOIs(filteredPois) {
    return {type: types.SET_FILTERED_POIS, filteredPois};
}
function setTypes(poitypes) {
    return {type: types.SET_TYPES, poitypes};
}
function setLebenslagen(lebenslagen) {
    return {type: types.SET_LEBENSLAGEN, lebenslagen};
}


//COMPLEXACTIONS

function loadPOIs() {
    return (dispatch, getState) => {
        let md5 = null;
        let currentPOI=null;
        const state = getState();
        let noCacheHeaders = new Headers();
        noCacheHeaders.append('pragma', 'no-cache');
        noCacheHeaders.append('cache-control', 'no-cache');

        return fetch('/pois/poi.data.json.md5', {method: 'get', headers: noCacheHeaders}).then((response) => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('Server md5 response wasn\'t OK');
            }
        }).then((md5value) => {
            md5 = md5value.trim();
            if (md5 === state.stadtplan.poisMD5 && (constants.DEBUG_ALWAYS_LOADING===false)) {
                dispatch(applyFilter());
                dispatch(createFeatureCollectionFromPOIs());
                throw 'CACHEHIT';
            } else {
                return "fetchit";
            }
        }).then((fetchit) => {
            return fetch('/pois/poi.data.json', {method: 'get', headers: noCacheHeaders});
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Server ehrenamt/data response wasn\'t OK');
            }
        }).then((data) => {

            let lebenslagen = new Set();
            let poitypes = [];

            for (let poi of data) {
                currentPOI=poi;
                //poi.point25832 = convertPoint(poi.geo_x, offer.geo_y)
                
                //zuesrt mainlocationtype
                if (poi.mainlocationtype) {
                    let type=poi.mainlocationtype;
                    for (let ll of type.lebenslagen) {
                        lebenslagen.add(ll);
                    }
                    let found=poitypes.find(x => x.id === type.id);
                    if (!found) {
                        poitypes.push(type);
                    }
                }
                //alle anderen typen
                if (poi.locationtypes) {
                    for (let type of poi.locationtypes){
                        for (let ll of type.lebenslagen) {
                            lebenslagen.add(ll);
                        }
                        let found=poitypes.find(x => x.id === type.id);
                        if (!found) {
                            poitypes.push(type);
                        }
                    }
                }
            }



            dispatch(setTypes(Array.from(poitypes).sort(predicateBy("name"))));
            dispatch(setLebenslagen(Array.from(lebenslagen).sort()));
            dispatch(setPOIs(data,md5));
            dispatch(applyFilter());
            dispatch(createFeatureCollectionFromPOIs());

        })
            .catch(function (err) {
                if (err !== 'CACHEHIT') {
                    console.log("Problem during POILoading");
                    console.log(currentPOI);
                    console.log(err);
                }
            });
    }
}



function applyFilter() {
    return (dispatch, getState) => {
        let state = getState();
        dispatch(setFilteredPOIs(state.stadtplan.pois));
    }
}
function createFeatureCollectionFromPOIs(boundingBox) {
    return (dispatch, getState) => {
        let state = getState()
        if (state.stadtplan.filteredPoisIndex) {
            let currentSelectedFeature = {
                id: -1
            };
            if (state.mapping.selectedIndex !== null && state.mapping.selectedIndex >= 0) {
                currentSelectedFeature = state.mapping.featureCollection[state.mapping.selectedIndex];
            } else {
                //          console.log("selectedIndex not set");
            }
            let bb;
            if (boundingBox) {
                bb = boundingBox;
            } else {
                bb = state.mapping.boundingBox;
            }

            let resultIds = state
                .stadtplan
                .filteredPoisIndex
                .range(bb.left, bb.bottom, bb.right, bb.top);
            let resultFC = [];
            let counter = 0;
            let results = [];

            for (let id of resultIds) {
                results.push(state.stadtplan.filteredPois[id]);
            }

            results.sort((a, b) => {
                if (a.geojson.coordinates[1] === b.geojson.coordinates[1]) {
                    return a.geojson.coordinates[0] - b.geojson.coordinates[0];
                } else {
                    return b.geojson.coordinates[1] - a.geojson.coordinates[1];
                }
            })

            let selectionWish = 0;
            for (let offer of results) {
                let offerFeature = convertPOIToFeature(offer, counter)
                resultFC.push(offerFeature);
                if (state.ehrenamt.cart.find((x => x.id === offerFeature.id))!==undefined) {
                    offerFeature.inCart=true
                }
                else {
                    offerFeature.inCart=false;
                }
                if (offerFeature.id === currentSelectedFeature.id) {
                    selectionWish = counter;
                }
                counter++;
            }

            dispatch(mappingActions.setFeatureCollection(resultFC));
            dispatch(mappingActions.setSelectedFeatureIndex(selectionWish));

        }
    }
}


//EXPORT ACTIONS
export const actions = {
    loadPOIs,
    setPOIs,
    createFeatureCollectionFromPOIs
}

//HELPER FUNCTIONS
function convertPOIToFeature(poi, index) {

    const id = poi.id;
    const type = "Feature";
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
        "crs": {
            "type": "name",
            "properties": {
                "name": "urn:ogc:def:crs:EPSG::25832"
            }
        },
        properties: poi
    }
}
