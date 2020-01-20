import L from 'leaflet';
import 'proj4leaflet';
import proj4 from 'proj4';

export const proj4crs25832def = '+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs';
const origin = proj4(
	proj4crs25832def,
	// Upper left corner of the tile orign based on the WMTSCapabilities layer BBox
	[ 0.105946948013, 56.8478734515 ]
);

// Set resolutions
const resolutions = [
	17471320.7509,
	8735660.37545,
	4367830.18772,
	2183915.09386,
	1091957.54693,
	545978.773466,
	272989.386733,
	136494.693366,
	68247.3466832,
	34123.6733416,
	17061.8366708,
	8530.9183354,
	4265.4591677,
	2132.72958385,
	1066.364792,
	533.182396,
	266.591198,
	133.295599,
	66.6477995,
	33.32389975
];
export const crs25832 = new L.Proj.CRS('EPSG:25832', proj4crs25832def, {
	origin: [ origin[0], origin[1] ],
	resolutions: resolutions.map(function(value) {
		return value * 0.00028;
	})
});
