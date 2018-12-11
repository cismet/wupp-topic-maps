import React from 'react';
import L from 'leaflet';
import { MapLayer } from 'react-leaflet';
import PropTypes from 'prop-types';
import LeafletCanvasLayer from './LeafletCanvasLayer';

export default class CanvasLayer extends MapLayer {
	createLeafletElement() {
		return null;
	}
	componentDidMount() {
    this.leafletElement = LeafletCanvasLayer.extend({
      renderCircle: function(ctx, point, radius) {
        ctx.fillStyle = 'rgba(255, 60, 60, 0.2)';
        ctx.strokeStyle = 'rgba(255, 60, 60, 0.9)';
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2.0, true, true);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      },
      render: function() {
        var canvas = this.getCanvas();
        var ctx = canvas.getContext('2d');
        // clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // get center from the map (projected)
        var point = this._map.latLngToContainerPoint(new L.LatLng(0, 0));
        // render
        this.renderCircle(ctx, point, (1.0 + Math.sin(Date.now()*0.001))*300);
        this.redraw();
      }
    });
	}
}
