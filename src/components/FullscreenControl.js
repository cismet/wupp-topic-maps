import PropTypes from "prop-types";
import { MapControl } from "react-leaflet";
import L from "leaflet";

import "leaflet-fullscreen-custom-container-fork/dist/leaflet.fullscreen.css";
import "leaflet-fullscreen-custom-container-fork";

class FullscreenControl extends MapControl {
  componentWillMount() {
    this.leafletElement = L.control.fullscreen({
      title: {
        false: this.props.title,
        true: this.props.titleCancel
      },
      position: this.props.position,
      content: this.props.content,
      forceSeparateButton: this.props.forceSeparateButton,
      pseudoFullscreen: this.props.forcePseudoFullscreen,
      fullscreenElement: this.props.fullscreenElement,
      container: this.props.container
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
