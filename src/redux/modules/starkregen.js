import objectAssign from 'object-assign';

import { proj4crs25832def } from '../../constants/gis';
import proj4 from 'proj4';

//TYPES
export const types = {
  SET_SIMULATION: 'STARKREGEN/SET_SIMULATION',
  SET_SELECTED_BACKGROUND: 'STARKREGEN/SET_SELECTED_BACKGROUND',
  SET_BACKGROUND_LAYER: 'STARKREGEN/SET_BACKGROUND_LAYER',
  SET_MINIFIED_INFO_BOX: 'STARKREGEN/SET_MINIFIED_INFO_BOX',
  SET_FEATUREINFOMODE_ACTIVATION: 'STARKREGEN/SET_FEATUREINFOMODE_ACTIVATION',
  SET_FEATUREOINFO_VALUE: 'STARKREGEN/SET_FEATUREOINFO_VALUE',
  SET_FEATUREOINFO_POSITION: 'STARKREGEN/SET_FEATUREOINFO_POSITION',
  SET_FEATUREOINFO_SIMULATION: 'STARKREGEN/SET_FEATUREOINFO_SIMULATION',
  SET_MODELLAYERPROBLEM_STATUS: 'STARKREGEN/SET_MODELLAYERPROBLEM_STATUS',
  SET_ANIMATION_ENABLED: 'STARKREGEN/SET_ANIMATION_ENABLED',
  SET_LOADING_ANIMATION_DATA: 'STARKREGEN/SET_LOADING_ANIMATION_DATA',
  SET_DISPLAY_MODE: 'STARKREGEN/SET_DISPLAY_MODE',
};

export const constants = { SHOW_VELOCITY: 'SHOW_VELOCITY', SHOW_HEIGHTS: 'SHOW_HEIGHTS' };

///INITIAL STATE
export const initialState = {
  displayMode: constants.SHOW_HEIGHT,
  modelLayerProblem: false,
  featureInfoModeActivated: false,
  currentFeatureInfoValue: undefined,
  currentFeatureInfoSelectedSimulation: undefined,
  currentFeatureInfoPosition: undefined,
  minifiedInfoBox: false,
  selectedSimulation: 0,
  backgroundLayer: undefined,
  selectedBackground: 0,
  animationEnabled: true,
  simulations: [
    {
      layer: 'starkregen:S11_T50_depth',
      velocityLayer: 'starkregen:S11_T50_velocity',
      directionsLayer: 'starkregen:S11_T50_direction',
      animation: '11_T50/',
      name: 'Stärke 6',
      title: 'Starkregen SRI 6 (38,5 l/m² in 2h)',
      icon: 'bar-chart',
      subtitle:
        'Simulation eines zweistündigen Starkregens mit 38,5 Liter/m² Niederschlag (Starkregenindex SRI 6) in ganz Wuppertal, statistische Wiederkehrzeit 50 Jahre',
    },
    {
      layer: 'starkregen:S12_T100_depth',
      velocityLayer: 'starkregen:S12_T100_velocity',
      directionsLayer: 'starkregen:S12_T100_direction',
      animation: '12_T100/',
      name: 'Stärke 7',
      icon: 'bar-chart',
      title: 'Starkregen SRI 7 (42 l/m² in 2h)',
      subtitle:
        'Simulation eines zweistündigen Starkregens mit 42 Liter/m² Niederschlag (Starkregenindex SRI 7) in ganz Wuppertal, statistische Wiederkehrzeit 100 Jahre',
    },
    {
      layer: 'starkregen:S13_hN90mm_depth',
      velocityLayer: 'starkregen:S13_hN90mm_velocity',
      directionsLayer: 'starkregen:S13_hN90mm_direction',
      animation: '13_hN90mm/',
      name: 'Stärke 10',
      icon: 'bitbucket',
      title: 'Starkregen SRI 10 (90 l/m² in 1h)',
      subtitle:
        'Simulation eines einstündigen Starkregens mit 90 Liter/m² Niederschlag (Starkregenindex SRI 10) in ganz Wuppertal',
    },
    {
      layer: 'starkregen:S14_Naturregen_depth',
      velocityLayer: 'starkregen:S14_Naturregen_velocity',
      directionsLayer: 'starkregen:S14_Naturregen_direction',
      animation: '14_Naturregen/',
      name: '29.05.18',
      icon: 'calendar',
      title: 'Regen vom 29.05.2018 (SRI 11)',
      subtitle:
        'Simulation des Starkregens vom 29.05.2018 (Starkregenindex SRI 11) für das gesamte Stadtgebiet anhand gemessener Niederschlagsmengen',
    },
  ],
  backgrounds: [
    {
      layerkey: 'hillshade|bplan_abkg@30|wupp-plan-live@20',
      src: '/images/rain-hazard-map-bg/topo.png',
      title: 'Top. Karte',
    },
    {
      layerkey: 'trueOrtho2020@50|rvrSchrift@100|wupp-plan-live@20',
      src: '/images/rain-hazard-map-bg/ortho.png',
      title: 'Luftbildkarte',
    },
    {
      layerkey: 'wupp-plan-live@40',
      src: '/images/rain-hazard-map-bg/citymap.png',
      title: 'Stadtplan',
    },
  ],
  backgroundsCached: [
    {
      layerkey: 'hillshadeCached|bplan_abkg@30 ',
      src: '/images/rain-hazard-map-bg/topo.png',
      title: 'Top. Karte',
    },
    {
      layerkey: 'trueOrtho2020Cached@50|rvrSchrift@100',
      src: '/images/rain-hazard-map-bg/ortho.png',
      title: 'Luftbildkarte',
    },
    {
      layerkey: 'wupp-plan-live@40',
      src: '/images/rain-hazard-map-bg/citymap.png',
      title: 'Stadtplan',
    },
  ],
  heightsLegend: [
    { title: '20 cm', lt: 0.1, bg: '#AFCFF9' },
    { title: '40 cm', lt: 0.3, bg: '#FED27B' },
    { title: '75 cm', lt: 0.5, bg: '#E9B279' },
    { title: '100 cm', lt: 1.0, bg: '#DD8C7B' },
  ],
  velocityLegend: [
    { title: '0.5 m/s', lt: 0.1, bg: '#BEC356' },
    { title: '2 m/s', lt: 1, bg: '#DA723E' },
    { title: '4 m/s', lt: 3, bg: '#D64733' },
    { title: '6 m/s', lt: 5, bg: '#8F251B' },
  ],
  isLoadingAnimationData: false,
};
///REDUCER
export default function starkregenReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case types.SET_SIMULATION: {
      newState = objectAssign({}, state);
      newState.selectedSimulation = action.simulation;
      return newState;
    }
    case types.SET_SELECTED_BACKGROUND: {
      newState = objectAssign({}, state);
      newState.selectedBackground = action.backgroundIndex;
      return newState;
    }
    case types.SET_BACKGROUND_LAYER: {
      newState = objectAssign({}, state);
      newState.backgroundLayer = action.layer;
      return newState;
    }
    case types.SET_MINIFIED_INFO_BOX: {
      newState = objectAssign({}, state);
      newState.minifiedInfoBox = action.minified;
      return newState;
    }
    case types.SET_FEATUREINFOMODE_ACTIVATION: {
      newState = objectAssign({}, state);
      newState.featureInfoModeActivated = action.activated;
      return newState;
    }
    case types.SET_FEATUREOINFO_VALUE: {
      newState = objectAssign({}, state);
      newState.currentFeatureInfoValue = action.value;
      return newState;
    }
    case types.SET_FEATUREOINFO_POSITION: {
      newState = objectAssign({}, state);
      newState.currentFeatureInfoPosition = action.position;
      return newState;
    }
    case types.SET_FEATUREOINFO_SIMULATION: {
      newState = objectAssign({}, state);
      newState.currentFeatureInfoSelectedSimulation = action.simulation;
      return newState;
    }
    case types.SET_MODELLAYERPROBLEM_STATUS: {
      newState = objectAssign({}, state);
      newState.modelLayerProblem = action.modelLayerProblem;
      return newState;
    }
    case types.SET_ANIMATION_ENABLED: {
      newState = objectAssign({}, state);
      newState.animationEnabled = action.animationEnabled;
      return newState;
    }
    case types.SET_LOADING_ANIMATION_DATA: {
      newState = objectAssign({}, state);
      newState.isLoadingAnimationData = action.isLoadingAnimationData;
      return newState;
    }
    case types.SET_DISPLAY_MODE: {
      newState = objectAssign({}, state);
      newState.displayMode = action.displayMode;
      newState.currentFeatureInfoValue = undefined;
      newState.featureInfoModeActivated = false;
      newState.currentFeatureInfoPosition = undefined;
      return newState;
    }
    default:
      return state;
  }
}

///SIMPLEACTIONCREATORS
function setSelectedSimulation(simulation) {
  return { type: types.SET_SIMULATION, simulation };
}
function setSelectedBackground(backgroundIndex) {
  return { type: types.SET_SELECTED_BACKGROUND, backgroundIndex };
}
function setBackgroundLayer(layers) {
  return { type: types.SET_BACKGROUND_LAYER, layers };
}
function setMinifiedInfoBox(minified) {
  return { type: types.SET_MINIFIED_INFO_BOX, minified };
}
function setFeatureInfoModeActivation(activated) {
  return { type: types.SET_FEATUREINFOMODE_ACTIVATION, activated };
}
function setCurrentFeatureInfoValue(value) {
  return { type: types.SET_FEATUREOINFO_VALUE, value };
}
function setCurrentFeatureInfoPosition(position) {
  return { type: types.SET_FEATUREOINFO_POSITION, position };
}
function setCurrentFeaturSelectedSimulation(simulation) {
  return { type: types.SET_FEATUREOINFO_SIMULATION, simulation };
}
function setModelLayerProblemStatus(modelLayerProblem) {
  return { type: types.SET_MODELLAYERPROBLEM_STATUS, modelLayerProblem };
}
function setAnimationEnabled(animationEnabled) {
  return { type: types.SET_ANIMATION_ENABLED, animationEnabled };
}
function setLoadingAnimationData(isLoadingAnimationData) {
  return { type: types.SET_LOADING_ANIMATION_DATA, isLoadingAnimationData };
}
function setDisplayMode(displayMode) {
  return { type: types.SET_DISPLAY_MODE, displayMode };
}
//COMPLEXACTIONS

function setSimulation(simulation) {
  return (dispatch, getState) => {
    let localState = getState().starkregen;
    dispatch(setSelectedSimulation(simulation));
    if (localState.featureInfoModeActivated) {
      dispatch(getFeatureInfo());
    }
  };
}

function getFeatureInfo(mapEvent) {
  return (dispatch, getState) => {
    let localState = getState().starkregen;
    let pos;
    if (!mapEvent) {
      if (
        localState.currentFeatureInfoPosition &&
        localState.currentFeatureInfoSelectedSimulation !== localState.selectedSimulation
      ) {
        pos = localState.currentFeatureInfoPosition;
      } else {
        return;
      }
    } else {
      pos = proj4(proj4.defs('EPSG:4326'), proj4crs25832def, [
        mapEvent.latlng.lng,
        mapEvent.latlng.lat,
      ]);
    }
    if (localState.displayMode === constants.SHOW_HEIGHTS) {
      const minimalBoxSize = 0.0001;
      const selectedSimulation = localState.simulations[localState.selectedSimulation].layer;
      const getFetureInfoRequestUrl =
        `https://starkregen-maps-wuppertal.cismet.de/geoserver/wms?` +
        `service=WMS&request=GetFeatureInfo&` +
        `format=image%2Fpng&transparenttrue&` +
        `version=1.1.1&tiled=true&` +
        `width=1&height=1&srs=EPSG%3A25832&` +
        `bbox=` +
        `${pos[0] - minimalBoxSize},` +
        `${pos[1] - minimalBoxSize},` +
        `${pos[0] + minimalBoxSize},` +
        `${pos[1] + minimalBoxSize}&` +
        `x=0&y=0&` +
        `layers=${selectedSimulation}&` +
        `QUERY_LAYERS=${selectedSimulation}&` +
        `INFO_FORMAT=application/vnd.ogc.gml`;
      let valueKey = 'starkregen:depth';
      if (/Edge/.test(navigator.userAgent)) {
        valueKey = 'value';
      }
      fetch(getFetureInfoRequestUrl)
        .then((response) => {
          if (response.ok) {
            return response.text();
          } else {
            throw new Error("Server response wasn't OK");
          }
        })
        .then((data) => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, 'text/xml');
          const value = parseFloat(xmlDoc.getElementsByTagName(valueKey)[0].textContent, 10);

          dispatch(setCurrentFeaturSelectedSimulation(localState.selectedSimulation));
          dispatch(setCurrentFeatureInfoValue(value));

          dispatch(setCurrentFeatureInfoPosition(pos));
        })
        .catch((error) => {
          console.log('error during fetch', error);
        });
    } else {
      const minimalBoxSize = 0.0001;
      const selectedSimulation =
        localState.simulations[localState.selectedSimulation].velocityLayer;

      const getFetureInfoRequestUrl =
        //https://starkregen-maps.cismet.de/geoserver/wms?
        // SERVICE=WMS&&VERSION=1.1.1&REQUEST=GetFeatureInfo&
        // BBOX=370755.2616521128,5681738.694328977,370860.33397403057,5681799.102881027&
        // WIDTH=981&HEIGHT=564&SRS=EPSG:25832&
        // FORMAT=image/png&TRANSPARENT=TRUE&BGCOLOR=0xF0F0F0&EXCEPTIONS=application/vnd.ogc.se_xml&
        // FEATURE_COUNT=99&
        // LAYERS=starkregen:S6_velocity&
        // STYLES=starkregen%3Avelocity&
        // QUERY_LAYERS=starkregen:S6_velocity&
        // INFO_FORMAT=application/json&X=618&Y=227
        `https://starkregen-maps.cismet.de/geoserver/wms?` +
        `SERVICE=WMS&&VERSION=1.1.1&REQUEST=GetFeatureInfo&` +
        `format=image%2Fpng&transparenttrue&` +
        `version=1.1.1&tiled=true&` +
        `width=1&height=1&srs=EPSG%3A25832&` +
        `bbox=` +
        `${pos[0] - minimalBoxSize},` +
        `${pos[1] - minimalBoxSize},` +
        `${pos[0] + minimalBoxSize},` +
        `${pos[1] + minimalBoxSize}&` +
        `x=0&y=0&` +
        `layers=${selectedSimulation}&` +
        `QUERY_LAYERS=${selectedSimulation}&` +
        `INFO_FORMAT=application/vnd.ogc.gml`;

      let valueKey = 'starkregen:velocity';
      if (/Edge/.test(navigator.userAgent)) {
        valueKey = 'value';
      }

      fetch(getFetureInfoRequestUrl)
        .then((response) => {
          if (response.ok) {
            return response.text();
          } else {
            throw new Error("Server response wasn't OK");
          }
        })
        .then((data) => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, 'text/xml');
          const value = parseFloat(xmlDoc.getElementsByTagName(valueKey)[0].textContent, 10);
          dispatch(setCurrentFeaturSelectedSimulation(localState.selectedSimulation));
          dispatch(setCurrentFeatureInfoValue(value));

          dispatch(setCurrentFeatureInfoPosition(pos));
        })
        .catch((error) => {
          console.log('error during fetch', error);
        });
    }
  };
}

//EXPORT ACTIONS
export const actions = {
  setSimulation,
  setSelectedBackground,
  setBackgroundLayer,
  setMinifiedInfoBox,
  setFeatureInfoModeActivation,
  setCurrentFeatureInfoValue,
  setCurrentFeatureInfoPosition,
  getFeatureInfo,
  setModelLayerProblemStatus,
  setAnimationEnabled,
  setLoadingAnimationData,
  setDisplayMode,
};

//HELPER FUNCTIONS
