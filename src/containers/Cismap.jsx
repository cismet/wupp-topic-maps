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
import { Typeahead } from 'react-bootstrap-typeahead';

import { push } from 'react-router-redux'
import {store} from '../index.js';

import wuppadr from '../wuppadr.json';


const fallbackposition = {
  lat: 51.272399,
  lng: 7.199712
};


function mapStateToProps(state) {
  return {
    uiState: state.uiState,
    mapping: state.mapping,
    attributionControl: false,
    routing: state.routing,

  };
}
export function createLeafletElement () {}    
export class Cismap_ extends React.Component {
      constructor(props) {
        super(props);


      }
componentDidMount() {
    this.refs.leafletMap.leafletElement.on('moveend', () => {
        const zoom=this.refs.leafletMap.leafletElement.getZoom();
        const center= this.refs.leafletMap.leafletElement.getCenter();
        const latFromUrl=parseFloat(this.props.routing.locationBeforeTransitions.query.lat)
        const lngFromUrl=parseFloat(this.props.routing.locationBeforeTransitions.query.lng)
        
        var lat=center.lat
        var lng=center.lng

        if (Math.abs(latFromUrl-center.lat) < 0.00001) {
          lat=latFromUrl;
        }
        if (Math.abs(lngFromUrl-center.lng) < 0.00001) {
          lng=lngFromUrl;
        }
        
        const querypart='?lat='+lat+'&lng='+lng+'&zoom='+zoom;
        store.dispatch(push(this.props.routing.locationBeforeTransitions.pathname + querypart))

    });
}

render() {
    console.log(this.props);


    const mapStyle = {
      height: this.props.uiState.height,
      width:  this.props.uiState.width
    };
    if (mapStyle.height==null || mapStyle.width==null) {
      mapStyle.height=window.innerHeight
      mapStyle.width=window.innerWidth
    }
   
   const positionByUrl=[parseFloat(this.props.routing.locationBeforeTransitions.query.lat)||fallbackposition.lat,parseFloat(this.props.routing.locationBeforeTransitions.query.lng)||fallbackposition.lng]
   const zoomByUrl= parseInt(this.props.routing.locationBeforeTransitions.query.zoom)||14

   const layerArr=this.props.layers.split(",");
    return (
      <Map 
        ref="leafletMap"
        key="leafletMap" 
        crs={crs25832}  
        style={mapStyle} 
        center={positionByUrl} 
        zoom={zoomByUrl} 
        attributionControl={false} 
        ondblclick={this.mapClick} 
        doubleClickZoom={false}
        minZoom={7} 
        maxZoom={18} 
        >
        {
          layerArr.map((layerWithOpacity)=> {
            const layOp=layerWithOpacity.split('@')
              return Layers.get(layOp[0])(parseInt(layOp[1]||'100')/100.0);
          })
        }
       
       //<ProjGeoJson key={JSON.stringify(this.props.mapping)} mappingProps={this.props.mapping}  />
        <FullscreenControl position="topleft" />
       <Control position="bottomleft"  >
        <Form style={{ width: '300px'}}  action="#">
            <FormGroup >
              <InputGroup>
                <InputGroup.Button  >
                  <Button><Glyphicon glyph="search" /></Button>
                </InputGroup.Button>
                <Typeahead style={{ width: '300px'}} 
                  onPaginate={e => console.log('Results paginated')}
                  onChange={selectedObject => {console.log(this.refs.leafletMap.leafletElement.panTo())}}
                  options={wuppadr.map(o => o)  }
                  labelKey={"string"}
                  paginate={true}
                  dropup={true}
                  placeholder="Geben Sie einen Suchbegriff ein."
                  minLength={4}
                  align={'justify'}
                  emptyLabel={'Keine Treffer gefunden'}
                  paginationText={"Mehr Treffer anzeigen"}
                  autoFocus={true}
                />
              </InputGroup>
            </FormGroup>
            </Form>
      
      
         
          </Control>
        
         {this.props.children}
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
  layers: PropTypes.string.isRequired,
};

Cismap_.defaultProps = {
  layers: "abkf"
}