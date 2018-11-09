import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import { actions as MappingActions } from '../redux/modules/mapping';
import { actions as UIStateActions } from '../redux/modules/uiState';
import { actions as StarkregenActions, initialState as starkregenInitialState } from '../redux/modules/starkregen';

import { proj4crs25832def } from '../constants/gis';
import proj4 from 'proj4';

import { routerActions as RoutingActions } from 'react-router-redux';
import TopicMap from '../containers/TopicMap';
import { WMSTileLayer, Marker, Popup } from 'react-leaflet';
import { Well, Label } from 'react-bootstrap';

import L from 'leaflet';
import { Icon } from 'react-fa';
import {FeatureCollectionDisplay} from 'react-cismap';
import { modifyQueryPart } from '../utils/routingHelper';
import InfoBox from '../components/starkregen/ControlInfoBox';
(function() {
	// var originalInitTile = L.GridLayer.prototype._initTile;
	// var originalGetTileUrl = L.TileLayer.WMS.prototype.getTileUrl;
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
		starkregen: state.starkregen,
		gazetteerTopics: state.gazetteerTopics
	};
}

function mapDispatchToProps(dispatch) {
	return {
		mappingActions: bindActionCreators(MappingActions, dispatch),
		uiStateActions: bindActionCreators(UIStateActions, dispatch),
		routingActions: bindActionCreators(RoutingActions, dispatch),
		starkregenActions: bindActionCreators(StarkregenActions, dispatch)
	};
}

export class Starkregen_ extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.gotoHome = this.gotoHome.bind(this);
		this.getFeatureInfo = this.getFeatureInfo.bind(this);
		this.setSimulationStateFromUrl = this.setSimulationStateFromUrl.bind(this);
		this.setBackgroundStateFromUrl = this.setBackgroundStateFromUrl.bind(this);
		this.setSimulationStateInUrl = this.setSimulationStateInUrl.bind(this);
	}

	comnponentDidMount() {
		console.log('didMount');
	}

	componentDidUpdate() {
		this.setSimulationStateFromUrl();
		this.setBackgroundStateFromUrl();
	}

	setSimulationStateFromUrl() {
		let selectedSimulationFromUrlQueryValue = new URLSearchParams(this.props.routing.location.search).get(
			'selectedSimulation'
		);
		if (selectedSimulationFromUrlQueryValue) {
			let selectedSimulationFromUrl = parseInt(selectedSimulationFromUrlQueryValue, 10);
			if (selectedSimulationFromUrl !== this.props.starkregen.selectedSimulation) {
				this.props.starkregenActions.setSimulation(selectedSimulationFromUrl);
			}
		} else {
			this.props.routingActions.push(
				this.props.routing.location.pathname +
					modifyQueryPart(this.props.routing.location.search, {
						selectedSimulation: this.props.starkregen.selectedSimulation
					})
			);
		}
	}

	setBackgroundStateFromUrl() {
		let urlBackground = this.props.match.params.layers;
		if (urlBackground) {
		}
	}
	setSimulationStateInUrl(simulation) {
		if (simulation !== this.props.starkregen.selectedSimulation) {
			this.props.routingActions.push(
				this.props.routing.location.pathname +
					modifyQueryPart(this.props.routing.location.search, {
						selectedSimulation: simulation
					})
			);
		}
	}

	getFeatureInfo(event) {
		if (this.props.starkregen.featureInfoModeActivated) {
			const pos = proj4(proj4.defs('EPSG:4326'), proj4crs25832def, [ event.latlng.lng, event.latlng.lat ]);
			const wkt = `POINT(${pos[0]} ${pos[1]})`;
			const minimalBoxSize = 0.0001;
			const roundingDecimalPlaces = 1;
			const roundingFactor = Math.pow(10, roundingDecimalPlaces);
			const selectedSimulation = this.props.starkregen.simulations[this.props.starkregen.selectedSimulation]
				.layer;
			const getFetureInfoRequestUrl =
				`https://geoportal.wuppertal.de/deegree/wms\?` +
				`service\=WMS\&request\=GetFeatureInfo\&` +
				`styles\=default\&format\=image%2Fpng\&transparent\=true\&` +
				`version\=1.1.1\&tiled\=true\&` +
				`width\=1\&height\=1\&srs\=EPSG%3A25832\&` +
				`bbox\=` +
				`${pos[0] - minimalBoxSize},` +
				`${pos[1] - minimalBoxSize},` +
				`${pos[0] + minimalBoxSize},` +
				`${pos[1] + minimalBoxSize}\&` +
				`x\=0\&y\=0\&` +
				`layers\=${selectedSimulation}\&` +
				`QUERY_LAYERS\=${selectedSimulation}\&` +
				`INFO_FORMAT\=application/vnd.ogc.gml`;

			fetch(getFetureInfoRequestUrl)
				.then((response) => {
					if (response.ok) {
						return response.text();
					} else {
						throw new Error("Server md5 response wasn't OK");
					}
				})
				.then((data) => {
					const parser = new DOMParser();
					const xmlDoc = parser.parseFromString(data, 'text/xml');
					const value = parseFloat(xmlDoc.getElementsByTagName('ll:value')[0].textContent, 10);
					const roundedValue = Math.round(value * roundingFactor) / roundingFactor;
					this.props.starkregenActions.setCurrentFeatureInfoValue(roundedValue);
					this.props.starkregenActions.setCurrentFeatureInfoPosition(pos);
					console.log('value', Math.round(value * roundingFactor) / roundingFactor);
				})
				.catch((error) => {
					console.log('error during fetch', error);
				});
		}
	}
	gotoHome() {
		if (this.topicMap) {
			this.topicMap.wrappedInstance.gotoHome();
		}
	}
	render() {
		let options = { opacity: 1 };

		let simulationLabels = [];
		this.props.starkregen.simulations.map((item, index) => {
			let bsStyle;
			if (this.props.starkregen.selectedSimulation === index) {
				bsStyle = 'primary';
			} else {
				bsStyle = 'default';
			}
			let label = (
				<a
					style={{ textDecoration: 'none' }}
					onClick={() => {
						this.setSimulationStateInUrl(index);
					}}
				>
					<Label bsStyle={bsStyle}>{item.name}</Label>
				</a>
			);
			simulationLabels.push(label);
		});
		let selSim = this.props.starkregen.simulations[this.props.starkregen.selectedSimulation];
		let info = (
			<InfoBox
				pixelwidth={330}
				selectedSimulation={selSim}
				simulationLabels={simulationLabels}
				backgrounds={this.props.starkregen.backgrounds}
				selectedBackgroundIndex={this.props.starkregen.selectedBackground}
				setBackgroundIndex={(index) => this.props.starkregenActions.setSelectedBackground(index)}
				minified={this.props.starkregen.minifiedInfoBox}
				minify={(minified) =>
					this.props.starkregenActions.setMinifiedInfoBox(minified)}
				legendObject={this.props.starkregen.legend}
				featureInfoModeActivated={this.props.starkregen.featureInfoModeActivated}
				setFeatureInfoModeActivation={(activated) => {
					if (!activated) {
						this.props.starkregenActions.setCurrentFeatureInfoValue(undefined);
						this.props.starkregenActions.setCurrentFeatureInfoPosition(undefined);
					}
					this.props.starkregenActions.setFeatureInfoModeActivation(activated);
				}}
				featureInfoValue={this.props.starkregen.currentFeatureInfoValue}
			/>
		);

		let cursor;
		if (this.props.starkregen.featureInfoModeActivated) {
			cursor = 'crosshair';
		} else {
			cursor = 'grabbing';
		}

		let featureInfoLayer;
		if (this.props.starkregen.currentFeatureInfoPosition){
			const geoJsonObject={
				id:0,
				type: "Feature",
				geometry: {
					"type": "Point",
					"coordinates": [this.props.starkregen.currentFeatureInfoPosition[0],this.props.starkregen.currentFeatureInfoPosition[1] ]
				  },
				crs: {
					type: "name",
					properties: {
					  name: "urn:ogc:def:crs:EPSG::25832"
					}
				  },
				  properties: {
					value: this.props.starkregen.currentFeatureInfoValue
				  }
			};
			console.log('geoJsonObject',geoJsonObject);
			
			featureInfoLayer=(
				<FeatureCollectionDisplay
					featureCollection={[geoJsonObject]}
					clusteringEnabled={false}
					// style={getFeatureStyler(currentMarkerSize, getColorForProperties)}
					style={() => ({ color: 'black' })}
					featureStylerScalableImageSize={30}
					showMarkerCollection={false}
				/>
			);
		}

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
				gazetteerTopicsList={[ 'geps', 'geps_reverse', 'pois', 'kitas', 'quartiere', 'bezirke', 'adressen' ]}
				gazetteerSearchBoxPlaceholdertext="Stadtteil | Adresse | POI | GEP"
				photoLightBox
				infoBox={info}
				backgroundlayers={
					this.props.match.params.layers ||
					this.props.starkregen.backgrounds[this.props.starkregen.selectedBackground].layerkey
				}
				onclick={this.getFeatureInfo}
				applicationMenuTooltipString="Kompaktanleitung | Hintergrundinfo"
				applicationMenuIconname="info"
				cursor={cursor}
			>
				<WMSTileLayer
					key={
						'rainHazardMap.bgMap' +
						this.props.starkregen.selectedBackground +
						'.' +
						this.props.match.params.layers
					}
					url="http://geoportal.wuppertal.de/deegree/wms"
					layers={this.props.starkregen.simulations[this.props.starkregen.selectedSimulation].layer}
					version="1.1.1"
					transparent="true"
					format="image/png"
					tiled="true"
					styles="default"
					maxZoom={19}
					opacity={1}
				/>
					{featureInfoLayer}
				
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
