import * as actionTypes from '../constants/actionTypes';

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