import objectAssign from "object-assign";
import { actions as mappingActions } from "./mapping";
import { predicateBy } from "../../utils/stringHelper";
import kdbush from "kdbush";
import { addSVGToPOI } from "../../utils/stadtplanHelper";
import queryString from "query-string";
import makeDataDuck from "../higherorderduckfactories/dataWithMD5Check";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import localForage from "localforage";
//TYPES
export const types = {
  //   SET_POI_GAZ_HIT: "STADTPLAN/SET_POI_GAZ_HIT",
  //   CLEAR_POI_GAZ_HIT: "STADTPLAN/CLEAR_POI_GAZ_HIT",
  SET_FILTERED_POIS: "STADTPLAN/SET_FILTERED_POIS",
  SET_FILTER: "STADTPLAN/SET_FILTER",

  SET_TYPES: "STADTPLAN/SET_TYPES",
  SET_LEBENSLAGEN: "STADTPLAN/SET_LEBENSLAGEN",

  SET_POI_SVG_SIZE: "STADTPLAN/SET_POI_SVG_SIZE"
};

export const constants = {
  DEBUG_ALWAYS_LOADING: false
};

//HIGHER ORDER DUCKS
const dataDuck = makeDataDuck("POIS", state => state.stadtplan.dataState);

///INITIAL STATE
const initialState = {
  poiGazHitId: null,
  filteredPois: [],
  filteredPoisIndex: null,
  lebenslagen: [],
  poitypes: [],
  filter: {
    positiv: [
      "Freizeit",
      "Sport",
      "Mobilität",
      "Religion",
      "Erholung",
      "Gesellschaft",
      "Gesundheit",
      "Kultur",
      "öffentliche Dienstleistungen",
      "Dienstleistungen",
      "Orientierung",
      "Bildung",
      "Stadtbild",
      "Kinderbetreuung"
    ],
    negativ: []
  },
  poiSvgSize: 35,
  apps: [
    {
      on: ["Kinderbetreuung"],
      name: "Kita-Finder",
      bsStyle: "success",
      backgroundColor: null,
      link: "/#/kitas",
      target: "_kitas"
    }
    // {
    //   on: ["Sport", "Freizeit"],
    //   name: "Schwimmbäder",
    //   bsStyle: "primary",
    //   backgroundColor: null,
    //   link: "/#/bplaene",
    //   target: "_baeder"
    // },
    // {
    //   on: ["Sport"],
    //   name: "Sporthallen",
    //   bsStyle: "default",
    //   backgroundColor: null,
    //   link: "/#/ehrenamt",
    //   target: "_hallen"
    // }
  ]
};

///REDUCER
const localStadtplanReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    // case types.SET_POIS: {
    //   newState = objectAssign({}, state);
    //   newState.pois = action.pois;
    //   newState.poisMD5 = action.poisMD5;
    //   return newState;
    // }
    // case types.SET_POI_GAZ_HIT: {
    //   newState = objectAssign({}, state);
    //   newState.poiGazHitId = action.hitId;
    //   return newState;
    // }
    // case types.CLEAR_POI_GAZ_HIT: {
    //   newState = objectAssign({}, state);
    //   newState.poiGazHitId = null;
    //   return newState;
    // }
    case types.SET_FILTERED_POIS: {
      newState = objectAssign({}, state);
      newState.filteredPois = action.filteredPois;
      newState.filteredPoisIndex = kdbush(
        action.filteredPois,
        p => p.geojson.coordinates[0],
        p => p.geojson.coordinates[1]
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
    case types.SET_FILTER: {
      newState = objectAssign({}, state);
      newState.filter = action.filter;
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
  key: "stadtplanPOIs",
  storage: localForage,
  whitelist: ["pois", "poisMD5", "filter", "poitypes", "lebenslagen", "poiSvgSize"]
};
const dataStateStorageConfig = {
  key: "stadtplanPOIData",
  storage: localForage,
  whitelist: ["items", "md5"]
};

const stadtplanReducer = combineReducers({
  localState: persistReducer(localStateStorageConfig, localStadtplanReducer),
  dataState: persistReducer(dataStateStorageConfig, dataDuck.reducer)
});

export default stadtplanReducer;

///SIMPLEACTIONCREATORS
function setPOIs(pois, poisMD5) {
  return { type: types.SET_POIS, pois, poisMD5 };
}
// function setPoiGazHit(hitId) {
//   return { type: types.SET_POI_GAZ_HIT, hitId };
// }
// function clearPoiGazHit() {
//   return { type: types.CLEAR_POI_GAZ_HIT };
// }
function setFilteredPOIs(filteredPois) {
  return { type: types.SET_FILTERED_POIS, filteredPois };
}
function setTypes(poitypes) {
  return { type: types.SET_TYPES, poitypes };
}
function setLebenslagen(lebenslagen) {
  return { type: types.SET_LEBENSLAGEN, lebenslagen };
}
function setFilter(filter) {
  return { type: types.SET_FILTER, filter };
}
function setPoiSvgSize(poiSvgSize) {
  return { type: types.SET_POI_SVG_SIZE, poiSvgSize };
}

//COMPLEXACTIONS

function setSelectedPOI(pid) {
  return (dispatch, getState) => {
    let state = getState();
    let poiFeature = state.mapping.featureCollection.find(x => x.id === pid);
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
    dispatch(
      dataDuck.actions.load({
        manualReloadRequested: manualReloadRequest,
        dataURL: "/data/poi.data.json",
        prepare: (dispatch, data) => {
          let lebenslagen = new Set();
          let poitypes = [];
          let currentPOI;
          for (let poi of data) {
            currentPOI = poi;
            //poi.point25832 = convertPoint(poi.geo_x, offer.geo_y)

            //zuesrt mainlocationtype
            if (poi.mainlocationtype) {
              let type = poi.mainlocationtype;
              for (let ll of type.lebenslagen) {
                lebenslagen.add(ll);
              }
              let found = poitypes.find(x => x.id === type.id);
              if (!found) {
                poitypes.push(type);
              }
            }
          }

          dispatch(setTypes(Array.from(poitypes).sort(predicateBy("name"))));
          dispatch(setLebenslagen(Array.from(lebenslagen).sort()));
          let svgResolvingPromises = data.map(function(poi) {
            return addSVGToPOI(poi, manualReloadRequest);
          });
          return svgResolvingPromises;
        },
        done: (dispatch, data, md5) => {
          dispatch(applyFilter());
          dispatch(createFeatureCollectionFromPOIs());
        },
        errorHandler: err => {
          console.log(err);
        }
      })
    );
  };
}

function toggleFilter(kind, filter) {
  return (dispatch, getState) => {
    let state = getState();
    let filterState = JSON.parse(JSON.stringify(state.stadtplan.localState.filter));
    let filterGroupSet = new Set(filterState[kind]);
    if (filterGroupSet.has(filter)) {
      filterGroupSet.delete(filter);
    } else {
      filterGroupSet.add(filter);
      if (kind === "positiv") {
        if (filterState.negativ.indexOf(filter) !== -1) {
          let otherFilterGroupSet = new Set(filterState["negativ"]);
          otherFilterGroupSet.delete(filter);
          filterState["negativ"] = Array.from(otherFilterGroupSet);
        }
      } else {
        if (filterState.positiv.indexOf(filter) !== -1) {
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
  };
}

function clearFilter(kind) {
  return (dispatch, getState) => {
    let state = getState();
    let filterState = JSON.parse(JSON.stringify(state.stadtplan.localState.filter));
    filterState[kind] = [];
    dispatch(setFilter(filterState));
    dispatch(applyFilter());
  };
}
function setAllLebenslagenToFilter(kind) {
  return (dispatch, getState) => {
    let state = getState();
    let filterState = JSON.parse(JSON.stringify(state.stadtplan.localState.filter));
    filterState[kind] = JSON.parse(JSON.stringify(state.stadtplan.localState.lebenslagen));
    dispatch(setFilter(filterState));
    dispatch(applyFilter());
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

    //positiv
    for (let poi of state.stadtplan.dataState.items) {
      for (let ll of poi.mainlocationtype.lebenslagen) {
        if (state.stadtplan.localState.filter.positiv.indexOf(ll) !== -1) {
          filteredPoiSet.add(poi);
          break;
        }
      }
    }
    //negativ
    for (let poi of state.stadtplan.dataState.items) {
      for (let ll of poi.mainlocationtype.lebenslagen) {
        if (state.stadtplan.localState.filter.negativ.indexOf(ll) !== -1) {
          filteredPoiSet.delete(poi);
        }
      }
    }

    filteredPois = Array.from(filteredPoiSet);

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
    if (state.stadtplan.localState.filteredPoisIndex) {
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

      let resultIds = state.stadtplan.localState.filteredPoisIndex.range(
        bb.left,
        bb.bottom,
        bb.right,
        bb.top
      );
      let resultFC = [];
      let counter = 0;
      let results = [];

      for (let id of resultIds) {
        results.push(state.stadtplan.localState.filteredPois[id]);
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
      //console.log("setPoiGazHit(nactionsull));")
      // dispatch(setPoiGazHit(null));
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
  setAllLebenslagenToFilter,
  clearFilter,
  refreshFeatureCollection,
  setPoiSvgSize
};

//EXPORT SELECTORS
export const getPOIs = state => dataDuck.selectors.getItems(state.dataState);
export const getPOIGazHitId = state => state.localState.poiGazHitId;
export const getPOIsMD5 = state => dataDuck.selectors.getMD5(state.dataState);
export const getFilteredPOIs = state => state.localState.filteredPois;
export const getFilteredPOIsIndex = state => state.localState.filteredPoisIndex;
export const getLebenslagen = state => state.localState.lebenslagen;
export const getPOITypes = state => state.localState.poitypes;
export const getFilter = state => state.localState.filter;
export const getPoiSvgSize = state => state.localState.poiSvgSize;
export const getApps = state => state.localState.apps;

// import {
//   getPOIs,
//   getPOIsMD5,
//   getPOIGazHitId,
//   getFilteredPOIs,
//   getFilteredPOIsIndex,
//   getLebenslagen,
//   getPOITypes,
//   getFilter,
//   getPoiSvgSize,
//   getApps
// } from "../redux/modules/stadtplan";

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
    crs: {
      type: "name",
      properties: {
        name: "urn:ogc:def:crs:EPSG::25832"
      }
    },
    properties: poi
  };
}
