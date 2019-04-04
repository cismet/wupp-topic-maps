import objectAssign from 'object-assign';

const makeDataWithMD5CheckDuckFor = (section, substateResolver) => {
	const actionTypes = {
		SET_DATA: `HO/DATA/${section}/SET_DATA`,
		LOAD_DATA: `HO/DATA/${section}/LOAD_DATA`
	};
	const initialState = {
		items: [],
		md5: null
	};

	const constants = {
		DEBUG_ALWAYS_LOADING: false
	};

	//SELECTORS
	const selectors = {
		getItems: (state) => state.items,
		getMD5: (state) => state.md5
	};
	const actions = {
		set: (items, itemsMD5) => ({ type: actionTypes.SET_DATA, items, itemsMD5 }),
		load: (config) => {
			return (dispatch, getState) => {
				let md5 = null;
				const defaultConfig = {
					prepare: () => [
						new Promise(function(resolve, reject) {
							setTimeout(function() {
								resolve();
							}, 1000);
						})
					],
					done: () => {},
					manualReloadRequested: false,
					dataURL: '/404',
					errorHandler: (err) => {
						console.err(err);
					}
				};
				config = Object.assign(defaultConfig, config);
				const state = substateResolver(getState());
				// console.log('state in higherorder duck',state)
				let noCacheHeaders = new Headers();
				noCacheHeaders.append('pragma', 'no-cache');
				noCacheHeaders.append('cache-control', 'no-cache');

				return fetch(`${config.dataURL}.md5`, {
					method: 'get',
					headers: noCacheHeaders
				})
					.then((response) => {
						if (response.ok) {
							const t = response.text();
							return t;
						} else {
							throw new Error("Server md5 response wasn't OK");
						}
					})
					.then((md5value) => {
						md5 = md5value.trim();
						if (config.manualReloadRequested) {
							console.log(
								'Fetch Data because of alwaysRefreshPOIsOnReload Parameter'
							);
							return 'fetchit';
						}

						if (md5 === state.md5 && constants.DEBUG_ALWAYS_LOADING === false) {
							config.done(dispatch);
							throw 'CACHEHIT';
						} else {
							return 'fetchit';
						}
					})
					.then((fetchit) => {
						return fetch(config.dataURL, {
							method: 'get',
							headers: noCacheHeaders
						});
					})
					.then((response) => {
						if (response.ok) {
							return response.json();
						} else {
							throw new Error("Server data response wasn't OK");
						}
					})
					.then((data) => {
						let preparingPromises = config.prepare(dispatch, data);
						Promise.all(preparingPromises).then(function(results) {
							dispatch(actions.set(data, md5));
							config.done(dispatch, data, md5);
						});
					})
					.catch(function(err) {
						if (err !== 'CACHEHIT') {
							console.log('Problem during DataLoading');
							console.log(err);
							config.errorHandler(err);
						} else {
							// console.log(`Cachehit for ${section}-Data`);
						}
					});
			};
		}
	};

	const reducer = (state = initialState, action) => {
		let newState;
		switch (action.type) {
			case actionTypes.SET_DATA: {
				newState = objectAssign({}, state);
				newState.items = action.items;
				newState.md5 = action.itemsMD5;
				return newState;
			}
			default:
				return state;
		}
	};
	return { actionTypes, actions, reducer, selectors };
};

export default makeDataWithMD5CheckDuckFor;
