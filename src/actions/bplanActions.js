import * as actionTypes from '../constants/actionTypes';
import { getPolygonfromBBox } from '../utils/gisHelper';
import * as mappingActions from './mappingActions';

import {
  SERVICE,
  DOMAIN
} from '../constants/cids';

import 'whatwg-fetch';
import * as stateConstants from '../constants/stateConstants';


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
            
        //   dispatch(uiStateActions.showWaiting(false));
           dispatch(mappingActions.setFeatureCollection(featureArray));
           dispatch(mappingActions.setSelectedFeatureIndex(0));
           dispatch(mappingActions.fitFeatureBounds(featureArray[0],stateConstants.AUTO_FIT_MODE_STRICT));

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
    let plaene_rk;
    if (propArray[3]!=null) {
      plaene_rk=JSON.parse(propArray[3]);
    } else {
      plaene_rk=[];
    }
    let plaene_nrk;
    if (propArray[4]!=null) {
      plaene_nrk=JSON.parse(propArray[4]);
    } else {
      plaene_nrk=[];
    }
    let docs;
    if (propArray[5]!=null) {
      docs=JSON.parse(propArray[5]);
    } else {
      docs=[];
    }
    return  {
    "id": propArray[0],
    "type": "Feature",
    "selected": false,
    "geometry": JSON.parse(propArray[6]),
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
    "plaene_rk":plaene_rk,
    "plaene_nrk":plaene_nrk,
    "docs":docs    
    }
  };
}