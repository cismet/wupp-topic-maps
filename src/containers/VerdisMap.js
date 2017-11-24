import PropTypes from 'prop-types';
import React from 'react';
//import { render } from 'react-dom';
import { connect } from "react-redux";
import 'proj4leaflet';
//import { Ortho2014, StadtgrundKarteABK, Osm } from './Layers';
import { Layers } from '../components/Layers';
import ProjGeoJson from '../components/ProjGeoJson';
import { crs25832, proj4crs25832def } from '../constants/gis';
import proj4 from 'proj4';
import { actions as MappingActions } from '../redux/modules/mapping';
import { bindActionCreators } from 'redux';
//import  CismapBaseMap  from './CismapBaseMap';
import RoutedMap from './RoutedMap';
import L from 'leaflet';


const position = [51.272399, 7.199712];

function mapStateToProps(state) {
  return {
    uiState: state.uiState,
    kassenzeichen: state.kassenzeichen,
    mapping: state.mapping
  };
}

function mapDispatchToProps(dispatch) {
  return {
    mappingActions: bindActionCreators(MappingActions, dispatch),

  };
}
export class Cismap_ extends React.Component {
    constructor(props) {
        super(props);
        this.mapDblClick = this.mapDblClick.bind(this);
        this.featureClick = this.featureClick.bind(this);
        this.fitBounds = this.fitBounds.bind(this);
    }

    fitBounds() {
        this.props.mappingActions.fitAll();
    }

    mapDblClick(event) {
        const skipFitBounds=true;//event.originalEvent.shiftKey; 
        const latlon = event.latlng;
        const pos=(proj4(proj4crs25832def, [latlon.lng, latlon.lat]));
        this.props.kassenzeichenActions.searchByPoint(pos[0],pos[1],!skipFitBounds);
    }
    // mapClick(event) {
    //     console.log(event);
    //    // this.props.mappingActions.setSelectedFeatureIndex(null);
    // }

    featureClick(event,feature,layer) {
        L.DomEvent.stopPropagation(event.originalEvent);
        event.originalEvent.preventDefault();
        this.props.featureClickHandler(event,feature,layer);
    }
    render() {
        const mapStyle = {
            height: this.props.height
        };

    // <Ortho2014 /><StadtgrundKarteABK />
    // <OSM />
    return (
      <RoutedMap ref="leafletRoutedMap" 
            key={"leafletRoutedMap"}  
            layers="" crs={crs25832} 
            style={mapStyle} 
            center={position}  
            zoom={14} 
            ondblclick={this.mapDblClick} 
            doubleClickZoom={false} >
        {this.props.uiState.layers.map((layer) => {
          if (layer.enabled) {
            return (
              Layers.get(layer.key)(layer.opacity)
            );
          }
          else {
            return (<div key={"empty_div_for_disabled_layer"+JSON.stringify(layer)}/>);
          }
        })}
        <ProjGeoJson key={JSON.stringify(this.props.mapping)} 
            mappingProps={this.props.mapping} 
            style={this.props.featureCollectionStyle} 
            featureClickHandler={this.featureClick}/>
      </RoutedMap>
    );
  }
}

//{m => { this.leafletRoutedMap = m; }}


const Cismap = connect(mapStateToProps, mapDispatchToProps,null, {withRef:true})(Cismap_);

Cismap_.propTypes = {
  uiState: PropTypes.object,
  kassenzeichen: PropTypes.object,
  mapping: PropTypes.object,
  height: PropTypes.number,
  kassenzeichenActions: PropTypes.object,
  mappingActions: PropTypes.object.isRequired,
  featureClickHandler: PropTypes.func,
  featureCollectionStyle: PropTypes.func,
};

export default Cismap;