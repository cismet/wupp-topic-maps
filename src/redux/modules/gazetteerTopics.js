import objectAssign from 'object-assign';


///TYPES
export const types = {
    SET_GAZETTEER_TOPIC: 'GAZETTEER_TOPICS/SET_GAZETTEER_TOPIC',
    CLEAR_ALL_GAZETTEER_TOPICS: 'GAZETTEER_TOPICS/CLEAR_ALL_GAZETTEER_TOPICS'

}

///INITIAL STATE
const initialState = {

};

///REDUCER
export default function gazetteerTopicsReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case types.SET_GAZETTEER_TOPIC:
      {
        newState = objectAssign({}, state);
        newState[action.topic+"-md5"] = action.md5;
        newState[action.topic] = action.datastring;
        return newState;
      }
    case types.CLEAR_ALL_GAZETTEER_TOPICS:
      {
        return {};
      }
    default:
      return state;
  }
}

///SIMPLEACTIONCREATORS

function setTopicData(topic,datastring,md5) {
    return {type: types.SET_GAZETTEER_TOPIC, topic, datastring, md5};
}

function clearAll() {
    return {type: types.CLEAR_ALL_GAZETTEER_TOPICS};
}

//COMPLEXACTIONS

function loadTopicsData(topicKeys) {
  return function(dispatch,getState) {
     let loaderpromises=topicKeys.map(loadTopicData);
     let dispatchedloaderpromises=loaderpromises.map(dispatch);
    //
    // return Promise.all([
    //   dispatch(loadTopicData("pois")),
    //   dispatch(loadTopicData("quartiere")),
    //   dispatch(loadTopicData("bezirke")),
    //   dispatch(loadTopicData("bplaene")),
    //   dispatch(loadTopicData("adressen")),
    // ]);

    return Promise.all(dispatchedloaderpromises);
  }
}


function loadTopicData(topicKey) {
  const debugMsg=false;
  let noCacheHeaders = new Headers();
  noCacheHeaders.append('pragma', 'no-cache');
  noCacheHeaders.append('cache-control', 'no-cache');

  let md5=null;
  if (debugMsg) console.log("loadTopicData outer "+topicKey)
  return (dispatch,getState) => {
    if (debugMsg) console.log("loadTopicData inner "+topicKey)
    const state = getState();
    return fetch('/gaz/' + topicKey + '.json.md5', {
        method: 'get', 
        headers: noCacheHeaders
    }).then((response)=>{
      if(response.ok) {
        return response.text();
      } else {
        throw new Error('Server md5 response wasn\'t OK');
      }
    }).then((md5value)=>{
      md5=md5value.trim();
      if (debugMsg) console.log("Check: "+topicKey +" : "+state.gazetteerTopics[topicKey+"-md5"]+"==="+md5+"  ???");
      if (md5===state.gazetteerTopics[topicKey+"-md5"]) {
        if (debugMsg) console.log("already in store. no need to fetch")
        throw 'CACHEHIT';
      }
      else {
        if (debugMsg) console.log(topicKey + " not in store. need to fetch")
        md5=md5value.trim();
        return topicKey;
      }
    }).then((topicKey)=>{
      if (debugMsg) console.log(topicKey + ":" + md5);
      return fetch('/gaz/' + topicKey + '.json', {
        method: 'get', 
        headers: noCacheHeaders
      });
    }).then((response)=>{
      if(response.ok) {
        return response.json();
      } else {
        throw new Error('Server json response wasn\'t OK');
      }
    }).then((result)=>{
      let resultString=JSON.stringify(result);
      if (debugMsg) console.log(topicKey + "resultstring ready length:"+resultString.length);
      return dispatch(setTopicData(topicKey,resultString , md5));
    }).catch(function(err){
      if (err !== 'CACHEHIT') {
        console.log("Error during loading of Topic Data. There will be Problems with the Gazetteer-Box.");
      }
    });
  };
}



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
