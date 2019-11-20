import objectAssign from 'object-assign';

const makeSecondaryInfoBoxStateDuck = (section, substateResolver) => {
	const actionTypes = {
		SET: `HO/SECONDARYINFOBOXVISIBILITYSTATE/${section}/SET`
	};
	const initialState = {
		visible: false
	};

	//SELECTORS
	const selectors = {
		isSecondaryInfoBoxVisible: (state) => state.visible
	};
	const actions = {
		setSecondaryInfoBoxVisibilityState: (visible) => ({
			type: actionTypes.SET,
			visible
		})
	};

	const reducer = (state = initialState, action) => {
		let newState;
		switch (action.type) {
			case actionTypes.SET: {
				newState = objectAssign({}, action.visible);
				newState.visible = action.visible;
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

export default makeSecondaryInfoBoxStateDuck;
