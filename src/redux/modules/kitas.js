import objectAssign from "object-assign";
import { actions as mappingActions } from "./mapping";
import kdbush from "kdbush";
import queryString from "query-string";

//TYPES
export const types = {
  SET_KITAS: "KITAS/SET_KITAS",
  SET_KITA_GAZ_HIT: "KITAS/SET_KITA_GAZ_HIT",
  CLEAR_KITA_GAZ_HIT: "KITAS/CLEAR_KITA_GAZ_HIT",
  SET_FILTERED_KITAS: "KITAS/SET_FILTERED_KITAS",
  SET_FILTER: "KITAS/SET_FILTER",
  SET_SVG_SIZE: "KITAS/SET_SVG_SIZE",
  SET_FEATURE_RENDERING: "KITAS/SET_FEATURE_RENDERING"
};

export const constants = {
  TRAEGERTYP_ANDERE: "KITAS/CONSTS/TRAEGERTYP_ANDERE",
  TRAEGERTYP_BETRIEBSKITA: "KITAS/CONSTS/TRAEGERTYP_BETRIEBSKITA",
  TRAEGERTYP_STAEDTISCH: "KITAS/CONSTS/TRAEGERTYP_STAEDTISCH",
  TRAEGERTYP_ELTERNINITIATIVE: "KITAS/CONSTS/TRAEGERTYP_ELTERNINITIATIVE",
  TRAEGERTYP_EVANGELISCH: "KITAS/CONSTS/TRAEGERTYP_EVANGELISCH",
  TRAEGERTYP_KATHOLISCH: "KITAS/CONSTS/TRAEGERTYP_KATHOLISCH",
  ALTER_UNTER2: "KITAS/CONSTS/ALTER_UNTER2",
  ALTER_AB2: "KITAS/CONSTS/ALTER_AB2",
  ALTER_AB3: "KITAS/CONSTS/ALTER_AB3",
  STUNDEN_NUR_35: "KITAS/CONSTS/STUNDEN_NUR_35",
  STUNDEN_NUR_35_u_45: "KITAS/CONSTS/STUNDEN_NUR_35_u_45",
  STUNDEN_NUR_45: "KITAS/CONSTS/STUNDEN_NUR_45",
  PROFIL_INKLUSION: "KITAS/CONSTS/PROFIL_INKLUSION",
  PROFIL_NORMAL: "KITAS/CONSTS/PROFIL_NORMAL",
  STUNDEN_FILTER_35: "KITAS/CONSTS/STUNDEN_FILTER_35",
  STUNDEN_FILTER_45: "KITAS/CONSTS/STUNDEN_FILTER_45",
  FEATURE_RENDERING_BY_PROFIL: "KITAS/CONSTS/FEATURE_RENDERING_BY_PROFIL",
  FEATURE_RENDERING_BY_TRAEGERTYP: "KITAS/CONSTS/FEATURE_RENDERING_BY_TRAEGERTYP",
  TRAEGERTEXT: {},
  TRAEGERTEXT_FOR_DESCRIPTION: {}
};

constants.TRAEGERTYP = [
  constants.TRAEGERTYP_ANDERE,
  constants.TRAEGERTYP_BETRIEBSKITA,
  constants.TRAEGERTYP_STAEDTISCH,
  constants.TRAEGERTYP_ELTERNINITIATIVE,
  constants.TRAEGERTYP_EVANGELISCH,
  constants.TRAEGERTYP_KATHOLISCH
];
constants.ALTER = [constants.ALTER_UNTER2, constants.ALTER_AB2, constants.ALTER_AB3];
constants.STUNDEN = [
  constants.STUNDEN_NUR_35,
  constants.STUNDEN_NUR_35_u_45,
  constants.STUNDEN_NUR_45
];

constants.TRAEGERTEXT[constants.TRAEGERTYP_ANDERE] = "andere freie Träger";
constants.TRAEGERTEXT[constants.TRAEGERTYP_BETRIEBSKITA] = "Betrieb";
constants.TRAEGERTEXT[constants.TRAEGERTYP_STAEDTISCH] = "städtisch";
constants.TRAEGERTEXT[constants.TRAEGERTYP_ELTERNINITIATIVE] = "Elterninitiative";
constants.TRAEGERTEXT[constants.TRAEGERTYP_EVANGELISCH] = "evangelisch";
constants.TRAEGERTEXT[constants.TRAEGERTYP_KATHOLISCH] = "katholisch";

constants.TRAEGERTEXT_FOR_DESCRIPTION[constants.TRAEGERTYP_ANDERE] =
  "andere Einrichtungen in freier Trägerschaft";
constants.TRAEGERTEXT_FOR_DESCRIPTION[constants.TRAEGERTYP_BETRIEBSKITA] = "Betriebskitas";
constants.TRAEGERTEXT_FOR_DESCRIPTION[constants.TRAEGERTYP_STAEDTISCH] = "städtische Einrichtungen";
constants.TRAEGERTEXT_FOR_DESCRIPTION[constants.TRAEGERTYP_ELTERNINITIATIVE] = "Elterninitiativen";
constants.TRAEGERTEXT_FOR_DESCRIPTION[constants.TRAEGERTYP_EVANGELISCH] =
  "evangelische Einrichtungen";
constants.TRAEGERTEXT_FOR_DESCRIPTION[constants.TRAEGERTYP_KATHOLISCH] =
  "katholische Einrichtungen";

///INITIAL STATE
const initialState = {
  kitas: [],
  kitaGazHitId: null,
  kitasMD5: "",
  filteredKitas: [],
  filteredKitasIndex: null,
  filter: {
    profil: [constants.PROFIL_NORMAL, constants.PROFIL_INKLUSION],
    alter: [constants.ALTER_AB3],
    umfang: [constants.STUNDEN_FILTER_35, constants.STUNDEN_FILTER_45],
    traeger: [
      constants.TRAEGERTYP_ANDERE,
      constants.TRAEGERTYP_BETRIEBSKITA,
      constants.TRAEGERTYP_STAEDTISCH,
      constants.TRAEGERTYP_ELTERNINITIATIVE,
      constants.TRAEGERTYP_EVANGELISCH,
      constants.TRAEGERTYP_KATHOLISCH
    ]
  },
  kitaSvgSize: 35,
  featureRendering: constants.FEATURE_RENDERING_BY_TRAEGERTYP
};
///REDUCER
export default function kitaReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case types.SET_KITAS: {
      newState = objectAssign({}, state);
      newState.kitas = action.kitas;
      newState.kitasMD5 = action.kitasMD5;
      return newState;
    }
    case types.SET_KITA_GAZ_HIT: {
      newState = objectAssign({}, state);
      newState.kitaGazHitId = action.hitId;
      return newState;
    }
    case types.CLEAR_KITA_GAZ_HIT: {
      newState = objectAssign({}, state);
      newState.kitaGazHitId = null;
      return newState;
    }
    case types.SET_FILTERED_KITAS: {
      newState = objectAssign({}, state);
      newState.filteredKitas = action.filteredKitas;
      newState.filteredKitasIndex = kdbush(
        action.filteredKitas,
        p => p.geojson.coordinates[0],
        p => p.geojson.coordinates[1]
      );
      return newState;
    }
    case types.SET_FILTER: {
      newState = objectAssign({}, state);
      newState.filter = action.filter;
      return newState;
    }
    case types.SET_SVG_SIZE: {
      newState = objectAssign({}, state);
      newState.kitaSvgSize = action.size;
      return newState;
    }
    case types.SET_FEATURE_RENDERING: {
      newState = objectAssign({}, state);
      newState.featureRendering = action.rendering;
      return newState;
    }
    default:
      return state;
  }
}

///SIMPLEACTIONCREATORS
function setKitas(kitas, kitasMD5) {
  return { type: types.SET_KITAS, kitas, kitasMD5 };
}
function setKitasGazHit(hitId) {
  return { type: types.SET_POI_GAZ_HIT, hitId };
}
function clearKitasGazHit() {
  return { type: types.SET_KITA_GAZ_HIT };
}
function setFilteredKitas(filteredKitas) {
  return { type: types.SET_FILTERED_KITAS, filteredKitas };
}

function setFilter(filter) {
  return { type: types.SET_FILTER, filter };
}
function setSvgSize(size) {
  return { type: types.SET_SVG_SIZE, size };
}
function setFeatureRendering(rendering) {
  return { type: types.SET_FEATURE_RENDERING, rendering };
}
//COMPLEXACTIONS

function setSelectedKita(kid) {
  return (dispatch, getState) => {
    let state = getState();
    let kitaFeature = state.mapping.featureCollection.find(x => x.id === kid);
    if (kitaFeature) {
      dispatch(mappingActions.setSelectedFeatureIndex(kitaFeature.index));
      dispatch(clearKitasGazHit());
    } else {
      dispatch(setKitasGazHit(kitaFeature.index));
    }
  };
}

function loadKitas() {
  return (dispatch, getState) => {
    let md5 = null;
    let currentKita = null;
    const state = getState();
    let noCacheHeaders = new Headers();
    noCacheHeaders.append("pragma", "no-cache");
    noCacheHeaders.append("cache-control", "no-cache");

    const manualReloadRequested =
      queryString.parse(state.routing.location.search).alwaysRefreshKitasOnReload !== undefined;

    return fetch("/kitas/kitas.data.json.md5", {
      method: "get",
      headers: noCacheHeaders
    })
      .then(response => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error("Server md5 response wasn't OK");
        }
      })
      .then(md5value => {
        md5 = md5value.trim();
        if (manualReloadRequested) {
          console.log("Fetch Kitas because of alwaysRefreshKitasOnReload Parameter");
          return "fetchit";
        }

        if (md5 === state.kitas.kitasMD5 && constants.DEBUG_ALWAYS_LOADING === false) {
          dispatch(applyFilter());
          dispatch(createFeatureCollectionFromKitas());
          throw "CACHEHIT";
        } else {
          return "fetchit";
        }
      })
      .then(fetchit => {
        return fetch("/kitas/kitas.data.json", {
          method: "get",
          headers: noCacheHeaders
        });
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Server kitas/data response wasn't OK");
        }
      })
      .then(data => {
        dispatch(setKitas(data, md5));
        dispatch(applyFilter());
        dispatch(createFeatureCollectionFromKitas());
      })
      .catch(function(err) {
        if (err !== "CACHEHIT") {
          console.log("Problem during KitasLoading");
          console.log(currentKita);
          console.log(err);
        }
      });
  };
}

function resetFilter(kind) {
  return dispatch => {
    let filterState = JSON.parse(JSON.stringify(initialState.filter));
    dispatch(setFilterAndApply(filterState));
  };
}

function addFilterFor(kind, item) {
  return (dispatch, getState) => {
    let state = getState();
    let filterState = JSON.parse(JSON.stringify(state.kitas.filter));
    if (filterState[kind].indexOf(item) === -1) {
      filterState[kind].push(item);
    }
    dispatch(setFilterAndApply(filterState));
  };
}

function removeFilterFor(kind, item) {
  return (dispatch, getState) => {
    let state = getState();
    let filterState = JSON.parse(JSON.stringify(state.kitas.filter));
    if (filterState[kind].indexOf(item) !== -1) {
      let filterStateSet = new Set(filterState[kind]);
      filterStateSet.delete(item);
      filterState[kind] = Array.from(filterStateSet);
    }
    dispatch(setFilterAndApply(filterState));
  };
}

function setFilterAndApply(filter) {
  return dispatch => {
    dispatch(setFilter(filter));
    dispatch(applyFilter());
  };
}

function applyFilter() {
  return (dispatch, getState) => {
    const state = getState();
    const filter = state.kitas.filter;
    let filteredKitas = [];
    let filteredKitaSet = new Set(); //avoid duplicates

    for (let kita of state.kitas.kitas) {
      //profil
      if (
        filter.profil.indexOf(constants.PROFIL_INKLUSION) !== -1 &&
        hasInklusionsSchwerpunkt(kita)
      ) {
        filteredKitaSet.add(kita);
      }
      if (
        filter.profil.indexOf(constants.PROFIL_NORMAL) !== -1 &&
        !hasInklusionsSchwerpunkt(kita)
      ) {
        filteredKitaSet.add(kita);
      }

      //traeger
      const kitaTraeger = constants.TRAEGERTYP[kita.traegertyp];
      if (filter.traeger.indexOf(kitaTraeger) === -1) {
        filteredKitaSet.delete(kita);
      }
      //alter
      if (filter.alter.indexOf(constants.ALTER_UNTER2) !== -1 && !isAlterUnter2(kita)) {
        filteredKitaSet.delete(kita);
        continue;
      }
      if (filter.alter.indexOf(constants.ALTER_AB2) !== -1 && !isAlterAb2(kita)) {
        filteredKitaSet.delete(kita);
        continue;
      }
      if (filter.alter.indexOf(constants.ALTER_AB3) !== -1 && !isAlterAb3(kita)) {
        filteredKitaSet.delete(kita);
        continue;
      }

      //umfang
      const chk45h = filter.umfang.indexOf(constants.STUNDEN_FILTER_45) !== -1;
      const chk35h = filter.umfang.indexOf(constants.STUNDEN_FILTER_35) !== -1;

      if (chk45h && chk35h) {
        continue;
      } else if (chk45h && !isAvailableFor45h(kita)) {
        filteredKitaSet.delete(kita);
        continue;
      } else if (chk35h && !isAvailableFor35h(kita)) {
        filteredKitaSet.delete(kita);
        continue;
      } else if (!chk35h && !chk45h) {
        filteredKitaSet.delete(kita);
        continue;
      }
    }

    filteredKitas = Array.from(filteredKitaSet);
    dispatch(setFilteredKitas(filteredKitas));
    dispatch(createFeatureCollectionFromKitas());
  };
}
function refreshFeatureCollection() {
  return (dispatch, getState) => {
    dispatch(applyFilter());
  };
}

function createFeatureCollectionFromKitas(boundingBox) {
  return (dispatch, getState) => {
    let state = getState();
    if (state.kitas.filteredKitasIndex) {
      let currentSelectedFeature = {
        id: -1
      };
      if (state.mapping.selectedIndex !== null && state.mapping.selectedIndex >= 0) {
        currentSelectedFeature = state.mapping.featureCollection[state.mapping.selectedIndex];
      } else {
        //          console.log("selectedIndex not set");
      }
      let bb;
      if (boundingBox) {
        bb = boundingBox;
      } else {
        bb = state.mapping.boundingBox;
      }

      let resultIds = state.kitas.filteredKitasIndex.range(bb.left, bb.bottom, bb.right, bb.top);
      let resultFC = [];
      let counter = 0;
      let results = [];

      for (let id of resultIds) {
        results.push(state.kitas.filteredKitas[id]);
      }

      results.sort((a, b) => {
        if (a.geojson.coordinates[1] === b.geojson.coordinates[1]) {
          return a.geojson.coordinates[0] - b.geojson.coordinates[0];
        } else {
          return b.geojson.coordinates[1] - a.geojson.coordinates[1];
        }
      });

      let selectionWish = 0;
      for (let kita of results) {
        let kitaFeature = convertKitaToFeature(kita, counter);
        resultFC.push(kitaFeature);

        if (kitaFeature.id === currentSelectedFeature.id) {
          selectionWish = kitaFeature.index;
        }
        counter++;
      }

      dispatch(mappingActions.setFeatureCollection(resultFC));
      dispatch(mappingActions.setSelectedFeatureIndex(selectionWish));
    }
  };
}

//EXPORT ACTIONS
export const actions = {
  setKitas,
  setKitasGazHit,
  clearKitasGazHit,
  setFilteredKitas,
  setFilter,
  setSvgSize,
  setFeatureRendering,

  loadKitas,
  setSelectedKita,
  createFeatureCollectionFromKitas,
  setFilterAndApply,
  resetFilter,
  refreshFeatureCollection,
  addFilterFor,
  removeFilterFor
};

//HELPER FUNCTIONS
function convertKitaToFeature(kita, index) {
  const id = kita.id;
  const type = "Feature";
  const selected = false;
  const geometry = kita.geojson;
  const text = kita.name;

  return {
    id,
    index,
    text,
    type,
    selected,
    geometry,
    crs: {
      type: "name",
      properties: {
        name: "urn:ogc:def:crs:EPSG::25832"
      }
    },
    properties: kita
  };
}

const hasInklusionsSchwerpunkt = kita => {
  return kita.plaetze_fuer_behinderte === true;
};

const isAlterUnter2 = kita => {
  return kita.alter === constants.ALTER.indexOf(constants.ALTER_UNTER2);
};
const isAlterAb2 = kita => {
  return kita.alter === constants.ALTER.indexOf(constants.ALTER_AB2) || isAlterUnter2(kita);
};
const isAlterAb3 = kita => {
  return (
    kita.alter === constants.ALTER.indexOf(constants.ALTER_AB3) ||
    isAlterAb2(kita) ||
    isAlterUnter2(kita)
  );
};

const isAvailableFor35h = kita => {
  return (
    kita.stunden === constants.STUNDEN.indexOf(constants.STUNDEN_NUR_35) ||
    kita.stunden === constants.STUNDEN.indexOf(constants.STUNDEN_NUR_35_u_45)
  );
};

const isAvailableFor45h = kita => {
  return (
    kita.stunden === constants.STUNDEN.indexOf(constants.STUNDEN_NUR_45) ||
    kita.stunden === constants.STUNDEN.indexOf(constants.STUNDEN_NUR_35_u_45)
  );
};
