import polylabel from '@mapbox/polylabel';
import proj4 from 'proj4';
import { proj4crs25832def } from '../constants/gis';

export function getPolygonfromBBox(bbox) {
	return (
		'POLYGON((' +
		bbox.left +
		' ' +
		bbox.top +
		',' +
		bbox.right +
		' ' +
		bbox.top +
		',' +
		bbox.right +
		' ' +
		bbox.bottom +
		',' +
		bbox.left +
		' ' +
		bbox.bottom +
		',' +
		bbox.left +
		' ' +
		bbox.top +
		'))'
	);
}

export function getLabelPosition(feature) {
	if (feature.geometry.type === 'Polygon') {
		return getLabelPositionForPolygon(feature.geometry.coordinates);
	}
	if (feature.geometry.type === 'MultiPolygon') {
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
	const projectedNE = proj4(proj4crs25832def, proj4.defs('EPSG:4326'), [ bbox[0], bbox[1] ]);
	const projectedSW = proj4(proj4crs25832def, proj4.defs('EPSG:4326'), [ bbox[2], bbox[3] ]);
	return [ [ projectedNE[1], projectedSW[0] ], [ projectedSW[1], projectedNE[0] ] ];
}

export function convertPoint(x, y) {
	let xval;
	let yval;
	if (typeof x === 'string') {
		xval = parseFloat(x);
	}
	if (typeof y === 'string') {
		yval = parseFloat(y);
	}
	const projectedPoint = proj4(proj4.defs('EPSG:4326'), proj4crs25832def, [ yval, xval ]);
	return projectedPoint;
}
