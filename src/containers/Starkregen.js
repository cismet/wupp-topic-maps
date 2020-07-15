import Icon from 'components/commons/Icon';
import PropTypes from 'prop-types';
import React from 'react';
import { Alert, Button, Label } from 'react-bootstrap';
import Loadable from 'react-loading-overlay';
import { faRandom } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FeatureCollectionDisplay } from 'react-cismap';
import { WMSTileLayer } from 'react-leaflet';
import { connect } from 'react-redux';
import { routerActions as RoutingActions } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import ContactButton from '../components/commons/ContactButton';
import InfoBox from '../components/starkregen/ControlInfoBox';
import FeatureInfoModeBoxForHeights from '../components/starkregen/FeatureInfoModeBoxForHeights';
import FeatureInfoModeBoxForVelocityAndDirection from '../components/starkregen/FeatureInfoModeBoxForVelocityAndDirection';
import FeatureInfoModeButton from '../components/starkregen/FeatureInfoModeButton';
import HelpAndInfo from '../components/starkregen/Help00MainComponent';
import TopicMap from '../containers/TopicMap';
import { actions as MappingActions } from '../redux/modules/mapping';
import {
	actions as StarkregenActions,
	constants as starkregenConstants
} from '../redux/modules/starkregen';
import { actions as UIStateActions } from '../redux/modules/uiState';
import { modifyQueryPart } from '../utils/routingHelper';
import VectorFieldAnimation from '../components/starkregen/VectorFieldAnimation';
import bboxPolygon from '@turf/bbox-polygon';
import area from '@turf/area';

/* eslint-disable jsx-a11y/anchor-is-valid */
// const service="http://127.0.0.1:8881";
const ANIMATION_RASTERFARI_SERVICE = 'https://rasterfari.cismet.de';
const MIN_ANIMATION_ZOOM = 13;
const switchIcon = faRandom;

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

	componentDidMount() {
		document.title = 'Starkregengefahrenkarte Wuppertal';
	}

	componentDidUpdate() {
		if (
			this.props.match.params.mode !== 'hoehen' &&
			this.props.match.params.mode !== 'fliessgeschwindigkeiten'
		) {
			this.props.routingActions.push(
				'/starkregen/hoehen' + this.props.routing.location.search
			);
			this.props.starkregenActions.setDisplayMode(starkregenConstants.SHOW_HEIGHTS);
			return;
		} else if (this.props.match.params.mode === 'fliessgeschwindigkeiten') {
			if (this.props.starkregen.displayMode !== starkregenConstants.SHOW_VELOCITY) {
				this.props.starkregenActions.setDisplayMode(starkregenConstants.SHOW_VELOCITY);
				return;
			}
		} else {
			if (this.props.starkregen.displayMode !== starkregenConstants.SHOW_HEIGHTS) {
				this.props.starkregenActions.setDisplayMode(starkregenConstants.SHOW_HEIGHTS);
				return;
			}
		}

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
		let selectedSimulationFromUrlQueryValue = new URLSearchParams(
			this.props.routing.location.search
		).get('selectedSimulation');
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
		let urlBackgroundQueryValue = new URLSearchParams(this.props.routing.location.search).get(
			'bg'
		);
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
		let currentZoom = new URLSearchParams(this.props.routing.location.search).get('zoom') || 8;
		let titleContent;
		if (this.props.starkregen.displayMode === starkregenConstants.SHOW_HEIGHTS) {
			titleContent = (
				<div>
					<b>Starkregengefahrenkarte: </b> max. Wasserstände<div
						style={{ float: 'right', paddingRight: 10 }}
					>
						<a
							href={
								'/#/starkregen/fliessgeschwindigkeiten' +
								this.props.routing.location.search
							}
						>
							<FontAwesomeIcon
								icon={switchIcon}
								style={{ marginRight: 5 }}
							/>Fließgeschwindigkeiten
						</a>
					</div>
				</div>
			);
		} else {
			titleContent = (
				<div>
					<b>Starkregengefahrenkarte: </b> max. Fließgeschwindigkeiten<div
						style={{ float: 'right', paddingRight: 10 }}
					>
						<a href={'/#/starkregen/hoehen' + this.props.routing.location.search}>
							<FontAwesomeIcon
								icon={switchIcon}
								style={{ marginRight: 5 }}
							/>Wasserstände
						</a>
					</div>
				</div>
			);
		}

		let title = null;
		let width = this.props.uiState.width;
		title = (
			<table
				style={{
					width: this.props.uiState.width - 54 - 12 - 38 - 12 + 'px',
					height: '30px',
					position: 'absolute',
					left: 54,
					top: 12,
					zIndex: 555
				}}
			>
				<tbody>
					<tr>
						<td
							style={{
								textAlign: 'center',
								verticalAlign: 'middle',
								background: '#ffffff',
								color: 'black',
								opacity: '0.9',
								paddingLeft: '10px'
							}}
						>
							{titleContent}
						</td>
					</tr>
				</tbody>
			</table>
		);
		let simulationLabels = [];
		this.props.starkregen.simulations.forEach((item, index) => {
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
		let cursor;
		if (this.props.starkregen.featureInfoModeActivated) {
			cursor = 'crosshair';
		} else {
			cursor = 'grabbing';
		}

		const mapRef = this.getMapRef();
		let url_u, url_v, vectorFieldAnimationSettings, currentBBox, currentMapArea;
		console.log('mapRef', mapRef);
		if (mapRef !== undefined) {
			console.log('mapRef.getZoom()', mapRef.getZoom());
		}
		const settingsForZoom = {
			13: { paths: 3000, velocityScale: 1 / 200, fade: 80 / 100, age: 50 },
			14: { paths: 2560, velocityScale: 1 / 400, fade: 83 / 100, age: 80 },
			15: { paths: 2120, velocityScale: 1 / 800, fade: 86 / 100, age: 110 },
			16: { paths: 1680, velocityScale: 1 / 1600, fade: 89 / 100, age: 140 },
			17: { paths: 1240, velocityScale: 1 / 3200, fade: 92 / 100, age: 170 },
			18: { paths: 800, velocityScale: 1 / 4000, fade: 95 / 100, age: 200 }
		};
		if (mapRef !== undefined) {
			const bounds = mapRef.getBounds();

			console.log('bughunt: currentZoom', currentZoom);
			console.log('bughunt: mapref.getZoom()', mapRef.getZoom());

			if (currentZoom >= MIN_ANIMATION_ZOOM) {
				currentBBox = [
					bounds._southWest.lng,
					bounds._northEast.lat,
					bounds._northEast.lng,
					bounds._southWest.lat
				];
				const bboxpoly = bboxPolygon(currentBBox);
				currentMapArea = area(bboxpoly);
				console.log('currentMapArea', currentMapArea);

				const paths = Math.sqrt(currentMapArea) * 8;
				console.log('paths', paths);

				vectorFieldAnimationSettings = {
					paths, // settingsForZoom[currentZoom].paths, //-- default 800
					fade: settingsForZoom[currentZoom].fade, // 0 to 1 -- default 0.96
					velocityScale: settingsForZoom[currentZoom].velocityScale, // -- default 1/ 5000
					maxAge: settingsForZoom[currentZoom].age, // number of maximum frames per path  -- default 200
					width: 1.0, // number | function widthFor(value)  -- default 1.0
					duration: 20, // milliseconds per 'frame'  -- default 20,
					color: '#326C88' // html-color | function colorFor(value) [e.g. chromajs.scale]   -- default white
				};
			}
		}

		const setAnimationEnabled = (enabled) => {
			if (currentZoom < MIN_ANIMATION_ZOOM) {
				this.props.routingActions.push(
					this.props.routing.location.pathname +
						modifyQueryPart(this.props.routing.location.search, {
							zoom: MIN_ANIMATION_ZOOM
						})
				);
				setTimeout(() => {
					this.props.starkregenActions.setAnimationEnabled(true);
				}, 50);
			} else {
				this.props.starkregenActions.setAnimationEnabled(enabled);
			}
		};
		let info = (
			<InfoBox
				pixelwidth={370}
				selectedSimulation={selSim}
				simulationLabels={simulationLabels}
				backgrounds={this.props.starkregen.backgrounds}
				selectedBackgroundIndex={this.props.starkregen.selectedBackground}
				setBackgroundIndex={(index) => this.setBackgroundStateInUrl(index)}
				minified={this.props.starkregen.minifiedInfoBox}
				minify={(minified) => this.props.starkregenActions.setMinifiedInfoBox(minified)}
				legendObject={
					this.props.starkregen.displayMode === starkregenConstants.SHOW_HEIGHTS ? (
						this.props.starkregen.heightsLegend
					) : (
						this.props.starkregen.velocityLegend
					)
				}
				featureInfoModeActivated={this.props.starkregen.featureInfoModeActivated}
				// setFeatureInfoModeActivation={}
				featureInfoValue={this.props.starkregen.currentFeatureInfoValue}
				showModalMenu={(section) => {
					this.props.uiStateActions.showApplicationMenuAndActivateSection(true, section);
				}}
				mapClickListener={this.getFeatureInfo}
				mapRef={mapRef}
				mapCursor={cursor}
				animationEnabled={
					this.props.starkregen.animationEnabled && currentZoom >= MIN_ANIMATION_ZOOM
				}
				setAnimationEnabled={setAnimationEnabled}
			/>
		);

		let featureInfoLayer;
		if (this.props.starkregen.currentFeatureInfoPosition) {
			let x, y;
			console.log(
				'xxx x,y',
				this.props.starkregen.currentFeatureInfoPosition[0],
				this.props.starkregen.currentFeatureInfoPosition[1]
			);

			let size;
			if (this.props.starkregen.displayMode === starkregenConstants.SHOW_HEIGHTS) {
				size = 0.5;
				x = Math.round(this.props.starkregen.currentFeatureInfoPosition[0]) - 0.125;
				y = Math.round(this.props.starkregen.currentFeatureInfoPosition[1]) - 0.02;
			} else {
				size = 0.5;
				x = Math.round(this.props.starkregen.currentFeatureInfoPosition[0] - 0.37) + 0.37;
				y = Math.round(this.props.starkregen.currentFeatureInfoPosition[1] - 0.5) + 0.5;
			}

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
							[ x - size, y - size ],
							[ x + size, y - size ],
							[ x + size, y + size ],
							[ x - size, y + size ],
							[ x - size, y - size ]
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
					style={() => ({
						color: 'black',
						fillColor: 'black',
						weight: '0.75',
						opacity: 1,
						fillOpacity: 0.3
					})}
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
		const setFeatureInfoModeActivation = (activated) => {
			if (!activated) {
				this.props.starkregenActions.setCurrentFeatureInfoValue(undefined);
				this.props.starkregenActions.setCurrentFeatureInfoPosition(undefined);
			} else {
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
		};

		let secondaryInfoBoxElements = [];
		if (this.props.starkregen.featureInfoModeActivated === true) {
			if (this.props.starkregen.displayMode === starkregenConstants.SHOW_HEIGHTS) {
				secondaryInfoBoxElements = [
					<FeatureInfoModeBoxForHeights
						setFeatureInfoModeActivation={setFeatureInfoModeActivation}
						featureInfoValue={this.props.starkregen.currentFeatureInfoValue}
						showModalMenu={(section) => {
							this.props.uiStateActions.showApplicationMenuAndActivateSection(
								true,
								section
							);
						}}
						legendObject={this.props.starkregen.heightsLegend}
					/>
				];
			} else {
				secondaryInfoBoxElements = [
					<FeatureInfoModeBoxForVelocityAndDirection
						setFeatureInfoModeActivation={setFeatureInfoModeActivation}
						featureInfoValue={this.props.starkregen.currentFeatureInfoValue}
						showModalMenu={(section) => {
							this.props.uiStateActions.showApplicationMenuAndActivateSection(
								true,
								section
							);
						}}
						legendObject={this.props.starkregen.velocityLegend}
					/>
				];
			}
		} else {
			secondaryInfoBoxElements = [
				<FeatureInfoModeButton
					setFeatureInfoModeActivation={setFeatureInfoModeActivation}
				/>
			];
		}

		return (
			<div>
				{title}

				<TopicMap
					key={'topicmap with background no' + this.backgroundIndex}
					ref={(comp) => {
						this.topicMap = comp;
					}}
					noInitialLoadingText={true}
					fullScreenControl
					locatorControl
					gazetteerSearchBox
					gazetteerTopicsList={[
						'geps',
						'geps_reverse',
						'pois',
						'kitas',
						'quartiere',
						'bezirke',
						'adressen'
					]}
					gazetteerSearchBoxPlaceholdertext='Stadtteil | Adresse | POI | GEP'
					photoLightBox
					infoBox={info}
					secondaryInfoBoxElements={secondaryInfoBoxElements}
					backgroundlayers={
						// this.props.match.params.layers ||
						this.props.starkregen.backgrounds[validBackgroundIndex].layerkey
					}
					onclick={this.getFeatureInfo}
					applicationMenuTooltipString='Kompaktanleitung | Hintergrundinfo'
					applicationMenuIconname='info'
					modalMenu={
						<HelpAndInfo
							uiState={this.props.uiState}
							uiStateActions={this.props.uiStateActions}
						/>
					}
					cursor={cursor}
					mappingBoundsChanged={(bbox) => {
						if (this.props.starkregen.currentFeatureInfoPosition) {
							const x = this.props.starkregen.currentFeatureInfoPosition[0];
							const y = this.props.starkregen.currentFeatureInfoPosition[1];
							const bb = bbox;
							if (x < bb.left || x > bb.right || y < bb.bottom || y > bb.top) {
								this.props.starkregenActions.setCurrentFeatureInfoValue(undefined);
								this.props.starkregenActions.setCurrentFeatureInfoPosition(
									undefined
								);
							}
						}
					}}
					home={{
						center: [ 51.27243990281796, 7.199752226846924 ],
						zoom: 13
					}}
				>
					{this.props.starkregen.displayMode === starkregenConstants.SHOW_HEIGHTS && (
						<WMSTileLayer
							ref={(c) => (this.modelLayer = c)}
							key={
								'rainHazardMap.bgMap' +
								this.props.starkregen.selectedBackground +
								'.'
								// +
								// this.props.match.params.layers
							}
							url='https://maps.wuppertal.de/deegree/wms'
							//url="https://wunda-geoportal-cache.cismet.de/geoportal"
							layers={
								this.props.starkregen.simulations[
									this.props.starkregen.selectedSimulation
								].layer
							}
							version='1.1.1'
							transparent='true'
							format='image/png'
							tiled='true'
							styles='default'
							maxZoom={19}
							opacity={1}
							caching={this.state.caching}
						/>
					)}
					{this.props.starkregen.displayMode === starkregenConstants.SHOW_VELOCITY && (
						<WMSTileLayer
							ref={(c) => (this.modelLayer = c)}
							key={
								'rainHazardMap.velocityLayer' +
								this.props.starkregen.selectedBackground +
								'.'
								// +
								// this.props.match.params.layers
							}
							url='http://starkregen-maps.cismet.de/geoserver/wms?SERVICE=WMS'
							//url="https://wunda-geoportal-cache.cismet.de/geoportal"
							layers={
								this.props.starkregen.simulations[
									this.props.starkregen.selectedSimulation
								].velocityLayer
							}
							version='1.1.1'
							transparent='true'
							format='image/png'
							tiled='true'
							styles='starkregen:velocity'
							// _sld='https://gist.githubusercontent.com/helllth/d922f098870fd8097b4e2659ea005f49/raw/c7fca5ddb2c64aea29e1d0463df73522dd53ed3b/velocity.sld'
							maxZoom={19}
							opacity={0.7}
							caching={this.state.caching}
						/>
					)}
					{this.props.starkregen.displayMode === starkregenConstants.SHOW_VELOCITY &&
					currentZoom >= 12 && (
						<WMSTileLayer
							ref={(c) => (this.modelLayer = c)}
							key={
								'rainHazardMap.bgMap' +
								this.props.starkregen.selectedBackground +
								'.'
								// +
								// this.props.match.params.layers
							}
							url='http://starkregen-maps.cismet.de/geoserver/wms?SERVICE=WMS'
							//url="https://wunda-geoportal-cache.cismet.de/geoportal"
							layers={
								this.props.starkregen.simulations[
									this.props.starkregen.selectedSimulation
								].directionsLayer
							}
							version='1.1.1'
							transparent='true'
							format='image/png'
							tiled='true'
							styles='starkregen:direction'
							maxZoom={19}
							opacity={1}
							caching={this.state.caching}
						/>
					)}
					{featureInfoLayer}
					{mapRef !== undefined &&
					this.props.starkregen.displayMode !== undefined &&
					this.props.starkregen.animationEnabled === true &&
					mapRef.getZoom() === parseInt(currentZoom) &&
					mapRef.getZoom() >= MIN_ANIMATION_ZOOM && ( //use mapRef.getZoom() to avoid rasie conditions due to animations
						<VectorFieldAnimation
							key={
								'VFA:' +
								mapRef.getZoom() +
								'.' +
								// JSON.stringify(currentBBox) +
								// '.' +
								this.props.starkregen.selectedSimulation +
								'.' +
								JSON.stringify(
									// this.props.match.params.layers ||
									this.props.starkregen.backgrounds[validBackgroundIndex].layerkey
								) +
								'.' +
								this.props.uiState.applicationMenuVisible +
								'.' +
								this.props.starkregen.minifiedInfoBox +
								'.' +
								this.props.starkregen.featureInfoModeActivated +
								'.' +
								this.props.starkregen.currentFeatureInfoPosition +
								'.' +
								this.props.mapping.gazetteerHit +
								'.' +
								this.props.mapping.overlayFeature +
								'.' +
								this.props.starkregen.displayMode
							}
							layerPrefix={
								this.props.starkregen.simulations[
									this.props.starkregen.selectedSimulation
								].animation
							}
							bbox={currentBBox}
							settings={vectorFieldAnimationSettings}
						/>
					)}

					<ContactButton
						id='329487'
						key='dsjkhfg'
						position='topleft'
						title='Fehler im Geländemodell melden'
						action={() => {
							let link = document.createElement('a');
							link.setAttribute('type', 'hidden');
							const br = '\n';

							let mailToHref =
								'mailto:starkregen@stadt.wuppertal.de?subject=eventueller Fehler im Geländemodell&body=' +
								encodeURI(
									`Sehr geehrte Damen und Herren,${br}${br}` +
										`in der Starkregengefahrenkarte `
								) +
								encodeURI(`auf${br}${br}`) +
								`${window.location.href
									.replace(/&/g, '%26')
									.replace(/#/g, '%23')}` +
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
							bsStyle='danger'
							onDismiss={() => {
								this.setState({
									caching: this.state.caching + 1
								});
							}}
						>
							<h5>
								<Icon name='exclamation-circle' /> Es liegt eine Störung vor.
								Momentan können leider keine Modellinformationen angezeigt werden.
								Bitte versuchen Sie es später noch einmal.
							</h5>
							<div style={{ textAlign: 'right' }}>
								<Button
									bsSize='xsmall'
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
			</div>
		);
	}
}

/*
// <Loadable
			// 	style={{ position: 'relative', zIndex: 9 }}
			// 	active={this.props.starkregen.isLoadingAnimationData}
			// 	spinner
			// 	text={'Animationsdaten werden geladen ...'}
			// >*/

const Starkregen = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(
	Starkregen_
);

export default Starkregen;

Starkregen.propTypes = {
	ui: PropTypes.object,
	uiState: PropTypes.object
};
