import { MapLayer } from 'react-leaflet';
import L from 'leaflet';
import chroma from 'chroma-js';
import '../commons/canvaslayerfield/_main';

// import 'leaflet-canvaslayer-field/dist/leaflet.canvaslayer.field';
import '../commons/canvaslayerfield/layer/L.CanvasLayer.Field';
import * as d3 from 'd3';
import bboxPolygon from '@turf/bbox-polygon';
/* eslint import/no-webpack-loader-syntax: off */
// import Worker from 'worker-loader!./VectorFieldAnimationUpdateLayerWorker.js';

async function produceVectorfield(uGrid, vGrid, scaleFactor) {
	return L.VectorField.fromASCIIGrids(uGrid, vGrid, scaleFactor);
}
window.d3 = d3;
const NO_DATA_GRID = L.VectorField.fromASCIIGrids(
	`ncols        1
	nrows        1
	xllcorner    7.195475301563
	yllcorner    51.270322489917
	cellsize     0.000012217020
	NODATA_value  -1
	 -1.0`,
	`ncols        1
	 nrows        1
	 xllcorner    7.195475301563
	 yllcorner    51.270322489917
	 cellsize     0.000012217020
	 NODATA_value  -1
	  -1.0`,
	0.001
);

const getBBoxForBounds = (bounds) => {
	return [
		bounds._southWest.lng,
		bounds._northEast.lat,
		bounds._northEast.lng,
		bounds._southWest.lat
	];
};
// const service="http://127.0.0.1:8881";
const service = 'https://rasterfari.cismet.de';
// const worker = new Worker();

class VectorFieldAnimation extends MapLayer {
	constructor(props, context) {
		super(props, context);
		window.d3 = d3;
		this.context = context;
		this.timers = [];
		this.state = { isLoadingAnimationData: true };
		const that = this;
		// worker.addEventListener('message', function(e) {
		// 	if (that.leafletElement !== undefined) {
		// 		that.leafletElement._field = e.data;
		// 	}
		// 	console.log('Message from Worker: ' + e.data);
		// });
	}

	setLoadingAnimationData(isLoadingAnimationData) {
		//this.setState({ isLoadingAnimationData });
	}
	createLeafletElement() {
		console.log('VFA: createleafletElement');

		let scaleFactor = 0.001; // to m/s

		let vf = NO_DATA_GRID;

		// let vf = L.VectorField.fromASCIIGrids(arrays[0], arrays[1], scaleFactor);
		let that = this;
		setTimeout(() => {
			console.log('VFA: createleafletElement: updateLayer()');

			that.updateLayer(that.props.bbox);
			// that.leafletElement.initialized = true;
		}, 10);
		const l = L.canvasLayer.vectorFieldAnim(vf, this.props.settings);
		l.bbox = 'NO_DATA';
		return l;
	}
	updateLeafletElement(fromProps: Object, toProps: Object) {
		console.log('VFA: updateLeafletElement');

		if (this.leafletElement) {
			console.log('VFA: updateLeafletElement ');

			if (this.leafletElement.timer && this.leafletElement.initialized === true) {
				console.log('VFA: stop timer', this.leafletElement);
				this.leafletElement.timer.stop();
			}
			const bounds = this.context.map.getBounds();
			const bbox = getBBoxForBounds(bounds);
			if (this.leafletElement.bbox === JSON.stringify(bbox)) {
				console.log('VFA: same bbox: do nothing');
			} else {
				console.log('VFA: componentDidUpdate: call updateLayer');
				this.updateLayer(toProps.bbox);
			}
		}
	}

	// componentWillUnmount() {
	// 	console.log('VFA: componentWillUnmount');

	// 	if (this.leafletElement.timer) {
	// 		this.leafletElement.timer.stop();
	// 	}
	// 	this.context.map.removeLayer(this.leafletElement);
	// 	// try {
	// 	// 	super.componentWillUnmount();
	// 	// } catch (e) {
	// 	// 	console.log('error in componentWillUnmount', e);
	// 	// }
	// }

	// componentDidMount() {
	// 	try {
	// 		super.componentDidMount();
	// 	} catch (e) {
	// 		console.log('error in componentDidMount', e);
	// 	}
	// }
	// componentWillUnmount() {
	// 	console.log('VFA: componentWillUnmount');

	// 	if (this.leafletElement.timer) {
	// 		this.leafletElement.timer.stop();
	// 	}
	// 	// try {
	// 	// 	super.componentWillUnmount();
	// 	// } catch (e) {
	// 	// 	console.log('error in componentWillUnmount', e);
	// 	// }
	// }

	// componentDidMount() {
	// 	super.componentDidMount();
	// 	console.log('VFA: timer', this.leafletElement.timer);

	// 	// const bounds = this.context.map.getBounds();
	// 	// const bbox = getBBoxForBounds(bounds);
	// 	// super.componentDidMount();
	// 	// this.updateLayer(bbox, true);
	// }

	// componentWillUnmount() {
	// 	try {
	// 		super.componentWillUnmount();
	// 	} catch (e) {
	// 		console.log('VFA: error in super.componentWillUnmount. could be already unmounted', e);
	// 	}
	// 	// if (this.leafletElement) {
	// 	// 	if (this.leafletElement.timer) {
	// 	// 		this.leafletElement.timer.stop();
	// 	// 	}
	// 	// }
	// }

	// superComponentDidMount() {
	// 	try {
	// 		super.componentDidMount();
	// 	} catch (e) {
	// 		console.log('VFA: error in super.componentDidMount. could be already unmounted', e);
	// 	}
	// }

	// componentDidUpdate(prevProps, newProps) {
	// 	super.componentDidUpdate(prevProps, newProps);

	// 	if (this.leafletElement) {
	// 		const bounds = this.context.map.getBounds();
	// 		const bbox = getBBoxForBounds(bounds);
	// 		if (this.leafletElement.bbox === JSON.stringify(bbox)) {
	// 			console.log('VFA: same bbox: do nothing ', this.leafletElement.initialized);
	// 			if (this.leafletElement.timer && this.leafletElement.initialized === true) {
	// 				this.leafletElement.timer.stop();
	// 				console.log('VFA: stop timer');
	// 			}
	// 		} else {
	// 			console.log('VFA: componentDidUpdate: call updateLayer');
	// 			this.updateLayer(bbox);
	// 		}
	// 	}
	// }

	// updateLayer_(bbox) {
	// 	worker.postMessage({ bbox, layerPrefix: this.props.layerPrefix });
	// }

	updateLayer(bbox) {
		this.leafletElement.bbox = JSON.stringify(bbox);

		console.log(
			'VFA: updateLayer()',
			this.leafletElement.timer,
			this.leafletElement.initialized
		);

		//		this.timers.push(this.leafletElement.timer);

		if (this.leafletElement.timer && this.leafletElement.initialized === true) {
			this.leafletElement.timer.stop();
			console.log('VFA: stop timer');
		}
		this.setLoadingAnimationData(true);
		//BBOX=7.1954778,51.2743996,7.2046701,51.2703213

		let url_u = `${service}/gdalProcessor?REQUEST=translate&SRS=EPSG:4326&BBOX=${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]}&LAYERS=docs/regen/${this
			.props.layerPrefix}u84.tif&FORMAT=text/raster.asc`;
		let url_v = `${service}/gdalProcessor?REQUEST=translate&SRS=EPSG:4326&BBOX=${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]}&LAYERS=docs/regen/${this
			.props.layerPrefix}v84.tif&FORMAT=text/raster.asc`;

		var urls = [ url_u, url_v ];

		console.log('VFA: different urls: fetch again');

		var promises = urls.map((url) => fetch(url).then((r) => r.text()));
		let that = this;

		setTimeout(() => {
			console.log('VFA: updateLayer: debug waiting period over');

			Promise.all(promises).then(function(arrays) {
				let scaleFactor = 0.001; // to m/s
				console.log('VFA: updateLayer: before vectorfield creation');
				// 	Promise.resolve(
				// 		produceVectorfield(arrays[0], arrays[1], scaleFactor)
				// 	).then((vf) => {
				let vf = L.VectorField.fromASCIIGrids(arrays[0], arrays[1], scaleFactor);
				console.log('VFA: updateLayer: after vectorfield creation', vf);

				var range = vf.range;
				var scale = chroma.scale('OrRd').domain(range);

				console.log('VFA: updateLayer: before vectorfield update');
				that.leafletElement._field = vf;

				//that.leafletElement = layer;
				that.leafletElement.initialized = true;
				console.log(
					'VFA: updateLayer: vectorfield updated',
					that.leafletElement.initialized
				);
				// 	});
			});
		}, 1);
	}
}

export default VectorFieldAnimation;
