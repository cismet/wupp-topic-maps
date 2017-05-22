
export default {
  kassenzeichen: {
    id: -1
  },
  mapping: {
    featureCollection: [],
    selectedIndex: null,
    boundingBox: null,
    autoFitBoundsTarget: null,
    autoFitBounds: false
  },
  uiState: {
    width: null,
    height: null,
    infoElementsEnabled: true,
    chartElementsEnabled: true,
    kanalElementsEnabled: false,
    filterElementEnabled: false,
    detailElementsEnabled: true,

    user: null,
    password: null,
    succesfullLogin: false,
    loginInProgress: false,

    settingsVisible: false,

    waitingVisible: false,
    waitingMessage: null,
    waitingUIAnimation: true,

    layers: [{
        key: "osm",
        opacity: 1,
        enabled: false
      },
      {
        key: "abkIntra",
        opacity: 1,
        enabled: true
      },
      {
        key: "orthoIntra",
        opacity: 0.6,
        enabled: true
      }
    ],
  }
};
