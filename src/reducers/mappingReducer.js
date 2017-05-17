import initialState from './initialState';
import objectAssign from 'object-assign';
import * as actionTypes from '../constants/actionTypes';


export default function mappingReducer(state = initialState.mapping, action) {
  let newState;
  
  switch (action.type) {
      case actionTypes.MAP_BOUNDING_BOX_CHANGED:
      {
        newState = objectAssign({}, state);
        newState.boundingBox = action.bbox;
        return newState;
      }
   default:
        return state;
 }
}