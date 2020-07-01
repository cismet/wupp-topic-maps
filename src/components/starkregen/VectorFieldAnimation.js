import { MapLayer } from 'react-leaflet';
import L from 'leaflet';
import chroma from 'chroma-js';
import 'leaflet-canvaslayer-field/dist/leaflet.canvaslayer.field';
import * as d3 from 'd3';

async function produceVectorfield(uGrid, vGrid, scaleFactor) {
	return L.VectorField.fromASCIIGrids(uGrid, vGrid, scaleFactor);
}
// const service="http://127.0.0.1:8881";
const service = 'https://rasterfari.cismet.de';
const settingsForZoom = {
	13: { paths: 3000, velocityScale: 1 / 200, fade: 80 / 100, age: 50 },
	14: { paths: 2560, velocityScale: 1 / 400, fade: 83 / 100, age: 80 },
	15: { paths: 2120, velocityScale: 1 / 800, fade: 86 / 100, age: 110 },
	16: { paths: 1680, velocityScale: 1 / 1600, fade: 89 / 100, age: 140 },
	17: { paths: 1240, velocityScale: 1 / 3200, fade: 92 / 100, age: 170 },
	18: { paths: 800, velocityScale: 1 / 4000, fade: 95 / 100, age: 200 }
};
class VectorFieldAnimation extends MapLayer {
	constructor(props, context) {
		super(props, context);
		window.d3 = d3;
		this.context = context;
	}

	createLeafletElement() {
		return null;
	}

	loadAndVis(didMount = false) {}

	componentDidMount() {
		console.log('xxx context', this.context.map.getBounds());
		const bounds = this.context.map.getBounds();

		//BBOX=7.1954778,51.2743996,7.2046701,51.2703213
		// let url_u = `http://127.0.0.1:8881/gdalProcessor?REQUEST=translate&SRS=EPSG:4326&BBOX=${bounds
		// 	._southWest.lng},${bounds._northEast.lat},${bounds._northEast.lng},${bounds._southWest
		// 	.lat}&LAYERS=docs/regen/u84.tif&FORMAT=text/raster.asc`;
		// let url_v = `http://127.0.0.1:8881/gdalProcessor?REQUEST=translate&SRS=EPSG:4326&BBOX=${bounds
		// 	._southWest.lng},${bounds._northEast.lat},${bounds._northEast.lng},${bounds._southWest
		// 	.lat}&LAYERS=docs/regen/v84.tif&FORMAT=text/raster.asc`;

		var urls = [ this.props.url_u, this.props.url_v ];
		console.log('VFA: ', urls);

		var promises = urls.map((url) => fetch(url).then((r) => r.text()));
		let that = this;
		Promise.all(promises).then(function(arrays) {
			console.log('VFA: urls fetched');

			let scaleFactor = 0.001; // to m/s
			let vf = L.VectorField.fromASCIIGrids(arrays[0], arrays[1], scaleFactor);
			var range = vf.range;
			var scale = chroma.scale('OrRd').domain(range);
			let paths = settingsForZoom[that.props.zoomlevel].paths;
			let velocityScale = settingsForZoom[that.props.zoomlevel].velocityScale;
			let fade = settingsForZoom[that.props.zoomlevel].fade;
			let age = settingsForZoom[that.props.zoomlevel].age;
			console.log('xxx velocityScale', velocityScale);

			let layer = L.canvasLayer.vectorFieldAnim(vf, {
				paths, //-- default 800
				width: 1.0, // number | function widthFor(value)  -- default 1.0
				fade, // 0 to 1 -- default 0.96
				duration: 20, // milliseconds per 'frame'  -- default 20
				maxAge: age, // number of maximum frames per path  -- default 200
				velocityScale, // -- default 1/ 5000
				color: '#326C88' // html-color | function colorFor(value) [e.g. chromajs.scale]   -- default white
			});

			that.leafletElement = layer;
			that.superComponentDidMount();
			console.log('xxx done');
		});
	}

	superComponentDidMount() {
		super.componentDidMount();
	}

	componentDidUpdate(prevProps, newProps) {
		if (this.leafletElement) {
			if (this.leafletElement.timer) {
				this.leafletElement.timer.stop();
			}
			//this.context.map.removeLayer(this.leafletElement);
			//this.componentDidMount();

			const bounds = this.context.map.getBounds();

			//BBOX=7.1954778,51.2743996,7.2046701,51.2703213
			let url_u = `${service}/gdalProcessor?REQUEST=translate&SRS=EPSG:4326&BBOX=${bounds
				._southWest.lng},${bounds._northEast.lat},${bounds._northEast.lng},${bounds
				._southWest.lat}&LAYERS=docs/regen/u84.tif&FORMAT=text/raster.asc`;
			let url_v = `${service}/gdalProcessor?REQUEST=translate&SRS=EPSG:4326&BBOX=${bounds
				._southWest.lng},${bounds._northEast.lat},${bounds._northEast.lng},${bounds
				._southWest.lat}&LAYERS=docs/regen/v84.tif&FORMAT=text/raster.asc`;

			var urls = [ url_u, url_v ];
			if (this.leafletElement.url_u === url_u && this.leafletElement.url_v === url_v) {
				console.log('VFA: same shit: do nothing');
			} else {
				console.log('VFA: different urls: fetch again');

				var promises = urls.map((url) => fetch(url).then((r) => r.text()));
				let that = this;
				that.leafletElement.url_u = url_u;
				that.leafletElement.url_v = url_v;
				setTimeout(() => {
					console.log('VFA: debug waiting period over');

					Promise.all(promises).then(function(arrays) {
						let scaleFactor = 0.001; // to m/s
						console.log('VFA: before vectorfield creation');
						Promise.resolve(
							produceVectorfield(arrays[0], arrays[1], scaleFactor)
						).then((vf) => {
							// let vf = L.VectorField.fromASCIIGrids(
							// 	arrays[0],
							// 	arrays[1],
							// 	scaleFactor
							// );
							console.log('VFA: after vectorfield creation', vf);
							var range = vf.range;
							var scale = chroma.scale('OrRd').domain(range);

							console.log('VFA: before vectorfield update');
							that.leafletElement._field = vf;
							//that.leafletElement = layer;
							console.log('VFA: vectorfield updated');
						});
					});
				}, 1);
			}
		}
	}
}

export default VectorFieldAnimation;
