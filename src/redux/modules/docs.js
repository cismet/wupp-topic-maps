import objectAssign from 'object-assign';

///TYPES
export const types = {};

export const constants = {LOADING_FINISHED:'LOADING_FINISHED'};

///INITIAL STATE
const initialState = {
    docPackageId: undefined,
    loading: constants.LOADING_FINISHED,
    sidebarOpen: true,
    pdfdoc: undefined,
    pdfdocs: [],
    sizes: [],
    canvasCache: new Map(),
    page: undefined,

    docIndex: undefined,
    pageIndex: undefined,

    doc: undefined,
    caching: 0,

    docs: [],
    //offScreenCanvas: osc,
    debugBounds: [ [ -0.5, -0.5 ], [ 0.5, 0.5 ] ]
};

///REDUCER
export default function docReducer(state = initialState, action) {
	let newState;
	switch (action.type) {
		case types.SET_OFFERS: {
			newState = objectAssign({}, state);
			newState.offers = action.offers;
			newState.offersMD5 = action.md5;
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

//COMPLEXACTIONS

function setMode(mode) {
	return (dispatch) => {
		
	};
}

//EXPORT ACTIONS

export const actions = {
};

//HELPER FUNCTIONS