import React, { PropTypes } from 'react';
import AwesomeMarker from './AwesomeMarker';
import { Marker } from 'react-leaflet';
import { crs25832, proj4crs25832def } from '../constants/gis';
import proj4 from 'proj4';

const GazetteerHitDisplay = ({mappingProps, style, labeler, featureClickHandler, mapRef}) => {
    let gazMarker=null;
    if (mappingProps.gazetteerHit!=null) {

        const pos=proj4(proj4crs25832def,proj4.defs('EPSG:4326'),[mappingProps.gazetteerHit.x,mappingProps.gazetteerHit.y])
        let markerOptions= {
            icon: mappingProps.gazetteerHit.glyphkey,
            markerColor: 'blue',
            spin: false
        }     
        gazMarker=(
            <AwesomeMarker 
                key={"gazmarker."+JSON.stringify(mappingProps.gazetteerHit)} 
                markerOptions={markerOptions} 
                position={[pos[1],pos[0]]} 
            />
        );
    }
    return gazMarker;
}

export default GazetteerHitDisplay;
 GazetteerHitDisplay.propTypes = {
   mappingProps: PropTypes.object.isRequired,
   mapRef: PropTypes.object,
};