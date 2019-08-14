import { GridLayer } from 'react-leaflet';
import L from 'leaflet';

class Layer extends GridLayer {
	componentDidMount() {
		console.log('PDFLayer componentDidMount');

		this.leafletElement = L.GridLayer.extend({
			createTile: function(coords) {
				var tile = document.createElement('div');
				tile.innerHTML = [ coords.x, coords.y, coords.z ].join(', ');
				tile.style.outline = '1px solid red';
				return tile;
			}
		})();
		console.log('CoordLayer.this.leafletElement', this.leafletElement);

		super.componentDidMount();
	}
}

export default Layer;
