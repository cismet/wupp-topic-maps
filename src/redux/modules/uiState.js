import objectAssign from 'object-assign';

///TYPES
export const types = {
  SCREEN_RESIZE: 'UISTATE/SCREEN_RESIZE',
  SHOW_APPLICATION_MENU: 'UISTATE/SHOW_APPLICATION_MENU',
  SET_GAZBOX_ENABLED: 'UISTATE/SET_GAZBOX_ENABLED',
  SET_GAZBOX_INFO_TEXT: 'UISTATE/SET_GAZBOX_INFO_TEXT',
  SET_GAZBOX_VISIBLE: 'UISTATE/SET_GAZBOX_VISIBLE',
  SET_APPLICATION_MENU_ACTIVE_KEY: 'UISTATE/SET_APPLICATION_MENU_ACTIVE_KEY',
  SET_LIGHTBOX_VISIBLE: 'UISTATE/SET_LIGHTBOX_VISIBLE',
  SET_LIGHTBOX_INDEX: 'UISTATE/SET_LIGHTBOX_INDEX',
  SET_LIGHTBOX_URLS: 'UISTATE/SET_LIGHTBOX_URLS',
  SET_LIGHTBOX_TITLE: 'UISTATE/SET_LIGHTBOX_TITLE',
  SET_LIGHTBOX_CAPTION: 'UISTATE/SET_LIGHTBOX_CAPTION'
};

///INITIAL STATE
const initialState = {
  width: null,
  height: null,
  applicationMenuVisible: false,
  applicationMenuActiveKey: null,
  gazeteerBoxInfoText: 'Geben Sie einen Suchbegriff ein. XXX',
  gazeteerBoxVisible: true,
  gazetteerBoxEnabled: false,
  lightboxurls: [
    'http://www.fotokraemer-wuppertal.de/images/Schloss%20Luentenbeck-016-02-24-004%20(1).jpg',
    'http://www.fotokraemer-wuppertal.de/images/Schloss%20Luentenbeck-016-02-24-005.jpg',
    'http://www.fotokraemer-wuppertal.de/images/Schloss%20Luentenbeck-016-02-24-001.jpg',
    'http://www.fotokraemer-wuppertal.de/images/Schloss%20Luentenbeck-016-02-24-003.jpg',
    'http://www.fotokraemer-wuppertal.de/images/Schloss%20Luentenbeck-016-02-24-009%20(1).jpg'
  ],
  lightboxindex: 0,
  lightboxvisible: false,
  lightboxcaption: null,
  lightboxtitle: null
};

///REDUCER
export default function uiStateReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case types.SCREEN_RESIZE: {
      newState = objectAssign({}, state);
      newState.width = action.width;
      newState.height = action.height;
      return newState;
    }
    case types.SHOW_APPLICATION_MENU: {
      newState = objectAssign({}, state);
      newState.applicationMenuVisible = action.applicationMenuVisible;
      return newState;
    }

    case types.SET_GAZBOX_ENABLED: {
      newState = objectAssign({}, state);
      newState.gazetteerBoxEnabled = action.enabled;
      return newState;
    }
    case types.SET_GAZBOX_INFO_TEXT: {
      newState = objectAssign({}, state);
      newState.gazeteerBoxInfoText = action.infoText;
      return newState;
    }
    case types.SET_GAZBOX_VISIBLE: {
      newState = objectAssign({}, state);
      newState.gazeteerBoxVisible = action.visible;
      return newState;
    }
    case types.SET_APPLICATION_MENU_ACTIVE_KEY: {
      newState = objectAssign({}, state);
      newState.applicationMenuActiveKey = action.key;
      return newState;
    }
    case types.SET_LIGHTBOX_VISIBLE: {
      newState = objectAssign({}, state);
      newState.lightboxvisible = action.visible || false;
      return newState;
    }
    case types.SET_LIGHTBOX_INDEX: {
      newState = objectAssign({}, state);
      newState.lightboxindex = action.index || 0;
      return newState;
    }
    case types.SET_LIGHTBOX_URLS: {
      newState = objectAssign({}, state);
      newState.lightboxurls = action.urls || [];
      return newState;
    }
    case types.SET_LIGHTBOX_TITLE: {
      newState = objectAssign({}, state);
      newState.lightboxtitle = action.title;
      return newState;
    }
    case types.SET_LIGHTBOX_CAPTION: {
      newState = objectAssign({}, state);
      newState.lightboxcaption = action.caption;
      return newState;
    }
    default:
      return state;
  }
}

///SIMPLEACTIONCREATORS
function screenResize(height, width) {
  return {
    type: types.SCREEN_RESIZE,
    width: width,
    height: height
  };
}
function showApplicationMenu(applicationMenuVisible) {
  return {
    type: types.SHOW_APPLICATION_MENU,
    applicationMenuVisible
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
function setApplicationMenuActiveKey(key) {
  return {
    type: types.SET_APPLICATION_MENU_ACTIVE_KEY,
    key
  };
}
function setLightboxVisible(visible) {
  return {
    type: types.SET_LIGHTBOX_VISIBLE,
    visible
  };
}
function setLightboxIndex(index) {
  return {
    type: types.SET_LIGHTBOX_INDEX,
    index
  };
}
function setLightboxUrls(urls) {
  return {
    type: types.SET_LIGHTBOX_URLS,
    urls
  };
}
function setLightboxTitle(title) {
  return {
    type: types.SET_LIGHTBOX_TITLE,
    title
  };
}
function setLightboxCaption(caption) {
  return {
    type: types.SET_LIGHTBOX_CAPTION,
    caption
  };
}

//COMPLEXACTIONS

function showApplicationMenuAndActivateSection(applicationMenuVisible, section) {
  return (dispatch, getState) => {
    dispatch(setApplicationMenuActiveKey(section));
    dispatch(showApplicationMenu(applicationMenuVisible));
  };
}

//EXPORT ACTIONS
export const actions = {
  screenResize,
  showApplicationMenu,
  setGazetteerBoxEnabled,
  setGazetteerBoxInfoText,
  setGazetteerBoxVisible,
  setApplicationMenuActiveKey,
  showApplicationMenuAndActivateSection,
  setLightboxVisible,
  setLightboxIndex,
  setLightboxUrls,
  setLightboxTitle,
  setLightboxCaption
};
