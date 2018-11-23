import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import { actions as MappingActions } from '../redux/modules/mapping';
import { actions as UIStateActions } from '../redux/modules/uiState';
import { actions as StarkregenActions, initialState as starkregenInitialState } from '../redux/modules/starkregen';
import { Icon } from 'react-fa';

import { routerActions as RoutingActions } from 'react-router-redux';
import TopicMap from '../containers/TopicMap';
import { WMSTileLayer } from 'react-leaflet';
import { Button, Label, Alert } from 'react-bootstrap';
import { FeatureCollectionDisplay } from 'react-cismap';
import { modifyQueryPart } from '../utils/routingHelper';
import InfoBox from '../components/starkregen/ControlInfoBox';
import ContactButton from '../components/starkregen/ContactButton';
import HelpAndInfo from '../components/starkregen/Help00MainComponent';


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
		this.getMapRef = this.getMapRef.bind(this);
		this.state = {
			caching: 0
		};
	}

	componentDidMount() {}

	componentDidUpdate() {
		this.setSimulationStateFromUrl();
		this.setBackgroundStateFromUrl();
		const that = this;
		if (this.modelLayer) {
			this.modelLayer.leafletElement.on('tileerror', function(error, tile) {
				if (that.props.starkregen.modelLayerProblem === false) {
					that.props.starkregenActions.setModelLayerProblemStatus(true);
				}
			});
			this.modelLayer.leafletElement.on('tileload', function() {
				if (that.props.starkregen.modelLayerProblem === true) {
					that.props.starkregenActions.setModelLayerProblemStatus(false);
				}
			});
		}
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

	setBackgroundStateFromUrl() {
		let urlBackgroundQueryValue = new URLSearchParams(this.props.routing.location.search).get('bg');
		if (urlBackgroundQueryValue) {
			let urlBackgroundIndex = parseInt(urlBackgroundQueryValue, 10);
			if (urlBackgroundIndex !== this.props.starkregen.selectedBackground) {
				this.props.starkregenActions.setSelectedBackground(urlBackgroundIndex);
			}
		}
	}
	setBackgroundStateInUrl(backgroundIndex) {
		if (backgroundIndex !== this.props.starkregen.selectedBackground) {
			this.props.routingActions.push(
				this.props.routing.location.pathname +
					modifyQueryPart(this.props.routing.location.search, {
						bg: backgroundIndex
					})
			);
		}
	}
	getFeatureInfo(event) {
		if (this.props.starkregen.featureInfoModeActivated) {
			this.props.starkregenActions.getFeatureInfo(event);
		}
	}
	gotoHome() {
		if (this.topicMap) {
			this.topicMap.wrappedInstance.gotoHome();
		}
	}

	getMapRef() {
		if (this.topicMap) {
			return this.topicMap.wrappedInstance.leafletRoutedMap.leafletMap.leafletElement;
		}
		return undefined;
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
		let leafletMapRef;
		if (this.topicMap) {
			leafletMapRef = this.topicMap.wrappedInstance.leafletRoutedMap.leafletMap.leafletElement;
		}


		let cursor;
		if (this.props.starkregen.featureInfoModeActivated) {
			cursor = 'crosshair';
		} else {
			cursor = 'grabbing';
		}

		const mapRef=this.getMapRef();

		let info = (
			<InfoBox
				pixelwidth={340}
				selectedSimulation={selSim}
				simulationLabels={simulationLabels}
				backgrounds={this.props.starkregen.backgrounds}
				selectedBackgroundIndex={this.props.starkregen.selectedBackground}
				setBackgroundIndex={(index) => this.setBackgroundStateInUrl(index)}
				minified={this.props.starkregen.minifiedInfoBox}
				minify={(minified) => this.props.starkregenActions.setMinifiedInfoBox(minified)}
				legendObject={this.props.starkregen.legend}
				featureInfoModeActivated={this.props.starkregen.featureInfoModeActivated}
				setFeatureInfoModeActivation={(activated) => {
					if (!activated) {
						this.props.starkregenActions.setCurrentFeatureInfoValue(undefined);
						this.props.starkregenActions.setCurrentFeatureInfoPosition(undefined);
					} else {
						let currentZoom = new URLSearchParams(this.props.routing.location.search).get('zoom') || 8;
						if (currentZoom < 15) {
							this.props.routingActions.push(
								this.props.routing.location.pathname +
									modifyQueryPart(this.props.routing.location.search, {
										zoom: 15
									})
							);
						}
					}
					this.props.starkregenActions.setFeatureInfoModeActivation(activated);
				}}
				featureInfoValue={this.props.starkregen.currentFeatureInfoValue}
				showModalMenu={(section) => {
					this.props.uiStateActions.showApplicationMenuAndActivateSection(true, section);
				}}
				mapClickListener={this.getFeatureInfo}
				mapRef={mapRef}
				mapCursor={cursor}
			/>
		);

		let featureInfoLayer;
		if (this.props.starkregen.currentFeatureInfoPosition) {
			const x = Math.round(this.props.starkregen.currentFeatureInfoPosition[0]) - 0.125;
			const y = Math.round(this.props.starkregen.currentFeatureInfoPosition[1]) - 0.02;
			const geoJsonObject = {
				id: 0,
				type: 'Feature',
				geometry_: {
					type: 'Point',
					coordinates: [ x, y ]
				},
				geometry: {
					type: 'Polygon',
					coordinates: [
						[
							[ x - 0.5, y - 0.5 ],
							[ x + 0.5, y - 0.5 ],
							[ x + 0.5, y + 0.5 ],
							[ x - 0.5, y + 0.5 ],
							[ x - 0.5, y - 0.5 ]
						]
					]
				},
				crs: {
					type: 'name',
					properties: {
						name: 'urn:ogc:def:crs:EPSG::25832'
					}
				},
				properties: {
					value: this.props.starkregen.currentFeatureInfoValue
				}
			};

			featureInfoLayer = (
				<FeatureCollectionDisplay
					featureCollection={[ geoJsonObject ]}
					clusteringEnabled={false}
					// style={getFeatureStyler(currentMarkerSize, getColorForProperties)}
					style={() => ({ color: 'black', fillColor: 'black', weight: '0.75', opacity: 1, fillOpacity: 0.3 })}
					featureStylerScalableImageSize={30}
					showMarkerCollection={true}
					//markerCollectionTransformation={}
					//markerStyle={getMarkerStyleFromFeatureConsideringSelection}
				/>
			);
		}
		let validBackgroundIndex = this.props.starkregen.selectedBackground;
		if (validBackgroundIndex >= this.props.starkregen.backgrounds.length) {
			validBackgroundIndex = 0;
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
					this.props.match.params.layers || this.props.starkregen.backgrounds[validBackgroundIndex].layerkey
				}
				onclick={this.getFeatureInfo}
				applicationMenuTooltipString="Kompaktanleitung | Hintergrundinfo"
				applicationMenuIconname="info"
				modalMenu={<HelpAndInfo uiState={this.props.uiState} uiStateActions={this.props.uiStateActions} />}
				cursor={cursor}
				mappingBoundsChanged={(bbox) => {
					if (this.props.starkregen.currentFeatureInfoPosition) {
						const x = this.props.starkregen.currentFeatureInfoPosition[0];
						const y = this.props.starkregen.currentFeatureInfoPosition[1];
						const bb = bbox;
						if (x < bb.left || x > bb.right || y < bb.bottom || y > bb.top) {
							this.props.starkregenActions.setCurrentFeatureInfoValue(undefined);
							this.props.starkregenActions.setCurrentFeatureInfoPosition(undefined);
						}
					}
				}}
			>
				<WMSTileLayer
					ref={(c) => (this.modelLayer = c)}
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
					caching={this.state.caching}
				/>
				{featureInfoLayer}
				<ContactButton
					position="topleft"
					title="Fehler im Geländemodell melden"
					action={() => {
						let link = document.createElement('a');
						link.setAttribute('type', 'hidden');
						const br = '\n';
						let mailToHref =
							'mailto:starkregen@stadt.wuppertal.de?subject=eventueller Fehler im Geländemodell&body=' +
							encodeURI(
								`Sehr geehrte Damen und Herren,${br}${br}` + `in der Starkregenkarte auf${br}${br}`
							) +
							`${window.location.href.replace(/&/g, '%26')}` +
							encodeURI(
								`${br}` +
									`${br}` +
									`ist mir folgendes aufgefallen:${br}` +
									`${br}${br}${br}${br}` +
									`Mit freundlichen Grüßen${br}` +
									`${br}` +
									`${br}`
							);
						document.body.appendChild(link);
						//link.href = downloadOptions.url;
						link.href = mailToHref;
						//link.download = downloadOptions.file;
						//link.target = "_blank";
						link.click();
					}}
				/>

				{this.props.starkregen.modelLayerProblem && (
					<Alert
						style={{
							position: 'absolute',
							zIndex: 1000,
							top_alt: '10px',
							top: '30%',
							left: '15%',
							width: '70%',
							textAlignment: 'center'
						}}
						bsStyle="danger"
						onDismiss={() => {
							this.setState({
								caching: this.state.caching + 1
							});
						}}
					>
						<h5>
							<Icon name="exclamation-circle" /> Es liegt eine Störung vor. Momentan können leider keine
							Modellinformationen angezeigt werden. Bitte versuchen Sie es später noch einmal.
						</h5>
						<div style={{ textAlign: 'right' }}>
							<Button
								bsSize="xsmall"
								style={{ opacity: 0.5 }}
								onClick={() => {
									this.setState({
										caching: this.state.caching + 1
									});
								}}
							>
								Erneut versuchen
							</Button>
						</div>
					</Alert>
				)}
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

const getMarkerStyleFromFeatureConsideringSelection = (feature) => {
	let opacity = 0.6;
	let linecolor = '#000000';
	let weight = 1;

	const style = {
		radius: 10,
		color: linecolor,
		weight: weight,
		opacity: 1.0,
		fillOpacity: opacity,
		svgSize: 100,
		className: 'verdis-flaeche-marker-' + feature.properties.bez,
		svg: `<svg width="32" height="32" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1325 1024h-109q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h109q-32-108-112.5-188.5t-188.5-112.5v109q0 26-19 45t-45 19h-128q-26 0-45-19t-19-45v-109q-108 32-188.5 112.5t-112.5 188.5h109q26 0 45 19t19 45v128q0 26-19 45t-45 19h-109q32 108 112.5 188.5t188.5 112.5v-109q0-26 19-45t45-19h128q26 0 45 19t19 45v109q108-32 188.5-112.5t112.5-188.5zm339-192v128q0 26-19 45t-45 19h-143q-37 161-154.5 278.5t-278.5 154.5v143q0 26-19 45t-45 19h-128q-26 0-45-19t-19-45v-143q-161-37-278.5-154.5t-154.5-278.5h-143q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h143q37-161 154.5-278.5t278.5-154.5v-143q0-26 19-45t45-19h128q26 0 45 19t19 45v143q161 37 278.5 154.5t154.5 278.5h143q26 0 45 19t19 45z"/></svg>`
	};

	return style;
};
