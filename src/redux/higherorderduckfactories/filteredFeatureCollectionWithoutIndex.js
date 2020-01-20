import objectAssign from 'object-assign';
import kdbush from 'kdbush';
import booleanDisjoint from '@turf/boolean-disjoint';
import bboxPolygon from '@turf/bbox-polygon';

const makeFeatureCollectionWithoutIndexDuck = (
	section,
	ownSubStateResolver,
	currentBoundingBoxResolver,
	convertItemToFeature,
	filterFunctionFactory = (filter) => {
		return () => {
			return true;
		};
	},
	initialFilterState
) => {
	const actionTypes = {
		SET_FEATURECOLLECTION: `HO/FEATURECOLLECTION/${section}/SET_FEATURECOLLECTION`,
		SET_FULL_FEATURECOLLECTION: `HO/FEATURECOLLECTION/${section}/SET_FULL_FEATURECOLLECTION`,
		SET_DATASOURCE: `HO/FEATURECOLLECTION/${section}/SET_DATASOURCE`,
		SET_FILTERED_DATASOURCE: `HO/FEATURECOLLECTION/${section}/SET_DATASET_FILTERED_DATASOURCE`,
		SET_SELECTED_INDEX: `HO/FEATURECOLLECTION/${section}/SET_SELECTED_INDEX`,
		SET_FILTER: `HO/FEATURECOLLECTION/${section}/SET_FILTER`
	};
	const initialState = {
		datasource: [],
		filteredDatasource: [],
		pointFC: [],
		fcIndex: null,
		selectedIndex: null,
		filter: initialFilterState
	};

	//SELECTORS
	const selectors = {
		getFeatureCollection: (state) => state.pointFC,
		getFilter: (state) => state.filter,
		getFilteredData: (state) => state.filteredDatasource,
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
		setFilteredDatasource: (filteredDatasource) => ({
			type: actionTypes.SET_FILTERED_DATASOURCE,
			filteredDatasource
		}),
		setFilter: (filter) => ({
			type: actionTypes.SET_FILTER,
			filter
		}),
		setSelectedIndex: (selectedIndex) => ({
			type: actionTypes.SET_SELECTED_INDEX,
			selectedIndex
		}),
		setFilterAndApply: (filter) => {
			return (dispatch) => {
				dispatch(actions.setFilter(filter));
				dispatch(actions.applyFilter());
			};
		},
		applyFilter: () => {
			return (dispatch, getState) => {
				let state = ownSubStateResolver(getState());
				let filter = state.filter;
				let datasource = state.datasource;
				dispatch(
					actions.setFilteredDatasource(datasource.filter(filterFunctionFactory(filter)))
				);
				dispatch(actions.createFeatureCollection());
			};
		},
		createFeatureCollection: (boundingBox) => {
			return (dispatch, getState) => {
				let state = ownSubStateResolver(getState());
				let filteredDatasource = state.filteredDatasource;
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

					const bboxPoly = bboxPolygon([ bb.left, bb.top, bb.right, bb.bottom ]);

					// let resultIds = state.fcIndex.range(bb.left, bb.bottom, bb.right, bb.top);
					let resultFC = [];
					let counter = 0;

					// for (let id of resultIds) {
					// 	results.push(filteredDatasource[id]);
					// }

					// results.sort((a, b) => {
					// 	if (a.geojson.coordinates[1] === b.geojson.coordinates[1]) {
					// 		return a.geojson.coordinates[0] - b.geojson.coordinates[0];
					// 	} else {
					// 		return b.geojson.coordinates[1] - a.geojson.coordinates[1];
					// 	}
					// });
					let results = filteredDatasource;
					let selectionWish = 0;
					for (let item of results) {
						let itemFeature = convertItemToFeature(item, counter);
						resultFC.push(itemFeature);

						if (itemFeature.id === currentSelectedFeature.id) {
							selectionWish = itemFeature.index;
						}
						counter++;
					}

					let finalResults = [];

					// Geometry filter
					for (let feature of resultFC) {
						//console.log('XXX feature to test', feature);

						if (!booleanDisjoint(bboxPoly, feature)) {
							finalResults.push(feature);
						}
					}

					dispatch(actions.setFeatureCollection([]));
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
				newState.datasource = action.datasource;
				return newState;
			}
			case actionTypes.SET_FILTERED_DATASOURCE: {
				newState = objectAssign({}, state);
				newState.filteredDatasource = action.filteredDatasource;
				newState.fcIndex = 'notUsed'; //kdbush(
				// 	action.filteredDatasource,
				// 	(p) => p.geojson.coordinates[0],
				// 	(p) => p.geojson.coordinates[1]
				// );
				return newState;
			}
			case actionTypes.SET_FILTER: {
				newState = objectAssign({}, state);
				newState.filter = action.filter;
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

export default makeFeatureCollectionWithoutIndexDuck;
