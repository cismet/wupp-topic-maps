import objectAssign from 'object-assign';

///TYPES
export const types = {
	SET_LOADING_STATE: 'SET_LOADING_STATE',
	RENDERING_FINISHED: 'RENDERING_FINISHED',
	SET_DOCS_INFO: 'SET_DOCS_INFO',
	SET_VIEWER_TITLE: 'SET_VIEWER_TITLE',
	SET_SIZES: 'SET_SIZES',
	SET_SIZE: 'SET_SIZE',
	SET_TOPIC: 'SET_TOPIC',
	SET_LOADING_TEXT: 'SET_LOADING_TEXT',
	SET_DEBUG_BOUNDS: 'SET_DEBUG_BOUNDS'
};

export const constants = {
	LOADING_FINISHED: 'LOADING_FINISHED',
	LOADING_STARTED: 'LOADING_STARTED',
	LOADING_OVERLAY: 'LOADING_OVERLAY',
	OVERLAY_DELAY: 500
};

///INITIAL STATE
const initialState = {
	viewerTitle: undefined,

	topic: undefined,
	topicData: undefined,

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

		case types.SET_VIEWER_TITLE: {
			newState = objectAssign({}, state);
			newState.viewerTitle = action.title;
			return newState;
		}
		case types.SET_TOPIC: {
			newState = objectAssign({}, state);
			newState.topic = action.topic;
			newState.topicData = action.topicData;
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

function setViewerTitle(title) {
	return { type: types.SET_VIEWER_TITLE, title };
}

function setSizes(sizes) {
	return { type: types.SET_SIZES, sizes };
}

function setTopic(topic, topicData) {
	return { type: types.SET_TOPIC, topic, topicData };
}

function setDebugBounds(debugBounds) {
	return { type: types.SET_DEBUG_BOUNDS, debugBounds };
}
//COMPLEXACTIONS
function setDelayedLoadingState(docPackageId, docIndex, pageIndex) {
	return (dispatch, getState) => {
		dispatch(setLoadingState(constants.LOADING_STARTED, docPackageId, docIndex, pageIndex));
		setTimeout(() => {
			const istate = getState().docs;
			if (istate.loadingState === constants.LOADING_STARTED) {
				dispatch(
					setLoadingState(constants.LOADING_OVERLAY, docPackageId, docIndex, pageIndex)
				);
			}
		}, constants.OVERLAY_DELAY);
	};
}

function finished(docPackageId, docIndex, pageIndex = 0, callback = () => {}) {
	return (dispatch, getState) => {
		dispatch(renderingFinished(docPackageId, docIndex, pageIndex, undefined, undefined));
		callback();
	};
}
function initialize() {
	return (dispatch) => {
		dispatch(setDocsInfo([]));
	};
}

function setDocsInformation(docs, callback = () => {}) {
	return (dispatch) => {
		dispatch(setDocsInfo([]));
		dispatch(setSizes([]));
		setTimeout(() => {
			Promise.all(
				docs.map((doc) => {
					// console.log('try to fetch ', doc.meta);

					return fetch(doc.meta);
				})
			)
				.then((responses) => Promise.all(responses.map((res) => res.text())))
				.then((jsonMetaArray) => {
					let i = 0;
					for (let jsonText of jsonMetaArray) {
						try {
							const meta = JSON.parse(jsonText);
							docs[i].meta = meta;
							docs[i].pages = meta.pages;
						} catch (err) {
							console.log('error when fetching meta.json', err);

							docs[i].meta = undefined;
							docs[i].pages = 0;
						}
						i = i + 1;
					}
					dispatch(setDocsInfo(docs));
					callback();
				});
		}, 0); //Simulate slow network
	};
}

//EXPORT ACTIONS

export const actions = {
	initialize,
	finished,
	setDocsInformation,
	setDelayedLoadingState,
	setDebugBounds,
	setTopic,
	setViewerTitle
};

//HELPER FUNCTIONS
