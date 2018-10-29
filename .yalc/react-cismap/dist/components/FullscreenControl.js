var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import PropTypes from "prop-types";
import { MapControl } from "react-leaflet";
import L from "leaflet";

import "leaflet-fullscreen-custom-container-fork/dist/leaflet.fullscreen.css";
import "leaflet-fullscreen-custom-container-fork";

var FullscreenControl = function (_MapControl) {
  _inherits(FullscreenControl, _MapControl);

  function FullscreenControl() {
    _classCallCheck(this, FullscreenControl);

    return _possibleConstructorReturn(this, (FullscreenControl.__proto__ || Object.getPrototypeOf(FullscreenControl)).apply(this, arguments));
  }

  _createClass(FullscreenControl, [{
    key: "componentWillMount",
    value: function componentWillMount() {
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
  }]);

  return FullscreenControl;
}(MapControl);

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