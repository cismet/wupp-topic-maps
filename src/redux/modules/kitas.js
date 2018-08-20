import objectAssign from 'object-assign';
import {actions as mappingActions} from './mapping';
import {predicateBy} from '../../utils/stringHelper';
import kdbush from 'kdbush';
import queryString from 'query-string';


//TYPES
export const types = {
    SET_KITAS: 'KITAS/SET_KITAS',
    SET_KITA_GAZ_HIT: 'KITAS/SET_KITA_GAZ_HIT',
    CLEAR_KITA_GAZ_HIT: 'KITAS/CLEAR_KITA_GAZ_HIT',
    SET_FILTERED_KITAS: 'KITAS/SET_FILTERED_KITAS',
    SET_FILTER: 'KITAS/SET_FILTER',
}


export const constants = {
    TRAEGERTYP_ANDERE: 'KITAS/CONSTS/TRAEGERTYP_ANDERE',
    TRAEGERTYP_BETRIEBSKITA: 'KITAS/CONSTS/TRAEGERTYP_BETRIEBSKITA',
    TRAEGERTYP_STAEDTISCH: 'KITAS/CONSTS/TRAEGERTYP_STAEDTISCH',
    TRAEGERTYP_ELTERNINITIATIVE: 'KITAS/CONSTS/TRAEGERTYP_ELTERNINITIATIVE',
    TRAEGERTYP_EVANGELISCH: 'KITAS/CONSTS/TRAEGERTYP_EVANGELISCH',
    TRAEGERTYP_KATHOLISCH: 'KITAS/CONSTS/TRAEGERTYP_KATHOLISCH',
    ALTER_UNTER2:  'KITAS/CONSTS/ALTER_UNTER2',
    ALTER_AB2:  'KITAS/CONSTS/ALTER_AB2',
    ALTER_AB3:  'KITAS/CONSTS/ALTER_AB3',
    STUNDEN_NUR_35: 'KITAS/CONSTS/STUNDEN_NUR_35',
    STUNDEN_NUR_35_u_45: 'KITAS/CONSTS/STUNDEN_NUR_35_u_45',
    STUNDEN_NUR_45: 'KITAS/CONSTS/STUNDEN_NUR_45'
}

constants.TRAEGERTYP=[
    constants.TRAEGERTYP_ANDERE, 
    constants.TRAEGERTYP_BETRIEBSKITA, 
    constants.TRAEGERTYP_STAEDTISCH, 
    constants.TRAEGERTYP_ELTERNINITIATIVE, 
    constants.TRAEGERTYP_EVANGELISCH, 
    constants.TRAEGERTYP_KATHOLISCH
];
constants.ALTER=[
    constants.ALTER_UNTER2,
    constants.ALTER_AB2,
    constants.ALTER_AB3        
];
constants.STUNDEN=[
    constants.STUNDEN_NUR_35,
    constants.STUNDEN_NUR_35_u_45,
    constants.STUNDEN_NUR_45        
];

///INITIAL STATE
const initialState = {
    kitas: [],
    kitaGazHitId: null,
    kitasMD5: "",
    filteredKitas: [],
    filteredKitasIndex: null,
    filter: {
    },
    kitaSvgSize:34

}
///REDUCER
export default function kitaReducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case types.SET_KITAS:
        {
            newState = objectAssign({}, state);
            newState.kitas=action.kitas;
            newState.kitasMD5=action.kitasMD5;
            return newState;
        }
        case types.SET_KITA_GAZ_HIT:
        {
            newState = objectAssign({}, state);
            newState.kitaGazHitId=action.hitId;
            return newState;
        }
        case types.CLEAR_KITA_GAZ_HIT:
        {
            newState = objectAssign({}, state);
            newState.kitaGazHitId=null;
            return newState;
        }
        case types.SET_FILTERED_KITAS:
        {
            newState = objectAssign({}, state);
            newState.filteredKitas=action.filteredKitas;
            newState.filteredKitasIndex=kdbush(action.filteredKitas, (p)=>p.geojson.coordinates[0], (p) => p.geojson.coordinates[1]);
            return newState;
        }
        case types.SET_FILTER:
        {
            newState = objectAssign({}, state);
            newState.filter=action.filter;
            return newState;
        }
        default:
            return state;
    }
}

///SIMPLEACTIONCREATORS
function setKitas(kitas,kitasMD5) {
    return {type: types.SET_KITAS, kitas, kitasMD5};
}
function setKitasGazHit(hitId) {
    return {type: types.SET_POI_GAZ_HIT, hitId};
}
function clearKitasGazHit() {
    return {type: types.SET_KITA_GAZ_HIT};
}
function setFilteredKitas(filteredKitas) {
    return {type: types.SET_FILTERED_KITAS, filteredKitas};
}

function setFilter(filter) {
    return {type: types.SET_FILTER, filter};
}


//COMPLEXACTIONS

function setSelectedKita(kid) {
    return (dispatch, getState) => {
        let state=getState();
        let kitaFeature=state.mapping.featureCollection.find(x => x.id === kid); 
        if (kitaFeature) {
            dispatch(mappingActions.setSelectedFeatureIndex(kitaFeature.index));    
            dispatch(clearKitasGazHit());   
        }
        else {
            dispatch(setKitasGazHit(kitaFeature.index));   
        }

    }
}

function loadKitas() {
    return (dispatch, getState) => {
        let md5 = null;
        let currentKita=null;
        const state = getState();
        let noCacheHeaders = new Headers();
        noCacheHeaders.append('pragma', 'no-cache');
        noCacheHeaders.append('cache-control', 'no-cache');

        const manualReloadRequested=(queryString.parse(state.routing.location.search).alwaysRefreshKitasOnReload!==undefined);

        return fetch('/kitas/kitas.data.json.md5', {method: 'get', headers: noCacheHeaders}).then((response) => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('Server md5 response wasn\'t OK');
            }
        }).then((md5value) => {
            md5 = md5value.trim();
            if (manualReloadRequested){
                console.log("Fetch Kitas because of alwaysRefreshKitasOnReload Parameter")
                return "fetchit";
            }

            if (md5 === state.kitas.kitasMD5 && (constants.DEBUG_ALWAYS_LOADING===false)) {
                dispatch(applyFilter());
                dispatch(createFeatureCollectionFromKitas());
                throw 'CACHEHIT';
            } else {
                return "fetchit";
            }
        }).then((fetchit) => {
            return fetch('/kitas/kitas.data.json', {method: 'get', headers: noCacheHeaders});
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Server kitas/data response wasn\'t OK');
            }
        }).then((data) => {

            let lebenslagen = new Set();
            let poitypes = [];

            dispatch(setKitas(data,md5));
            dispatch(applyFilter());
            dispatch(createFeatureCollectionFromKitas());    
        }).catch(function (err) {
                if (err !== 'CACHEHIT') {
                    console.log("Problem during KitasLoading");
                    console.log(currentKita);
                    console.log(err);
                }
            });
    }
}


function clearFilter(kind) {
    return (dispatch, getState) => {
        // let state = getState();
        // let filterState = JSON.parse(JSON.stringify(state.stadtplan.filter));
        // filterState[kind]=[];
        // dispatch(setFilter(filterState));
        // dispatch(applyFilter());
    }
}

function setFilterAndApply(filter) {
    return (dispatch, getState) => {
        let state = getState();
        dispatch(setFilter(filter));
        dispatch(applyFilter());
    }
}


function applyFilter() {
    return (dispatch, getState) => {
        let state = getState();
        let filteredKitas = [];
        let filteredKitaSet = new Set(); //avoid duplicates



        // //positiv
        // for (let poi of state.stadtplan.pois){
        //     for (let ll of poi.mainlocationtype.lebenslagen){
        //         if (state.stadtplan.filter.positiv.indexOf(ll)!==-1) {
        //             filteredPoiSet.add(poi);
        //             break;
        //         }
        //     }
        // }
        // //negativ
        // for (let poi of state.stadtplan.pois){
        //     for (let ll of poi.mainlocationtype.lebenslagen){
        //         if (state.stadtplan.filter.negativ.indexOf(ll)!==-1) {
        //             filteredPoiSet.delete(poi);
        //         }
        //     }
        // }



        
        filteredKitas=state.kitas.kitas;

      
         dispatch(setFilteredKitas(filteredKitas)); 
         dispatch(createFeatureCollectionFromKitas());
    }
}
function refreshFeatureCollection() {
    return (dispatch, getState) => {
        dispatch(applyFilter());
    }
}

function createFeatureCollectionFromKitas(boundingBox) {
    return (dispatch, getState) => {
        let state = getState()
        if (state.kitas.filteredKitasIndex) {
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
                .kitas
                .filteredKitasIndex
                .range(bb.left, bb.bottom, bb.right, bb.top);
            let resultFC = [];
            let counter = 0;
            let results = [];

            for (let id of resultIds) {
                results.push(state.kitas.filteredKitas[id]);
            }

            results.sort((a, b) => {
                if (a.geojson.coordinates[1] === b.geojson.coordinates[1]) {
                    return a.geojson.coordinates[0] - b.geojson.coordinates[0];
                } else {
                    return b.geojson.coordinates[1] - a.geojson.coordinates[1];
                }
            })

            let selectionWish = 0;
            for (let kita of results) {
                let kitaFeature = convertKitaToFeature(kita, counter)
                resultFC.push(kitaFeature);
               
                if (kitaFeature.id === currentSelectedFeature.id) {
                    selectionWish = kitaFeature.index;
                    
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
    setKitas,
    setKitasGazHit,
    clearKitasGazHit,
    setFilteredKitas,
    setFilter,

    loadKitas,
    setSelectedKita,
    createFeatureCollectionFromKitas,
    setFilterAndApply,
    clearFilter,
    refreshFeatureCollection
}

//HELPER FUNCTIONS
function convertKitaToFeature(kita, index) {

    const id = kita.id;
    const type = "Feature";
    const selected = false;
    const geometry = kita.geojson;
    const text = kita.name;

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
        properties: kita
    }
}

