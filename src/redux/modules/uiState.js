import objectAssign from 'object-assign';


///TYPES
export const types = {
    SCREEN_RESIZE : 'UISTATE/SCREEN_RESIZE',
    SHOW_HELP_COMPONENT : 'UISTATE/SHOW_HELP_COMPONENT',
    SET_GAZBOX_ENABLED : 'UISTATE/SET_GAZBOX_ENABLED',
    SET_GAZBOX_INFO_TEXT : 'UISTATE/SET_GAZBOX_INFO_TEXT',
    SET_GAZBOX_VISIBLE : 'UISTATE/SET_GAZBOX_VISIBLE',
}


///INITIAL STATE
const initialState = {
    width: null,
    height: null,
    helpTextVisible: true,
    gazeteerBoxInfoText: "Geben Sie einen Suchbegriff ein. XXX",
    gazeteerBoxVisible: true,
    gazetteerBoxEnabled: false,

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
        case types.SET_GAZBOX_ENABLED:
         {
           newState = objectAssign({}, state);
           newState.gazetteerBoxEnabled = action.enabled;
           return newState;
         }
         case types.SET_GAZBOX_INFO_TEXT:
          {
            newState = objectAssign({}, state);
            newState.gazeteerBoxInfoText = action.infoText;
            return newState;
          }
          case types.SET_GAZBOX_VISIBLE:
           {
             newState = objectAssign({}, state);
             newState.gazeteerBoxVisible = action.visible;
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


function setGazetteerBoxEnabled(enabled) {
    return {
        type: types.SET_GAZBOX_ENABLED,
        enabled
    };
}

function setGazetteerBoxInfoText(infoText) {
    return {
        type: types.SET_GAZBOX_INFO_TEXT,
        infoText
    };
}

function setGazetteerBoxVisible(visible) {
    return {
        type: types.SET_GAZBOX_VISIBLE,
        visible
    };
}
//COMPLEXACTIONS

//EXPORT ACTIONS
export const actions = {
    screenResize,
    showHelpComponent,
    setGazetteerBoxEnabled,
    setGazetteerBoxInfoText,
    setGazetteerBoxVisible
};
