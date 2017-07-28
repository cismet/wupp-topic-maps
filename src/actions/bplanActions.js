//import * as actionTypes from '../constants/actionTypes';
import { getPolygonfromBBox } from '../utils/gisHelper';
import * as mappingActions from './mappingActions';
import * as actionTypes from '../constants/actionTypes';
import * as turf from '@turf/turf';
import * as stateConstants from '../constants/stateConstants';

import {
  SERVICE
} from '../constants/cids';

import 'whatwg-fetch';


export function searchForPlans(gazObject) {
  return function (dispatch, getState) {
    dispatch(mappingActions.setSearchProgressIndicator(true));
    const state = getState();
    let query={
      "list": [{
        "key": "wktString",
        "value": getPolygonfromBBox(state.mapping.boundingBox)
      }
      ,{
        "key": "status",
        "value": ''
      },{
        "key": "srs",
        "value": 25832
      },{
        "key": "urlprefix",
        "value": "https://wunda-geoportal-docs.cismet.de"
      }
      ]
    };
    //console.log(JSON.stringify(query));
    fetch(SERVICE + '/searches/WUNDA_BLAU.BPlanAPISearch/results?role=all&limit=100&offset=0', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(query)

    }).then(function (response) {
      if (response.status >= 200 && response.status < 300) {
        response.json().then(function (result) {
            
            let featureArray=[];
            let counter=0;
            let lastFeature=null;
            let selectionIndexWish=0;
            for (let objArr of result.$collection) {
                let feature=convertPropArrayToFeature(objArr,counter);
                
                if (lastFeature!=null && JSON.stringify(feature.geometry)==JSON.stringify(lastFeature.geometry)) {
                  lastFeature.twin=counter;
                  feature.twin=counter-1;
                }

                //check whether the gazetteer-object has a property verfahrensnummer
                //if this verfahrensnummer matches the nummer of the feature this
                //should be the only feature in the resultset
                if (gazObject!=null && gazObject.length == 1 && gazObject[0] !=null && gazObject[0].verfahrensnummer==feature.properties.nummer) {
                  featureArray=[feature];
                  break;
                }
                
                featureArray.push(feature);
                lastFeature=feature;
                counter++;
            }

           dispatch(mappingActions.setSearchProgressIndicator(false));
           dispatch(mappingActions.setFeatureCollection(featureArray));
           if (featureArray.length>0) {
            dispatch(mappingActions.setSelectedFeatureIndex(selectionIndexWish));
           }
           if (gazObject!=null && gazObject.length == 1 && gazObject[0] !=null) {
              let p=turf.point([gazObject[0].x,gazObject[0].y]);
              if (turf.inside(p,featureArray[selectionIndexWish])) {
                dispatch(mappingActions.fitFeatureBounds(featureArray[selectionIndexWish],stateConstants.AUTO_FIT_MODE_STRICT));
              }
           }
          
        });
      } else if (response.status === 401) {
           dispatch(mappingActions.setSearchProgressIndicator(false));
      }
    });
  };
}
export function setDocumentLoadingIndicator(isLoading) {
  return {
    type: actionTypes.SET_DOCUMENT_LOADING_INDICATOR,
    isLoading
  };
}

function convertPropArrayToFeature(propArray,counter,){
    let plaene_rk;
    let geom=JSON.parse(propArray[6]);
    
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
    "id": propArray[0]+"."+counter,
    "type": "Feature",
    "selected": false,
    "geometry": geom,
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
    "docs":docs,
    "twin":null
    }
  };
}