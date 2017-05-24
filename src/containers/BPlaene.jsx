import React, { PropTypes } from 'react';
import Cismap from '../containers/Cismap.jsx';
import { connect } from "react-redux";
import Control from 'react-leaflet-control';
import {browserHistory } from 'react-router';
import { Form, FormGroup, InputGroup, FormControl, Button, Glyphicon, Well} from 'react-bootstrap';
import { getPolygonfromBBox } from '../utils/gisHelper';
import * as bplanActions from '../actions/bplanActions';
import { bindActionCreators } from 'redux';
import { bplanFeatureStyler, bplanLabeler } from '../utils/bplanHelper';
import * as mappingActions from '../actions/mappingActions';
import * as stateConstants from '../constants/stateConstants';

import BPlanInfo  from '../components/BPlanInfo'

function mapStateToProps(state) {
  return {
    ui: state.uiState,
    mapping: state.mapping,
    routing: state.routing,
  };
}


function mapDispatchToProps(dispatch) {
  return {
    bplanActions: bindActionCreators(bplanActions,dispatch),
    mappingActions: bindActionCreators(mappingActions,dispatch),
  };
}


export class BPlaene_ extends React.Component {
  constructor(props, context) {
      super(props, context);
      this.bplanSearchButtonHit=this.bplanSearchButtonHit.bind(this);
      this.bplanGazeteerhHit=this.bplanGazeteerhHit.bind(this);
      this.selectNextIndex=this.selectNextIndex.bind(this);
      this.selectPreviousIndex=this.selectPreviousIndex.bind(this);
      this.featureClick=this.featureClick.bind(this);

  }

  bplanGazeteerhHit(selectedObject){   
    this.bplanSearchButtonHit();
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
    this.props.mappingActions.fitSelectedFeatureBounds(stateConstants.AUTO_FIT_MODE_NO_ZOOM_IN);
  }

  selectPreviousIndex() {
    let potIndex=this.props.mapping.selectedIndex-1;
    if (potIndex<0){
      potIndex=this.props.mapping.featureCollection.length-1;
    }
    this.props.mappingActions.setSelectedFeatureIndex(potIndex);
    this.props.mappingActions.fitSelectedFeatureBounds(stateConstants.AUTO_FIT_MODE_NO_ZOOM_IN);
  }

  featureClick(event){
    if (event.target.feature.selected) {
      this.props.mappingActions.fitSelectedFeatureBounds();
    }
    else {
      this.props.mappingActions.setSelectedFeatureIndex(this.props.mapping.featureCollection.indexOf(event.target.feature));
    }
  }

  render() {  
   let info= null;
     if (this.props.mapping.featureCollection.length>0) {
        info = (
          <BPlanInfo 
              featureCollection={this.props.mapping.featureCollection} 
              selectedIndex={this.props.mapping.selectedIndex||0}
              next={this.selectNextIndex}
              previous={this.selectPreviousIndex}
              />
          )
     }
     else {
       info = (<Well>jhhasdgfjakldsjdshafkahdsfjkhdfsjkhahdsgjhkdfsgjhkg</Well>)
     }
  
   return (
        <div>
            <Cismap layers={this.props.params.layers ||'abkIntra'} 
                    gazeteerHitTrigger={this.bplanGazeteerhHit} 
                    searchButtonTrigger={this.bplanSearchButtonHit} 
                    featureStyler={bplanFeatureStyler}
                    labeler={bplanLabeler}
                    featureClickHandler={this.featureClick}>
                <Control position="topright" >
                <button onClick={ () => browserHistory.push(this.props.location.pathname+ '?lat=51.272399&lng=7.199712&zoom=14') }>Reset View </button>
                </Control>
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
  uiState: PropTypes.object

};
