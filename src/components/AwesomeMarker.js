import L from 'leaflet';
import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import { Marker } from 'react-leaflet';
import AwesomeMarkers from 'drmonty-leaflet-awesome-markers';
import 'drmonty-leaflet-awesome-markers/css/leaflet.awesome-markers.css';
//import *  'drmonty-leaflet-awesome-markers/css/images';

function mapStateToProps(state) {
  return {
    mapping: state.mapping,
  };
}

export class AwesomeMarker_ extends Marker {
    constructor(props) {
      super(props);
    }
    createLeafletElement (props: Object) {
      let marker=super.createLeafletElement(props);
      var redMarker = L.AwesomeMarkers.icon(props.markerOptions);
      marker.options.icon=redMarker;
      return marker;
    }

    componentWillMount() {
      super.componentWillMount();
    }

    updateLeafletElement (fromProps: Object, toProps: Object) {
      return super.updateLeafletElement(fromProps,toProps);
    }
    render() {
      return super.render();
    }
}


const AwesomeMarker = connect(mapStateToProps)(AwesomeMarker_);
export default AwesomeMarker;


AwesomeMarker.propTypes = {
  mappingProps: PropTypes.object.isRequired,
  markerOptions: PropTypes.object.isRequired,
};