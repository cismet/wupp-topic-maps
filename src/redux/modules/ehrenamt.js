import objectAssign from 'object-assign';
import { actions as mappingActions } from './mapping';
import { routerActions } from 'react-router-redux';

import { convertPoint } from '../../utils/gisHelper';
import { getCartStringForAdding, getCartStringForRemoving } from '../../utils/ehrenamtHelper';
import { modifyQueryPart } from '../../utils/routingHelper';

import kdbush from 'kdbush';

///TYPES
export const types = {
  SET_OFFERS: 'EHRENAMT/SET_OFFERS',
  SET_FILTERED_OFFERS: 'EHRENAMT/SET_FILTERED_OFFERS',
  SET_GLOBALBEREICHE: 'EHRENAMT/SET_GLOBALBEREICHE',
  SET_KENNTNISSE: 'EHRENAMT/SET_KENNTNISSE',
  SET_ZIELGRUPPEN: 'EHRENAMT/SET_ZIELGRUPPEN',
  SET_FILTER: 'EHRENAMT/SET_FILTER',
  SET_IGNORED_FILTERGROUPS: 'EHRENAMT/SET_IGNORED_FILTERGROUPS',
  ADD_TO_CART: 'EHRENAMT/ADD_TO_CART',
  REMOVE_FROM_CART: 'EHRENAMT/REMOVE_FROM_CART',
  CLEAR_CART: 'EHRENAMT/CLEAR_CART',
  SET_MODE: 'EHRENAMT/SET_MODE',
  SET_CART: 'EHRENAMT/SET_CART'
};

export const constants = {
  FILTER_FILTER: 'EHRENAMT/FILTER_FILTER',
  CART_FILTER: 'EHRENAMT/CART_FILTER',
  OR_FILTER: 'EHRENAMT/OR_FILTER',
  AND_FILTER: 'EHRENAMT/AND_FILTER',
  IGNORE_FILTER: 'EHRENAMT/IGNORE_FILTER',
  KENTNISSE_FILTER: 'EHRENAMT/KENTNISSE_FILTER',
  ZIELGRUPPEN_FILTER: 'EHRENAMT/ZIELGRUPPEN_FILTER',
  GLOBALBEREICHE_FILTER: 'EHRENAMT/GLOBALBEREICHE_FILTER'
};

///INITIAL STATE
const initialState = {
  mode: constants.FILTER_FILTER,
  offers: [],
  offersMD5: '',
  filteredOffers: [],
  filteredOfferIndex: null,
  globalbereiche: [],
  kenntnisse: [],
  zielgruppen: [],
  filter: {
    positiv: {
      globalbereiche: [],
      kenntnisse: [],
      zielgruppen: []
    },
    negativ: {
      globalbereiche: [],
      kenntnisse: [],
      zielgruppen: []
    },
    globalbereiche: [],
    kenntnisse: [],
    zielgruppen: [],
    filtermode: constants.OR_FILTER,
    ignoredFilterGroups: [
      constants.KENTNISSE_FILTER,
      constants.GLOBALBEREICHE_FILTER,
      constants.ZIELGRUPPEN_FILTER
    ]
  },
  cart: [],
  filterX: {
    positiv: {
      globalbereiche: [],
      kenntnisse: [],
      zielgruppen: []
    },
    filtermode: constants.OR_FILTER,
    negativ: {
      globalbereiche: [],
      kenntnisse: [],
      zielgruppen: []
    }
  }
};

///REDUCER
export default function ehrenamtReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case types.SET_OFFERS: {
      newState = objectAssign({}, state);
      newState.offers = action.offers;
      newState.offersMD5 = action.md5;
      return newState;
    }
    case types.SET_FILTERED_OFFERS: {
      newState = objectAssign({}, state);
      newState.filteredOffers = action.offers;
      newState.filteredOfferIndex = kdbush(
        action.offers,
        p => p.point25832[0],
        p => p.point25832[1]
      );
      return newState;
    }
    case types.SET_GLOBALBEREICHE: {
      newState = objectAssign({}, state);
      newState.globalbereiche = action.globalbereiche;

      return newState;
    }
    case types.SET_KENNTNISSE: {
      newState = objectAssign({}, state);
      newState.kenntnisse = action.kenntnisse;

      return newState;
    }
    case types.SET_ZIELGRUPPEN: {
      newState = objectAssign({}, state);
      newState.zielgruppen = action.zielgruppen;

      return newState;
    }
    case types.SET_FILTER: {
      newState = objectAssign({}, state);
      newState.filterX = action.filter;

      return newState;
    }
    case types.SET_IGNORED_FILTERGROUPS: {
      newState = objectAssign({}, state);
      newState.filter = JSON.parse(JSON.stringify(state.filter));
      newState.filter.ignoredFilterGroups = action.filtergroups;

      return newState;
    }
    case types.ADD_TO_CART: {
      newState = objectAssign({}, state);
      newState.cart = JSON.parse(JSON.stringify(state.cart));
      newState.cart.push(action.item);
      return newState;
    }
    case types.REMOVE_FROM_CART: {
      newState = objectAssign({}, state);
      newState.cart = [];
      for (let testItem of state.cart) {
        if (testItem.id !== action.item.id) {
          newState.cart.push(testItem);
        }
      }
      return newState;
    }
    case types.CLEAR_CART: {
      newState = objectAssign({}, state);
      newState.cart = [];
      return newState;
    }
    case types.SET_CART: {
      newState = objectAssign({}, state);
      newState.cart = action.cart;
      return newState;
    }
    case types.SET_MODE: {
      newState = objectAssign({}, state);
      newState.mode = action.mode;
      return newState;
    }
    default:
      return state;
  }
}

///SIMPLEACTIONCREATORS
function setOffers(offers, md5) {
  return { type: types.SET_OFFERS, offers, md5 };
}
function setFilteredOffers(offers) {
  return { type: types.SET_FILTERED_OFFERS, offers };
}

function setGlobalbereiche(globalbereiche) {
  return { type: types.SET_GLOBALBEREICHE, globalbereiche };
}

function setKenntnisse(kenntnisse) {
  return { type: types.SET_KENNTNISSE, kenntnisse };
}

function setZielgruppen(zielgruppen) {
  return { type: types.SET_ZIELGRUPPEN, zielgruppen };
}

function setFilter(filter) {
  return { type: types.SET_FILTER, filter };
}

function setTheCart(cart) {
  return { type: types.SET_CART, cart };
}

function addToTheCart(item) {
  return { type: types.ADD_TO_CART, item };
}
function removeFromTheCart(item) {
  return { type: types.REMOVE_FROM_CART, item };
}
function clearTheCart() {
  return { type: types.CLEAR_CART };
}
function setTheMode(mode) {
  return { type: types.SET_MODE, mode };
}

//COMPLEXACTIONS

function setMode(mode) {
  return dispatch => {
    dispatch(setTheMode(mode));
    dispatch(applyFilter());
  };
}

function addToCartById(id) {
  return (dispatch, getState) => {
    let state = getState();
    let found = state.ehrenamt.offers.find(x => x.id === id);
    if (found) {
      dispatch(addToCart(found));
    }
  };
}
function addToCartByIds(ids) {
  return (dispatch, getState) => {
    let state = getState();
    let newCart = new Set(state.ehrenamt.cart);

    for (let id of ids) {
      let found = state.ehrenamt.offers.find(x => x.id === id);
      if (found) {
        newCart.add(found);
      }
    }
    dispatch(setTheCart(Array.from(newCart)));
    dispatch(createFeatureCollectionFromOffers());
  };
}

function addToCart(item) {
  return (dispatch, getState) => {
    let state = getState();
    dispatch(addToTheCart(item));
    dispatch(
      routerActions.push(
        state.routing.location.pathname +
          modifyQueryPart(state.routing.location.search, {
            cart: getCartStringForAdding(state.ehrenamt.cart, item.id)
          })
      )
    );
  };
}

function removeFromCart(item) {
  return (dispatch, getState) => {
    let state = getState();
    dispatch(removeFromTheCart(item));
    dispatch(
      routerActions.push(
        state.routing.location.pathname +
          modifyQueryPart(state.routing.location.search, {
            cart: getCartStringForRemoving(state.ehrenamt.cart, item.id)
          })
      )
    );
  };
}

function toggleCartFromOffer(offer) {
  return (dispatch, getState) => {
    let featureCollection = getState().mapping.featureCollection;
    let feature = featureCollection.find(x => x.id === offer.id);
    if (feature) {
      //offer is shown in the map, therefore the toggleFromFeatureMethod should be used
      dispatch(toggleCartFromFeature(feature));
    } else {
      //offer not shown in map
      let cart = getState().ehrenamt.cart;
      if (cart.find(x => x.id === offer.id) === undefined) {
        dispatch(addToCart(offer));
      } else {
        dispatch(removeFromCart(offer));
      }
    }
  };
}

function toggleCartFromFeature(feature) {
  return (dispatch, getState) => {
    let cart = getState().ehrenamt.cart;
    let f = objectAssign({}, feature);

    if (cart.find(x => x.id === feature.properties.id) === undefined) {
      dispatch(addToCart(feature.properties));
      f.inCart = true;
      dispatch(mappingActions.changeFeatureById(f));
    } else {
      dispatch(removeFromCart(feature.properties));
      f.inCart = false;
      dispatch(mappingActions.changeFeatureById(f));
    }
    //TODO nur im CART_FILTER Mode
    dispatch(applyFilter());
  };
}

function toggleFilter(kind, filtergroup, filter) {
  return (dispatch, getState) => {
    let state = getState();
    let filterState = JSON.parse(JSON.stringify(state.ehrenamt.filterX));
    let filterGroupSet = new Set(filterState[kind][filtergroup]);
    if (filterGroupSet.has(filter)) {
      filterGroupSet.delete(filter);
    } else {
      filterGroupSet.add(filter);
      if (kind === 'positiv') {
        if (filterState.negativ[filtergroup].indexOf(filter) !== -1) {
          let otherFilterGroupSet = new Set(filterState['negativ'][filtergroup]);
          otherFilterGroupSet.delete(filter);
          filterState['negativ'][filtergroup] = Array.from(otherFilterGroupSet);
        }
      } else {
        if (filterState.positiv[filtergroup].indexOf(filter) !== -1) {
          let otherFilterGroupSet = new Set(filterState['positiv'][filtergroup]);
          otherFilterGroupSet.delete(filter);
          filterState['positiv'][filtergroup] = Array.from(otherFilterGroupSet);
        }
      }
    }
    filterState[kind][filtergroup] = Array.from(filterGroupSet);
    filterState[kind][filtergroup].sort();
    dispatch(setTheMode(constants.FILTER_FILTER));
    dispatch(setFilter(filterState));
    dispatch(applyFilter());
  };
}

function applyFilter() {
  return (dispatch, getState) => {
    let state = getState();
    if (state.ehrenamt.mode === constants.FILTER_FILTER) {
      let groups = [
        constants.KENTNISSE_FILTER,
        constants.GLOBALBEREICHE_FILTER,
        constants.ZIELGRUPPEN_FILTER
      ];
      let filteredOffers = [];
      let filteredOfferSet = new Set(); //avoid duplicates
      if (
        state.ehrenamt.filterX.positiv.zielgruppen.length === 0 &&
        state.ehrenamt.filterX.positiv.kenntnisse.length === 0 &&
        state.ehrenamt.filterX.positiv.globalbereiche.length === 0
      ) {
        filteredOffers = state.ehrenamt.offers;
        filteredOfferSet = new Set(filteredOffers);
      } else {
        for (let fg of groups) {
          for (let offer of state.ehrenamt.offers) {
            if (offer[getFilterSelectorForConstant(fg)]) {
              for (let zg of offer[getFilterSelectorForConstant(fg)]) {
                if (
                  state.ehrenamt.filterX.positiv[getFilterSelectorForConstant(fg)].indexOf(zg) > -1
                ) {
                  filteredOfferSet.add(offer);
                  break;
                }
              }
            }
          }
        }
        filteredOffers = Array.from(filteredOfferSet);
      }

      if (
        state.ehrenamt.filterX.negativ.zielgruppen.length !== 0 ||
        state.ehrenamt.filterX.negativ.kenntnisse.length !== 0 ||
        state.ehrenamt.filterX.negativ.globalbereiche.length !== 0
      ) {
        for (let fg of groups) {
          for (let offer of filteredOffers) {
            if (offer[getFilterSelectorForConstant(fg)]) {
              for (let zg of offer[getFilterSelectorForConstant(fg)]) {
                if (
                  state.ehrenamt.filterX.negativ[getFilterSelectorForConstant(fg)].indexOf(zg) > -1
                ) {
                  filteredOfferSet.delete(offer);
                  break;
                }
              }
            }
          }
        }
        filteredOffers = Array.from(filteredOfferSet);
      }

      dispatch(setFilteredOffers(filteredOffers));
      dispatch(createFeatureCollectionFromOffers());
    } else {
      //show only the cart
      dispatch(setFilteredOffers(state.ehrenamt.cart));
      dispatch(createFeatureCollectionFromOffers());
    }

    // Auflisten der Angebote die der Filter herausgefiltert hat let difference =
    // state.ehrenamt.offers.filter(x => !filteredOffers.includes(x));
    // console.log(difference);
  };
}

function loadOffers() {
  return (dispatch, getState) => {
    let md5 = null;
    let currentOffer = null;
    const state = getState();
    let noCacheHeaders = new Headers();
    noCacheHeaders.append('pragma', 'no-cache');
    noCacheHeaders.append('cache-control', 'no-cache');

    return fetch('/ehrenamt/data.json.md5', { method: 'get', headers: noCacheHeaders })
      .then(response => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error("Server md5 response wasn't OK");
        }
      })
      .then(md5value => {
        md5 = md5value.trim();
        if (md5 === state.ehrenamt.offersMD5) {
          dispatch(applyFilter());
          dispatch(createFeatureCollectionFromOffers());

          throw 'CACHEHIT';
        } else {
          return 'fetchit';
        }
      })
      .then(fetchit => {
        return fetch('/ehrenamt/data.json', { method: 'get', headers: noCacheHeaders });
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Server ehrenamt/data response wasn't OK");
        }
      })
      .then(data => {
        let globalbereiche = new Set();
        let kenntnisse = new Set();
        let zielgruppen = new Set();

        for (let offer of data) {
          currentOffer = offer;
          offer.point25832 = convertPoint(offer.geo_x, offer.geo_y);
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
        dispatch(setOffers(data, md5));
        dispatch(applyFilter());
        dispatch(createFeatureCollectionFromOffers());
      })
      .catch(function(err) {
        if (err !== 'CACHEHIT') {
          console.log('Problem during OfferLoading');
          console.log(currentOffer);
          console.log(err);
        }
      });
  };
}

function createFeatureCollectionFromOffers(boundingBox) {
  return (dispatch, getState) => {
    let state = getState();

    if (state.ehrenamt.filteredOfferIndex) {
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

      let resultIds = state.ehrenamt.filteredOfferIndex.range(bb.left, bb.bottom, bb.right, bb.top);
      let resultFC = [];
      let counter = 0;
      let results = [];

      for (let id of resultIds) {
        results.push(state.ehrenamt.filteredOffers[id]);
      }

      results.sort((a, b) => {
        if (a.point25832[1] === b.point25832[1]) {
          return a.point25832[0] - b.point25832[0];
        } else {
          return b.point25832[1] - a.point25832[1];
        }
      });

      let selectionWish = 0;
      for (let offer of results) {
        let offerFeature = convertOfferToFeature(offer, counter);
        resultFC.push(offerFeature);
        if (state.ehrenamt.cart.find(x => x.id === offerFeature.id) !== undefined) {
          offerFeature.inCart = true;
        } else {
          offerFeature.inCart = false;
        }
        if (offerFeature.id === currentSelectedFeature.id) {
          selectionWish = counter;
        }
        counter++;
      }

      dispatch(mappingActions.setFeatureCollection(resultFC));
      dispatch(mappingActions.setSelectedFeatureIndex(selectionWish));
    }
  };
}

function getFilterSelectorForConstant(constant) {
  switch (constant) {
    case constants.GLOBALBEREICHE_FILTER: {
      return 'globalbereiche';
    }
    case constants.KENTNISSE_FILTER: {
      return 'kenntnisse';
    }
    case constants.ZIELGRUPPEN_FILTER: {
      return 'zielgruppen';
    }
    default: {
      return undefined;
    }
  }
}
function setFilterAndApply(filter) {
  return (dispatch, getState) => {
    dispatch(setFilter(filter));
    dispatch(applyFilter());
  };
}

function clearCart() {
  return (dispatch, getState) => {
    let state = getState();
    dispatch(clearTheCart());
    dispatch(
      routerActions.push(
        state.routing.location.pathname +
          modifyQueryPart(state.routing.location.search, {
            cart: ''
          })
      )
    );
    //TODO nur im CART_FILTER Mode
    dispatch(applyFilter());
  };
}

function resetFilter() {
  return (dispatch, getState) => {
    dispatch(setFilterAndApply(initialState.filterX));
  };
}

function selectOffer(offer) {
  return (dispatch, getState) => {
    let state = getState();
    let selectionWish = state.mapping.featureCollection.findIndex(x => x.id === offer.id);
    if (selectionWish !== -1) {
      dispatch(mappingActions.setSelectedFeatureIndex(selectionWish));
    }
    dispatch(applyFilter());
  };
}

//EXPORT ACTIONS

export const actions = {
  setOffers,
  loadOffers,
  createFeatureCollectionFromOffers,
  toggleFilter,
  resetFilter,
  setFilterAndApply,
  addToCart,
  clearCart,
  toggleCartFromFeature,
  toggleCartFromOffer,
  setMode,
  selectOffer,
  addToCartById,
  addToCartByIds
};

//HELPER FUNCTIONS
function convertOfferToFeature(offer, index) {
  const id = offer.id;
  const type = 'Feature';
  const selected = false;
  const point = offer.point25832; //convertPoint(offer.geo_x, offer.geo_y)
  const geometry = {
    type: 'Point',
    coordinates: [point[0], point[1]]
  };
  const text = offer.text;

  return {
    id,
    index,
    text,
    type,
    selected,
    geometry,
    crs: {
      type: 'name',
      properties: {
        name: 'urn:ogc:def:crs:EPSG::25832'
      }
    },
    properties: offer
  };
}
