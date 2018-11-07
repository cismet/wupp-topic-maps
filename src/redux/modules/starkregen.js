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
			title: '20-jährlicher Starkregen (2h)',
			icon: 'bar-chart',
			subtitle:
				'Simulation eines zweistündigen Starkregens mit statistisch 20-jährlicher Wiederkehrzeit in ganz Wuppertal (Intensitätsverlauf Modell Euler Typ II)'
		},
		{
			layer: 'R102:100md',
			name: '100-jährlich',
			icon: 'bar-chart',
			title: '100-jährlicher Starkregen (2h)',
			subtitle:
				'Simulation eines zweistündigen Starkregens mit statistisch 100-jährlicher Wiederkehrzeit in ganz Wuppertal (Intensitätsverlauf Modell Euler Typ II)'
		},
		{
			layer: 'R102:90md',
			name: '90 Liter/m²',
			icon: 'bitbucket',
			title: '90 Liter/m² Blockregen (1h)',
			subtitle:
				'Simulation eines einstündigen Starkregens (90 Liter pro m²) mit gleichmäßiger Intensität ("Blockregen") in ganz Wuppertal '
		},
		{
			layer: 'R102:SRmd',
			name: '29.05.18',
			icon: 'calendar',
			title: 'Starkregen vom 29.05.2018',
			subtitle:
				'Simulation des Starkregens vom 29.05.2018 in den Tallagen von Barmen und Elberfeld anhand gemessener Niederschlagsmengen'
		}
	],
	backgrounds: [
		{ layerkey: 'wupp-plan-live@40', src: '/images/rain-hazard-map-bg/citymap.png', title: 'Stadtplan' },
		{ layerkey: 'trueOrtho2018@40', src: '/images/rain-hazard-map-bg/ortho.png', title: 'Luftbild' },
		{
			layerkey: 'wupp-plan-live@60|trueOrtho2018@40',
			src: '/images/rain-hazard-map-bg/mixed.png',
			title: 'Luftbild mit Beschriftungen'
		}
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
