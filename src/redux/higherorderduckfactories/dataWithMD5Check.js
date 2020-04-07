import objectAssign from 'object-assign';
import { actions as UIStateActions } from '../modules/uiState';

const makeDataWithMD5CheckDuckFor = (section, substateResolver, featureFactory) => {
	const actionTypes = {
		SET_DATA: `HO/DATA/${section}/SET_DATA`,
		LOAD_DATA: `HO/DATA/${section}/LOAD_DATA`
	};
	const initialState = {
		items: [],
		features: [],
		md5: null
	};

	const constants = {
		DEBUG_ALWAYS_LOADING: false
	};

	const debugLog = true;

	//SELECTORS
	const selectors = {
		getItems: (state) => state.items,
		getFeatures: (state) => state.features,
		getMD5: (state) => state.md5
	};
	const actions = {
		set: (items, itemsMD5, features) => ({
			type: actionTypes.SET_DATA,
			items,
			itemsMD5,
			features
		}),
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
						if (debugLog) {
							console.log(
								'dataWithMD5Check:' + section + ' fetched \tmd5 Value :' + md5 + ':'
							);
						}
						if (config.manualReloadRequested) {
							console.log(
								'dataWithMD5Check:' +
									section +
									' Fetch Data because of alwaysRefreshPOIsOnReload Parameter'
							);

							return 'fetchit';
						}
						if (debugLog) {
							console.log(
								'dataWithMD5Check:' +
									section +
									' state \tmd5 Value :' +
									state.md5 +
									':'
							);
							console.log(
								'dataWithMD5Check:' +
									section +
									' md5 === state.md5 ' +
									(md5 === state.md5)
							);
							console.log(
								'dataWithMD5Check:' +
									section +
									' constants.DEBUG_ALWAYS_LOADING ' +
									constants.DEBUG_ALWAYS_LOADING
							);
						}
						if (md5 === state.md5 && constants.DEBUG_ALWAYS_LOADING === false) {
							config.done(dispatch);
							// TODO
							// don't know another way yet
							//therefore
							/* eslint-disable */
							if (debugLog) {
								console.log('dataWithMD5Check:' + section + ': CACHEHIT ');
							}
							dispatch(UIStateActions.setLoadingStatus('Datencache lesen'));

							throw 'CACHEHIT';
							/* eslint-enable */
						} else {
							if (debugLog) {
								console.log('dataWithMD5Check:' + section + ': fetch the data');
							}

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
							let features = [];
							let counter = 0;
							if (featureFactory !== undefined) {
								for (let item of data) {
									let itemFeature = featureFactory(item, counter);
									features.push(itemFeature);
									// if (itemFeature.id === currentSelectedFeature.id) {
									// 	selectionWish = itemFeature.index;
									// }
									counter++;
								}
							}
							dispatch(actions.set(data, md5, features));
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
				newState.features = action.features;
				return newState;
			}
			default:
				return state;
		}
	};
	return { actionTypes, actions, reducer, selectors };
};

export default makeDataWithMD5CheckDuckFor;
