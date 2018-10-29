import React from "react";
import PropTypes from "prop-types";
import ProjGeoJson from "./ProjGeoJson";
import { convertFeatureCollectionToMarkerPositionCollection } from "../tools/mappingHelpers";

// Since this component is simple and static, there's no parent container for it.
var FeatureCollectionDisplay = function FeatureCollectionDisplay(_ref) {
  var featureCollection = _ref.featureCollection,
      boundingBox = _ref.boundingBox,
      style = _ref.style,
      hoverer = _ref.hoverer,
      featureClickHandler = _ref.featureClickHandler,
      mapRef = _ref.mapRef,
      selectionSpiderfyMinZoom = _ref.selectionSpiderfyMinZoom,
      clusterOptions = _ref.clusterOptions,
      clusteringEnabled = _ref.clusteringEnabled,
      showMarkerCollection = _ref.showMarkerCollection,
      markerCollectionTransformation = _ref.markerCollectionTransformation,
      markerStyle = _ref.markerStyle;

  var markers = void 0;
  if (showMarkerCollection) {
    markers = React.createElement(ProjGeoJson, {
      key: "markers." + JSON.stringify(featureCollection) + "." + JSON.stringify(boundingBox),
      featureCollection: markerCollectionTransformation(featureCollection, boundingBox),
      clusteringEnabled: clusteringEnabled,
      clusterOptions: clusterOptions,
      style: markerStyle,
      featureClickHandler: featureClickHandler,
      mapRef: mapRef,
      selectionSpiderfyMinZoom: selectionSpiderfyMinZoom
    });
  }
  return React.createElement(
    "div",
    null,
    React.createElement(ProjGeoJson, {
      key: JSON.stringify(featureCollection) + "." + JSON.stringify(boundingBox),
      featureCollection: featureCollection,
      clusteringEnabled: clusteringEnabled,
      clusterOptions: clusterOptions,
      hoverer: hoverer,
      style: style,
      featureClickHandler: featureClickHandler,
      mapRef: mapRef,
      selectionSpiderfyMinZoom: selectionSpiderfyMinZoom
    }),
    markers
  );
};

export default FeatureCollectionDisplay;

FeatureCollectionDisplay.propTypes = {
  featureCollection: PropTypes.array.isRequired,
  boundingBox: PropTypes.object,
  clusteredMarkers: PropTypes.object,
  selectionSpiderfyMinZoom: PropTypes.number,
  style: PropTypes.func.isRequired,
  labeler: PropTypes.func,
  hoverer: PropTypes.func,
  featureClickHandler: PropTypes.func.isRequired,
  mapRef: PropTypes.object,
  clusterOptions: PropTypes.object,
  clusteringEnabled: PropTypes.bool,
  showMarkerCollection: PropTypes.bool,
  markerCollectionTransformation: PropTypes.func,
  markerStyle: PropTypes.func
};

FeatureCollectionDisplay.defaultProps = {
  featureCollection: [],
  selectionSpiderfyMinZoom: 7,
  style: function style() {},
  // hoverer: () => {},
  featureClickHandler: function featureClickHandler() {},
  clusterOptions: {},
  clusteringEnabled: false,
  showMarkerCollection: false,
  markerCollectionTransformation: convertFeatureCollectionToMarkerPositionCollection
};