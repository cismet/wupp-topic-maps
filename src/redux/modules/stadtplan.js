import objectAssign from 'object-assign';
import { actions as mappingActions } from './mapping';
import { predicateBy } from '../../utils/stringHelper';
import kdbush from 'kdbush';
import { addSVGToPOI } from '../../utils/stadtplanHelper';
import makeDataDuck from '../higherorderduckfactories/dataWithMD5Check';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import localForage from 'localforage';
import makeInfoBoxStateDuck from '../higherorderduckfactories/minifiedInfoBoxState';
import { actions as UIStateActions } from './uiState';

//TYPES
export const types = {
  //   SET_POI_GAZ_HIT: "STADTPLAN/SET_POI_GAZ_HIT",   CLEAR_POI_GAZ_HIT:
  // "STADTPLAN/CLEAR_POI_GAZ_HIT",
  SET_FILTERED_POIS: 'STADTPLAN/SET_FILTERED_POIS',
  SET_FILTER: 'STADTPLAN/SET_FILTER',

  SET_TYPES: 'STADTPLAN/SET_TYPES',
  SET_LEBENSLAGEN: 'STADTPLAN/SET_LEBENSLAGEN',
  SET_MINIFIED_INFO_BOX: 'STADTPLAN/SET_MINIFIED_INFO_BOX',

  SET_POI_SVG_SIZE: 'STADTPLAN/SET_POI_SVG_SIZE',
};

export const constants = {
  DEBUG_ALWAYS_LOADING: false,
};

//HIGHER ORDER DUCKS
const dataDuck = makeDataDuck('POIS', (state) => state.stadtplan.dataState);
const infoBoxStateDuck = makeInfoBoxStateDuck('POIS', (state) => state.stadtplan.infoBoxState);
const colorDataDuck = makeDataDuck('POICOLORS', (state) => state.stadtplan.poiColorDataState);

///INITIAL STATE
const initialState = {
  poiGazHitId: null,
  filteredPois: [],
  filteredPoisIndex: null,
  lebenslagen: [],
  poitypes: [],
  filter: {
    positiv: [
      'Freizeit',
      'Sport',
      'Mobilität',
      'Religion',
      'Erholung',
      'Gesellschaft',
      'Gesundheit',
      'Kultur',
      'öffentliche Dienstleistungen',
      'Dienstleistungen',
      'Orientierung',
      'Bildung',
      'Stadtbild',
      'Kinderbetreuung',
    ],
    negativ: [],
  },
  poiSvgSize: 35,
  apps: [
    {
      on: ['Kinderbetreuung'],
      name: 'Kita-Finder',
      bsStyle: 'success',
      backgroundColor: null,
      link: '/#/kitas',
      target: '_kitas',
    },
    {
      on: ['Sport', 'Freizeit'],
      name: 'Bäderkarte',
      bsStyle: 'primary',
      backgroundColor: null,
      link: '/#/baeder',
      target: '_baeder',
    },
    {
      on: ['Kultur'],
      name: 'Kulturstadtplan',
      bsStyle: 'warning',
      backgroundColor: null,
      link: '/#/kulturstadtplan',
      target: '_kulturstadtplan',
    },
    {
      on: ['Mobilität'],
      name: 'Park+Ride-Karte',
      bsStyle: 'warning',
      backgroundColor: '#62B7D5',
      link: '/#/xandride',
      target: '_xandride',
    },

    {
      on: ['Mobilität'],
      name: 'E-Auto-Ladestationskarte',
      bsStyle: 'warning',
      backgroundColor: '#003E7A',
      link: '/#/elektromobilitaet',
      target: '_elektromobilitaet',
    },
    {
      on: ['Mobilität'],
      name: 'E-Fahrrad-Karte',
      bsStyle: 'warning',
      backgroundColor: '#326C88', //'#15A44C', //'#EC7529',
      link: '/#ebikes',
      target: '_ebikes',
    },
    // {
    //   on: ['Gesundheit'],
    //   name: 'Corona-Präventionskarte',
    //   bsStyle: 'warning',
    //   backgroundColor: '#BD000E', //'#15A44C', //'#EC7529',
    //   link: 'https://topicmaps-wuppertal.github.io/corona-praevention/#/?title',
    //   target: '_corona',
    // },

    // {   on: ["Sport"],   name: "Sporthallen",   bsStyle: "default",
    // backgroundColor: null,   link: "/#/ehrenamt",   target: "_hallen" }
  ],
};

///REDUCER
const localStadtplanReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
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
  key: 'stadtplanPOIs',
  storage: localForage,
  whitelist: [
    'pois',
    'poisMD5',
    'filter',
    'poitypes',
    'lebenslagen',
    'poiSvgSize',
    'minifiedInfoBox',
  ],
};
const dataStateStorageConfig = {
  key: 'stadtplanPOIData',
  storage: localForage,
  whitelist: ['items', 'md5'],
};
const colordataStateStorageConfig = {
  key: 'stadtplanPOIColorData',
  storage: localForage,
  whitelist: ['items', 'md5'],
};
const infoBoxStateStorageConfig = {
  key: 'stadtplaninfoBoxMinifiedState',
  storage: localForage,
  whitelist: ['minified'],
};

const stadtplanReducer = combineReducers({
  localState: persistReducer(localStateStorageConfig, localStadtplanReducer),
  dataState: persistReducer(dataStateStorageConfig, dataDuck.reducer),
  poiColorDataState: persistReducer(colordataStateStorageConfig, colorDataDuck.reducer),
  infoBoxState: persistReducer(infoBoxStateStorageConfig, infoBoxStateDuck.reducer),
});

export default stadtplanReducer;

///SIMPLEACTIONCREATORS
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
    let poiFeature = state.mapping.featureCollection.find((x) => x.id === pid);
    if (poiFeature) {
      dispatch(mappingActions.setSelectedFeatureIndex(poiFeature.index));
      //dispatch(clearPoiGazHit());
    } else {
      //dispatch(setPoiGazHit(poiFeature.index));
    }
  };
}

function loadPOIColors(finishedHandler = () => {}) {
  const manualReloadRequest = false;
  return (dispatch, getState) => {
    dispatch(
      colorDataDuck.actions.load({
        manualReloadRequested: manualReloadRequest,
        dataURL: '/data/poi.farben.json',
        errorHandler: (err) => {
          console.log(err);
        },
        done: finishedHandler,
      })
    );
  };
}

function loadPOIs(finishedHandler = () => {}) {
  const manualReloadRequest = false;
  return (dispatch, getState) => {
    dispatch(
      dataDuck.actions.load({
        manualReloadRequested: manualReloadRequest,
        dataURL: '/data/poi.data.json',
        prepare: (dispatch, data) => {
          let lebenslagen = new Set();
          let poitypes = [];
          for (let poi of data) {
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
          }

          dispatch(setTypes(Array.from(poitypes).sort(predicateBy('name'))));
          dispatch(setLebenslagen(Array.from(lebenslagen).sort()));
          let svgResolvingPromises = data.map(function (poi) {
            return addSVGToPOI(poi, manualReloadRequest);
          });
          return svgResolvingPromises;
        },
        done: (dispatch, data, md5) => {
          dispatch(UIStateActions.setLoadingStatus('Filtern'));
          dispatch(applyFilter());
          dispatch(UIStateActions.setLoadingStatus('Darstellung in der Karte'));
          dispatch(createFeatureCollectionFromPOIs());
          finishedHandler();
        },
        errorHandler: (err) => {
          console.log(err);
        },
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
        id: -1,
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
      //console.log("setPoiGazHit(nactionsull));") dispatch(setPoiGazHit(null));
      dispatch(mappingActions.setSelectedFeatureIndex(selectionWish));
    }
  };
}

//EXPORT ACTIONS
export const actions = {
  loadPOIs,
  loadPOIColors,
  setSelectedPOI,
  createFeatureCollectionFromPOIs,
  setFilterAndApply,
  toggleFilter,
  setAllLebenslagenToFilter,
  clearFilter,
  refreshFeatureCollection,
  setPoiSvgSize,
  setMinifiedInfoBox: infoBoxStateDuck.actions.setMinifiedInfoBoxState,
};

//EXPORT SELECTORS
export const getPOIs = (state) => dataDuck.selectors.getItems(state.dataState);
export const getPOIColors = (state) => colorDataDuck.selectors.getItems(state.poiColorDataState);
export const getPOIGazHitId = (state) => state.localState.poiGazHitId;
export const getPOIsMD5 = (state) => dataDuck.selectors.getMD5(state.dataState);
export const getFilteredPOIs = (state) => state.localState.filteredPois;
export const getFilteredPOIsIndex = (state) => state.localState.filteredPoisIndex;
export const getLebenslagen = (state) => state.localState.lebenslagen;
export const getPOITypes = (state) => state.localState.poitypes;
export const getFilter = (state) => state.localState.filter;
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
        name: 'urn:ogc:def:crs:EPSG::25832',
      },
    },
    properties: poi,
  };
}
