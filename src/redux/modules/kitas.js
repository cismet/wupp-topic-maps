import objectAssign from "object-assign";
import { actions as mappingActions } from "./mapping";
import { predicateBy } from "../../utils/stringHelper";
import kdbush from "kdbush";
import queryString from "query-string";

//TYPES
export const types = {
  SET_KITAS: "KITAS/SET_KITAS",
  SET_KITA_GAZ_HIT: "KITAS/SET_KITA_GAZ_HIT",
  CLEAR_KITA_GAZ_HIT: "KITAS/CLEAR_KITA_GAZ_HIT",
  SET_FILTERED_KITAS: "KITAS/SET_FILTERED_KITAS",
  SET_FILTER: "KITAS/SET_FILTER",
  SET_SVG_SIZE: "KITAS/SET_SVG_SIZE"
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
  STUNDEN_FILTER_45: "KITAS/CONSTS/STUNDEN_FILTER_45"
};

constants.TRAEGERTYP = [
  constants.TRAEGERTYP_ANDERE,
  constants.TRAEGERTYP_BETRIEBSKITA,
  constants.TRAEGERTYP_STAEDTISCH,
  constants.TRAEGERTYP_ELTERNINITIATIVE,
  constants.TRAEGERTYP_EVANGELISCH,
  constants.TRAEGERTYP_KATHOLISCH
];
constants.ALTER = [
  constants.ALTER_UNTER2,
  constants.ALTER_AB2,
  constants.ALTER_AB3
];
constants.STUNDEN = [
  constants.STUNDEN_NUR_35,
  constants.STUNDEN_NUR_35_u_45,
  constants.STUNDEN_NUR_45
];

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
    umfang: [constants.STUNDEN_FILTER_35, constants.STUNDEN_FILTER_45]
  },
  kitaSvgSize: 34
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
      queryString.parse(state.routing.location.search)
        .alwaysRefreshKitasOnReload !== undefined;

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
          console.log(
            "Fetch Kitas because of alwaysRefreshKitasOnReload Parameter"
          );
          return "fetchit";
        }

        if (
          md5 === state.kitas.kitasMD5 &&
          constants.DEBUG_ALWAYS_LOADING === false
        ) {
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
        let lebenslagen = new Set();
        let poitypes = [];

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

function clearFilter(kind) {
  return (dispatch, getState) => {
    // let state = getState();
    // let filterState = JSON.parse(JSON.stringify(state.stadtplan.filter));
    // filterState[kind]=[];
    // dispatch(setFilter(filterState));
    // dispatch(applyFilter());
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
      delete filterState[kind][filterState[kind].indexOf(item)];
    }
    dispatch(setFilterAndApply(filterState));
  };
}

function setFilterAndApply(filter) {
  return (dispatch, getState) => {
    let state = getState();
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

      //alter
      if (
        filter.alter.indexOf(constants.ALTER_UNTER2) !== -1 &&
        !isAlterUnter2(kita)
      ) {
        filteredKitaSet.delete(kita);
        continue;
      }
      if (
        filter.alter.indexOf(constants.ALTER_AB2) !== -1 &&
        !isAlterAb2(kita)
      ) {
        filteredKitaSet.delete(kita);
        continue;
      }
      if (
        filter.alter.indexOf(constants.ALTER_AB3) !== -1 &&
        !isAlterAb3(kita)
      ) {
        filteredKitaSet.delete(kita);
        continue;
      }

      //umfang
      let stundenCheck35 = true;
      let stundenCheck45 = true;

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
      if (
        state.mapping.selectedIndex !== null &&
        state.mapping.selectedIndex >= 0
      ) {
        currentSelectedFeature =
          state.mapping.featureCollection[state.mapping.selectedIndex];
      } else {
        //          console.log("selectedIndex not set");
      }
      let bb;
      if (boundingBox) {
        bb = boundingBox;
      } else {
        bb = state.mapping.boundingBox;
      }

      let resultIds = state.kitas.filteredKitasIndex.range(
        bb.left,
        bb.bottom,
        bb.right,
        bb.top
      );
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

  loadKitas,
  setSelectedKita,
  createFeatureCollectionFromKitas,
  setFilterAndApply,
  clearFilter,
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
  return (
    kita.alter === constants.ALTER.indexOf(constants.ALTER_AB2) ||
    isAlterUnter2(kita)
  );
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
