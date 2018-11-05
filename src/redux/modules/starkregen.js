import objectAssign from 'object-assign';

//TYPES
export const types = {
	SET_SIMULATION: 'STARKREGEN/SET_SIMULATION',
	SET_BACKGROUND: 'STARKREGEN/SET_BACKGROUND'
};

export const constants = {};

///INITIAL STATE
const initialState = {
	selectedSimulation: 0,
	selectedBackground: 0,
	simulations: [
		{
			layer: 'R102:20md',
			name: '20-jährlich',
			title: '20-jährlicher Starkregen',
			subtitle: 'Bei den angezeigten Wasserständen handelt es sich um Simulationsergebnisse eines Regenereignisses das statisch gesehen alle 20 Jahre vorkommt.'
		},
		// { layer: 'R102:50md', name:"50-jährlich",  title: '50-jährlicher Starkregen',subtitle: "Bei den angezeigten Wasserständen handelt es sich um Simulationsergebnisse."  },
		{
			layer: 'R102:100md',
			name: '100-jährlich',
			title: '100-jährlicher Starkregen',
			subtitle: 'Bei den angezeigten Wasserständen handelt es sich um Simulationsergebnisse eines Regenereignisses das statisch gesehen alle 100 Jahre vorkommt.'
		},
		{
			layer: 'R102:90md',
			name: '90mm Modell',
			title: '90mm Modellregen',
			subtitle: 'Bei den angezeigten Wasserständen handelt es sich um Simulationsergebnisse eines 90mm Modellregens.'
		},
		{
			layer: 'R102:50md',
			name: '29.05.2018',
			title: 'Ereignis am 29.05.2018',
			subtitle: 'Bei den angezeigten Wasserständen handelt es sich um Simulationsergebnisse. Als Grundlage wurde das Starkregenereignis vom 29.05.2018 herangezogen.'
		}
	],
	backgrounds: [
		{ layerkey:"wupp-plan-live@40",src: '/images/rain-hazard-map-bg/citymap.png', title: 'Stadtplan' },
		{ layerkey:"trueOrtho2018@40",src: '/images/rain-hazard-map-bg/ortho.png', title: 'Luftbild' },
		{ layerkey:"wupp-plan-live@60|trueOrtho2018@40",src: '/images/rain-hazard-map-bg/mixed.png', title: 'Luftbild mit Beschriftungen' }
	],
	legend: [
		{ title: '> 10 cm', bg: '#AFCFF9' },
		{ title: '> 30 cm', bg: '#FED27B' },
		{ title: '> 50 cm', bg: '#E9B279' },
		{ title: '> 100 cm', bg: '#DD8C7B' }
	]
};
///REDUCER
export default function starkregenReducer(state = initialState, action) {
	let newState;
	switch (action.type) {
		case types.SET_SIMULATION: {
			newState = objectAssign({}, state);
			newState.selectedSimulation = action.simulation;
			return newState;
		}
		case types.SET_BACKGROUND: {
			newState = objectAssign({}, state);
			newState.selectedBackground = action.background;
			return newState;
		}
		default:
			return state;
	}
}

///SIMPLEACTIONCREATORS
function setSimulation(simulation) {
	return { type: types.SET_SIMULATION, simulation };
}
function setBackground(background) {
	return { type: types.SET_BACKGROUND, background };
}
//COMPLEXACTIONS

//EXPORT ACTIONS
export const actions = {
	setSimulation,
	setBackground
};

//HELPER FUNCTIONS
