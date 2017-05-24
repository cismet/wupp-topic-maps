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

import { routerActions } from 'react-router-redux'

import wuppadr from '../wuppadr.json';
import * as mappingActions from '../actions/mappingActions';
 

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

function mapDispatchToProps(dispatch) {
  return {
    mappingActions: bindActionCreators(mappingActions, dispatch),
    routingActions: bindActionCreators(routerActions,dispatch),
  };
}

export function createLeafletElement () {}    

export class Cismap_ extends React.Component {
      constructor(props) {
        super(props);
        this.internalGazeteerHitTrigger=this.internalGazeteerHitTrigger.bind(this);
        this.internalSearchButtonTrigger=this.internalSearchButtonTrigger.bind(this);
        this.featureClick = this.featureClick.bind(this);

      }
componentDidMount() {
    this.refs.leafletMap.leafletElement.on('moveend', () => {
        const zoom=this.refs.leafletMap.leafletElement.getZoom();
        const center= this.refs.leafletMap.leafletElement.getCenter();
        const latFromUrl=parseFloat(this.props.routing.locationBeforeTransitions.query.lat);
        const lngFromUrl=parseFloat(this.props.routing.locationBeforeTransitions.query.lng);
        const zoomFromUrl=parseInt(this.props.routing.locationBeforeTransitions.query.zoom);
        var lat=center.lat
        var lng=center.lng

        if (Math.abs(latFromUrl-center.lat) < 0.0001) {
          lat=latFromUrl;
        }
        if (Math.abs(lngFromUrl-center.lng) < 0.0001) {
          lng=lngFromUrl;
        }
        
        const querypart='?lat='+lat+'&lng='+lng+'&zoom='+zoom;
        if (lng!==lngFromUrl || lat!==latFromUrl || zoomFromUrl!==zoom) {
          //store.dispatch(push(this.props.routing.locationBeforeTransitions.pathname + querypart))
          this.props.routingActions.push(this.props.routing.locationBeforeTransitions.pathname + querypart)
        }
        this.storeBoundingBox();
        
    });
    this.storeBoundingBox();
}

componentDidUpdate() {
    if ((typeof (this.refs.leafletMap) != 'undefined' && this.refs.leafletMap != null)) {
      if (this.props.mapping.autoFitBounds) {
        this.refs.leafletMap.leafletElement.fitBounds(this.props.mapping.autoFitBoundsTarget);
        this.props.mappingActions.setAutoFit(false);
      }
    }
  }


storeBoundingBox(){
  //store the projected bounds in the store
  const bounds=this.refs.leafletMap.leafletElement.getBounds()
  const projectedNE=proj4(proj4.defs('EPSG:4326'),proj4crs25832def,[bounds._northEast.lng,bounds._northEast.lat])
  const projectedSW=proj4(proj4.defs('EPSG:4326'),proj4crs25832def,[bounds._southWest.lng,bounds._southWest.lat])
  const bbox = {left: projectedSW[0], top: projectedNE[1], right: projectedNE[0], bottom: projectedSW[1]};
  //console.log(getPolygon(bbox));
  this.props.mappingActions.mappingBoundsChanged(bbox);
}

internalGazeteerHitTrigger(hit){
    if (hit!==undefined && hit.length !=undefined && hit[0].x!==undefined && hit[0].y!==undefined) {
      //console.log(hit)
      const pos=proj4(proj4crs25832def,proj4.defs('EPSG:4326'),[hit[0].x,hit[0].y])
      //console.log(pos)
      this.refs.leafletMap.leafletElement.panTo([pos[1],pos[0]]);
  }
  else {
    console.log(hit);
  }
  if (this.props.gazeteerHitTrigger!==undefined) {
    this.props.gazeteerHitTrigger(hit);
  }
  
}

internalSearchButtonTrigger(event){
  if (this.props.searchButtonTrigger!==undefined) {
    this.props.searchButtonTrigger(event)
  } else {
    console.log("no searchButtonTrigger defined");
  }

}
featureClick(event) {
    this.props.featureClickHandler(event);
}


render() {
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
       
       <ProjGeoJson key={JSON.stringify(this.props.mapping)} mappingProps={this.props.mapping} style={this.props.featureStyler} labeler={this.props.labeler} featureClickHandler={this.featureClick}/>
       <FullscreenControl position="topleft" />
       <Control position="bottomleft"  >
        <Form style={{ width: '300px'}}  action="#">
            <FormGroup >
              <InputGroup>
                <InputGroup.Button  onClick={this.internalSearchButtonTrigger}>
                  <Button><Glyphicon glyph="search" /></Button>
                </InputGroup.Button>
                <Typeahead style={{ width: '300px'}} 
                  onPaginate={e => console.log('Results paginated')}
                  onChange={this.internalGazeteerHitTrigger}
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

const Cismap = connect(mapStateToProps, mapDispatchToProps, null, {withRef:true})(Cismap_);
export default Cismap;

Cismap_.propTypes = {
  uiState: PropTypes.object,
  mapping: PropTypes.object,
  height: PropTypes.number,
  width: PropTypes.number,
  layers: PropTypes.string.isRequired,
  gazeteerHitTrigger: PropTypes.func.isRequired,
  searchButtonTrigger: PropTypes.func.isRequired,
  mappingAction: PropTypes.object,
  featureStyler: PropTypes.func.isRequired,
  labeler: PropTypes.func.isRequired,
  featureClickHandler: PropTypes.func.isRequired,

};

Cismap_.defaultProps = {
  layers: "abkf",
  gazeteerHitTrigger: function(){},
  searchButtonTrigger: function(){},
  featureClickHandler: function(){},
}