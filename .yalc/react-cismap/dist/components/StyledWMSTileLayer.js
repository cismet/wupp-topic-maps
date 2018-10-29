var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { WMSTileLayer } from "react-leaflet";
// import filters from 'pleeease-filters'; /a postcss  plugin. worked only for the first expression
import PropTypes from "prop-types";

export var StyledWMSTileLayer_ = function (_WMSTileLayer) {
  _inherits(StyledWMSTileLayer_, _WMSTileLayer);

  function StyledWMSTileLayer_(props) {
    _classCallCheck(this, StyledWMSTileLayer_);

    console.debug("constructor");

    var _this = _possibleConstructorReturn(this, (StyledWMSTileLayer_.__proto__ || Object.getPrototypeOf(StyledWMSTileLayer_)).call(this, props));

    _this.setFilter = _this.setFilter.bind(_this);
    return _this;
  }

  _createClass(StyledWMSTileLayer_, [{
    key: "createLeafletElement",
    value: function createLeafletElement(props) {
      return _get(StyledWMSTileLayer_.prototype.__proto__ || Object.getPrototypeOf(StyledWMSTileLayer_.prototype), "createLeafletElement", this).call(this, props);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      _get(StyledWMSTileLayer_.prototype.__proto__ || Object.getPrototypeOf(StyledWMSTileLayer_.prototype), "componentDidMount", this).call(this);
      this.setFilter();
    }
  }, {
    key: "updateLeafletElement",
    value: function updateLeafletElement(fromProps, toProps) {
      _get(StyledWMSTileLayer_.prototype.__proto__ || Object.getPrototypeOf(StyledWMSTileLayer_.prototype), "updateLeafletElement", this).call(this, fromProps, toProps);
      this.setFilter();
    }
  }, {
    key: "setFilter",
    value: function setFilter() {
      if (this.props.cssFilter) {
        if (this.leafletElement) {
          if (this.leafletElement._container) {
            if (this.leafletElement._container.style) {
              this.leafletElement._container.style.cssText += " " + this.props.cssFilter;
            } else {
              console.debug("this.leafletElement._container not set");
            }
          } else {
            console.debug("this.leafletElement._container not set");
          }
        } else {
          console.debug("this.leafletElemen not set");
        }

        //  filters.process("{"+ this.props.cssFilter +"}",{}).then(result => {
        //     let newfilter=result.css.substring(1, result.css.length-1);

        //     console.log("result.css:"+newfilter);

        //     this.leafletElement._container.style.cssText+=" "+newfilter;
        //  });
      } else {
        console.debug("no cssFilter set");
      }
    }
  }, {
    key: "getOptions",
    value: function getOptions(params) {
      return _get(StyledWMSTileLayer_.prototype.__proto__ || Object.getPrototypeOf(StyledWMSTileLayer_.prototype), "getOptions", this).call(this, params);
    }
  }]);

  return StyledWMSTileLayer_;
}(WMSTileLayer);

var StyledWMSTileLayer = StyledWMSTileLayer_;

export default StyledWMSTileLayer;

StyledWMSTileLayer.propTypes = {
  url: PropTypes.string,
  layers: PropTypes.string,
  format: PropTypes.string,
  tiled: PropTypes.string,
  version: PropTypes.string,
  maxZoom: PropTypes.number,
  opacity: PropTypes.number,
  cssFilter: PropTypes.string
};