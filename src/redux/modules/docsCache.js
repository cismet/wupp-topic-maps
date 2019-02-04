import objectAssign from 'object-assign';

///TYPES
export const types = {
	ADD_PDFDOC_TO_CACHE: 'ADD_PDFDOC_TO_CACHE',
	ADD_PDFPAGE_TO_CACHE: 'ADD_PDFPAGE_TO_CACHE',
	ADD_CANVAS_TO_CACHE: 'ADD_CANVAS_TO_CACHE',
	CLEAR_ALL: 'CLEAR_ALL',
	CLEAR_PDFDOC_CACHE: 'CLEAR_PDFDOC_CACHE',
	CLEAR_PPDFPAGE_CACHE: 'CLEAR_PPDFPAGE_CACHE',
	CLEAR_CANVAS_CACHE: 'CLEAR_CANVAS_CACHE'
};

export const constants = {};

///INITIAL STATE
const initialState = {
	pdfDocCache: new Map(),
	pdfPageCache: new Map(),
	canvasCache: new Map()
};

///REDUCER
export default function docReducer(state = initialState, action) {
	let newState;
	switch (action.type) {
		case types.ADD_PDFDOC_TO_CACHE: {
			newState = objectAssign({}, state);
			newState.pdfDocCache = new Map(state.pdfDocCache);
			newState.pdfDocCache.set(action.key, action.doc);
			return newState;
		}
		case types.ADD_PDFPAGE_TO_CACHE: {
			newState = objectAssign({}, state);
			newState.pdfPageCache = new Map(state.pdfPageCache);
			newState.pdfPageCache.set(action.key, action.page);
			return newState;
		}
		case types.ADD_CANVAS_TO_CACHE: {
			newState = objectAssign({}, state);
			newState.canvasCache = new Map(state.canvasCache);
			newState.canvasCache.set(action.key, action.canvas);
			return newState;
		}
		case types.CLEAR_ALL: {
			return initialState;
		}
		case types.CLEAR_PDFDOC_CACHE: {
			newState = objectAssign({}, state);
			newState.pdfDocCache = new Map();
			return newState;
		}
		case types.CLEAR_PPDFPAGE_CACHE: {
			newState = objectAssign({}, state);
			newState.pdfPageCache = new Map();
			return newState;
		}
		case types.CLEAR_CANVAS_CACHE: {
			newState = objectAssign({}, state);
			newState.canvasCache = new Map();
			return newState;
		}
		default:
			return state;
	}
}

///SIMPLEACTIONCREATORS
function addPdfDocToCache(key, doc) {
	return { type: types.ADD_PDFDOC_TO_CACHE, key, doc };
}
function addPdfPageToCache(key, page) {
	return { type: types.ADD_PDFPAGE_TO_CACHE, key, page };
}
function addCanvasToCache(key, canvas) {
	return { type: types.ADD_CANVAS_TO_CACHE, key, canvas };
}
function clearAllCaches() {
	return { type: types.CLEAR_ALL };
}
function clearPdfDocCache() {
	return { type: types.CLEAR_PDFDOC_CACHE };
}
function clearPdfPageCache() {
	return { type: types.CLEAR_PPDFPAGE_CACHE };
}
function clearCanvasCache() {
	return { type: types.CLEAR_CANVAS_CACHE };
}

//COMPLEXACTIONS

function setMode(mode) {
	return (dispatch) => {};
}

//EXPORT ACTIONS

export const actions = {
    addPdfDocToCache,
    addPdfPageToCache,
    addCanvasToCache,
    clearAllCaches,
    clearPdfDocCache,
    clearPdfPageCache,
    clearCanvasCache
};

//HELPER FUNCTIONS
