import Icon from 'components/commons/Icon';
import PropTypes from 'prop-types';
import React from 'react';
import { Alert, Button, Label } from 'react-bootstrap';
import { WMSTileLayer } from 'react-leaflet';
import { connect } from 'react-redux';
import { routerActions as RoutingActions } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import InfoBox from '../components/hitze/ControlInfoBox';
import HelpAndInfo from '../components/hitze/Help00MainComponent';
import TopicMap from '../containers/TopicMap';
import { actions as HitzeActions } from '../redux/modules/hitze';
import { actions as MappingActions } from '../redux/modules/mapping';
import { actions as UIStateActions } from '../redux/modules/uiState';
import { modifyQueryPart } from '../utils/routingHelper';

/* eslint-disable jsx-a11y/anchor-is-valid */

function mapStateToProps(state) {
	return {
		uiState: state.uiState,
		mapping: state.mapping,
		routing: state.routing,
		hitze: state.hitze,
		gazetteerTopics: state.gazetteerTopics
	};
}

function mapDispatchToProps(dispatch) {
	return {
		mappingActions: bindActionCreators(MappingActions, dispatch),
		uiStateActions: bindActionCreators(UIStateActions, dispatch),
		routingActions: bindActionCreators(RoutingActions, dispatch),
		hitzeActions: bindActionCreators(HitzeActions, dispatch)
	};
}

export class Comp_ extends React.Component {
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
		document.title = 'Hitze in Wuppertal';
	}

	componentDidUpdate() {
		this.setSimulationStateFromUrl();
		this.setBackgroundStateFromUrl();
		const that = this;
		if (this.modelLayer) {
			this.modelLayer.leafletElement.on('tileerror', function(error, tile) {
				if (that.props.hitze.modelLayerProblem === false) {
					that.props.hitzeActions.setModelLayerProblemStatus(true);
				}
			});
			this.modelLayer.leafletElement.on('tileload', function() {
				if (that.props.hitze.modelLayerProblem === true) {
					that.props.hitzeActions.setModelLayerProblemStatus(false);
				}
			});
		}
	}

	setSimulationStateFromUrl() {
		const selectedSimulationsFromUrlQueryValue = new URLSearchParams(
			this.props.routing.location.search
		).get('selectedSimulations');

		if (selectedSimulationsFromUrlQueryValue) {
			const selSimsFromQ = JSON.parse(selectedSimulationsFromUrlQueryValue);
			if (
				JSON.stringify(selSimsFromQ.sort()) !==
				JSON.stringify(this.props.hitze.selectedSimulations.sort())
			) {
				this.props.hitzeActions.setSimulations(selSimsFromQ);
			}
		} else {
			this.props.routingActions.push(
				this.props.routing.location.pathname +
					modifyQueryPart(this.props.routing.location.search, {
						selectedSimulations: JSON.stringify(this.props.hitze.selectedSimulations)
					})
			);
		}
	}

	setSimulationStateInUrl(simulation) {
		// console.log('setSimulationStateInUrl', simulation);

		const selSims = JSON.parse(JSON.stringify(this.props.hitze.selectedSimulations));
		const simIndexInSelSim = selSims.indexOf(simulation);
		if (simIndexInSelSim !== -1) {
			selSims.splice(simIndexInSelSim, 1);
		} else {
			selSims.push(simulation);
			selSims.sort();
		}
		this.props.routingActions.push(
			this.props.routing.location.pathname +
				modifyQueryPart(this.props.routing.location.search, {
					selectedSimulations: JSON.stringify(selSims)
				})
		);
	}

	setBackgroundStateFromUrl() {
		let urlBackgroundQueryValue = new URLSearchParams(this.props.routing.location.search).get(
			'bg'
		);
		if (urlBackgroundQueryValue) {
			let urlBackgroundIndex = parseInt(urlBackgroundQueryValue, 10);
			if (urlBackgroundIndex !== this.props.hitze.selectedBackground) {
				this.props.hitzeActions.setSelectedBackground(urlBackgroundIndex);
			}
		}
	}
	setBackgroundStateInUrl(backgroundIndex) {
		if (backgroundIndex !== this.props.hitze.selectedBackground) {
			this.props.routingActions.push(
				this.props.routing.location.pathname +
					modifyQueryPart(this.props.routing.location.search, {
						bg: backgroundIndex
					})
			);
		}
	}
	getFeatureInfo(event) {
		if (this.props.hitze.featureInfoModeActivated) {
			this.props.hitzeActions.getFeatureInfo(event);
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
		let simulationLabels = [];
		this.props.hitze.simulations.forEach((item, index) => {
			let bsStyle;
			if (this.props.hitze.selectedSimulations.indexOf(index) !== -1) {
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

		let cursor;
		if (this.props.hitze.featureInfoModeActivated) {
			cursor = 'crosshair';
		} else {
			cursor = 'grabbing';
		}

		const mapRef = this.getMapRef();

		let info = (
			<InfoBox
				pixelwidth={340}
				selectedSimulations={this.props.hitze.selectedSimulations}
				simulations={this.props.hitze.simulations}
				simulationLabels={simulationLabels}
				backgrounds={this.props.hitze.backgrounds}
				selectedBackgroundIndex={this.props.hitze.selectedBackground}
				setBackgroundIndex={(index) => this.setBackgroundStateInUrl(index)}
				minified={this.props.hitze.minifiedInfoBox}
				minify={(minified) => this.props.hitzeActions.setMinifiedInfoBox(minified)}
				legendObject={this.props.hitze.legend}
				featureInfoModeActivated={this.props.hitze.featureInfoModeActivated}
				setFeatureInfoModeActivation={(activated) => {
					if (!activated) {
						this.props.hitzeActions.setCurrentFeatureInfoValue(undefined);
						this.props.hitzeActions.setCurrentFeatureInfoPosition(undefined);
					} else {
						let currentZoom =
							new URLSearchParams(this.props.routing.location.search).get('zoom') ||
							8;
						if (currentZoom < 15) {
							this.props.routingActions.push(
								this.props.routing.location.pathname +
									modifyQueryPart(this.props.routing.location.search, {
										zoom: 15
									})
							);
						}
					}
					this.props.hitzeActions.setFeatureInfoModeActivation(activated);
				}}
				featureInfoValue={this.props.hitze.currentFeatureInfoValue}
				showModalMenu={(section) => {
					this.props.uiStateActions.showApplicationMenuAndActivateSection(true, section);
				}}
				mapClickListener={this.getFeatureInfo}
				mapRef={mapRef}
				mapCursor={cursor}
			/>
		);

		let validBackgroundIndex = this.props.hitze.selectedBackground;
		if (validBackgroundIndex >= this.props.hitze.backgrounds.length) {
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
				gazetteerTopicsList={[ 'pois', 'kitas', 'quartiere', 'bezirke', 'adressen' ]}
				gazetteerSearchBoxPlaceholdertext='Stadtteil | Adresse | POI '
				photoLightBox
				infoBox={info}
				backgroundlayers={
					this.props.match.params.layers ||
					this.props.hitze.backgrounds[validBackgroundIndex].layerkey
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
					if (this.props.hitze.currentFeatureInfoPosition) {
						const x = this.props.hitze.currentFeatureInfoPosition[0];
						const y = this.props.hitze.currentFeatureInfoPosition[1];
						const bb = bbox;
						if (x < bb.left || x > bb.right || y < bb.bottom || y > bb.top) {
							this.props.hitzeActions.setCurrentFeatureInfoValue(undefined);
							this.props.hitzeActions.setCurrentFeatureInfoPosition(undefined);
						}
					}
				}}
				home={{
					center: [ 51.27243990281796, 7.199752226846924 ],
					zoom: 13
				}}
			>
				{this.props.hitze.selectedSimulations.map((simulationIndex) => {
					const selSimString = JSON.stringify(this.props.hitze.selectedSimulations);
					return (
						<WMSTileLayer
							ref={(c) => (this.modelLayer = c)}
							key={
								'heatmap.bgMap' +
								this.props.hitze.selectedBackground +
								'.' +
								'heatmap.simlayer' +
								this.props.hitze.simulations[simulationIndex].layer +
								'heatmap.selSims' +
								selSimString
							}
							url='https://maps.wuppertal.de/deegree/wms'
							layers={this.props.hitze.simulations[simulationIndex].layer}
							version='1.1.1'
							transparent='true'
							format='image/png'
							tiled='true'
							styles='default'
							maxZoom={19}
							opacity={this.props.hitze.simulations[simulationIndex].opacity}
							caching={this.state.caching}
						/>
					);
				})}

				{this.props.hitze.modelLayerProblem && (
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
							<Icon name='exclamation-circle' /> Es liegt eine Störung vor. Momentan
							können leider keine Modellinformationen angezeigt werden. Bitte
							versuchen Sie es später noch einmal.
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
		);
	}
}

const Comp = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Comp_);

export default Comp;

Comp.propTypes = {
	ui: PropTypes.object,
	uiState: PropTypes.object
};
