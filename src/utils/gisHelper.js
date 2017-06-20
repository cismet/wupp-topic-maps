
import polylabel from '@mapbox/polylabel'

export function getPolygonfromBBox(bbox) {
  return "POLYGON(("+bbox.left+" "+ bbox.top+","+bbox.right+" "+bbox.top+","+bbox.right+" "+bbox.bottom+","+bbox.left+" "+bbox.bottom+","+bbox.left+" "+bbox.top+"))";
}


export function getLabelPosition(feature) {
  if (feature.geometry.type==='Polygon'){
    return getLabelPositionForPolygon(feature.geometry.coordinates);
  }
  if (feature.geometry.type==='MultiPolygon'){
    if (feature.geometry.coordinates.length===1) {
      return getLabelPositionForPolygon(feature.geometry.coordinates[0]);
    }
    else {
      return getLabelPositionForPolygon(feature.geometry.coordinates[0]);
    }
  }
}

function getLabelPositionForPolygon(coordinates) {
  return polylabel(coordinates);
}