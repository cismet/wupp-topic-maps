import objectAssign from 'object-assign';

import { proj4crs25832def } from '../../constants/gis';
import proj4 from 'proj4';

//TYPES
export const types = {
	SET_SIMULATION: 'STARKREGEN/SET_SIMULATION',
	SET_SELECTED_BACKGROUND: 'STARKREGEN/SET_SELECTED_BACKGROUND',
	SET_BACKGROUND_LAYER: 'STARKREGEN/SET_BACKGROUND_LAYER',
	SET_MINIFIED_INFO_BOX: 'STARKREGEN/SET_MINIFIED_INFO_BOX',
	SET_FEATUREINFOMODE_ACTIVATION: 'STARKREGEN/SET_FEATUREINFOMODE_ACTIVATION',
	SET_FEATUREOINFO_VALUE: 'STARKREGEN/SET_FEATUREOINFO_VALUE',
	SET_FEATUREOINFO_POSITION: 'STARKREGEN/SET_FEATUREOINFO_POSITION',
	SET_FEATUREOINFO_SIMULATION: 'STARKREGEN/SET_FEATUREOINFO_SIMULATION'
};

export const constants = {};

///INITIAL STATE
export const initialState = {
	featureInfoModeActivated: false,
	currentFeatureInfoValue: undefined,
	currentFeatureInfoSelectedSimulation: undefined,
	currentFeatureInfoPosition: undefined,
	minifiedInfoBox: false,
	selectedSimulation: 0,
	backgroundLayer: undefined,
	selectedBackground: 0,
	simulations: [
		{
			layer: 'R102:20md',
			name: '20-jährlich',
			title: '20-jährlicher Starkregen (2h)',
			icon: 'bar-chart',
			subtitle:
				'Simulation eines zweistündigen Starkregens mit statistisch 20-jährlicher Wiederkehrzeit in ganz Wuppertal mit Intensitätsverlauf Modell Euler Typ II'
		},
		{
			layer: 'R102:100md',
			name: '100-jährlich',
			icon: 'bar-chart',
			title: '100-jährlicher Starkregen (2h)',
			subtitle:
				'Simulation eines zweistündigen Starkregens mit statistisch 100-jährlicher Wiederkehrzeit in ganz Wuppertal mit Intensitätsverlauf Modell Euler Typ II'
		},
		{
			layer: 'R102:90md',
			name: '90 Liter/m²',
			icon: 'bitbucket',
			title: '90 Liter/m² Blockregen (1h)',
			subtitle:
				'Simulation eines einstündigen Starkregens (90 Liter pro m²) mit gleichmäßiger Intensität ("Blockregen") in ganz Wuppertal'
		},
		{
			layer: 'R102:SRmd',
			name: '29.05.18',
			icon: 'calendar',
			title: 'Starkregen vom 29.05.2018',
			subtitle:
				'Simulation des Starkregens vom 29.05.2018 für das gesamte Stadtgebiet anhand gemessener Niederschlagsmengen'
		}
	],
	backgrounds: [
		{ layerkey: 'hillshade|bplan_abkg@30 ', src: '/images/rain-hazard-map-bg/topo.png', title: 'Top. Karte' },
		{ layerkey: 'trueOrtho2018@50', src: '/images/rain-hazard-map-bg/ortho.png', title: 'Luftbild' },
		{ layerkey: 'wupp-plan-live@40', src: '/images/rain-hazard-map-bg/citymap.png', title: 'Stadtplan' }
	],
	legend: [
		{ title: '> 10 cm', lt: 0.1, bg: '#AFCFF9' },
		{ title: '> 30 cm', lt: 0.3, bg: '#FED27B' },
		{ title: '> 50 cm', lt: 0.4, bg: '#E9B279' },
		{ title: '> 100 cm', lt: 1.0, bg: '#DD8C7B' }
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
		case types.SET_SELECTED_BACKGROUND: {
			newState = objectAssign({}, state);
			newState.selectedBackground = action.backgroundIndex;
			return newState;
		}
		case types.SET_BACKGROUND_LAYER: {
			newState = objectAssign({}, state);
			newState.backgroundLayer = action.layer;
			return newState;
		}
		case types.SET_MINIFIED_INFO_BOX: {
			newState = objectAssign({}, state);
			newState.minifiedInfoBox = action.minified;
			return newState;
		}
		case types.SET_FEATUREINFOMODE_ACTIVATION: {
			newState = objectAssign({}, state);
			newState.featureInfoModeActivated = action.activated;
			return newState;
		}
		case types.SET_FEATUREOINFO_VALUE: {
			newState = objectAssign({}, state);
			newState.currentFeatureInfoValue = action.value;
			return newState;
		}
		case types.SET_FEATUREOINFO_POSITION: {
			newState = objectAssign({}, state);
			newState.currentFeatureInfoPosition = action.position;
			return newState;
		}
		case types.SET_FEATUREOINFO_SIMULATION: {
			newState = objectAssign({}, state);
			newState.currentFeatureInfoSelectedSimulation = action.simulation;
			return newState;
		}
		default:
			return state;
	}
}

///SIMPLEACTIONCREATORS
function setSelectedSimulation(simulation) {
	return { type: types.SET_SIMULATION, simulation };
}
function setSelectedBackground(backgroundIndex) {
	return { type: types.SET_SELECTED_BACKGROUND, backgroundIndex };
}
function setBackgroundLayer(layers) {
	return { type: types.SET_BACKGROUND_LAYER, layers };
}
function setMinifiedInfoBox(minified) {
	return { type: types.SET_MINIFIED_INFO_BOX, minified };
}
function setFeatureInfoModeActivation(activated) {
	return { type: types.SET_FEATUREINFOMODE_ACTIVATION, activated };
}
function setCurrentFeatureInfoValue(value) {
	return { type: types.SET_FEATUREOINFO_VALUE, value };
}
function setCurrentFeatureInfoPosition(position) {
	return { type: types.SET_FEATUREOINFO_POSITION, position };
}
function setCurrentFeaturSelectedSimulation(simulation) {
	return { type: types.SET_FEATUREOINFO_SIMULATION, simulation };
}
//COMPLEXACTIONS

function setSimulation(simulation) {
	return (dispatch, getState) => {
		let localState = getState().starkregen;
		dispatch(setSelectedSimulation(simulation));
		if (localState.featureInfoModeActivated) {
			dispatch(getFeatureInfo());
		}
	};
}

function getFeatureInfo(mapEvent) {
	return (dispatch, getState) => {
		let localState = getState().starkregen;
		let pos;
		if (!mapEvent) {
			if (
				localState.currentFeatureInfoPosition &&
				localState.currentFeatureInfoSelectedSimulation !== localState.selectedSimulation
			) {
				pos = localState.currentFeatureInfoPosition;
			} else {
				return;
			}
		} else {
			pos = proj4(proj4.defs('EPSG:4326'), proj4crs25832def, [ mapEvent.latlng.lng, mapEvent.latlng.lat ]);
		}
		const wkt = `POINT(${pos[0]} ${pos[1]})`;
		const minimalBoxSize = 0.0001;
		const selectedSimulation = localState.simulations[localState.selectedSimulation].layer;
		const getFetureInfoRequestUrl =
			`https://geoportal.wuppertal.de/deegree/wms?` +
			`service=WMS&request=GetFeatureInfo&` +
			`styles=default&format=image%2Fpng&transparenttrue&` +
			`version=1.1.1&tiled=true&` +
			`width=1&height=1&srs=EPSG%3A25832&` +
			`bbox=` +
			`${pos[0] - minimalBoxSize},` +
			`${pos[1] - minimalBoxSize},` +
			`${pos[0] + minimalBoxSize},` +
			`${pos[1] + minimalBoxSize}&` +
			`x=0&y=0&` +
			`layers=${selectedSimulation}&` +
			`QUERY_LAYERS=${selectedSimulation}&` +
			`INFO_FORMAT=application/vnd.ogc.gml`;

		fetch(getFetureInfoRequestUrl)
			.then((response) => {
				if (response.ok) {
					return response.text();
				} else {
					throw new Error("Server md5 response wasn't OK");
				}
			})
			.then((data) => {
				const parser = new DOMParser();
				const xmlDoc = parser.parseFromString(data, 'text/xml');
				const value = parseFloat(xmlDoc.getElementsByTagName('ll:value')[0].textContent, 10);
				dispatch(setCurrentFeaturSelectedSimulation(localState.selectedSimulation));
				dispatch(setCurrentFeatureInfoValue(value));
				dispatch(setCurrentFeatureInfoPosition(pos));
			})
			.catch((error) => {
				console.log('error during fetch', error);
			});
	};
}

//EXPORT ACTIONS
export const actions = {
	setSimulation,
	setSelectedBackground,
	setBackgroundLayer,
	setMinifiedInfoBox,
	setFeatureInfoModeActivation,
	setCurrentFeatureInfoValue,
	setCurrentFeatureInfoPosition,
	getFeatureInfo
};

//HELPER FUNCTIONS
