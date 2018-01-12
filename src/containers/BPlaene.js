import React from 'react';
import PropTypes from 'prop-types';
import Cismap from '../containers/Cismap';
import { connect } from "react-redux";
import Control from 'react-leaflet-control';
import { Well, Tooltip} from 'react-bootstrap';

import { actions as bplanActions } from '../redux/modules/bplaene';
import { actions as mappingActions } from '../redux/modules/mapping';
import { actions as uiStateActions } from '../redux/modules/uiState';

import { bindActionCreators } from 'redux';
import { bplanFeatureStyler, bplanLabeler } from '../utils/bplanHelper';
import { downloadSingleFile,downloadMultipleFiles, mergeMultipleFiles } from '../utils/downloadHelper';
import BPlanModalHelp from '../components/BPlanModalHelpComponent';
import BPlanInfo  from '../components/BPlanInfo'
import {Icon} from 'react-fa'


import { proj4crs25832def } from '../constants/gis';
import proj4 from 'proj4';


function mapStateToProps(state) {
  return {
    ui: state.uiState,
    mapping: state.mapping,
    routing: state.routing,
    bplaene: state.bplaene
  };
}


function mapDispatchToProps(dispatch) {
  return {
    bplanActions: bindActionCreators(bplanActions,dispatch),
    mappingActions: bindActionCreators(mappingActions,dispatch),
    uiStateActions: bindActionCreators(uiStateActions,dispatch),

  };
}


export class BPlaene_ extends React.Component {
  constructor(props, context) {
      super(props, context);
      this.bplanSearchButtonHit=this.bplanSearchButtonHit.bind(this);
      this.bplanGazeteerhHit=this.bplanGazeteerhHit.bind(this);
      this.selectNextIndex=this.selectNextIndex.bind(this);
      this.selectPreviousIndex=this.selectPreviousIndex.bind(this);
      this.fitAll=this.fitAll.bind(this);
      this.featureClick=this.featureClick.bind(this);
      this.downloadPlan=this.downloadPlan.bind(this);
      this.downloadEverything=this.downloadEverything.bind(this);
      this.downloadDone=this.downloadDone.bind(this);
      this.openHelp=this.openHelp.bind(this);
      this.doubleMapClick = this.doubleMapClick.bind(this);

  }

  bplanGazeteerhHit(selectedObject){
    this.props.bplanActions.searchForPlans(selectedObject);
  }

  bplanSearchButtonHit(event) {
      console.log(this.props);
    this.props.bplanActions.searchForPlans();
  }

  selectNextIndex() {
    let potIndex=this.props.mapping.selectedIndex+1;
    if (potIndex>=this.props.mapping.featureCollection.length){
      potIndex=0;
    }
    this.props.mappingActions.setSelectedFeatureIndex(potIndex);
    //this.props.mappingActions.fitSelectedFeatureBounds(stateConstants.AUTO_FIT_MODE_NO_ZOOM_IN);
  }

  doubleMapClick(event) {
    console.log("suche nach bplan");
    console.log(event.latlng);
    const pos=proj4(proj4.defs('EPSG:4326'),proj4crs25832def,[event.latlng.lng,event.latlng.lat])

    let wkt=`POINT(${pos[0]} ${pos[1]})`;
    console.log(wkt);
    this.props.bplanActions.searchForPlans(null,wkt);
  }


  selectPreviousIndex() {
    let potIndex=this.props.mapping.selectedIndex-1;
    if (potIndex<0){
      potIndex=this.props.mapping.featureCollection.length-1;
    }
    this.props.mappingActions.setSelectedFeatureIndex(potIndex);
    //this.props.mappingActions.fitSelectedFeatureBounds(stateConstants.AUTO_FIT_MODE_NO_ZOOM_IN);
  }

  fitAll() {
    this.props.mappingActions.fitAll();
  }

  downloadPlan() {
    const currentFeature=this.props.mapping.featureCollection[this.props.mapping.selectedIndex];
    if ((currentFeature.properties.plaene_rk.length+currentFeature.properties.plaene_nrk.length)===1 ) {
      if (currentFeature.properties.plaene_rk.length===1) {
        downloadSingleFile(currentFeature.properties.plaene_rk[0]);
      }
      else {
        downloadSingleFile(currentFeature.properties.plaene_nrk[0]);
      }
    }
    else {
      this.props.bplanActions.setDocumentLoadingIndicator(true);
      let downloadConf= {
        "name":"BPLAN_Plaene."+currentFeature.properties.nummer,
        "files": []
      };
      for (let index = 0; index < currentFeature.properties.plaene_rk.length; ++index) {
        let prk=currentFeature.properties.plaene_rk[index];
        downloadConf.files.push({
            "uri":prk.url,
            "folder":"rechtskraeftig"
          });
      }
      for (let index = 0; index < currentFeature.properties.plaene_nrk.length; ++index) {
        let pnrk=currentFeature.properties.plaene_nrk[index];
        downloadConf.files.push({
            "uri":pnrk.url,
            "folder":"nicht rechtskraeftig"
          });
      }
      mergeMultipleFiles(downloadConf,this.downloadDone)
     }
  }

  downloadEverything() {
    this.props.bplanActions.setDocumentLoadingIndicator(true);
    const currentFeature=this.props.mapping.featureCollection[this.props.mapping.selectedIndex];
    // downloadMultipleFiles(
    //     [
    //       {"folder":"rechtskraeftig/","downloads":currentFeature.properties.plaene_rk},
    //       {"folder":"nicht rechtskraeftig/","downloads":currentFeature.properties.plaene_nrk},
    //       {"folder":"Zusatzdokumente/","downloads":currentFeature.properties.docs}
    //     ], "BPLAN_Plaene_und_Zusatzdokumente."+currentFeature.properties.nummer,this.downloadDone);

      let downloadConf= {
        "name":"BPLAN_Plaene_und_Zusatzdokumente."+currentFeature.properties.nummer,
        "files": []
      };
      for (let index = 0; index < currentFeature.properties.plaene_rk.length; ++index) {
        let prk=currentFeature.properties.plaene_rk[index];
        downloadConf.files.push({
            "uri":prk.url,
            "folder":"rechtskraeftig"
          });
      }
      for (let index = 0; index < currentFeature.properties.plaene_nrk.length; ++index) {
        let pnrk=currentFeature.properties.plaene_nrk[index];
        downloadConf.files.push({
            "uri":pnrk.url,
            "folder":"nicht rechtskraeftig"
          });
      }
      for (let index = 0; index < currentFeature.properties.docs.length; ++index) {
        let doc=currentFeature.properties.docs[index];
        downloadConf.files.push({
            "uri":doc.url,
            "folder":"Zusatzdokumente"
          });
      }

      downloadMultipleFiles(downloadConf,this.downloadDone);

  }

  downloadDone() {
    this.props.bplanActions.setDocumentLoadingIndicator(false);
  }

  openHelp() {
    this.props.uiStateActions.showHelpComponent(true);
  }

  featureClick(event){
    if (event.target.feature.selected) {
      this.props.mappingActions.fitSelectedFeatureBounds();
      if (event.target.feature.twin!=null) {
        this.props.mappingActions.setSelectedFeatureIndex(event.target.feature.twin);
      }
    }
    else {
      this.props.mappingActions.setSelectedFeatureIndex(this.props.mapping.featureCollection.indexOf(event.target.feature));
    }
  }

  searchTooltip(){
     return (<Tooltip style={{zIndex: 3000000000}} id="searchTooltip">B-Pl&auml;ne im Kartenausschnitt laden</Tooltip>);
  };

  render() {
   let info= null;
     if (this.props.mapping.featureCollection.length>0) {
        info = (
          <BPlanInfo
              featureCollection={this.props.mapping.featureCollection}
              selectedIndex={this.props.mapping.selectedIndex||0}
              next={this.selectNextIndex}
              previous={this.selectPreviousIndex}
              fitAll={this.fitAll}
              loadingIndicator={this.props.bplaene.documentsLoading}
              downloadPlan={this.downloadPlan}
              downloadEverything={this.downloadEverything}
              />
          )
     }
     else {
       info = (<Well>
                  <h5>Aktuell keine Bebauungspl&auml;ne  geladen.</h5>
                  <p>Um B-Pl&auml;ne an einem bestimmten Ort zu laden oder direkt auf <br />
                  einen Plan zuzugreifen, den Anfang (mindestens 2 Zeichen) <br />
                  eines Suchbegriffs eingeben (Adresse, POI oder B-Plan-<br />
                  Nummer)
                  und Eintrag aus Vorschlagsliste auswählen oder mit <br />
                  <Icon name="search"/> alle Pl&auml;ne im aktuellen Kartenausschnitt laden.</p>

                  <a onClick={this.openHelp}>vollst&auml;ndige Bedienungsanleitung</a>
               </Well>)
     }
   return (
        <div>
            <BPlanModalHelp key={'BPlanModalHelp.visible:'+this.props.ui.helpTextVisible}/>

            <Cismap layers={this.props.match.params.layers ||'uwBPlan'}
                    gazeteerHitTrigger={this.bplanGazeteerhHit}
                    searchButtonTrigger={this.bplanSearchButtonHit}
                    featureStyler={bplanFeatureStyler}
                    labeler={bplanLabeler}
                    featureClickHandler={this.featureClick}
                    ondblclick={this.doubleMapClick}
                    searchTooltipProvider={this.searchTooltip}
                    searchMinZoom={12}
                    searchMaxZoom={18}
                    gazTopics={["pois","bplaene","adressen"]}>
                <Control position="bottomright" >
                  <div>{info}</div>
                </Control>
            </Cismap>
        </div>
    );
  }
}

const BPlaene = connect(mapStateToProps,mapDispatchToProps)(BPlaene_);

export default BPlaene;

BPlaene.propTypes = {
  ui: PropTypes.object,
  kassenzeichen: PropTypes.object,
  uiState: PropTypes.object,
  bplaene: PropTypes.object,
};
