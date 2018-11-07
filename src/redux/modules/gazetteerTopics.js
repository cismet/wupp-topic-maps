import objectAssign from 'object-assign';

///TYPES
export const types = {
	SET_GAZETTEER_TOPIC: 'GAZETTEER_TOPICS/SET_GAZETTEER_TOPIC',
	CLEAR_ALL_GAZETTEER_TOPICS: 'GAZETTEER_TOPICS/CLEAR_ALL_GAZETTEER_TOPICS'
};

///INITIAL STATE
const initialState = {};

///REDUCER
export default function gazetteerTopicsReducer(state = initialState, action) {
	let newState;
	switch (action.type) {
		case types.SET_GAZETTEER_TOPIC: {
			newState = objectAssign({}, state);
			newState[action.topic + '-md5'] = action.md5;
			newState[action.topic] = action.datastring;
			return newState;
		}
		case types.CLEAR_ALL_GAZETTEER_TOPICS: {
			return {};
		}
		default:
			return state;
	}
}

///SIMPLEACTIONCREATORS

function setTopicData(topic, datastring, md5) {
	return { type: types.SET_GAZETTEER_TOPIC, topic, datastring, md5 };
}

function clearAll() {
	return { type: types.CLEAR_ALL_GAZETTEER_TOPICS };
}

//COMPLEXACTIONS

function loadTopicsData(topicKeys) {
	return function(dispatch, getState) {
		let loaderpromises = topicKeys.map(loadTopicData);
		let dispatchedloaderpromises = loaderpromises.map(dispatch);
		//
		// return Promise.all([
		//   dispatch(loadTopicData("pois")),
		//   dispatch(loadTopicData("quartiere")),
		//   dispatch(loadTopicData("bezirke")),
		//   dispatch(loadTopicData("bplaene")),
		//   dispatch(loadTopicData("adressen")),
		// ]);

		return Promise.all(dispatchedloaderpromises);
	};
}

function loadTopicData(topicKey) {
	const debugMsg = false;
	let noCacheHeaders = new Headers();
	noCacheHeaders.append('pragma', 'no-cache');
	noCacheHeaders.append('cache-control', 'no-cache');

	let md5 = null;
	if (debugMsg) console.log('loadTopicData outer ' + topicKey);
	return (dispatch, getState) => {
		if (debugMsg) console.log('loadTopicData inner ' + topicKey);
		const state = getState();
		return fetch('/gaz/' + topicKey + '.json.md5', {
			method: 'get',
			headers: noCacheHeaders
		})
			.then((response) => {
				if (response.ok) {
					return response.text();
				} else {
					throw new Error("Server md5 response wasn't OK");
				}
			})
			.then((md5value) => {
				md5 = md5value.trim();
				if (debugMsg)
					console.log(
						'Check: ' + topicKey + ' : ' + state.gazetteerTopics[topicKey + '-md5'] + '===' + md5 + '  ???'
					);
				if (md5 === state.gazetteerTopics[topicKey + '-md5']) {
					if (debugMsg) console.log('already in store. no need to fetch');
					throw 'CACHEHIT';
				} else {
					if (debugMsg) console.log(topicKey + ' not in store. need to fetch');
					md5 = md5value.trim();
					return topicKey;
				}
			})
			.then((topicKey) => {
				if (debugMsg) console.log(topicKey + ':' + md5);
				return fetch('/gaz/' + topicKey + '.json', {
					method: 'get',
					headers: noCacheHeaders
				});
			})
			.then((response) => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error("Server json response wasn't OK");
				}
			})
			.then((result) => {
				let resultString = JSON.stringify(result);
				if (debugMsg) console.log(topicKey + 'resultstring ready length:' + resultString.length);
				return dispatch(setTopicData(topicKey, resultString, md5));
			})
			.catch(function(err) {
				if (err !== 'CACHEHIT') {
					console.log('Error during loading of Topic Data. There will be Problems with the Gazetteer-Box.');
				}
			});
	};
}

//EXPORT SELECTORS
export const getGazDataForTopicIds = (state, topics) => {
	let sorter = 0;

	let gazData = [];
	for (let topic of topics) {
		if (topic==='pois') {
			let pois = JSON.parse(state.pois);
			for (let i = 0; i < pois.length; ++i) {
				let topicItem = pois[i];
				let g = {
					sorter: sorter++,
					string: topicItem.s,
					glyph: topicItem.g,
					x: topicItem.x,
					y: topicItem.y,
					more: topicItem.m
				};
				gazData.push(g);
			}
    }
    if (topic==='quartiere') {
			let quartiere = JSON.parse(state.quartiere);
			for (let i = 0; i < quartiere.length; ++i) {
				let topicItem = quartiere[i];
				let g = {
					sorter: sorter++,
					string: topicItem.s,
					glyph: topicItem.g,
					x: topicItem.x,
					y: topicItem.y,
					more: topicItem.m
				};
				gazData.push(g);
			}
		}
    if (topic==='bezirke') {
			let bezirke = JSON.parse(state.bezirke);
			for (let i = 0; i < bezirke.length; ++i) {
				let topicItem = bezirke[i];
				let g = {
					sorter: sorter++,
					string: topicItem.s,
					glyph: topicItem.g,
					x: topicItem.x,
					y: topicItem.y,
					more: topicItem.m
				};
				gazData.push(g);
			}
    }
    if (topic==='kitas') {
			let kitas = JSON.parse(state.kitas);
			for (let i = 0; i < kitas.length; ++i) {
				let topicItem = kitas[i];
				let g = {
					sorter: sorter++,
					string: topicItem.s,
					glyph: topicItem.g,
					x: topicItem.x,
					y: topicItem.y,
					more: topicItem.m
				};
				gazData.push(g);
			}
		}
    if (topic==='adressen') {
			let adressen = JSON.parse(state.adressen);
			for (let i = 0; i < adressen.length; ++i) {
				let topicItem = adressen[i];
				let string = topicItem.s;
				if (topicItem.nr !== '' && topicItem.nr !== 0) {
					string = string + ' ' + topicItem.nr;
				}
				if (topicItem.z !== '') {
					string = string + ' ' + topicItem.z;
				}
				let g = {
					sorter: sorter++,
					string: string,
					glyph: topicItem.g,
					x: topicItem.x,
					y: topicItem.y,
					more: topicItem.m
				};
				gazData.push(g);
			}
		}
    if (topic==='bplaene') {
			let bplaene = JSON.parse(state.bplaene);
			for (let i = 0; i < bplaene.length; ++i) {
				let topicItem = bplaene[i];
				let g = {
					sorter: sorter++,
					string: topicItem.s,
					glyph: topicItem.g,
					x: topicItem.x,
					y: topicItem.y,
					more: topicItem.m
				};
				gazData.push(g);
			}
		}
    if (topic==='geps') {
      let geps = JSON.parse(state.geps);
			for (let i = 0; i < geps.length; ++i) {
				let topicItem = geps[i];
				let g = {
					sorter: sorter++,
					string: topicItem.s,
					glyph: topicItem.g,
					x: topicItem.x,
					y: topicItem.y,
					more: topicItem.m
				};
				gazData.push(g);
			}
		}
	}
	return gazData;
};

// For debugging purposes
// console.log("pause")
// sleep(1000);
// console.log("go on")
// function sleep(milliseconds) {
//   var start = new Date().getTime();
//   for (var i = 0; i < 1e7; i++) {
//     if ((new Date().getTime() - start) > milliseconds){
//       break;
//     }
//   }
// }

//EXPORT ACTIONS

export const actions = {
	setTopicData,
	loadTopicData,
	loadTopicsData,
	clearAll
};
