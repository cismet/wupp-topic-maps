import React, { PropTypes } from 'react';
import Cismap from '../containers/Cismap.jsx';
import { connect } from "react-redux";
import Control from 'react-leaflet-control';
import {browserHistory,withRouter } from 'react-router';

function mapStateToProps(state) {
  return {
    ui: state.uiState,
  };
}
export class BPlaene_ extends React.Component {
  constructor(props, context) {
      super(props, context);
  }
  render() {   
    //console.log(this.props.params.layers) 
    console.log(this.props) 

   return (
        <div>
            <Cismap>
                <Control position="topright" >
                <button onClick={ () => browserHistory.push(this.props.location.pathname+ '?q=bar') }>Reset View </button>
                </Control>
            </Cismap>
        </div>
    );
  }
}

const BPlaene = withRouter(connect(mapStateToProps))(BPlaene_);

export default BPlaene;

BPlaene.propTypes = {
  ui: PropTypes.object,
  kassenzeichen: PropTypes.object,
  uiState: PropTypes.object

};
