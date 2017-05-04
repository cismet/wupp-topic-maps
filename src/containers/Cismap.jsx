import React, { PropTypes } from 'react';
import { Map, TileLayer } from 'react-leaflet';
import { connect } from "react-redux";
import 'proj4leaflet';
import { Layers } from '../components/Layers';
import ProjGeoJson from '../components/ProjGeoJson';
import { crs25832, proj4crs25832def } from '../constants/gis';
import proj4 from 'proj4';
import { bindActionCreators } from 'redux';
import 'react-leaflet-fullscreen/dist/styles.css';
import FullscreenControl from 'react-leaflet-fullscreen';
import Control from 'react-leaflet-control';
import { Form, FormGroup, InputGroup, FormControl, Button, Glyphicon, Well} from 'react-bootstrap';



const position = [51.272399, 7.199712];


function mapStateToProps(state) {
  return {
    uiState: state.uiState,
    mapping: state.mapping,
    attributionControl: false
  };
}
 export function createLeafletElement () {}    
export class Cismap_ extends React.Component {
      constructor(props) {
        super(props);


      }

render() {
    const mapStyle = {
      height: this.props.uiState.height,
      width:  this.props.uiState.width
    };
    console.log(mapStyle)
    if (mapStyle.height==null || mapStyle.width==null) {
      mapStyle.height=window.innerHeight
      mapStyle.width=window.innerWidth
    }

    return (
      <Map ref="leafletMap" key="leafletMap" crs={crs25832}  style={mapStyle} center={position} zoom={14}attributionControl={false} ondblclick={this.mapClick} doubleClickZoom={false} >
        {this.props.uiState.layers.map((layer) => {
          if (layer.enabled) {
            return (
              Layers.get(layer.key)(layer.opacity)
            );
          }
        })}
       
       //<ProjGeoJson key={JSON.stringify(this.props.mapping)} mappingProps={this.props.mapping}  />
        <FullscreenControl position="topleft" />
        <Control   position="bottomleft" >
          <Form >
            <FormGroup >
              <InputGroup>
                <InputGroup.Button  >
                  <Button><Glyphicon glyph="search" /></Button>
                </InputGroup.Button>
                <FormControl type="text" style={{ width: '200px'}} />
              </InputGroup>
            </FormGroup>
            </Form>
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
         <Control position="top
         right" >
          <button onClick={ () => this.setState({bounds: position}) }>Reset View </button>
        </Control>
      </Map>
    );
    
  }
}

const Cismap = connect(mapStateToProps, null, null, {withRef:true})(Cismap_);
export default Cismap;

Cismap_.propTypes = {
  uiState: PropTypes.object,
  mapping: PropTypes.object,
  height: PropTypes.number,
  width: PropTypes.number,
};