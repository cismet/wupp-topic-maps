import objectAssign from 'object-assign';
import {actions as mappingActions} from './mapping';
import {convertPoint} from '../../utils/gisHelper';

import kdbush from 'kdbush';

///TYPES
export const types = {
    SET_OFFERS: 'EHRENAMT/SET_OFFERS',
    SET_FILTERED_OFFERS: 'EHRENAMT/SET_FILTERED_OFFERS',
    SET_GLOBALBEREICHE: 'EHRENAMT/SET_GLOBALBEREICHE',
    SET_KENNTNISSE: 'EHRENAMT/SET_KENNTNISSE',
    SET_ZIELGRUPPEN: 'EHRENAMT/SET_ZIELGRUPPEN',
    SET_FILTER: 'EHRENAMT/SET_FILTER',
    SET_IGNORED_FILTERGROUPS: 'EHRENAMT/SET_IGNORED_FILTERGROUPS'
    
}

export const constants = {
    OR_FILTER: 'EHRENAMT/OR_FILTER',
    AND_FILTER: 'EHRENAMT/AND_FILTER',
    IGNORE_FILTER: 'EHRENAMT/IGNORE_FILTER',
    KENTNISSE_FILTER: 'EHRENAMT/KENTNISSE_FILTER',
    ZIELGRUPPEN_FILTER: 'EHRENAMT/ZIELGRUPPEN_FILTER',
    GLOBALBEREICHE_FILTER: 'EHRENAMT/GLOBALBEREICHE_FILTER',
}

///INITIAL STATE
const initialState = {
    offers: [],
    filteredOffers: [],
    //offerIndex: null,
    filteredOfferIndex: null,
    globalbereiche: [],
    kenntnisse: [],
    zielgruppen: [],
    filter: {
        globalbereiche: [],
        kenntnisse: [],
        zielgruppen: [
            "Behinderte/Kranke",
            "Erwachsene",
            "Familien",
            "Flüchtlinge/Migranten",
            "Frauen",
            "MigrantInnen",
            "Männer",
            "SeniorInnen"
        ],
        filtermode: constants.OR_FILTER,
        ignoredFilterGroups: []//[constants.KENTNISSE_FILTER, constants.GLOBALBEREICHE_FILTER, constants.ZIELGRUPPEN_FILTER]
    }
};

///REDUCER
export default function ehrenamtReducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case types.SET_OFFERS:
            {
                newState = objectAssign({}, state);
                newState.offers = action.offers
                // newState.offerIndex = kdbush(action.offers, (p) => p.point25832[0], (p) =>
                // p.point25832[1]);
                return newState;
            }
        case types.SET_FILTERED_OFFERS:
            {
                newState = objectAssign({}, state);
                newState.filteredOffers = action.offers
                newState.filteredOfferIndex = kdbush(action.offers, (p) => p.point25832[0], (p) => p.point25832[1]);
                return newState;
            }
        case types.SET_GLOBALBEREICHE:
            {
                newState = objectAssign({}, state);
                newState.globalbereiche = action.globalbereiche

                return newState;
            }
        case types.SET_KENNTNISSE:
            {
                newState = objectAssign({}, state);
                newState.kenntnisse = action.kenntnisse

                return newState;
            }
        case types.SET_ZIELGRUPPEN:
            {
                newState = objectAssign({}, state);
                newState.zielgruppen = action.zielgruppen

                return newState;
            }
        case types.SET_FILTER:
            {
                newState = objectAssign({}, state);
                newState.filter = action.filter

                return newState;
            }
            case types.SET_IGNORED_FILTERGROUPS:
            {
                newState = objectAssign({}, state);
                newState.filter=JSON.parse(JSON.stringify(state.filter));
                newState.filter.ignoredFilterGroups = action.filtergroups;

                return newState;
            }
        default:
            return state;
    }
}

///SIMPLEACTIONCREATORS
function setOffers(offers) {
    return {type: types.SET_OFFERS, offers};
}
function setFilteredOffers(offers) {
    return {type: types.SET_FILTERED_OFFERS, offers};
}

function setGlobalbereiche(globalbereiche) {
    return {type: types.SET_GLOBALBEREICHE, globalbereiche};
}

function setKenntnisse(kenntnisse) {
    return {type: types.SET_KENNTNISSE, kenntnisse};
}

function setZielgruppen(zielgruppen) {
    return {type: types.SET_ZIELGRUPPEN, zielgruppen};
}

function setFilter(filter) {
    return {type: types.SET_FILTER, filter};
}

function setIgnoredFilterGroups(filtergroups) {
    return {type: types.SET_IGNORED_FILTERGROUPS, filtergroups};
}

//COMPLEXACTIONS

function toggleFilter(filtergroup, filter) {
    return (dispatch, getState) => {
        let state = getState();
        let filterState = JSON.parse(JSON.stringify(state.ehrenamt.filter));
        let filterGroupSet = new Set(filterState[filtergroup]);
        if (filterGroupSet.has(filter)) {
            filterGroupSet.delete(filter);
        } else {
            filterGroupSet.add(filter);
        }
        filterState[filtergroup] = Array.from(filterGroupSet);
        filterState[filtergroup].sort();
        dispatch(setFilter(filterState));
        dispatch(applyFilter());

    }
}

function toggleIgnoredFilterGroup(filtergroup) {
    return (dispatch, getState) => {
        let state = getState();
        let filterState = JSON.parse(JSON.stringify(state.ehrenamt.filter));
        let ignoredFilterGroupsSet = new Set(filterState.ignoredFilterGroups);
        if (ignoredFilterGroupsSet.has(filtergroup)) {
            ignoredFilterGroupsSet.delete(filtergroup);
        } else {
            ignoredFilterGroupsSet.add(filtergroup);
        }
        let result = Array.from(ignoredFilterGroupsSet);
        result.sort();
        dispatch(setIgnoredFilterGroups(result));
        dispatch(applyFilter());
    }
}

function applyFilter() {

    return (dispatch, getState) => {
        let state = getState();
        let groups=[
            getFilterSelectorForConstant(constants.KENTNISSE_FILTER), 
            getFilterSelectorForConstant(constants.GLOBALBEREICHE_FILTER), 
            getFilterSelectorForConstant(constants.ZIELGRUPPEN_FILTER)
        ];
        let fo = [];

        for (let offer of state.ehrenamt.offers) {
            for (let fg of groups){
                if (state.ehrenamt.filter.ignoredFilterGroups.indexOf(fg)===-1){
                    if (offer[fg]) {
                        for (let zg of offer[fg]) {
                            if (state.ehrenamt.filter[fg].indexOf(zg) > -1) {
                                fo.push(offer);
                                break;
                            }
                        }
                    }
                }
            }
        }

        // for (let offer of state.ehrenamt.offers) {
            
        //     if (offer.zielgruppen) {
        //         for (let zg of offer.zielgruppen) {
        //             if (state.ehrenamt.filter.zielgruppen.indexOf(zg) > -1) {
        //                 fo.push(offer);
        //                 break;
        //             }
        //         }
        //     }
        // }
        dispatch(setFilteredOffers(fo));
        dispatch(createFeatureCollectionFromOffers());

    }
}

function loadOffers() {
    return (dispatch, getState) => {
        return fetch('/ehrenamt/data.json', {method: 'get'}).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Server ehrenamt/data response wasn\'t OK');
            }
        }).then((data) => {

            let globalbereiche = new Set();
            let kenntnisse = new Set();
            let zielgruppen = new Set();

            for (let offer of data) {
                offer.point25832 = convertPoint(offer.geo_x, offer.geo_y)
                if (offer.globalbereiche) {
                    for (let g of offer.globalbereiche) {
                        globalbereiche.add(g);
                    }
                }
                if (offer.kenntnisse) {
                    for (let k of offer.kenntnisse) {
                        kenntnisse.add(k);
                    }
                }
                if (offer.zielgruppen) {
                    for (let z of offer.zielgruppen) {
                        zielgruppen.add(z);
                    }
                }
            }

            dispatch(setGlobalbereiche(Array.from(globalbereiche).sort()));
            dispatch(setKenntnisse(Array.from(kenntnisse).sort()));
            dispatch(setZielgruppen(Array.from(zielgruppen).sort()));
            dispatch(setOffers(data));
            dispatch(applyFilter());
            dispatch(createFeatureCollectionFromOffers());

        })
            .catch(function (err) {
                console.log(err);
            });
    }
}

function createFeatureCollectionFromOffers(boundingBox) {
    return (dispatch, getState) => {
        let state = getState()

        if (state.ehrenamt.filteredOfferIndex) {
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
                .ehrenamt
                .filteredOfferIndex
                .range(bb.left, bb.bottom, bb.right, bb.top);
            let resultFC = [];
            let counter = 0;
            let results = [];

            for (let id of resultIds) {
                results.push(state.ehrenamt.filteredOffers[id]);
            }

            results.sort((a, b) => {
                if (a.point25832[1] === b.point25832[1]) {
                    return a.point25832[0] - b.point25832[0];
                } else {
                    return b.point25832[1] - a.point25832[1];
                }
            })

            let selectionWish = 0;
            for (let offer of results) {
                let offerFeature = convertOfferToFeature(offer, counter)
                resultFC.push(offerFeature);
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


function getFilterSelectorForConstant(constant){
    switch (constant) {
        case constants.GLOBALBEREICHE_FILTER:
        {
            return "globalbereiche";
        }
        case constants.KENTNISSE_FILTER:
        {
            return "kenntnisse";
        }
        case constants.ZIELGRUPPEN_FILTER:
        {
            return "zielgruppen";
        }
    }
}

function selectAll(filtergroupconstant) {
    return (dispatch, getState) => {
        let filtergroup=getFilterSelectorForConstant(filtergroupconstant);
        let state = getState();
        let filterState = JSON.parse(JSON.stringify(state.ehrenamt.filter));
        filterState[filtergroup] = JSON.parse(JSON.stringify(state.ehrenamt[filtergroup]));
        filterState[filtergroup].sort();
        dispatch(setFilter(filterState));
        dispatch(applyFilter());    
    }        
}

function selectNone(filtergroupconstant) {
    return (dispatch, getState) => {
        let filtergroup=getFilterSelectorForConstant(filtergroupconstant);
        let state = getState();
        let filterState = JSON.parse(JSON.stringify(state.ehrenamt.filter));
        filterState[filtergroup] = [];
        filterState[filtergroup].sort();
        dispatch(setFilter(filterState));
        dispatch(applyFilter());    
    }        

}

function invertSelection(filtergroupconstant) {
    return (dispatch, getState) => {
        let filtergroup=getFilterSelectorForConstant(filtergroupconstant);
        let state = getState();
        let filterState = JSON.parse(JSON.stringify(state.ehrenamt.filter));
        let filterGroupSet = new Set(filterState[filtergroup]);
        
        let possibilities=JSON.parse(JSON.stringify(state.ehrenamt[filtergroup]));
        for (let filter of possibilities) {
            if (filterGroupSet.has(filter)) {
                filterGroupSet.delete(filter);
            } else {
                filterGroupSet.add(filter);
            }
        }
        
        filterState[filtergroup] = Array.from(filterGroupSet);
        filterState[filtergroup].sort();
        dispatch(setFilter(filterState));
        dispatch(applyFilter());    
    }        

}


//EXPORT ACTIONS

export const actions = {
    setOffers,
    loadOffers,
    createFeatureCollectionFromOffers,
    toggleFilter,
    toggleIgnoredFilterGroup,
    selectAll,
    selectNone,
    invertSelection,
};

//helperFunctions
function convertOfferToFeature(offer, index) {

    const id = offer.id;
    const type = "Feature";
    const selected = false;
    const point = offer.point25832; //convertPoint(offer.geo_x, offer.geo_y)
    const geometry = {
        "type": "Point",
        "coordinates": [point[0], point[1]]
    }
    const text = offer.text;

    const globalbereiche = offer.globalbereiche;
    const kenntnisse = offer.kenntnisse;
    const zielgruppen = offer.zielgruppen;

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
        properties: {
            zielgruppen,
            globalbereiche,
            kenntnisse
        }
    }
}
