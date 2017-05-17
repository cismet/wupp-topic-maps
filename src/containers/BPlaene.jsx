import React, { PropTypes } from 'react';
import Cismap from '../containers/Cismap.jsx';
import { connect } from "react-redux";
import Control from 'react-leaflet-control';
import {browserHistory } from 'react-router';
import { Form, FormGroup, InputGroup, FormControl, Button, Glyphicon, Well} from 'react-bootstrap';

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

bplanGazeteerhHit(selectedObject){
  console.log("^^");
}

bplanSearchButtonHit(event) {
  console.log("^^");
}
  render() {   
   return (
        <div>
            <Cismap layers={this.props.params.layers ||'abkIntra'} gazeteerHitTriggerX={this.bplanGazeteerhHit} searchButtonTrigger={this.bplanSearchButtonHit}>
                <Control position="topright" >
                <button onClick={ () => browserHistory.push(this.props.location.pathname+ '?lat=51.272399&lng=7.199712&zoom=14') }>Reset View </button>
                </Control>
                <Control position="bottomright" >
                  <Well bsSize="small" style={{ width: '250px'}}>
                    <table style={{ width: '100%' }}>
                      <tbody>
                        <tr>
                          <td style={{ textAlign: 'left', verticalAlign: 'top' }}>
                            <h4>BPlan 442</h4>
                            <h6>Rathaus</h6>
                            </td>
                          <td style={{ textAlign: 'right', verticalAlign: 'top' }}>
                            <h4><Glyphicon glyph="download" /></h4>
                            <h6><a href="#">Plan</a></h6>
                            <h6><a href="#">alles</a></h6>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <br/>
                    <table style={{ width: '100%' }}>
                      <tbody>
                        <tr>
                          <td style={{ textAlign: 'left', verticalAlign: 'center' }}><a href="#">&lt;&lt;</a></td>
                          <td style={{ textAlign: 'center', verticalAlign: 'center' }}>4 weitere</td>
                          <td style={{ textAlign: 'right', verticalAlign: 'center' }}><a href="#">&gt;&gt;</a></td>
                        </tr>
                      </tbody>
                    </table>
                  </Well>
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
