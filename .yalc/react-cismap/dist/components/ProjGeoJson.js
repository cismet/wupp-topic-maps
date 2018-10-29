var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import L from "leaflet";
import { isFunction } from "lodash";
import PropTypes from "prop-types";
import "proj4leaflet";

import { Path } from "react-leaflet";

require("react-leaflet-markercluster/dist/styles.min.css");

// need to have this import
// eslint-disable-next-line
import markerClusterGroup from "leaflet.markercluster";

var ProjGeoJson = function (_Path) {
  _inherits(ProjGeoJson, _Path);

  function ProjGeoJson() {
    _classCallCheck(this, ProjGeoJson);

    return _possibleConstructorReturn(this, (ProjGeoJson.__proto__ || Object.getPrototypeOf(ProjGeoJson)).apply(this, arguments));
  }

  _createClass(ProjGeoJson, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this2 = this;

      _get(ProjGeoJson.prototype.__proto__ || Object.getPrototypeOf(ProjGeoJson.prototype), "componentWillMount", this).call(this);

      var _props = this.props,
          featureCollection = _props.featureCollection,
          props = _objectWithoutProperties(_props, ["featureCollection"]);

      props.onEachFeature = function (feature, layer) {
        //This could be the problem in /stadtplan
        //----wait for regressions -.-
        //layer._leaflet_id = feature.id;
        //----

        //TODO set a offset so that the Tooltip is shown in the current map
        layer.feature = feature;

        //new
        //layer.on('click',props.featureClickHandler);

        //old
        layer.on("click", function (event) {
          props.featureClickHandler(event, feature, layer);
        });

        var zoffset = new L.point(0, 0);
        if (feature.selected) {
          //ugly winning: a direct call of bringToFront has no effect -.-
          setTimeout(function () {
            try {
              layer.bringToFront();
            } catch (err) {
              //ugly winning
            }
            if (props.labeler) {
              layer.bindTooltip(props.labeler(feature), {
                className: "customGeoJSONFeatureTooltipClass",
                permanent: true,
                direction: "center",
                offset: zoffset,
                opacity: "0.9"
              });
            }
          }, 10);
        } else {
          if (props.labeler) {
            layer.bindTooltip(props.labeler(feature), {
              className: "customGeoJSONFeatureTooltipClass",
              permanent: true,
              direction: "center",
              offset: zoffset,
              opacity: "0.9"
            });
          }
        }
        if (props.hoverer) {
          var theStyle = props.style(feature, props.featureStylerScalableImageSize);

          layer.bindTooltip("" + props.hoverer(feature), {
            offset: L.point(theStyle.radius, 0),
            direction: "right"
          });
          layer.on("mouseover", function () {
            layer.openPopup();
          });
          layer.on("mouseout", function () {
            layer.closePopup();
          });
        }
      };

      props.pointToLayer = function (feature, latlng) {
        if (props.style) {
          var theStyle = props.style(feature);
          var marker = null;
          if (theStyle.svg) {
            var divIcon = L.divIcon({
              className: "leaflet-data-marker",
              html: theStyle.svg,
              iconAnchor: [theStyle.svgSize / 2, theStyle.svgSize / 2],
              iconSize: [theStyle.svgSize, theStyle.svgSize]
            });
            marker = L.marker(latlng, { icon: divIcon });
          } else {
            marker = L.circleMarker(latlng, { radius: 2 });
          }
          return marker;
        }
      };

      var geojson = L.Proj.geoJson(featureCollection, props);

      this.props.clusterOptions.customSize = 36;

      if (!this.clusteredMarkers) {
        this.clusteredMarkers = L.markerClusterGroup(this.props.clusterOptions);
      } else {
        this.clusteredMarkers = null;
        if (this.props.mapRef.leafletElement.hasLayer(this.leafletElement)) {
          this.props.mapRef.leafletElement.removeLayer(this.leafletElement);
        }
      }

      if (this.clusteredMarkers && this.props.clusteringEnabled) {
        this.leafletElement = this.clusteredMarkers.clearLayers();
        this.leafletElement = this.clusteredMarkers.addLayer(geojson);
        var that = this;

        // need to add it to the map now, because of the spiderfy functionality
        // (ensure spidefication when object is selected)
        // the test needs an already mounted layer

        //ugly winning
        // don't know exactly why there is an error when a new wms background is set
        // TypeError: Cannot read property '_leaflet_pos' of undefined
        try {
          this.props.mapRef.leafletElement.addLayer(this.leafletElement);
        } catch (e) {
          //console.log(e);
        }

        this.clusteredMarkers.on("clusterclick", function (a) {
          var zoomLevel = that.props.mapRef.leafletElement.getZoom();
          if (zoomLevel < (that.props.clusterOptions.cismapZoomTillSpiderfy || 11)) {
            that.props.mapRef.leafletElement.setZoomAround(a.latlng, zoomLevel + 1);
          } else {
            a.layer.spiderfy();
          }
        });
        var markers = this.clusteredMarkers.getLayers();
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = markers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var marker = _step.value;

            if (marker.feature.selected === true) {
              (function () {
                var parent = _this2.clusteredMarkers.getVisibleParent(marker);
                if (parent && parent.spiderfy) {
                  //   console.log("will spiderfy cluster of feature "+marker.feature.id )
                  if (_this2.props.mapRef.leafletElement.getZoom() >= (_this2.props.selectionSpiderfyMinZoom || 12)) {
                    setTimeout(function () {
                      try {
                        parent.spiderfy();
                      } catch (err) {
                        //ugly winning
                      }
                    }, 1);
                  }
                  //   console.log("have spiderfied cluster of feature "+marker.feature.id )
                }
              })();
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      } else {
        this.leafletElement = geojson;
      }
    }
  }, {
    key: "createLeafletElement",
    value: function createLeafletElement() {}
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (isFunction(this.props.style)) {
        this.setStyle(this.props.style);
      } else {
        this.setStyleIfChanged(prevProps, this.props);
      }
    }
  }, {
    key: "render",
    value: function render() {
      return _get(ProjGeoJson.prototype.__proto__ || Object.getPrototypeOf(ProjGeoJson.prototype), "render", this).call(this);
    }
  }]);

  return ProjGeoJson;
}(Path);

export default ProjGeoJson;

ProjGeoJson.propTypes = {
  featureCollection: PropTypes.array.isRequired,
  clusteredMarkers: PropTypes.object,
  selectionSpiderfyMinZoom: PropTypes.number,
  labeler: PropTypes.func,
  hoverer: PropTypes.func,
  featureClickHandler: PropTypes.func.isRequired,
  mapRef: PropTypes.object,
  featureStylerScalableImageSize: PropTypes.number,
  clusteringEnabled: PropTypes.bool,
  clusterOptions: PropTypes.object
};

ProjGeoJson.defaultProps = {
  featureStylerScalableImageSize: 32,
  clusterOptions: {},
  clusteringEnabled: false
};