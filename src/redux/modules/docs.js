import objectAssign from 'object-assign';

import pdfjsLib from 'pdfjs-dist';
import L from 'leaflet';

import { actions as docsCacheActions } from './docsCache';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.943/pdf.worker.min.js';

///TYPES
export const types = {
	SET_LOADING_STATE: 'SET_LOADING_STATE',
	RENDERING_FINISHED: 'RENDERING_FINISHED',
	SET_DOCS_INFO: 'SET_DOCS_INFO',
	CLEAR_PDF_DOC_AND_CANVAS: 'CLEAR_PDF_DOC_AND_CANVAS'
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
	loadingtext: undefined,

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
			newState.futureDocPackageId= action.docPackageId;
			newState.futureDocIndex= action.docIndex;
			newState.futurePageIndex= action.pageIndex;
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

		default:
			return state;
	}
}

///SIMPLEACTIONCREATORS
function setLoadingState(loadingState,docPackageId, docIndex, pageIndex) {
	return { type: types.SET_LOADING_STATE, loadingState,docPackageId, docIndex, pageIndex };
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

//COMPLEXACTIONS
function setDelayedLoadingState(docPackageId, docIndex, pageIndex) {
	return (dispatch, getState) => {
		const state = getState().docs;
		dispatch(setLoadingState(constants.LOADING_STARTED,docPackageId, docIndex, pageIndex));
		setTimeout(() => {
			const istate = getState().docs;
			if (istate.loadingState === constants.LOADING_STARTED) {
				dispatch(setLoadingState(constants.LOADING_OVERLAY,docPackageId, docIndex, pageIndex));
			}
		}, constants.OVERLAY_DELAY);
	};
}

function loadPage(docPackageId, docIndex, pageIndex = 0) {
	return (dispatch, getState) => {
		const state = getState().docs;
		const cacheState = getState().docsCache;

		const doc = state.docs[docIndex];
		dispatch(setDelayedLoadingState(docPackageId, docIndex, pageIndex));

		// const total = fetch(new Request(doc.url, { method: 'HEAD' })).then((res) => {
		//     this.setSize(docIndex, res.headers.get('content-length'));
		// });
		const pdfDocCacheHit = getCachedPdfDoc(cacheState, docPackageId, docIndex);

		if (docPackageId !== state.docPackageId || docIndex !== state.docIndex) {
			if (pdfDocCacheHit === undefined) {
				const loadingTask = pdfjsLib.getDocument(doc.url);
				// loadingTask.onProgress = function(progress) {
				//     var percent = parseInt(progress.loaded, 10) / parseInt(progress.total, 10) * 100;
				//     console.log('percent', percent);
				//     console.log('state', that.state);
				// };

				loadingTask.promise.then((pdf) => {
					dispatch(storePdfDocInCache(docPackageId, docIndex, pdf));
					dispatch(getPDFPage(docPackageId, docIndex, pdf, pageIndex));
				});
			} else {
				dispatch(getPDFPage(docPackageId, docIndex, pdfDocCacheHit, pageIndex));
			}
		} else {
			//Same doc other page
			dispatch(getPDFPage(docPackageId, docIndex, pdfDocCacheHit, pageIndex));
		}
	};
}

function getPDFPage(docPackageId, docIndex, pdf, pageIndex) {
	return (dispatch, getState) => {
		const cacheState = getState().docsCache;
		pdf.getPage(pageIndex + 1).then((page) => {
			const canvasCacheHit = getCachedCanvas(cacheState, docPackageId, docIndex, pageIndex);
			if (canvasCacheHit === undefined) {
                const scale = 2;
                const canvas = document.createElement('canvas');
				const w = page.getViewport(scale).width;
                const h = page.getViewport(scale).height;
                
				let xCorrection = 0;
				let yCorrection = 0;
				if (w > h) {
					canvas.width = w;
					canvas.height = w;
					yCorrection = (w - h) / 2;
				} else {
					canvas.width = h;
					canvas.height = h;
					xCorrection = (h - w) / 2;
				}
				canvas.width = w;
				canvas.height = h;

				const viewport = page.getViewport(scale, page.rotate);
				viewport.offsetX = xCorrection;
				viewport.offsetY = yCorrection;

				const ctx = canvas.getContext('2d');
				page
					.render({
						intent: 'print',
						background: 'white', //'transparent'
						canvasContext: ctx,
						viewport: viewport
						// viewport: new pdfjsLib.PageViewport(
						// 	page.view,
						// 	scale, //computedScale,
						// 	page.rotate,
						// 	xCorrection,
						// 	yCorrection
						// )
					})
					.then(() => {
						dispatch(storeCanvasInCache(docPackageId, docIndex, pageIndex, canvas));
						dispatch(renderingFinished(docPackageId, docIndex, pageIndex, pdf, canvas));
						// setTimeout(() => {
						//     this.gotoWholeDocument();
						// }, 100);
					})
					.catch((error) => {
						console.error('error during pdfjs-rendering', error);
					});
			} else {
				dispatch(renderingFinished(docPackageId, docIndex, pageIndex, pdf, canvasCacheHit));
				// setTimeout(() => {
				//     this.gotoWholeDocument();
				// }, 50);
			}
		});
	};
}

function storePdfDocInCache(docPackageId, docIndex, pdfDoc) {
	return (dispatch) => {
		dispatch(docsCacheActions.addPdfDocToCache(docPackageId + '.' + docIndex, pdfDoc));
	};
}

function storePageInCache(docPackageId, docIndex, pageIndex, page) {
	return (dispatch) => {
		dispatch(docsCacheActions.addPdfPageToCache(docPackageId + '.' + docIndex + '.' + pageIndex, page));
	};
}

function storeCanvasInCache(docPackageId, docIndex, pageIndex, canvas) {
	return (dispatch) => {
		dispatch(docsCacheActions.addCanvasToCache(docPackageId + '.' + docIndex + '.' + pageIndex, canvas));
	};
}

function setDocsInformationAndInitializeCaches(docs) {
	return (dispatch) => {
		dispatch(docsCacheActions.clearAllCaches());
		dispatch(clearDocAndCanvas());
		dispatch(setDocsInfo(docs));
	};
}

//EXPORT ACTIONS

export const actions = {
	loadPage,
	setDocsInformationAndInitializeCaches,
	setDelayedLoadingState
};

//HELPER FUNCTIONS

function getCachedPdfDoc(cacheState, docPackageId, docIndex) {
	return cacheState.pdfDocCache.get(docPackageId + '.' + docIndex);
}

function getCachedPage(cacheState, docPackageId, docIndex, pageIndex) {
	return cacheState.get(docPackageId + '.' + docIndex + '.' + pageIndex);
}

function getCachedCanvas(cacheState, docPackageId, docIndex, pageIndex) {
	return cacheState.pdfDocCache.get(docPackageId + '.' + docIndex + '.' + pageIndex);
}
