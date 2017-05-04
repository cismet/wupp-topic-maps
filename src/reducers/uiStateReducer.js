import initialState from './initialState';
import * as actionTypes from '../constants/actionTypes';
import objectAssign from 'object-assign';


export default function uiStateReducer(state = initialState.uiState, action) {
  let newState;
  switch (action.type) {
     case actionTypes.SCREEN_RESIZE:
      {
        newState = objectAssign({}, state);
        newState.width = action.width;
        newState.height = action.height;
        return newState;
      }
     default:
      return state;

  }

}
