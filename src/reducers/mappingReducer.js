import initialState from './initialState';
import objectAssign from 'object-assign';
import * as actionTypes from '../constants/actionTypes';


export default function mappingReducer(state = initialState.mapping, action) {
  let newState;
  console.log("mappingActions "+action.type);
  switch (action.type) {
      case actionTypes.MAP_BOUNDING_BOX_CHANGED:
      {
        newState = objectAssign({}, state);
        newState.boundingBox = action.bbox;
        return newState;
      }
      case actionTypes.FEATURE_COLLECTION_CHANGED:
      {
        newState = objectAssign({}, state);
        newState.featureCollection = action.featureCollection;
        newState.selectedIndex = 0;
        return newState;
      } 
      case actionTypes.FEATURE_SELECTION_INDEX_CHANGED:
      {
        newState = JSON.parse(JSON.stringify(state));
        for (let feature of newState.featureCollection) {
          feature.selected=false;          
        }
        newState.featureCollection[action.index].selected=true;
        newState.selectedIndex = action.index;
        return newState;
      } 
   default:
        return state;
 }
}


