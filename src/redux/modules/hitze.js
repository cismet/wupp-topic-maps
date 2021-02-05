import objectAssign from 'object-assign';

//TYPES
export const types = {
	SET_SIMULATIONS: 'HITZE/SET_SIMULATIONS',
	SET_SELECTED_BACKGROUND: 'HITZE/SET_SELECTED_BACKGROUND',
	SET_BACKGROUND_LAYER: 'HITZE/SET_BACKGROUND_LAYER',
	SET_MINIFIED_INFO_BOX: 'HITZE/SET_MINIFIED_INFO_BOX',
	SET_FEATUREINFOMODE_ACTIVATION: 'HITZE/SET_FEATUREINFOMODE_ACTIVATION',
	SET_FEATUREOINFO_VALUE: 'HITZE/SET_FEATUREOINFO_VALUE',
	SET_FEATUREOINFO_POSITION: 'HITZE/SET_FEATUREOINFO_POSITION',
	SET_FEATUREOINFO_SIMULATION: 'HITZE/SET_FEATUREOINFO_SIMULATION',
	SET_MODELLAYERPROBLEM_STATUS: 'HITZE/SET_MODELLAYERPROBLEM_STATUS'
};

export const constants = {};

///INITIAL STATE
export const initialState = {
	modelLayerProblem: false,
	featureInfoModeActivated: false,
	currentFeatureInfoValue: undefined,
	currentFeatureInfoSelectedSimulation: undefined,
	currentFeatureInfoPosition: undefined,
	minifiedInfoBox: false,
	selectedSimulations: [ 0, 1, 2 ],
	backgroundLayer: undefined,
	selectedBackground: 0,
	discardedSimulations: [
		{
			layer: 'Frischluftschneisen',
			longname: 'Luftleitbahnen',

			name: 'Luftleitbahnen',
			title: 'Starkregen SRI 6 (38,5 l/m² in 2h)',
			icon: 'bar-chart',
			opacity: 0.7,
			subtitle:
				'Simulation eines zweistündigen Starkregens mit 38,5 Liter/m² Niederschlag (Starkregenindex SRI 6) in ganz Wuppertal, statistische Wiederkehrzeit 50 Jahre'
		}
	],
	simulations: [
		{
			layer: 'Hitze-Ist',
			longname: 'Hitzeinsel im IST-Zustand',
			name: 'Hitzebelastung',
			icon: 'bar-chart',
			title: 'Starkregen SRI 7 (42 l/m² in 2h)',
			opacity: 0.7,
			subtitle:
				'Simulation eines zweistündigen Starkregens mit 42 Liter/m² Niederschlag (Starkregenindex SRI 7) in ganz Wuppertal, statistische Wiederkehrzeit 100 Jahre'
		},
		{
			layer: 'Hitze-Stark-Ist',
			longname: 'starke Hitzeinsel im IST-Zustand',
			name: 'starke Hitzebelastung',
			icon: 'bitbucket',
			title: 'Starkregen SRI 10 (90 l/m² in 1h)',
			opacity: 0.7,
			subtitle:
				'Simulation eines einstündigen Starkregens mit 90 Liter/m² Niederschlag (Starkregenindex SRI 10) in ganz Wuppertal'
		},
		{
			layer: 'Hitze-2050',
			longname: 'Ausweitung der Hitzeinsel im Zukunftsszenario 2050',
			name: 'Zukunftsszenario 2050-2060',
			icon: 'calendar',
			title: 'Regen vom 29.05.2018 (SRI 11)',
			opacity: 0.7,
			subtitle:
				'Simulation des Starkregens vom 29.05.2018 (Starkregenindex SRI 11) für das gesamte Stadtgebiet anhand gemessener Niederschlagsmengen'
		}
	],
	backgrounds: [
		{
			layerkey: 'hillshade|bplan_abkg@30|wupp-plan-live@20',
			src: '/images/rain-hazard-map-bg/topo.png',
			title: 'Top. Karte'
		},
		{
			layerkey: 'trueOrtho2020@50|rvrSchrift@100|wupp-plan-live@20',
			src: '/images/rain-hazard-map-bg/ortho.png',
			title: 'Luftbildkarte'
		},
		{
			layerkey: 'wupp-plan-live@40',
			src: '/images/rain-hazard-map-bg/citymap.png',
			title: 'Stadtplan'
		}
	],
	legend: [
		// { title: 'Luft', lt: 0.1, bg: '#2<a>&lt;&lt;</a>FF' },
		{ title: 'Hitze', lt: 0.3, bg: '#FFD521' },
		{ title: 'starke Hitze', lt: 0.4, bg: '#FF3C2E' },
		{ title: '2050-2060', lt: 1.0, bg: '#CE1EE8' }
	]
};
///REDUCER
export default function reducer(state = initialState, action) {
	let newState;
	switch (action.type) {
		case types.SET_SIMULATIONS: {
			newState = objectAssign({}, state);
			newState.selectedSimulations = action.simulations;
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
		case types.SET_MODELLAYERPROBLEM_STATUS: {
			newState = objectAssign({}, state);
			newState.modelLayerProblem = action.modelLayerProblem;
			return newState;
		}
		default:
			return state;
	}
}

///SIMPLEACTIONCREATORS
function setSelectedSimulations(simulations) {
	return { type: types.SET_SIMULATIONS, simulations };
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

function setModelLayerProblemStatus(modelLayerProblem) {
	return { type: types.SET_MODELLAYERPROBLEM_STATUS, modelLayerProblem };
}
//COMPLEXACTIONS

function setSimulations(simulations) {
	return (dispatch, getState) => {
		let localState = getState().hitze;
		dispatch(setSelectedSimulations(simulations));
		if (localState.featureInfoModeActivated) {
			dispatch(getFeatureInfo());
		}
	};
}

function getFeatureInfo(mapEvent) {
	return (dispatch, getState) => {
		// let localState = getState().starkregen;
		// let pos;
		// if (!mapEvent) {
		// 	if (
		// 		localState.currentFeatureInfoPosition &&
		// 		localState.currentFeatureInfoSelectedSimulation !== localState.selectedSimulation
		// 	) {
		// 		pos = localState.currentFeatureInfoPosition;
		// 	} else {
		// 		return;
		// 	}
		// } else {
		// 	pos = proj4(proj4.defs('EPSG:4326'), proj4crs25832def, [
		// 		mapEvent.latlng.lng,
		// 		mapEvent.latlng.lat
		// 	]);
		// }
		// const minimalBoxSize = 0.0001;
		// const selectedSimulation = localState.simulations[localState.selectedSimulation].layer;
		// const getFetureInfoRequestUrl =
		// 	`https://maps.wuppertal.de/deegree/wms?` +
		// 	`service=WMS&request=GetFeatureInfo&` +
		// 	`styles=default&format=image%2Fpng&transparenttrue&` +
		// 	`version=1.1.1&tiled=true&` +
		// 	`width=1&height=1&srs=EPSG%3A25832&` +
		// 	`bbox=` +
		// 	`${pos[0] - minimalBoxSize},` +
		// 	`${pos[1] - minimalBoxSize},` +
		// 	`${pos[0] + minimalBoxSize},` +
		// 	`${pos[1] + minimalBoxSize}&` +
		// 	`x=0&y=0&` +
		// 	`layers=${selectedSimulation}&` +
		// 	`QUERY_LAYERS=${selectedSimulation}&` +
		// 	`INFO_FORMAT=application/vnd.ogc.gml`;
		// let valueKey = 'll:value';
		// if (/Edge/.test(navigator.userAgent)) {
		// 	valueKey = 'value';
		// }
		// fetch(getFetureInfoRequestUrl)
		// 	.then((response) => {
		// 		if (response.ok) {
		// 			return response.text();
		// 		} else {
		// 			throw new Error("Server response wasn't OK");
		// 		}
		// 	})
		// 	.then((data) => {
		// 		const parser = new DOMParser();
		// 		const xmlDoc = parser.parseFromString(data, 'text/xml');
		// 		const value = parseFloat(xmlDoc.getElementsByTagName(valueKey)[0].textContent, 10);
		// 		dispatch(setCurrentFeaturSelectedSimulation(localState.selectedSimulation));
		// 		dispatch(setCurrentFeatureInfoValue(value));
		// 		dispatch(setCurrentFeatureInfoPosition(pos));
		// 	})
		// 	.catch((error) => {
		// 		console.log('error during fetch', error);
		// 	});
	};
}

//EXPORT ACTIONS
export const actions = {
	setSimulations,
	setSelectedBackground,
	setBackgroundLayer,
	setMinifiedInfoBox,
	setFeatureInfoModeActivation,
	setCurrentFeatureInfoValue,
	setCurrentFeatureInfoPosition,
	getFeatureInfo,
	setModelLayerProblemStatus
};

//HELPER FUNCTIONS
