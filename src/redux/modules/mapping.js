import L from 'leaflet';
import 'proj4leaflet';
import objectAssign from 'object-assign';

///TYPES
export const types = {
  MAP_BOUNDING_BOX_CHANGED: 'MAPPING/MAP_BOUNDING_BOX_CHANGED',
  FEATURE_COLLECTION_CHANGED: 'MAPPING/FEATURE_COLLECTION_CHANGED',
  FEATURE_SELECTION_INDEX_CHANGED: 'MAPPING/FEATURE_SELECTION_INDEX_CHANGED',
  SET_AUTO_FIT: 'MAPPING/SET_AUTO_FIT',
  SET_SEARCH_PROGRESS_INDICATOR: 'MAPPING/SET_SEARCH_PROGRESS_INDICATOR',
  GAZETTEER_HIT: 'MAPPING/GAZETTEER_HIT',
  SET_MAP_BOUNDING_BOX_CHANGED_TRIGGER: 'MAPPING/SET_MAP_BOUNDING_BOX_CHANGED_TRIGGER',
  CHANGE_FEATURE: 'MAPPING/CHANGE_FEATURE',
  SET_OVERLAY_FEATURE: 'MAPPING/SET_OVERLAY_FEATURE',
  SET_MASKED_OVERLAY: 'MAPPING/SET_MASKED_OVERLAY',
  SET_FEATURE_COLLECTION_KEY_POSTFIX: 'MAPPING/SET_FEATURE_COLLECTION_KEY_POSTFIX'
};
export const constants = {
  AUTO_FIT_MODE_STRICT: 'MAPPING/AUTO_FIT_MODE_STRICT',
  AUTO_FIT_MODE_NO_ZOOM_IN: 'MAPPING/AUTO_FIT_MODE_NO_ZOOM_IN'
};
///INITIAL STATE
const initialState = {
  featureCollection: [],
  selectedIndex: null,
  boundingBox: null,
  autoFitBoundsTarget: null,
  autoFitBounds: false,
  searchInProgress: false,
  gazetteerHit: null,
  gazetteerData: [
    {
      sorter: 1,
      string: '000 Büro des Oberbürgermeisters',
      glyph: 'tags',
      x: 374440.63,
      y: 5681637.71,
      more: {
        zoomlevel: 14
      }
    },
    {
      sorter: 101,
      string: '1161',
      glyph: 'file',
      x: 365016.54,
      y: 5677991.07,
      more: {
        zoomlevel: 18,
        verfahrensnummer: '1161'
      }
    }
  ],
  gazetteerTopicsLoaded: false,
  boundingBoxChangedTrigger: null,
  spiderfiedCluster: null,
  overlayFeature: null,
  maskedOverlay: true,
  featureStylerScalableImageSize: 24,
  featureCollectionKeyPostfix: ''
};

///REDUCER
export default function mappingReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case types.MAP_BOUNDING_BOX_CHANGED: {
      newState = objectAssign({}, state);
      newState.boundingBox = action.bbox;
      return newState;
    }
    case types.SET_MAP_BOUNDING_BOX_CHANGED_TRIGGER: {
      newState = objectAssign({}, state);
      newState.boundingBoxChangedTrigger = action.trigger;
      return newState;
    }
    case types.FEATURE_COLLECTION_CHANGED: {
      newState = objectAssign({}, state);
      newState.featureCollection = action.featureCollection;
      newState.selectedIndex = 0;
      return newState;
    }
    case types.FEATURE_SELECTION_INDEX_CHANGED: {
      newState = objectAssign({}, state);
      newState.featureCollection = JSON.parse(JSON.stringify(state.featureCollection));
      for (let feature of newState.featureCollection) {
        feature.selected = false;
      }
      if (newState.featureCollection[action.index]) {
        newState.featureCollection[action.index].selected = true;
        newState.selectedIndex = action.index;
      } else {
        newState.selectedIndex = null;
      }
      return newState;
    }
    case types.SET_AUTO_FIT: {
      newState = objectAssign({}, state);
      newState.autoFitBounds = action.autofit;
      newState.autoFitMode = action.mode;
      newState.autoFitBoundsTarget = action.bounds;
      return newState;
    }
    case types.SET_SEARCH_PROGRESS_INDICATOR: {
      newState = objectAssign({}, state);
      newState.searchInProgress = action.inProgress;
      return newState;
    }
    case types.GAZETTEER_HIT: {
      newState = objectAssign({}, state);
      newState.gazetteerHit = action.hit;
      return newState;
    }
    case types.CHANGE_FEATURE: {
      newState = objectAssign({}, state);
      newState.featureCollection = JSON.parse(JSON.stringify(state.featureCollection));
      let found = newState.featureCollection.findIndex(x => x.id === action.newFeature.id);
      if (found !== -1) {
        newState.featureCollection[found] = action.newFeature;
      }
      return newState;
    }
    case types.SET_OVERLAY_FEATURE: {
      newState = objectAssign({}, state);
      newState.overlayFeature = action.overlayFeature;
      return newState;
    }
    case types.SET_MASKED_OVERLAY: {
      newState = objectAssign({}, state);
      newState.maskedOverlay = action.maskedOverlayhit;
      return newState;
    }
    case types.SET_FEATURE_COLLECTION_KEY_POSTFIX: {
      newState = objectAssign({}, state);
      newState.featureCollectionKeyPostfix = action.featureCollectionKeyPostfix;
      return newState;
    }
    default:
      return state;
  }
}

///SIMPLEACTIONCREATORS
function setMappingBounds(bbox) {
  return {
    type: types.MAP_BOUNDING_BOX_CHANGED,
    bbox
  };
}

function setBoundingBoxChangedTrigger(trigger) {
  return {
    type: types.SET_MAP_BOUNDING_BOX_CHANGED_TRIGGER,
    trigger
  };
}

function setFeatureCollection(featureCollection) {
  return {
    type: types.FEATURE_COLLECTION_CHANGED,
    featureCollection
  };
}

function setSelectedFeatureIndex(index) {
  return {
    type: types.FEATURE_SELECTION_INDEX_CHANGED,
    index
  };
}

function setSearchProgressIndicator(inProgress) {
  return {
    type: types.SET_SEARCH_PROGRESS_INDICATOR,
    inProgress
  };
}

function setAutoFit(autofit, bounds, mode) {
  return {
    type: types.SET_AUTO_FIT,
    autofit,
    bounds,
    mode
  };
}

function gazetteerHit(hit) {
  return {
    type: types.GAZETTEER_HIT,
    hit
  };
}

function changeFeatureById(newFeature) {
  return {
    type: types.CHANGE_FEATURE,
    newFeature
  };
}

function setOverlayFeature(overlayFeature) {
  return {
    type: types.SET_OVERLAY_FEATURE,
    overlayFeature
  };
}

function setMaskedOverlay(maskedOverlay) {
  return {
    type: types.SET_MASKED_OVERLAY,
    maskedOverlay
  };
}

function setFeatureCollectionKeyPostfix(featureCollectionKeyPostfix) {
  return {
    type: types.SET_FEATURE_COLLECTION_KEY_POSTFIX,
    featureCollectionKeyPostfix
  };
}

//COMPLEXACTIONS

function mappingBoundsChanged(bbox) {
  return function(dispatch, getState) {
    let state = getState().mapping;
    if (state.boundingBoxChangedTrigger) {
      //} && JSON.stringify(state.boundingBox)!==JSON.stringify(bbox)) {
      state.boundingBoxChangedTrigger(bbox);
    }

    dispatch(setMappingBounds(bbox));
  };
}

function fitFeatureBounds(feature, mode) {
  return function(dispatch) {
    const projectedF = L.Proj.geoJson(feature);
    const bounds = projectedF.getBounds();
    dispatch(setAutoFit(true, bounds, mode));
  };
}

function fitSelectedFeatureBounds(mode) {
  return function(dispatch, getState) {
    const currentState = getState();
    dispatch(
      fitFeatureBounds(
        currentState.mapping.featureCollection[currentState.mapping.selectedIndex],
        mode
      )
    );
  };
}

function fitAll() {
  return function(dispatch, getState) {
    const currentState = getState();
    dispatch(fitFeatureCollection(currentState.mapping.featureCollection));
  };
}

function fitFeatureCollection(features) {
  return function(dispatch) {
    const projectedFC = L.Proj.geoJson(features);
    const bounds = projectedFC.getBounds();
    dispatch(setAutoFit(true, bounds, constants.AUTO_FIT_MODE_STRICT));
  };
}

//EXPORT ACTIONS

export const actions = {
  mappingBoundsChanged,
  setBoundingBoxChangedTrigger,
  setFeatureCollection,
  setSelectedFeatureIndex,
  setSearchProgressIndicator,
  setAutoFit,
  gazetteerHit,
  fitFeatureBounds,
  fitSelectedFeatureBounds,
  fitAll,
  fitFeatureCollection,
  changeFeatureById,
  setOverlayFeature,
  setMaskedOverlay,
  setFeatureCollectionKeyPostfix
};
