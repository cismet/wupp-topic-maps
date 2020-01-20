import React from 'react';
import PropTypes from 'prop-types';
import ExtraMarker from './ExtraMarker';
import { proj4crs25832def } from '../constants/gis';
import proj4 from 'proj4';

const GazetteerHitDisplay = ({ mappingProps, style, labeler, featureClickHandler, mapRef }) => {
	let gazMarker = null;

	if (mappingProps.gazetteerHit != null) {
		const pos = proj4(proj4crs25832def, proj4.defs('EPSG:4326'), [
			mappingProps.gazetteerHit.x,
			mappingProps.gazetteerHit.y
		]);
		let markerOptions = {
			icon: 'fa-' + mappingProps.gazetteerHit.glyph,
			markerColor: 'cyan',
			spin: false,
			prefix: 'fas'
		};
		gazMarker = (
			<ExtraMarker
				key={'gazmarker.' + JSON.stringify(mappingProps.gazetteerHit)}
				markerOptions={markerOptions}
				position={[ pos[1], pos[0] ]}
			/>
		);
	}
	return gazMarker;
};

export default GazetteerHitDisplay;
GazetteerHitDisplay.propTypes = {
	mappingProps: PropTypes.object,
	mapRef: PropTypes.object
};
