import L from 'leaflet';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Marker } from 'react-leaflet';
import 'drmonty-leaflet-awesome-markers/css/leaflet.awesome-markers.css';

// need to have this import because of CSS sziss
// eslint-disable-next-line
import AwesomeMarkers from 'drmonty-leaflet-awesome-markers';

function mapStateToProps(state) {
  return {
    mapping: state.mapping
  };
}

export class AwesomeMarker_ extends Marker {
  createLeafletElement(props) {
    let marker = super.createLeafletElement(props);
    var redMarker = L.AwesomeMarkers.icon(props.markerOptions);
    marker.options.icon = redMarker;
    return marker;
  }

  componentWillMount() {
    super.componentWillMount();
  }

  updateLeafletElement(fromProps, toProps) {
    return super.updateLeafletElement(fromProps, toProps);
  }
  render() {
    return super.render();
  }
}

const AwesomeMarker = connect(mapStateToProps)(AwesomeMarker_);
export default AwesomeMarker;

AwesomeMarker.propTypes = {
  mappingProps: PropTypes.object,
  markerOptions: PropTypes.object
};
