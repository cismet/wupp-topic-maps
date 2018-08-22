import objectAssign from 'object-assign';
import {actions as mappingActions} from './mapping';
import {predicateBy} from '../../utils/stringHelper';
import kdbush from 'kdbush';
import {addSVGToPOI} from '../../utils/stadtplanHelper';
import queryString from 'query-string';


//TYPES
export const types = {
    SET_POIS: 'STADTPLAN/SET_POIS',
    SET_POI_GAZ_HIT: 'STADTPLAN/SET_POI_GAZ_HIT',
    CLEAR_POI_GAZ_HIT: 'STADTPLAN/CLEAR_POI_GAZ_HIT',
    SET_FILTERED_POIS: 'STADTPLAN/SET_FILTERED_POIS',
    SET_TYPES: 'STADTPLAN/SET_TYPES',
    SET_LEBENSLAGEN: 'STADTPLAN/SET_LEBENSLAGEN',
    SET_FILTER: 'STADTPLAN/SET_FILTER',
    SET_POI_SVG_SIZE: 'STADTPLAN/SET_POI_SVG_SIZE',
}


export const constants = {
    DEBUG_ALWAYS_LOADING: false
}


///INITIAL STATE
const initialState = {
    pois: [],
    poiGazHitId: null,
    poisMD5: "",
    filteredPois: [],
    filteredPoisIndex: null,
    lebenslagen: [],
    poitypes: [],
    filter: {
        positiv: ["Freizeit","Sport","Mobilität","Religion","Erholung","Gesellschaft","Gesundheit","Kultur","öffentliche Dienstleistungen","Dienstleistungen","Orientierung","Bildung","Stadtbild"],
        negativ: []
    },
    poiSvgSize:35

}
///REDUCER
export default function stadtplanReducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case types.SET_POIS:
        {
            newState = objectAssign({}, state);
            newState.pois=action.pois;
            newState.poisMD5=action.poisMD5;
            return newState;
        }
        case types.SET_POI_GAZ_HIT:
        {
            newState = objectAssign({}, state);
            newState.poiGazHitId=action.hitId;
            return newState;
        }
        case types.CLEAR_POI_GAZ_HIT:
        {
            newState = objectAssign({}, state);
            newState.poiGazHitId=null;
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
        case types.SET_FILTER:
        {
            newState = objectAssign({}, state);
            newState.filter=action.filter;
            return newState;
        }
        case types.SET_POI_SVG_SIZE:
        {
            newState = objectAssign({}, state);
            newState.poiSvgSize=action.poiSvgSize;
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
function setPoiGazHit(hitId) {
    return {type: types.SET_POI_GAZ_HIT, hitId};
}
function clearPoiGazHit() {
    return {type: types.CLEAR_POI_GAZ_HIT};
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
function setFilter(filter) {
    return {type: types.SET_FILTER, filter};
}
function setPoiSvgSize(poiSvgSize) {
    return {type: types.SET_POI_SVG_SIZE, poiSvgSize};
}


//COMPLEXACTIONS

function setSelectedPOI(pid) {
    return (dispatch, getState) => {
        let state=getState();
        let poiFeature=state.mapping.featureCollection.find(x => x.id === pid); 
        if (poiFeature) {
            dispatch(mappingActions.setSelectedFeatureIndex(poiFeature.index));    
            dispatch(clearPoiGazHit());   
        }
        else {
            dispatch(setPoiGazHit(poiFeature.index));   
        }

    }
}

function loadPOIs() {
    return (dispatch, getState) => {
        let md5 = null;
        let currentPOI=null;
        const state = getState();
        let noCacheHeaders = new Headers();
        noCacheHeaders.append('pragma', 'no-cache');
        noCacheHeaders.append('cache-control', 'no-cache');


        const manualReloadRequested=(queryString.parse(state.routing.location.search).alwaysRefreshPOIsOnReload!==undefined);

        return fetch('/pois/poi.data.json.md5', {method: 'get', headers: noCacheHeaders}).then((response) => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('Server md5 response wasn\'t OK');
            }
        }).then((md5value) => {
            md5 = md5value.trim();
            if (manualReloadRequested){
                console.log("Fetch POIs because of alwaysRefreshPOIsOnReload Parameter")
                return "fetchit";
            }

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
                // if (poi.locationtypes) {
                //     for (let type of poi.locationtypes){
                //         for (let ll of type.lebenslagen) {
                //             lebenslagen.add(ll);
                //         }
                //         let found=poitypes.find(x => x.id === type.id);
                //         if (!found) {
                //             poitypes.push(type);
                //         }
                //     }
                // }
            }

            dispatch(setTypes(Array.from(poitypes).sort(predicateBy("name"))));
            dispatch(setLebenslagen(Array.from(lebenslagen).sort()));
            let svgResolvingPromises = data.map(function(poi){
                return addSVGToPOI(poi,manualReloadRequested);
            })

            Promise.all(svgResolvingPromises).then(function(results) {
                dispatch(setPOIs(data,md5));
                dispatch(applyFilter());
                dispatch(createFeatureCollectionFromPOIs());    
            });



        }).catch(function (err) {
                if (err !== 'CACHEHIT') {
                    console.log("Problem during POILoading");
                    console.log(currentPOI);
                    console.log(err);
                }
            });
    }
}


function toggleFilter(kind, filter) {
    return (dispatch, getState) => {
        let state = getState();
        let filterState = JSON.parse(JSON.stringify(state.stadtplan.filter));
        let filterGroupSet = new Set(filterState[kind]);
        if (filterGroupSet.has(filter)) {
            filterGroupSet.delete(filter);
        } else {
            filterGroupSet.add(filter);
            if (kind==="positiv"){
                if (filterState.negativ.indexOf(filter)!==-1){
                    let otherFilterGroupSet = new Set(filterState["negativ"]);
                    otherFilterGroupSet.delete(filter);
                    filterState["negativ"] = Array.from(otherFilterGroupSet);
                }
            }
            else {
                if (filterState.positiv.indexOf(filter)!==-1){
                    let otherFilterGroupSet = new Set(filterState["positiv"]);
                    otherFilterGroupSet.delete(filter);
                    filterState["positiv"] = Array.from(otherFilterGroupSet);
                }
                
            }
        }
        filterState[kind] = Array.from(filterGroupSet);
        filterState[kind].sort();
        dispatch(setFilter(filterState));
        dispatch(applyFilter());

    }
}

function clearFilter(kind) {
    return (dispatch, getState) => {
        let state = getState();
        let filterState = JSON.parse(JSON.stringify(state.stadtplan.filter));
        filterState[kind]=[];
        dispatch(setFilter(filterState));
        dispatch(applyFilter());
    }
}
function setAllLebenslagenToFilter(kind) {
    return (dispatch, getState) => {
        let state = getState();
        let filterState = JSON.parse(JSON.stringify(state.stadtplan.filter));
        filterState[kind]=JSON.parse(JSON.stringify(state.stadtplan.lebenslagen));
        dispatch(setFilter(filterState));
        dispatch(applyFilter());
    }
}


function setFilterAndApply(filter) {
    return (dispatch, getState) => {
        dispatch(setFilter(filter));
        dispatch(applyFilter());
    }
}


function applyFilter() {
    return (dispatch, getState) => {
        let state = getState();
        let filteredPois = [];
        let filteredPoiSet = new Set(); //avoid duplicates



        //positiv
        for (let poi of state.stadtplan.pois){
            for (let ll of poi.mainlocationtype.lebenslagen){
                if (state.stadtplan.filter.positiv.indexOf(ll)!==-1) {
                    filteredPoiSet.add(poi);
                    break;
                }
            }
        }
        //negativ
        for (let poi of state.stadtplan.pois){
            for (let ll of poi.mainlocationtype.lebenslagen){
                if (state.stadtplan.filter.negativ.indexOf(ll)!==-1) {
                    filteredPoiSet.delete(poi);
                }
            }
        }



        filteredPois=Array.from(filteredPoiSet);

      
        dispatch(setFilteredPOIs(filteredPois));
        dispatch(createFeatureCollectionFromPOIs());
    }
}
function refreshFeatureCollection() {
    return (dispatch, getState) => {
        dispatch(applyFilter());
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
            for (let poi of results) {
                let poiFeature = convertPOIToFeature(poi, counter)
                resultFC.push(poiFeature);
               
                if (poiFeature.id === currentSelectedFeature.id) {
                    selectionWish = poiFeature.index;
                    
                }
                counter++;
            }
            
            dispatch(mappingActions.setFeatureCollection(resultFC));
                //console.log("setPoiGazHit(null));")
                // dispatch(setPoiGazHit(null));
            dispatch(mappingActions.setSelectedFeatureIndex(selectionWish));
        }
    }
}


//EXPORT ACTIONS
export const actions = {
    loadPOIs,
    setPOIs,
    setSelectedPOI,
    createFeatureCollectionFromPOIs,
    setFilterAndApply,
    toggleFilter,
    setAllLebenslagenToFilter,
    clearFilter,
    refreshFeatureCollection,
    setPoiSvgSize
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

