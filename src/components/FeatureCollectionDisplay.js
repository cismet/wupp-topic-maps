import React from 'react';
import PropTypes from 'prop-types';
import ProjGeoJson from '../components/ProjGeoJson';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import * as turfHelpers from '@turf/helpers';
import bboxPolygon from '@turf/bbox-polygon';
import intersect from '@turf/intersect';
import polylabel from '@mapbox/polylabel'
import proj4 from 'proj4';
import { proj4crs25832def } from '../constants/gis';

import * as gisHelpers from '../utils/gisHelper';

// Since this component is simple and static, there's no parent container for it.
const FeatureCollectionDisplay = ({mappingProps, style, labeler, featureClickHandler, mapRef}) => {
    let markers=[];
    let markerPos=[];
    let bbox=[ mappingProps.boundingBox.left,
                    mappingProps.boundingBox.bottom,
                    mappingProps.boundingBox.right,
                    mappingProps.boundingBox.top
                     ];
    let view=bboxPolygon(bbox)
    let selectedMarkers=[];
    if (mappingProps.featureCollection.length>0) {
        for (let currentfeatureIdx in mappingProps.featureCollection) {
            let currentFeature=mappingProps.featureCollection[currentfeatureIdx];
            if (currentFeature.geometry.type==='Polygon' || (currentFeature.geometry.type==='MultiPolygon' && currentFeature.geometry.coordinates.length===1)) {
                //console.log("Polygon");
                let coordinates=null;
                if (currentFeature.geometry.type==='Polygon' ) {
                    coordinates=currentFeature.geometry.coordinates;
                }
                else {
                    //must currentFeature.geometry.type==='MultiPolygon' && currentFeature.geometry.coordinates.length===1
                    coordinates=currentFeature.geometry.coordinates[0];
                }

                let marker=createMarker(currentFeature,"marker."+currentFeature.id,coordinates,view,markerPos, labeler);
                if (currentFeature.selected===true) {
                    selectedMarkers.push(marker);
                }
                else {
                    markers.push(marker);
                }

            }
            else if (currentFeature.geometry.type==='MultiPolygon' && currentFeature.geometry.coordinates.length>1){
                //console.log("Multipolygon mit "+currentFeature.geometry.coordinates.length);
                for (let currentsubfeatureIdx in currentFeature.geometry.coordinates) {
                    let coordinates=currentFeature.geometry.coordinates[currentsubfeatureIdx]
                    let marker=createMarker(currentFeature,"marker.subfeature"+currentFeature.id+"."+currentsubfeatureIdx,coordinates,view,markerPos, labeler);
                    if (currentFeature.selected===true) {
                        selectedMarkers.push(marker);
                    }
                    else {
                        markers.push(marker);
                    }
                }
            }
            else if (currentFeature.geometry.type==='Point') {
            

            }
        }
        for (let midx in selectedMarkers) {
            markers.push(selectedMarkers[midx]);
        }
    }

  return (
    <div>
         <ProjGeoJson key={JSON.stringify(mappingProps)} mappingProps={mappingProps} style={style}  featureClickHandler={featureClickHandler} mapRef={mapRef}/>
        {markers}

    </div>
  );
};

function createMarker(currentFeature, key, coordinates, view, markerPos, labeler) {
    //get the subfeature into a polygon
    console.log(coordinates)
    let polygon=turfHelpers.polygon(coordinates);
    let newPoly=intersect(view,polygon);

    let pointOnPolygon=null
    if (newPoly) {
        pointOnPolygon =gisHelpers.getLabelPosition(newPoly) //if there is a multipolygon created from the boundingbox intersects use the first
    }
    else {
        pointOnPolygon = polylabel(coordinates)
    }

    if (isNaN(pointOnPolygon[0])) {
        pointOnPolygon = polylabel(coordinates)
    }
    let pointOnPolygonWGS84=proj4(proj4crs25832def,proj4.defs('EPSG:4326'),[pointOnPolygon[0],pointOnPolygon[1]]);

    let offset=null;
    let position=[pointOnPolygonWGS84[1],pointOnPolygonWGS84[0]];
    if (markerPos.includes(position[0]+"-"+position[1])) {
        offset=new L.point(15,15);
    }
    else {
        offset=new L.point(-15,-15);
    }
    markerPos.push(position[0]+"-"+position[1]);

    return (
        <Marker key={key} position={[pointOnPolygonWGS84[1],pointOnPolygonWGS84[0]]} opacity={0.0} onClick={labelClick}>
            <Tooltip className={'customGeoJSONFeatureTooltipClass'} permanent={true} direction={'center'} offset={offset} onClick={labelClick}>
                <div>{labeler(currentFeature)}</div>
            </Tooltip>
        </Marker>
    )
}

function labelClick(event) {
    // console.log("TOOOOOOLTIP");
    // console.log(event);
}

export default FeatureCollectionDisplay;
 FeatureCollectionDisplay.propTypes = {
   mappingProps: PropTypes.object.isRequired,
   style: PropTypes.func.isRequired,
   labeler: PropTypes.func.isRequired,
   featureClickHandler: PropTypes.func.isRequired,
   mapRef: PropTypes.object,
 };
