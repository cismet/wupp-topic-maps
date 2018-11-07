import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import { actions as MappingActions } from '../redux/modules/mapping';
import { actions as UIStateActions } from '../redux/modules/uiState';
import { actions as StarkregenActions } from '../redux/modules/starkregen';

import { proj4crs25832def } from "../constants/gis";
import proj4 from "proj4";

import { routerActions as RoutingActions } from 'react-router-redux';
import TopicMap from '../containers/TopicMap';
import { WMSTileLayer, Marker, Popup } from 'react-leaflet';
import { Well, Label } from 'react-bootstrap';

import L from 'leaflet';
import { Icon } from "react-fa";

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
		this.doubleMapClick = this.doubleMapClick.bind(this);

	}
	doubleMapClick(event) {
		const pos = proj4(proj4.defs("EPSG:4326"), proj4crs25832def, [
		  event.latlng.lng,
		  event.latlng.lat
		]);
		let wkt = `POINT(${pos[0]} ${pos[1]})`;
		console.log('doubleClick',wkt);
		
	}
	gotoHome() {
		if (this.topicMap) {
			this.topicMap.wrappedInstance.gotoHome();
		}
	}
	render() {
		let options = { opacity: 1 };

		let header = (
			<table style={{ width: '100%' }}>
				<tbody>
					<tr>
						{this.props.starkregen.legend.map((item) => {
							return (
								<td
									key={'legend-for-' + item.title}
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
					</tr>
				</tbody>
			</table>
		);

		let simulationLabels = [];
		this.props.starkregen.simulations.map((item, index) => {
			let bsStyle;
			if (this.props.starkregen.selectedSimulation === index) {
				bsStyle = 'primary';
			} else {
				bsStyle = 'default';
			}
			let label = (
				<a style={{ textDecoration: 'none' }}
					onClick={() => {
						this.props.starkregenActions.setSimulation(index);
					}}
				>
					<Label bsStyle={bsStyle}>{item.name}</Label>
				</a>
			);
			simulationLabels.push(label);
		});
		let selSim=this.props.starkregen.simulations[this.props.starkregen.selectedSimulation];
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
					<h4 style={{marginTop:0}}><Icon name={selSim.icon} /> {selSim.title}</h4>
					<p style={{marginBottom:5}}>
						{selSim.subtitle}{' '}
						<a>(mehr)</a>
					</p>
					<table border={0} style={{ width: '100%' }}>
						<tbody>
							<tr>
								<td
									style={{
										textAlign: 'center',
										paddingLeft: '0px',
										paddingTop: '0px',
										paddingBottom: '0px'
									}}
								>
									<h5
										style={{
											textAlign: 'center',
											margin: '4px'
										}}
									>
										Simulation
									</h5>
								</td>
								<td
									style={{
										textAlign: 'center',
										paddingLeft: '0px',
										paddingTop: '0px',
										paddingBottom: '5px'
									}}
								>
									<h5
										style={{
											textAlign: 'center',
											margin: '4px'
										}}
									>
										Karte
									</h5>
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
									<table
										border={0}
										style={{
											width: '100%'
										}}
									>
										<tbody>
											<tr>
												<td style={{ textAlign: 'center', verticalAlign: 'center' }}>
													{simulationLabels[0]} {simulationLabels[1]}
												</td>
												<td style={{ textAlign: 'center', verticalAlign: 'center' }} />
											</tr>
											<tr>
												<td>
												{simulationLabels[2]} {simulationLabels[3]}
												</td>
											</tr>
										</tbody>
									</table>
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
									{this.props.starkregen.backgrounds.map((item, index) => {
										let theStyle;
										if (this.props.starkregen.selectedBackground === index) {
											theStyle = {
												border: '3px solid #5f83b8',
												marginLeft: 7
											};
										} else {
											theStyle = {
												//border: '3px solid #818180',
												marginLeft: 7
											};
										}
										return (
											<a
												onClick={() => {
													this.props.starkregenActions.setBackground(index);
												}}
											>
												<img style={theStyle} width="36px" src={item.src} />
											</a>
										);
									})}
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
				gazetteerTopicsList= {["geps", "pois", "kitas", "quartiere", "bezirke", "adressen"]}
				gazetteerSearchBoxPlaceholdertext="Stadtteil | Adresse | POI | GEP"
				photoLightBox
				infoBox={info}
				backgroundlayers={
					this.props.match.params.layers ||
					this.props.starkregen.backgrounds[this.props.starkregen.selectedBackground].layerkey
				}
				ondblclick={this.doubleMapClick}

			>
				<WMSTileLayer
					key={'Ortho2014' + JSON.stringify(options)}
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
