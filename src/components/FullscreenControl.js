import PropTypes from 'prop-types';
import { MapControl } from 'react-leaflet';
import L from 'leaflet';

import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
import 'leaflet-fullscreen';


class FullscreenControl extends MapControl {
    componentWillMount() {
    this.leafletElement = L.control.fullscreen({
      title: {
        'false':this.props.title,
        'true': this.props.titleCancel
      },
      position:this.props.position,
      content:this.props.content,
      forceSeparateButton:this.props.forceSeparateButton,
      forcePseudoFullscreen:this.props.forcePseudoFullscreen,
      fullscreenElement:this.props.fullscreenElement
    });
  }
}

FullscreenControl.propTypes = {
  position: PropTypes.string,
  title: PropTypes.string,
  titleCancel: PropTypes.string,
  content: PropTypes.node,
  forceSeparateButton: PropTypes.bool,
  forcePseudoFullscreen: PropTypes.bool,
  fullscreenElement: PropTypes.bool
};

export default FullscreenControl;
