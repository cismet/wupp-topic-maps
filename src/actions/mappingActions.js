import * as actionTypes from '../constants/actionTypes';
import L from 'leaflet';
import 'proj4leaflet';

export function mappingBoundsChanged(bbox) {
  return {
    type: actionTypes.MAP_BOUNDING_BOX_CHANGED,
    bbox
  };
}

export function setFeatureCollection(featureCollection) {
  return {
    type: actionTypes.FEATURE_COLLECTION_CHANGED,
    featureCollection
  };
}

export function setSelectedFeatureIndex(index) {
  return {
    type: actionTypes.FEATURE_SELECTION_INDEX_CHANGED,
    index
  };
}

export function fitSelectedFeatureBounds(mode) {
  return function (dispatch, getState) {
    const currentState=getState();
    dispatch(fitFeatureBounds(currentState.mapping.featureCollection[currentState.mapping.selectedIndex],mode));
  };
}

export function fitFeatureBounds(feature, mode) {
return function (dispatch) {
    const projectedF = L.Proj.geoJson(feature);
    const bounds=projectedF.getBounds();
    dispatch(setAutoFit(true,bounds,mode));
};
}

export function setSearchProgressIndicator(inProgress) {
  return {
    type: actionTypes.SET_SEARCH_PROGRESS_INDICATOR,
    inProgress
  };
}

export function setAutoFit(autofit, bounds, mode) {
  return {
    type: actionTypes.SET_AUTO_FIT,
    autofit,
    bounds,
    mode
  };    
}

export function gazetteerHit(hit) {
  return {
    type: actionTypes.GAZETTEER_HIT,
    hit
  };   
}
