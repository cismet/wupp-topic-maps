import objectAssign from 'object-assign';

const makeMinifiedInfoBoxStateDuck = (section, substateResolver) => {
	const actionTypes = {
		SET: `HO/MINIFIEDINFOBOXSTATE/${section}/SET`
	};
	const initialState = {
		minified: false
	};

	//SELECTORS
	const selectors = {
		getMinifiedInfoBoxState: (state) => state.minified
	};
	const actions = {
		setMinifiedInfoBoxState: (minified) => ({
			type: actionTypes.SET,
			minified
		})
	};

	const reducer = (state = initialState, action) => {
		let newState;
		switch (action.type) {
			case actionTypes.SET: {
				newState = objectAssign({}, action.minified);
				newState.minified = action.minified;
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

export default makeMinifiedInfoBoxStateDuck;
