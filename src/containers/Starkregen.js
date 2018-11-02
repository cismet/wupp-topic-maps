import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import { actions as MappingActions } from '../redux/modules/mapping';
import { actions as UIStateActions } from '../redux/modules/uiState';
import {
	actions as BaederActions,
	getBaeder,
	getBaederFeatureCollection,
	getBadSvgSize,
	getBaederFeatureCollectionSelectedIndex
} from '../redux/modules/baeder';

import { routerActions as RoutingActions } from 'react-router-redux';
import { getFeatureStyler, featureHoverer } from '../utils/stadtplanHelper';
import { getColorForProperties } from '../utils/baederHelper';
import BaederInfo from '../components/baeder/BaederInfo';
import BaederModalMenu from '../components/baeder/BaederModalMenu';
import TopicMap from '../containers/TopicMap';
import { WMSTileLayer } from 'react-leaflet';
import Control from 'react-leaflet-control';
import { FeatureCollectionDisplay } from 'react-cismap';
import { Well } from 'react-bootstrap';

import L from 'leaflet';

(function() {
	var originalInitTile = L.GridLayer.prototype._initTile;
	var originalGetTileUrl = L.TileLayer.WMS.prototype.getTileUrl;
	console.log(originalGetTileUrl);
	// L.GridLayer.include({
	//     _initTile: function (tile) {
	//         originalInitTile.call(this, tile);

	//         var tileSize = this.getTileSize();

	//         tile.style.width = tileSize.x + 1 + 'px';
	//         tile.style.height = tileSize.y + 1 + 'px';
	//     }
	// });

	// L.TileLayer.WMS.include({
	// 	getTileUrl: function(coords){
	// 		let url=originalGetTileUrl.call(this, coords);
	// 		if (this.options.coordsRoundingDecimalPlaces){
	// 		let urlParts=url.split('?');
	// 		let roundingFactor=Math.pow(10,this.options.coordsRoundingDecimalPlaces);
	// 		console.log("vorher", url)
	// 		let usp=new URLSearchParams(urlParts[1]);
	// 		let bbox=usp.get("bbox");
	// 		let elements=bbox.split(",");
	// 		let newElements=[];
	// 		for (let el of elements){
	// 			newElements.push(Math.round(el*roundingFactor)/roundingFactor);
	// 		}
	// 		let newBBox=newElements.join(",");
	// 		console.log('newBBox',newBBox);
	// 		usp.set("bbox",newBBox);
	// 		let newUrl=urlParts[0]+"?"+usp.toString()
	// 		console.log("nachher",newUrl)

	// 		//return "https://picsum.photos/256&"+JSON.stringify(coords);
	// 		return newUrl;
	// 	}
	// 	else {
	// 		console.log("no change",url)

	// 		return url;
	// 	}

	// 	}
	// }
	//);
})();

function mapStateToProps(state) {
	return {
		uiState: state.uiState,
		mapping: state.mapping,
		routing: state.routing,
		baeder: state.baeder,
		gazetteerTopics: state.gazetteerTopics
	};
}

function mapDispatchToProps(dispatch) {
	return {
		mappingActions: bindActionCreators(MappingActions, dispatch),
		uiStateActions: bindActionCreators(UIStateActions, dispatch),
		routingActions: bindActionCreators(RoutingActions, dispatch),
		baederActions: bindActionCreators(BaederActions, dispatch)
	};
}

const legend = [
	{ title: '> 0,10 m', bg: '#AFCFF9' },
	{ title: '> 0,25 m', bg: '#E9B279' },
	{ title: '> 0,50 m', bg: '#FED27B' },
	{ title: '> 1,00 m', bg: '#DD8C7B' }
];

const bgPreview = [
	<img width="100px" src="/images/rain-hazard-next-bg/0.png" />,
	<img width="100px" src="/images/rain-hazard-next-bg/1.png" />,
	<img width="100px" src="/images/rain-hazard-next-bg/2.png" />
];

export class Starkregen_ extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.gotoHome = this.gotoHome.bind(this);
		this.toggleBackground = this.toggleBackground.bind(this);
		this.toggleSimulation = this.toggleSimulation.bind(this);
		this.backgroundIndex = 0;
		this.backgrounds = [ 'wupp-plan-live@40', 'trueOrtho2018@40', 'wupp-plan-live@60|trueOrtho2018@40' ];
		this.simulationIndex = 0;
		this.simulations = [
			{ layer: 'R102:20md', title: '20 jährlicher Starkregen', next: 1 },
			{ layer: 'R102:50md', title: '50 jährlicher Starkregen', next: 2 },
			{ layer: 'R102:100md', title: '100 jährlicher Starkregen', next: 3 },
			{ layer: 'R102:100md', title: 'Ereigniss am 29.05.2018', next: 0 }
		];
	}

	gotoHome() {
		if (this.topicMap) {
			this.topicMap.wrappedInstance.gotoHome();
		}
	}

	toggleBackground() {
		this.backgroundIndex = (this.backgroundIndex + 1) % this.backgrounds.length;
		this.forceUpdate();
	}
	toggleSimulation() {
		this.simulationIndex = (this.simulationIndex + 1) % this.simulations.length;
		this.forceUpdate();
	}

	render() {
		let options = { opacity: 1 };

		let header = (
			<table style={{ width: '100%' }}>
				<tbody>
					{legend.map((item) => {
						return (
							<td
								style={{
									textAlign: 'center',
									verticalAlign: 'top',
									background: item.bg,
									// color: textColor,
									paddingLeft: '3px',
									paddingTop: '0px',
									paddingBottom: '0px'
								}}
							>
								<div>{item.title}</div>
							</td>
						);
					})}
				</tbody>
			</table>
		);

		let info = (
			<div pixelwidth={300}>
				<table style={{ width: '100%' }}>
					<tbody>
						<tr>
							<td
								style={{
									opacity: '0.9',
									paddingLeft: '0px',
									paddingTop: '0px',
									paddingBottom: '0px'
								}}
							>
								{header}
							</td>
						</tr>
					</tbody>
				</table>
				<Well pixelwidth={300} bsSize="small">
					<h4>{this.simulations[this.simulationIndex].title}</h4>
					<p>
						Bei den angezeigten Wasserständen handelt es sich um Simulationsergebnisse (<a>Weitere Infos</a>).
					</p>
					<table style={{ width: '100%' }}>
						<tbody>
							<tr>
								<td
									style={{
										textAlign: 'center',
										paddingLeft: '0px',
										paddingTop: '0px',
										paddingBottom: '5px'
									}}
								>
									<h5>anderes Ereigniss</h5>
								</td>
								<td
									style={{
										textAlign: 'center',
										paddingLeft: '0px',
										paddingTop: '0px',
										paddingBottom: '5px'
									}}
								>
									<h5>anderer Kartenhintergrund</h5>
								</td>
							</tr>
							<tr>
								<td
									style={{
										textAlign: 'center',
										paddingLeft: '0px',
										paddingTop: '0px',
										paddingBottom: '0px'
									}}
								>
									<a
										onClick={() => {
											this.toggleSimulation();
										}}
									>
										{this.simulations[this.simulations[this.simulationIndex].next].title}
									</a>
								</td>
								<td
									key={'bgprev' + this.backgroundIndex}
									style={{
										textAlign: 'center',
										paddingLeft: '0px',
										paddingTop: '0px',
										paddingBottom: '0px'
									}}
								>
									<a
										onClick={() => {
											this.toggleBackground();
										}}
									>
										{bgPreview[this.backgroundIndex]}
									</a>
								</td>
							</tr>
						</tbody>
					</table>
				</Well>
			</div>
		);
		return (
			<TopicMap
				key={'topicmap with background no' + this.backgroundIndex}
				ref={(comp) => {
					this.topicMap = comp;
				}}
				noInitialLoadingText={true}
				fullScreenControl
				locatorControl
				gazetteerSearchBox
				gazetteerSearchBoxPlaceholdertext="Stadtteil | Adresse | POI"
				photoLightBox
				infoBox={info}
				backgroundlayers={this.props.match.params.layers || this.backgrounds[this.backgroundIndex]}
			>
				{/* <WMSTileLayer
      key={"trueOrtho2018"+JSON.stringify(options)}
      url="https://geoportal.wuppertal.de/deegree/wms"
			layers="R102:trueortho2018 "
			format="image/png"
			tiled="true"
			maxZoom={19}
			opacity={options.opacity}
			styles="default"
			coordsRoundingDecimalPlaces={0}


		/> */}

				<WMSTileLayer
					key={'Ortho2014' + JSON.stringify(options)}
					url="http://geoportal.wuppertal.de/deegree/wms"
					layers={this.simulations[this.simulationIndex].layer}
					version="1.1.1"
					transparent="true"
					format="image/png"
					tiled="true"
					styles="default"
					maxZoom={19}
					opacity={1}
				/>

				{/* <WMSTileLayer
      key={"trueortho2018"+JSON.stringify(options)}
      url="http://geoportal.wuppertal.de/deegree/wms"
			layers="R102:trueortho2018"
			transparent="true"
			format="image/png"
			tiled="true"
			xrounding={10}
			
			maxZoom={19}
			opacity={1}
		/>  */}

				{/* <WMSTileLayer
      key={"Ortho2014"+JSON.stringify(options)}
      url="http://basisdaten.wuppertal-intra.de:8399/arcgis/services/WuNDa-Orthophoto-WUP/MapServer/WMSServer"
			layers="13"
			transparent="true"
			format="image/png"
			tiled="true"
				styles="default"
				
			maxZoom={19}
			opacity={1}
		/>  */}

				{/* 		 
		  <WMSTileLayer
      key={"Ortho2014"+JSON.stringify(options)}
      url="http://geoportal.wuppertal.de/deegree/wms"
			layers="R102:100md"
			version="1.1.1"
			transparent="true"
			format="image/png"
			tiled="true"
		    styles="default"
			maxZoom={19}
			opacity={0.8}
		/>  */}

				{
					// <FeatureCollectionDisplay
					// 		key={
					// 			'FeatureCollectionDisplayPreview.'
					// 			// +
					// 			//   this.props.featureKeySuffixCreator() +
					// 			//   "clustered:" +
					// 			//   this.props.clustered +
					// 			//   ".customPostfix:" +
					// 			//   this.props.featureCollectionKeyPostfix
					// 		}
					// 		featureCollection={FC}
					// 		clusteringEnabled={false}
					// 		//mapRef={this.leafletMap}
					// 		showMarkerCollection={false}
					// 	/>
				}
			</TopicMap>
		);
	}
}

const Starkregen = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Starkregen_);

export default Starkregen;

Starkregen.propTypes = {
	ui: PropTypes.object,
	uiState: PropTypes.object
};
