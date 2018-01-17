import objectAssign from 'object-assign';
import {
  actions as mappingActions
} from './mapping';
import {
  convertPoint
} from '../../utils/gisHelper';

import kdbush from 'kdbush';

///TYPES
export const types = {
  SET_OFFERS: 'EHRENAMT/SET_OFFERS',
  SET_GLOBALBEREICHE: 'EHRENAMT/SET_GLOBALBEREICHE',
  SET_KENNTNISSE: 'EHRENAMT/SET_KENNTNISSE',
  SET_ZIELGRUPPEN: 'EHRENAMT/SET_ZIELGRUPPEN',
}

export const constants = {
  OR_FILTER: 'EHRENAMT/OR_FILTER',
  AND_FILTER: 'EHRENAMT/AND_FILTER',
  IGNORE_FILTER: 'EHRENAMT/IGNORE_FILTER',
}

///INITIAL STATE
const initialState = {
  offers: [],
  filteredOffers: [],
  offerIndex: null,
  globalbereiche: [],
  kenntnisse: [],
  zielgruppen: [],
  filter: {
    globalbereiche: [],
    kenntnisse: [],
    zielgruppen: [],
    filtermode: constants.IGNORE_FILTER
  }
};


///REDUCER
export default function ehrenamtReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case types.SET_OFFERS:
      {
        newState = objectAssign({}, state);
        newState.offers = action.offers
        newState.offerIndex = kdbush(action.offers, (p) => p.point25832[0], (p) => p.point25832[1]);
        return newState;
      }
    case types.SET_GLOBALBEREICHE:
      {
        newState = objectAssign({}, state);
        newState.globalbereiche = action.globalbereiche

        return newState;
      }
    case types.SET_KENNTNISSE:
      {
        newState = objectAssign({}, state);
        newState.kenntnisse = action.kenntnisse

        return newState;
      }
    case types.SET_ZIELGRUPPEN:
      {
        newState = objectAssign({}, state);
        newState.zielgruppen = action.zielgruppen

        return newState;
      }
    default:
      return state;
  }
}



///SIMPLEACTIONCREATORS
function setOffers(offers) {
  return {
    type: types.SET_OFFERS,
    offers
  };
}

function setGlobalbereiche(globalbereiche) {
  return {
    type: types.SET_GLOBALBEREICHE,
    globalbereiche
  };
}

function setKenntnisse(kenntnisse) {
  return {
    type: types.SET_KENNTNISSE,
    kenntnisse
  };
}

function setZielgruppen(zielgruppen) {
  return {
    type: types.SET_ZIELGRUPPEN,
    zielgruppen
  };
}

//COMPLEXACTIONS
function loadOffers() {
  return (dispatch, getState) => {
    return fetch('/ehrenamt/data.json', {
      method: 'get'
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Server ehrenamt/data response wasn\'t OK');
      }
    }).then((data) => {
      //console.log(data);

      let counter = 0;

      let globalbereiche = new Set();
      let kenntnisse = new Set();
      let zielgruppen = new Set();

      for (let offer of data) {
        offer.point25832 = convertPoint(offer.geo_x, offer.geo_y)
        if (offer.globalbereiche) {
          for (let g of offer.globalbereiche) {
            globalbereiche.add(g);
          }
        }
        if (offer.kenntnisse) {
          for (let k of offer.kenntnisse) {
            kenntnisse.add(k);
          }
        }
        if (offer.zielgruppen) {
          for (let z of offer.zielgruppen) {
            zielgruppen.add(z);
          }
        }
      }

      dispatch(setGlobalbereiche(Array.from(globalbereiche).sort()));
      dispatch(setKenntnisse(Array.from(kenntnisse).sort()));
      dispatch(setZielgruppen(Array.from(zielgruppen).sort()));
      dispatch(setOffers(data));

      dispatch(createFeatureCollectionFromOffers());



    }).catch(function(err) {
      console.log(err);
    });
  }
}

function createFeatureCollectionFromOffers(boundingBox) {
  return (dispatch, getState) => {
    let state = getState()

    if (state.ehrenamt.offerIndex) {

      let bb;
      if (boundingBox) {
        bb = boundingBox;
      } else {
        bb = state.mapping.boundingBox;
      }

      console.log(bb)
      let featureArray = [];

      let resultIds = state.ehrenamt.offerIndex.range(bb.left, bb.bottom, bb.right, bb.top);
      let resultFC = [];
      let counter = 0;
      let results=[];

      for (let id of resultIds) {
        results.push(state.ehrenamt.offers[id]);
      }
      console.log(results[0]);

      results.sort((a,b)=> {
        if (a.point25832[1]===b.point25832[1]) {
          return a.point25832[0]-b.point25832[0];
        }
        else {
          return b.point25832[1]-a.point25832[1];
        }
      })

      console.log(results[0]);
      for (let offer of results) {
        resultFC.push(convertOfferToFeature(offer, counter++));
      }



      dispatch(mappingActions.setFeatureCollection(resultFC));
      dispatch(mappingActions.setSelectedFeatureIndex(0));

    }
  }
}

//EXPORT ACTIONS

export const actions = {
  setOffers,
  loadOffers,
  createFeatureCollectionFromOffers
};


//helperFunctions
function convertOfferToFeature(offer, index) {

  const id = offer.id;
  const type = "Feature";
  const selected = false;
  const point = offer.point25832; //convertPoint(offer.geo_x, offer.geo_y)
  const geometry = {
    "type": "Point",
    "coordinates": [point[0], point[1]]
  }
  const text = offer.text;

  const globalbereiche = offer.globalbereiche;
  const kenntnisse = offer.kenntnisse;
  const zielgruppen = offer.zielgruppen;


  return {
    id,
    index,
    text,
    type,
    selected,
    geometry,
    "crs": {
      "type": "name",
      "properties": {
        "name": "urn:ogc:def:crs:EPSG::25832"
      }
    },
    properties: {
      zielgruppen,
      globalbereiche,
      kenntnisse
    }
  }
}
