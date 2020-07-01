import { MapLayer } from 'react-leaflet';
import L from 'leaflet';
import chroma from 'chroma-js';
import 'leaflet-canvaslayer-field/dist/leaflet.canvaslayer.field';
import * as d3 from 'd3';

class VectorFieldAnimation extends MapLayer {
	constructor(props, context) {
		super(props, context);
		window.d3 = d3;
	}

	createLeafletElement() {
		return null;
	}

	componentDidMount() {
		var url_u = 'https://updates.cismet.de/test/u84.asc?timestamp=' + Date.now();
		var url_v = 'https://updates.cismet.de/test/v84.asc?timestamp=' + Date.now();
		var urls = [ url_u, url_v ];
		var promises = urls.map((url) => fetch(url).then((r) => r.text()));
		let that = this;
		Promise.all(promises).then(function(arrays) {
			let scaleFactor = 0.001; // to m/s
			let vf = L.VectorField.fromASCIIGrids(arrays[0], arrays[1], scaleFactor);
			var range = vf.range;
			var scale = chroma.scale('OrRd').domain(range);
			let layer = L.canvasLayer.vectorFieldAnim(vf, {
				paths: 3000, //-- default 800
				width: 1.0, // number | function widthFor(value)  -- default 1.0
				fade: 0.7, // 0 to 1 -- default 0.96
				duration: 20, // milliseconds per 'frame'  -- default 20
				maxAge: 50, // number of maximum frames per path  -- default 200
				velocityScale: 1 / 200, // -- default 1/ 5000
				color: '#326C88' // html-color | function colorFor(value) [e.g. chromajs.scale]   -- default white
			});

			that.leafletElement = layer;
			that.superComponentDidMount();
		});
	}

	superComponentDidMount() {
		super.componentDidMount();
	}
	componentDidUpdate(prevProps, newProps) {
		if (this.leafletElement) {
			this.leafletElement.timer.stop();
		}
	}
}

export default VectorFieldAnimation;
