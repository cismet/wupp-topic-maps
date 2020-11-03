import objectAssign from 'object-assign';
import kdbush from 'kdbush';

const makePointFeatureCollectionWithIndexDuck = (
	section,
	ownSubStateResolver,
	currentBoundingBoxResolver,
	convertItemToFeature,
	coordinatesResolver = (p) => p.geojson.coordinates
) => {
	const actionTypes = {
		SET_FEATURECOLLECTION: `HO/POINTFEATURECOLLECTION/${section}/SET_FEATURECOLLECTION`,
		SET_DATASOURCE: `HO/POINTFEATURECOLLECTION/${section}/SET_DATASOURCE`,
		SET_SELECTED_INDEX: `HO/POINTFEATURECOLLECTION/${section}/SET_SELECTED_INDEX`
	};
	const initialState = {
		datasource: [],
		pointFC: [],
		fcIndex: null,
		selectedIndex: null
	};

	//SELECTORS
	const selectors = {
		getFeatureCollection: (state) => state.pointFC,
		getFeatureCollectionDataSource: (state) => state.datasource,
		getSelectedIndex: (state) => state.selectedIndex
	};
	const actions = {
		setFeatureCollection: (featureCollection) => ({
			type: actionTypes.SET_FEATURECOLLECTION,
			featureCollection
		}),
		setDatasource: (datasource) => ({
			type: actionTypes.SET_DATASOURCE,
			datasource
		}),
		setSelectedIndex: (selectedIndex) => ({
			type: actionTypes.SET_SELECTED_INDEX,
			selectedIndex
		}),
		createFeatureCollection: (boundingBox) => {
			return (dispatch, getState) => {
				let state = ownSubStateResolver(getState());
				let dataSource = state.datasource;
				if (state.fcIndex) {
					let currentSelectedFeature = {
						id: -1
					};
					if (state.selectedIndex !== null && state.selectedIndex >= 0) {
						currentSelectedFeature = state.pointFC[state.selectedIndex];
					} else {
						//console.log("selectedIndex not set");
					}
					let bb;
					if (boundingBox) {
						bb = boundingBox;
					} else {
						bb = currentBoundingBoxResolver(getState());
					}

					let resultIds = state.fcIndex.range(bb.left, bb.bottom, bb.right, bb.top);
					let resultFC = [];
					let counter = 0;
					let results = [];

					for (let id of resultIds) {
						results.push(dataSource[id]);
					}

					results.sort((a, b) => {
						if (coordinatesResolver(a)[1] === coordinatesResolver(b)[1]) {
							return coordinatesResolver(a)[0] - coordinatesResolver(b)[0];
						} else {
							return coordinatesResolver(b)[1] - coordinatesResolver(a)[1];
						}
					});

					let selectionWish = 0;
					let i = 0;
					for (let item of results) {
						let itemFeature = JSON.parse(
							JSON.stringify(convertItemToFeature(item, counter))
						);
						itemFeature.index = i++;
						resultFC.push(itemFeature);

						if (itemFeature.id === currentSelectedFeature.id) {
							selectionWish = itemFeature.index;
						}
						counter++;
					}
					dispatch(actions.setFeatureCollection(resultFC));
					dispatch(actions.setSelectedIndex(selectionWish));
				}
			};
		},
		setSelectedItem: (itemId) => {
			return (dispatch, getState) => {
				let state = ownSubStateResolver(getState());
				let itemFeature = state.pointFC.find((x) => x.id === itemId);
				if (itemFeature) {
					dispatch(actions.setSelectedIndex(itemFeature.index));
				} else {
					//dispatch(setPoiGazHit(poiFeature.index));
				}
			};
		}
	};
	const reducer = (state = initialState, action) => {
		let newState;
		switch (action.type) {
			case actionTypes.SET_FEATURECOLLECTION: {
				newState = objectAssign({}, state);
				newState.pointFC = action.featureCollection;
				return newState;
			}
			case actionTypes.SET_DATASOURCE: {
				newState = objectAssign({}, state);
				console.log('xxx SET_DATASOURCE', action.datasource);

				newState.datasource = action.datasource;
				newState.fcIndex = kdbush(
					action.datasource,
					(p) => coordinatesResolver(p)[0],
					(p) => coordinatesResolver(p)[1]
				);
				return newState;
			}
			case actionTypes.SET_SELECTED_INDEX: {
				newState = objectAssign({}, state);
				newState.pointFC = JSON.parse(JSON.stringify(state.pointFC));
				for (let feature of newState.pointFC) {
					feature.selected = false;
				}
				if (newState.pointFC[action.selectedIndex]) {
					newState.pointFC[action.selectedIndex].selected = true;
					newState.selectedIndex = action.selectedIndex;
				} else {
					newState.selectedIndex = null;
				}
				return newState;
			}
			default:
				return state;
		}
	};
	return {
		actionTypes,
		actions,
		reducer,
		selectors
	};
};

export default makePointFeatureCollectionWithIndexDuck;
