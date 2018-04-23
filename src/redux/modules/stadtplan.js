import objectAssign from 'object-assign';
import {actions as mappingActions} from './mapping';
import {routerActions} from 'react-router-redux'
import {predicateBy} from '../../utils/stringHelper';
//TYPES
export const types = {
    SET_POIS: 'STADTPLAN/SET_POIS',
    SET_TYPES: 'STADTPLAN/SET_TYPES',
    SET_LEBENSLAGEN: 'STADTPLAN/SET_LEBENSLAGEN',
}


export const constants = {
}


///INITIAL STATE
const initialState = {
    pois: [],
    poisMD5: "",
    filteredPois: [],
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
            if (md5 === state.stadtplan.poisMD5) {
                // dispatch(applyFilter());
                // dispatch(createFeatureCollectionFromOffers());
    
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
            // dispatch(applyFilter());
            // dispatch(createFeatureCollectionFromOffers());

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


//EXPORT ACTIONS
export const actions = {
    loadPOIs,
    setPOIs,
}

//HELPER FUNCTIONS
