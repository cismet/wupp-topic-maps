import React, { PropTypes } from 'react';
import Cismap from '../containers/Cismap.jsx';
import { connect } from "react-redux";
import Control from 'react-leaflet-control';
import {browserHistory } from 'react-router';
import { Form, FormGroup, InputGroup, FormControl, Button, Well, Tooltip} from 'react-bootstrap';
import { getPolygonfromBBox } from '../utils/gisHelper';
import * as bplanActions from '../actions/bplanActions';
import { bindActionCreators } from 'redux';
import { bplanFeatureStyler, bplanLabeler, getLineColorFromFeature } from '../utils/bplanHelper';
import * as mappingActions from '../actions/mappingActions';
import * as uiStateActions from '../actions/uiStateActions';
import * as stateConstants from '../constants/stateConstants';
import { downloadSingleFile,downloadMultipleFiles } from '../utils/downloadHelper';
import BPlanModalHelp from '../components/BPlanModalHelpComponent';
import BPlanInfo  from '../components/BPlanInfo'
import {Icon} from 'react-fa'

function mapStateToProps(state) {
  return {
    ui: state.uiState,
    mapping: state.mapping,
    routing: state.routing,
    bplanAppState: state.bplanApp
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
  }

  bplanGazeteerhHit(selectedObject){   
    this.props.bplanActions.searchForPlans(selectedObject);
  }

  bplanSearchButtonHit(event) {
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
    if ((currentFeature.properties.plaene_rk.length+currentFeature.properties.plaene_nrk.length)==1 ) {
      if (currentFeature.properties.plaene_rk.length==1) {
        downloadSingleFile(currentFeature.properties.plaene_rk[0]);
      }
      else {
        downloadSingleFile(currentFeature.properties.plaene_nrk[0]);
      }
    }
    else {
      this.props.bplanActions.setDocumentLoadingIndicator(true);
      downloadMultipleFiles(
        [
          {"folder":"rechtskraeftig/","downloads":currentFeature.properties.plaene_rk},
          {"folder":"nicht rechtskraeftig/","downloads":currentFeature.properties.plaene_nrk}
        ], "BPLAN_Plaene."+currentFeature.properties.nummer,this.downloadDone);
    }
  }

  downloadEverything() {
    this.props.bplanActions.setDocumentLoadingIndicator(true);
    const currentFeature=this.props.mapping.featureCollection[this.props.mapping.selectedIndex];
    downloadMultipleFiles(
        [
          {"folder":"rechtskraeftig/","downloads":currentFeature.properties.plaene_rk},
          {"folder":"nicht rechtskraeftig/","downloads":currentFeature.properties.plaene_nrk},
          {"folder":"Zusatzdokumente/","downloads":currentFeature.properties.docs}
        ], "BPLAN_Plaene_und_Zusatzdokumente."+currentFeature.properties.nummer,this.downloadDone);
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
              loadingIndicator={this.props.bplanAppState.documentsLoading}
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
                  
                  <a onClick={this.openHelp} href='#'>vollst&auml;ndige Bedienungsanleitung</a>
               </Well>)
     }
  
   return (
        <div>
            <BPlanModalHelp key={'BPlanModalHelp.visible:'+this.props.ui.helpTextVisible}/>

            <Cismap layers={this.props.params.layers ||'uwBPlan'} 
                    gazeteerHitTrigger={this.bplanGazeteerhHit} 
                    searchButtonTrigger={this.bplanSearchButtonHit} 
                    featureStyler={bplanFeatureStyler}
                    labeler={bplanLabeler}
                    featureClickHandler={this.featureClick}
                    searchTooltipProvider={this.searchTooltip}
                    searchMinZoom={12}
                    searchMaxZoom={18}>
                <Control position="bottomright" >
                  {info}                    
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
  bplanAppState: PropTypes.object,
};
