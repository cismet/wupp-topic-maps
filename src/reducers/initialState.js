
export default {
  kassenzeichen: {
    id: -1
  },
  mapping: {
    featureCollection: [],
    bounds: null,
    boundsFittingEnabled: false
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
        key: "Osm",
        opacity: 1,
        enabled: false
      },
      {
        key: "StadtgrundKarteABK",
        opacity: 1,
        enabled: true
      },
      {
        key: "Ortho2014",
        opacity: 0.6,
        enabled: false
      }
    ],
  }
};
