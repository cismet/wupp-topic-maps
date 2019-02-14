import objectAssign from 'object-assign';

import pdfjsLib from 'pdfjs-dist';
import L from 'leaflet';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.943/pdf.worker.min.js';

///TYPES
export const types = {
	SET_LOADING_STATE: 'SET_LOADING_STATE',
	RENDERING_FINISHED: 'RENDERING_FINISHED',
	SET_DOCS_INFO: 'SET_DOCS_INFO',
	CLEAR_PDF_DOC_AND_CANVAS: 'CLEAR_PDF_DOC_AND_CANVAS',
	SET_SIZES: 'SET_SIZES',
	SET_SIZE: 'SET_SIZE',
	SET_LOADING_TEXT: 'SET_LOADING_TEXT',
	SET_DEBUG_BOUNDS: 'SET_DEBUG_BOUNDS'
};

export const constants = {
	LOADING_FINISHED: 'LOADING_FINISHED',
	LOADING_STARTED: 'LOADING_STARTED',
	LOADING_OVERLAY: 'LOADING_OVERLAY',
	OVERLAY_DELAY: 100
};

///INITIAL STATE
const initialState = {
	topic: 'bplaene',
	docPackageId: undefined,
	docIndex: undefined,
	pageIndex: undefined,

	futureDocPackageId: undefined,
	futureDocIndex: undefined,
	futurePageIndex: undefined,

	docs: [],
	
	loadingState: constants.LOADING_FINISHED,
	loadingText: undefined,

	pdfdoc: undefined,
	canvas: undefined,
	sidebarOpen: true,
	sizes: [],
	page: undefined,
	caching: 0,

	debugBounds: [ [ -0.5, -0.5 ], [ 0.5, 0.5 ] ]
};

///REDUCER
export default function docReducer(state = initialState, action) {
	let newState;
	switch (action.type) {
		case types.SET_LOADING_STATE: {
			newState = objectAssign({}, state);
			newState.loadingState = action.loadingState;
			newState.futureDocPackageId = action.docPackageId;
			newState.futureDocIndex = action.docIndex;
			newState.futurePageIndex = action.pageIndex;
			return newState;
		}
		case types.RENDERING_FINISHED: {
			newState = objectAssign({}, state);
			newState.docPackageId = action.docPackageId;
			newState.docIndex = action.docIndex;
			newState.pageIndex = action.pageIndex;
			newState.pdfdoc = action.pdfdoc;
			newState.canvas = action.canvas;
			newState.caching = state.caching + 1;
			newState.loadingState = constants.LOADING_FINISHED;

			return newState;
		}
		case types.SET_DOCS_INFO: {
			newState = objectAssign({}, state);
			newState.docs = action.docs;
			return newState;
		}
		case types.CLEAR_PDF_DOC_AND_CANVAS: {
			newState = objectAssign({}, state);
			newState.pdfdoc = undefined;
			newState.canvas = undefined;
			return newState;
		}
		case types.SET_SIZES: {
			newState = objectAssign({}, state);
			newState.sizes = action.sizes;
			return newState;
		}
		case types.SET_SIZE: {
			newState = objectAssign({}, state);
			newState.sizes = state.sizes.slice(0);
			newState.sizes[action.index] = action.size;
			return newState;
		}
		case types.SET_LOADING_TEXT: {
			newState = objectAssign({}, state);
			newState.loadingText = action.loadingText;
			return newState;
		}
		case types.SET_DEBUG_BOUNDS: {
			newState = objectAssign({}, state);
			newState.debugBounds = action.debugBounds;
			return newState;
		}
		default:
			return state;
	}
}

///SIMPLEACTIONCREATORS
function setLoadingState(loadingState, docPackageId, docIndex, pageIndex) {
	return { type: types.SET_LOADING_STATE, loadingState, docPackageId, docIndex, pageIndex };
}

function renderingFinished(docPackageId, docIndex, pageIndex, pdfdoc, canvas) {
	return { type: types.RENDERING_FINISHED, docPackageId, docIndex, pageIndex, pdfdoc, canvas };
}

function setDocsInfo(docs) {
	return { type: types.SET_DOCS_INFO, docs };
}
function clearDocAndCanvas() {
	return { type: types.CLEAR_PDF_DOC_AND_CANVAS };
}
function setSizes(sizes) {
	return { type: types.SET_SIZES, sizes };
}
function setSize(index, size) {
	return { type: types.SET_SIZE, index, size };
}
function setLoadingText(loadingText) {
	return { type: types.SET_LOADING_TEXT, loadingText };
}
function setDebugBounds(debugBounds) {
	return { type: types.SET_DEBUG_BOUNDS, debugBounds };
}
//COMPLEXACTIONS
function setDelayedLoadingState(docPackageId, docIndex, pageIndex) {
	return (dispatch, getState) => {
		const state = getState().docs;
		dispatch(setLoadingState(constants.LOADING_STARTED, docPackageId, docIndex, pageIndex));
		setTimeout(() => {
			const istate = getState().docs;
			if (istate.loadingState === constants.LOADING_STARTED) {
				dispatch(setLoadingState(constants.LOADING_OVERLAY, docPackageId, docIndex, pageIndex));
			}
		}, constants.OVERLAY_DELAY);
	};
}

function loadPage(docPackageId, docIndex, pageIndex = 0, callback = () => {}) {
	return (dispatch, getState) => {
		dispatch(renderingFinished(docPackageId, docIndex, pageIndex, undefined, undefined));
		 callback();
		
		// const state = getState().docs;
		// const cacheState = getState().docsCache;

		// const doc = state.docs[docIndex];
		// dispatch(setDelayedLoadingState(docPackageId, docIndex, pageIndex));

		// const total = fetch(new Request(doc.url, { method: 'HEAD' })).then((res) => {
		// 	dispatch(setSize(docIndex, res.headers.get('content-length')));
		// });
		// const pdfDocCacheHit = getCachedPdfDoc(cacheState, docPackageId, docIndex);

		// if (docPackageId !== state.docPackageId || docIndex !== state.docIndex) {
		// 	if (pdfDocCacheHit === undefined) {
		// 		const loadingTask = pdfjsLib.getDocument(doc.url);
		// 		// loadingTask.onProgress = function(progress) {
		// 		//     var percent = parseInt(progress.loaded, 10) / parseInt(progress.total, 10) * 100;
		// 		//     console.log('percent', percent);
		// 		//     console.log('state', that.state);
		// 		// };

		// 		loadingTask.promise.then((pdf) => {
		// 			dispatch(storePdfDocInCache(docPackageId, docIndex, pdf));
		// 			//dispatch(getPDFPage(docPackageId, docIndex, pdf, pageIndex,callback));
		// 		});
		// 	} else {
		// 		//dispatch(getPDFPage(docPackageId, docIndex, pdfDocCacheHit, pageIndex,callback));
		// 	}
		// } else {
		// 	//Same doc other page
		// 	//dispatch(getPDFPage(docPackageId, docIndex, pdfDocCacheHit, pageIndex,callback));
		// }
	};
}

function setDocsInformationAndInitializeCaches(docs) {
	return (dispatch) => {
		dispatch(clearDocAndCanvas());
		dispatch(setSizes([]));
		Promise.all(
			docs.map((doc) => {
				return fetch(doc.meta);
			})
		)
			.then((responses) => Promise.all(responses.map((res) => res.text())))
			.then((jsonMetaArray) => {
				let i=0;
				for (let jsonText of jsonMetaArray){
					try {
						const meta=JSON.parse(jsonText);
						docs[i].meta=meta
						docs[i].pages=meta.pages;
					}catch (err) {
						console.log('Fehler in den Metadaten '+i,jsonText);
						docs[i].meta=undefined;
						docs[i].pages=0;
					  }
					  i=i+1;
				}
				dispatch(setDocsInfo(docs));
			});
	};
}

//EXPORT ACTIONS

export const actions = {
	loadPage,
	setDocsInformationAndInitializeCaches,
	setDelayedLoadingState,
	setDebugBounds
};

//HELPER FUNCTIONS

function getCachedPdfDoc(cacheState, docPackageId, docIndex) {
	return cacheState.pdfDocCache.get(docPackageId + '.' + docIndex);
}

function getCachedPage(cacheState, docPackageId, docIndex, pageIndex) {
	return cacheState.pdfPageCache.get(docPackageId + '.' + docIndex + '.' + pageIndex);
}

function getCachedCanvas(cacheState, docPackageId, docIndex, pageIndex) {
	return cacheState.canvasCache.get(docPackageId + '.' + docIndex + '.' + pageIndex);
}
