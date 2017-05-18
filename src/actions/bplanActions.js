import * as actionTypes from '../constants/actionTypes';
import { getPolygonfromBBox } from '../utils/gisHelper';
import * as mappingActions from './mappingActions';

import {
  SERVICE,
  DOMAIN
} from '../constants/cids';

import 'whatwg-fetch';


export function searchForPlans() {
  return function (dispatch, getState) {
    // dispatch(uiStateActions.showWaiting(true, "Kassenzeichen laden ..."));
    const state = getState();
    let username = "admin";
    let pass = "leo";
    let query={
      "list": [{
        "key": "wktString",
        "value": getPolygonfromBBox(state.mapping.boundingBox)
      }]
    };
    fetch(SERVICE + '/searches/WUNDA_BLAU.BPlanAPISearch/results?role=all&limit=100&offset=0', {
      method: 'post',
      headers: {
        'Authorization': 'Basic ' + btoa(username + '@' + DOMAIN + ':' + pass),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(query)

    }).then(function (response) {
      if (response.status >= 200 && response.status < 300) {
        response.json().then(function (result) {
            
            let featureArray=[];
            for (let objArr of result.$collection) {
                featureArray.push(convertPropArrayToFeature(objArr));
            }
            console.log(featureArray);
        //   dispatch(uiStateActions.showWaiting(false));
           dispatch(mappingActions.setFeatureCollection(featureArray));
        //   dispatch(mappingActions.showKassenzeichenObject(kassenzeichenData,skipFitBounds));
        });
      } else if (response.status === 401) {
        // dispatch(uiStateActions.showWaiting(false));
        // dispatch(uiStateActions.invalidateLogin(username, pass, false));
      }
    });
  };
}

function convertPropArrayToFeature(propArray){
    return  {
    "type": "Feature",
    "geometry": JSON.parse(propArray[5]),
    "crs": {
        "type": "name",
        "properties": {
            "name": "urn:ogc:def:crs:EPSG::25832"
        }
    },
    "properties": {
    "nummer":propArray[0],
    "name":propArray[1],
    "status":propArray[2],
    "plaene":propArray[3],
    "docs":propArray[4],    
    }
  };
}