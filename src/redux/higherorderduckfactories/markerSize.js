import objectAssign from "object-assign";

const makeMarkerSizeDuck = (section, substateResolver) => {
  const actionTypes = {
    SET: `HO/MARKERSIZE/${section}/SET`
  };
  const initialState = {
    markerSize: 30
  };

  //SELECTORS
  const selectors = {
    getMarkerSize: state => state.markerSize
  };
  const actions = {
    setSize: size => {
      type: actionTypes.SET, size;
    }
  };

  const reducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
      case actionTypes.SET: {
        newState = objectAssign({}, state);
        newState.markerSize = action.size;
        return newState;
      }
      default:
        return state;
    }
  };
  return {
    actionTypes,
    actions,
    reducer,
    selectors
  };
};

export default makeMarkerSizeDuck;
