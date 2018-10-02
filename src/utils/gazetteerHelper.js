import { crs25832, proj4crs25832def } from "../constants/gis";
import proj4 from "proj4";
import objectAssign from "object-assign";
import bboxCreator from "@turf/bbox";
import * as turfHelpers from "@turf/helpers";
import * as gisHelpers from "./gisHelper";

export const builtInGazetteerHitTrigger = (
  hit,
  leafletElement,
  mappingActions,
  furtherGazeteerHitTrigger
) => {
  if (
    hit !== undefined &&
    hit.length !== undefined &&
    hit.length > 0 &&
    hit[0].x !== undefined &&
    hit[0].y !== undefined
  ) {
    const pos = proj4(proj4crs25832def, proj4.defs("EPSG:4326"), [hit[0].x, hit[0].y]);
    //console.log(pos)
    leafletElement.panTo([pos[1], pos[0]], {
      animate: false
    });

    let hitObject = objectAssign({}, hit[0]);

    //Change the Zoomlevel of the map
    if (hitObject.more.zl) {
      leafletElement.setZoom(hitObject.more.zl, {
        animate: false
      });

      //show marker
      mappingActions.gazetteerHit(hitObject);
      mappingActions.setOverlayFeature(null);
    } else if (hitObject.more.g) {
      var feature = turfHelpers.feature(hitObject.more.g);
      if (!feature.crs) {
        feature.crs = {
          type: "name",
          properties: { name: "urn:ogc:def:crs:EPSG::25832" }
        };
      }
      var bb = bboxCreator(feature);
      mappingActions.gazetteerHit(null);
      mappingActions.setOverlayFeature(feature);
      leafletElement.fitBounds(gisHelpers.convertBBox2Bounds(bb));
    }

    if (furtherGazeteerHitTrigger !== undefined) {
      furtherGazeteerHitTrigger(hit);
    }
  } else {
    //console.log(hit);
  }
};
