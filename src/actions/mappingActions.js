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

export function fitSelectedFeatureBounds() {
  return function (dispatch, getState) {
    const currentState=getState();
    dispatch(fitFeatureBounds(currentState.mapping.featureCollection[currentState.mapping.selectedIndex]));
  };
}

export function fitFeatureBounds(feature) {
  return function (dispatch) {
    const projectedF = L.Proj.geoJson(feature);
    const bounds=projectedF.getBounds();
    dispatch(setAutoFit(true,bounds));
};
}

// export function setTargetBounds(bounds) {
//   return {
//     type: actionTypes.FEATURE_SELECTION_INDEX_CHANGED,
//     bounds
//   };    
// }

export function setAutoFit(autofit, bounds) {
  return {
    type: actionTypes.SET_AUTO_FIT,
    autofit,
    bounds
  };    
}
