import initialState from './initialState';
import objectAssign from 'object-assign';
import * as actionTypes from '../constants/actionTypes';


export default function bplanReducer(state = initialState.bplanApp, action) {
  let newState;
  switch (action.type) {
      case actionTypes.SET_DOCUMENT_LOADING_INDICATOR:
      {
        newState = objectAssign({}, state);
        newState.documentsLoading = action.isLoading;
        return newState;
      }

   default:
        return state;
 }
}