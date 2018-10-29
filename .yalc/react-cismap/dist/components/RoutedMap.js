var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from "react";
import PropTypes from "prop-types";
import { Map, ZoomControl } from "react-leaflet";
import "proj4leaflet";
import proj4 from "proj4";
import "url-search-params-polyfill";

import * as MappingConstants from "../constants/mapping";

import getLayersByNames from "../tools/layerFactory";
import FullscreenControl from ".//FullscreenControl";
import NewWindowControl from "./NewWindowControl";
import LocateControl from "../components/LocateControl";

export var RoutedMap = function (_React$Component) {
  _inherits(RoutedMap, _React$Component);

  function RoutedMap(props) {
    _classCallCheck(this, RoutedMap);

    var _this = _possibleConstructorReturn(this, (RoutedMap.__proto__ || Object.getPrototypeOf(RoutedMap)).call(this, props));

    _this.featureClick = _this.featureClick.bind(_this);
    return _this;
  }

  // add a handler for detecting map changes


  _createClass(RoutedMap, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.leafletMap.leafletElement.on("moveend", function () {
        if (typeof _this2.leafletMap !== "undefined" && _this2.leafletMap !== null) {
          var zoom = _this2.leafletMap.leafletElement.getZoom();
          var center = _this2.leafletMap.leafletElement.getCenter();
          var latFromUrl = parseFloat(_this2.props.urlSearchParams.get("lat"));
          var lngFromUrl = parseFloat(_this2.props.urlSearchParams.get("lng"));
          var zoomFromUrl = parseInt(_this2.props.urlSearchParams.get("zoom"), 10);
          var lat = center.lat;
          var lng = center.lng;
          if (Math.abs(latFromUrl - center.lat) < 0.000001) {
            lat = latFromUrl;
          }
          if (Math.abs(lngFromUrl - center.lng) < 0.000001) {
            lng = lngFromUrl;
          }

          if (lng !== lngFromUrl || lat !== latFromUrl || zoomFromUrl !== zoom) {
            _this2.props.locationChangedHandler({
              lat: lat,
              lng: lng,
              zoom: zoom
            });
          }
          _this2.storeBoundingBox(_this2.leafletMap);
        } else {
          //console.log("this.leafletMap is null");
        }
      });
      this.storeBoundingBox(this.leafletMap);
    }

    //Handle a autoFit Command if needed

  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (typeof this.leafletMap !== "undefined" && this.leafletMap != null) {
        if (this.props.autoFitConfiguration.autoFitBounds) {
          if (this.props.autoFitConfiguration.autoFitMode === MappingConstants.AUTO_FIT_MODE_NO_ZOOM_IN) {
            if (!this.leafletMap.leafletElement.getBounds().contains(this.props.autoFitConfiguration.autoFitBoundsTarget)) {
              this.leafletMap.leafletElement.fitBounds(this.props.autoFitConfiguration.autoFitBoundsTarget);
            }
          } else {
            if (this.props.autoFitConfiguration.autoFitBoundsTarget && this.props.autoFitConfiguration.autoFitBoundsTarget.isValid()) {
              this.leafletMap.leafletElement.fitBounds(this.props.autoFitConfiguration.autoFitBoundsTarget);
            }
          }
          this.props.autoFitProcessedHandler();
        }
      }
    }
  }, {
    key: "storeBoundingBox",
    value: function storeBoundingBox(leafletMap) {
      //store the projected bounds in the store
      var bounds = leafletMap.leafletElement.getBounds();
      var projectedNE = proj4(proj4.defs("EPSG:4326"), this.props.referenceSystemDefinition, [bounds._northEast.lng, bounds._northEast.lat]);
      var projectedSW = proj4(proj4.defs("EPSG:4326"), this.props.referenceSystemDefinition, [bounds._southWest.lng, bounds._southWest.lat]);
      var bbox = {
        left: projectedSW[0],
        top: projectedNE[1],
        right: projectedNE[0],
        bottom: projectedSW[1]
      };
      //console.log(getPolygon(bbox));

      this.props.boundingBoxChangedHandler(bbox);
    }
  }, {
    key: "featureClick",
    value: function featureClick(event) {
      this.props.featureClickHandler(event);
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var positionByUrl = [parseFloat(this.props.urlSearchParams.get("lat")) || this.props.fallbackPosition.lat, parseFloat(this.props.urlSearchParams.get("lng")) || this.props.fallbackPosition.lng];
      var zoomByUrl = parseInt(this.props.urlSearchParams.get("zoom"), 10) || this.props.fallbackZoom;

      var fullscreenControl = React.createElement("div", null);

      var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
      var inIframe = window.self !== window.top;
      var simulateInIframe = false;
      var simulateInIOS = false;
      var iosClass = "no-iOS-device";

      if (this.props.fullScreenControlEnabled) {
        fullscreenControl = React.createElement(FullscreenControl, {
          title: "Vollbildmodus",
          forceSeparateButton: true,
          titleCancel: "Vollbildmodus beenden",
          position: "topleft",
          container: document.documentElement
        });

        if (simulateInIOS || iOS) {
          iosClass = "iOS-device";
          if (simulateInIframe || inIframe) {
            fullscreenControl =
            // <OverlayTrigger placement="left" overlay={(<Tooltip>Maximiert in neuem Browser-Tab öffnen.</Tooltip>)}>
            React.createElement(NewWindowControl, {
              position: "topleft",
              routing: this.props.routing,
              title: "Maximiert in neuem Browser-Tab \xF6ffnen."
            });
            // </OverlayTrigger>
          } else {
            fullscreenControl = React.createElement("div", null);
          }
        }
      }
      var locateControl = React.createElement("div", null);
      if (this.props.locateControlEnabled) {
        locateControl = React.createElement(LocateControl, {
          setView: "once",
          flyTo: true,
          strings: {
            title: "Mein Standort",
            metersUnit: "Metern",
            feetUnit: "Feet",
            popup: "Sie befinden sich im Umkreis von {distance} {unit} um diesen Punkt.",
            outsideMapBoundsMsg: "Sie gefinden sich wahrscheinlich außerhalb der Kartengrenzen."
          }
        });
      }

      return React.createElement(
        "div",
        { className: iosClass },
        React.createElement(
          Map,
          {
            ref: function ref(leafletMap) {
              _this3.leafletMap = leafletMap;
            },
            key: "leafletMap",
            crs: this.props.referenceSystem,
            style: this.props.style,
            center: positionByUrl,
            zoom: zoomByUrl,
            zoomControl: false,
            attributionControl: false,
            doubleClickZoom: false,
            ondblclick: this.props.ondblclick,
            minZoom: 7,
            maxZoom: 18
          },
          React.createElement(ZoomControl, {
            position: "topleft",
            zoomInTitle: "Vergr\xF6\xDFern",
            zoomOutTitle: "Verkleinern"
          }),
          fullscreenControl,
          locateControl,
          getLayersByNames(this.props.backgroundlayers, this.props.urlSearchParams.get('mapStyle')),
          this.props.children
        )
      );
    }
  }]);

  return RoutedMap;
}(React.Component);

RoutedMap.propTypes = {
  mapping: PropTypes.object,
  height: PropTypes.number,
  width: PropTypes.number,
  layers: PropTypes.string.isRequired,
  featureClickHandler: PropTypes.func,
  style: PropTypes.object.isRequired,
  ondblclick: PropTypes.func,
  children: PropTypes.array,
  locationChangedHandler: PropTypes.func,

  boundingBoxChangedHandler: PropTypes.func,

  autoFitConfiguration: PropTypes.object,
  autoFitProcessedHandler: PropTypes.func,
  urlSearchParams: PropTypes.object,
  fallbackPosition: PropTypes.object,
  fallbackZoom: PropTypes.number,
  referenceSystem: PropTypes.object,
  referenceSystemDefinition: PropTypes.string,
  backgroundlayers: PropTypes.string,
  fullScreenControlEnabled: PropTypes.bool,
  locateControlEnabled: PropTypes.bool
};

RoutedMap.defaultProps = {
  layers: "",
  gazeteerHitTrigger: function gazeteerHitTrigger() {},
  searchButtonTrigger: function searchButtonTrigger() {},
  featureClickHandler: function featureClickHandler() {},
  ondblclick: function ondblclick() {},
  locationChangedHandler: function locationChangedHandler() {},
  autoFitConfiguration: {},
  urlSearchParams: new URLSearchParams(""),
  boundingBoxChangedHandler: function boundingBoxChangedHandler() {},
  autoFitProcessedHandler: function autoFitProcessedHandler() {},
  fallbackPosition: {
    lat: 51.272399,
    lng: 7.199712
  },
  fallbackZoom: 14,
  referenceSystem: MappingConstants.crs25832,
  referenceSystemDefinition: MappingConstants.proj4crs25832def,
  backgroundlayers: "default"
};

export default RoutedMap;