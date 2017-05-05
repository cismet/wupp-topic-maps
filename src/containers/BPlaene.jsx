import React, { PropTypes } from 'react';
import Cismap from '../containers/Cismap.jsx';
import { connect } from "react-redux";
import Control from 'react-leaflet-control';
import {browserHistory } from 'react-router';

function mapStateToProps(state) {
  return {
    ui: state.uiState,
    mapping: state.mapping,
    routing: state.routing,
    

  };
}
export class BPlaene_ extends React.Component {
  constructor(props, context) {
      super(props, context);
  }
  render() {   
   return (
        <div>
            <Cismap layers={this.props.params.layers ||'abkIntra'} location={this.props.location}>
                <Control position="topright" >
                <button onClick={ () => browserHistory.push(this.props.location.pathname+ '?lat=51.272399&lng=7.199712&zoom=14') }>Reset View </button>
                </Control>
            </Cismap>
        </div>
    );
  }
}

const BPlaene = connect(mapStateToProps)(BPlaene_);

export default BPlaene;

BPlaene.propTypes = {
  ui: PropTypes.object,
  kassenzeichen: PropTypes.object,
  uiState: PropTypes.object

};
