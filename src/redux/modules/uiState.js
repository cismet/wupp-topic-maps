import objectAssign from 'object-assign';


///TYPES
export const types = {
    SCREEN_RESIZE : 'UISTATE/SCREEN_RESIZE',
    SHOW_HELP_COMPONENT : 'UISTATE/SHOW_HELP_COMPONENT'
}


///INITIAL STATE
const initialState = {
    width: null,
    height: null,
    helpTextVisible: false    
};


///REDUCER
export default function uiStateReducer(state = initialState, action) {
    let newState;
    switch (action.type) {
       case types.SCREEN_RESIZE:
        {
          newState = objectAssign({}, state);
          newState.width = action.width;
          newState.height = action.height;
          return newState;
        }
       case types.SHOW_HELP_COMPONENT:
        {
          newState = objectAssign({}, state);
          newState.helpTextVisible = action.helpTextVisible;
          return newState;
        }
       default:
        return state;

    }
  }



///SIMPLEACTIONCREATORS
function screenResize(height,width) {
    return {
        type: types.SCREEN_RESIZE,
        width: width,
        height: height,
    };
}
function showHelpComponent(helpTextVisible) {
    return {
        type: types.SHOW_HELP_COMPONENT,
        helpTextVisible
    };
}
//COMPLEXACTIONS

//EXPORT ACTIONS
export const actions = {
    screenResize,
    showHelpComponent
};
