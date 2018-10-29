import polylabel from "polylabel";
import { proj4crs25832def } from "../constants/mapping";
import proj4 from "proj4";

import intersect from "@turf/intersect";
import * as turfHelpers from "@turf/helpers";
import bboxPolygon from "@turf/bbox-polygon";

export function getPolygonfromBBox(bbox) {
  return "POLYGON((" + bbox.left + " " + bbox.top + "," + bbox.right + " " + bbox.top + "," + bbox.right + " " + bbox.bottom + "," + bbox.left + " " + bbox.bottom + "," + bbox.left + " " + bbox.top + "))";
}

export function getLabelPosition(feature) {
  if (feature.geometry.type === "Polygon") {
    return getLabelPositionForPolygon(feature.geometry.coordinates);
  }
  if (feature.geometry.type === "MultiPolygon") {
    if (feature.geometry.coordinates.length === 1) {
      return getLabelPositionForPolygon(feature.geometry.coordinates[0]);
    } else {
      return getLabelPositionForPolygon(feature.geometry.coordinates[0]);
    }
  }
}

function getLabelPositionForPolygon(coordinates) {
  return polylabel(coordinates);
}

export function convertBBox2Bounds(bbox) {
  var projectedNE = proj4(proj4crs25832def, proj4.defs("EPSG:4326"), [bbox[0], bbox[1]]);
  var projectedSW = proj4(proj4crs25832def, proj4.defs("EPSG:4326"), [bbox[2], bbox[3]]);
  return [[projectedNE[1], projectedSW[0]], [projectedSW[1], projectedNE[0]]];
}

export function convertPoint(x, y) {
  var xval = void 0;
  var yval = void 0;
  if (typeof x === "string") {
    xval = parseFloat(x);
  }
  if (typeof y === "string") {
    yval = parseFloat(y);
  }
  var projectedPoint = proj4(proj4.defs("EPSG:4326"), proj4crs25832def, [yval, xval]);
  return projectedPoint;
}

export var convertFeatureCollectionToMarkerPositionCollection = function convertFeatureCollectionToMarkerPositionCollection(featureCollection, boundingBox) {
  var simplifyProperties = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (featureProperties) {
    return featureProperties;
  };

  var markerFeatures = [];
  var selectedmarkerFeatures = [];
  var viewBBox = void 0;
  if (boundingBox) {
    var bbox = [boundingBox.left, boundingBox.bottom, boundingBox.right, boundingBox.top];
    viewBBox = bboxPolygon(bbox);
  } else {
    console.log("no viewbox");
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = featureCollection[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var currentFeature = _step.value;

      var marker = JSON.parse(JSON.stringify(currentFeature)); //deep clone
      marker.properties = simplifyProperties(marker.properties);
      marker.id = "mrk." + marker.id;

      if (currentFeature.geometry.type === "Polygon" || currentFeature.geometry.type === "MultiPolygon" && currentFeature.geometry.coordinates.length === 1) {
        //console.log("Polygon");
        var coordinates = null;
        if (currentFeature.geometry.type === "Polygon") {
          coordinates = currentFeature.geometry.coordinates;
        } else {
          //must currentFeature.geometry.type==='MultiPolygon' && currentFeature.geometry.coordinates.length===1
          coordinates = currentFeature.geometry.coordinates[0];
        }
        marker.geometry = createPolygonMarkerGeometry(coordinates, viewBBox);
        if (currentFeature.selected === true) {
          selectedmarkerFeatures.push(marker);
        } else {
          markerFeatures.push(marker);
        }
      } else if (currentFeature.geometry.type === "MultiPolygon" && currentFeature.geometry.coordinates.length > 1) {
        //console.log("Multipolygon mit "+currentFeature.geometry.coordinates.length);
        for (var currentsubfeatureIdx in currentFeature.geometry.coordinates) {
          var subMarker = JSON.parse(JSON.stringify(marker)); //deep clone
          subMarker.id = subMarker.id + "." + currentsubfeatureIdx;

          var _coordinates = currentFeature.geometry.coordinates[currentsubfeatureIdx];
          subMarker.geometry = createPolygonMarkerGeometry(_coordinates, viewBBox);
          if (currentFeature.selected === true) {
            selectedmarkerFeatures.push(subMarker);
          } else {
            markerFeatures.push(subMarker);
          }
        }
      } else if (currentFeature.geometry.type === "Point") {
        //don't change the geometry since it is already a point
        if (currentFeature.selected === true) {
          selectedmarkerFeatures.push(marker);
        } else {
          markerFeatures.push(marker);
        }
      }
    }
    //Add the selected mf's at the end
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

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = selectedmarkerFeatures[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var midx = _step2.value;

      markerFeatures.push(midx);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return markerFeatures;
};

var createPolygonMarkerGeometry = function createPolygonMarkerGeometry(coordinates, viewBBox) {
  //get the subfeature into a polygon

  var polygon = turfHelpers.polygon(coordinates);
  var newPoly = void 0;
  if (viewBBox) {
    newPoly = intersect(viewBBox, polygon);
  }
  var pointOnPolygon = null;
  if (newPoly) {
    pointOnPolygon = getLabelPosition(newPoly); //if there is a multipolygon created from the boundingbox intersects use the first
  } else {
    pointOnPolygon = polylabel(coordinates);
  }

  if (isNaN(pointOnPolygon[0])) {
    pointOnPolygon = polylabel(coordinates);
  }

  return { type: "Point", coordinates: pointOnPolygon };
};