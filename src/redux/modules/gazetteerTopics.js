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
  let md5=null;
  console.log("loadTopicData outer "+topicKey)
  return (dispatch,getState) => {
    console.log("loadTopicData inner "+topicKey)
    const state = getState();
    return fetch('/gaz/' + topicKey + '.json.md5', {
      method: 'get'
    }).then((response)=>{
      if(response.ok) {
        return response.text();
      } else {
        throw new Error('Server md5 response wasn\'t OK');
      }
    }).then((md5value)=>{
      if (md5value.trim()===state.gazetteerTopics[topicKey+"-md5"]) {
        console.log("already in store. no need to fetch")
      }
      else {
        console.log(topicKey + " not in store. need to fetch")
        md5=md5value.trim();
        return topicKey;
      }

    }).then((topicKey)=>{
      console.log(topicKey);
      console.log(md5);
      return fetch('/gaz/' + topicKey + '.json', { method: 'get' });
    }).then((response)=>{
      if(response.ok) {
        return response.json();
      } else {
        throw new Error('Server json response wasn\'t OK');
      }
    }).then((result)=>{
      let resultString=JSON.stringify(result);
      console.log(topicKey + "resultstring ready length:"+resultString.length);
      return dispatch(setTopicData(topicKey,resultString , md5));
      //
      console.log("pause")
      sleep(1000);
      console.log("go on")
    });
  };
}

function forceLoadTopicData(topicKey, md5) {
  return function(dispatch, getState) {
    return fetch('/gaz/' + topicKey + '.json', {
      method: 'get'
    }).then(function(response) {
      if (response.status >= 200 && response.status < 300) {
        response.json().then(function(result) {
          return dispatch(setTopicData(topicKey, JSON.stringify(result), md5));
        });
      } else {
        //TODO Error
        console.log("ERROR");
      }
    });
  }
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

//EXPORT ACTIONS

export const actions = {
    setTopicData,
    loadTopicData,
    loadTopicsData,
    clearAll
};
