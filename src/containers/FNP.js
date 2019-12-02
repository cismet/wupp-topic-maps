import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { bindActionCreators } from 'redux';
import { actions as MappingActions } from '../redux/modules/mapping';
import { actions as UIStateActions } from '../redux/modules/uiState';
import { WMSTileLayer } from 'react-leaflet';
import { Icon } from 'react-fa';

import uwz from '../components/prbr/UWZ';
import {
	actions as AEVActions,
	getAEVs,
	getAEVFeatures,
	searchForAEVs,
	// getAEVFeatureCollection,
	getAEVSvgSize,
	// getAEVFeatureCollectionSelectedIndex,
	hasMinifiedInfoBox,
	// getAEVFilter,
	// getAEVFilteredData,
	isSecondaryInfoBoxVisible
	// getAEVFilterDescription,
	// isEnvZoneVisible
} from '../redux/modules/fnp';
import { FeatureCollectionDisplay, FeatureCollectionDisplayWithTooltipLabels } from 'react-cismap';
import { routerActions as RoutingActions } from 'react-router-redux';
import {
	getFeatureStyler,
	featureHoverer,
	getPoiClusterIconCreatorFunction
} from '../utils/stadtplanHelper';
import { getColorForProperties } from '../utils/prbrHelper';
import AEVInfo from '../components/flaechennutzungsplan/AEVInfo';
import PRBRModalMenu from '../components/prbr/ModalMenu';
import TopicMap from '../containers/TopicMap';
import ProjSingleGeoJson from '../components/ProjSingleGeoJson';
import SecondaryInfoModal from '../components/prbr/SecondaryInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt, faRandom } from '@fortawesome/free-solid-svg-icons';
import { aevFeatureStyler, aevLabeler } from '../utils/fnpHelper';
import { proj4crs25832def } from '../constants/gis';
import proj4 from 'proj4';
import { Well } from 'react-bootstrap';

const switchIcon = faRandom;
const searchMinZoom = 10;
function mapStateToProps(state) {
	return {
		uiState: state.uiState,
		mapping: state.mapping,
		routing: state.routing,
		aev: state.aev,
		gazetteerTopics: state.gazetteerTopics
	};
}

function mapDispatchToProps(dispatch) {
	return {
		mappingActions: bindActionCreators(MappingActions, dispatch),
		uiStateActions: bindActionCreators(UIStateActions, dispatch),
		routingActions: bindActionCreators(RoutingActions, dispatch),
		aevActions: bindActionCreators(AEVActions, dispatch)
	};
}

export class Container_ extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.gotoHome = this.gotoHome.bind(this);
		this.aevGazeteerhHit = this.aevGazeteerhHit.bind(this);
		this.aevSearchButtonHit = this.aevSearchButtonHit.bind(this);
		this.featureClick = this.featureClick.bind(this);
		this.doubleMapClick = this.doubleMapClick.bind(this);
		this.selectNextIndex = this.selectNextIndex.bind(this);
		this.selectPreviousIndex = this.selectPreviousIndex.bind(this);
		this.fitAll = this.fitAll.bind(this);
		this.changeMarkerSymbolSize = this.changeMarkerSymbolSize.bind(this);
		this.props.mappingActions.setBoundingBoxChangedTrigger((bbox) =>
			this.props.aevActions.refreshFeatureCollection(bbox)
		);
	}
	componentDidMount() {
		document.title = 'FNP-Auskunft Wuppertal';
	}
	gotoHome() {
		if (this.topicMap) {
			this.topicMap.wrappedInstance.gotoHome();
		}
	}

	changeMarkerSymbolSize(size) {
		this.props.aevActions.setAEVSvgSize(size);
		this.props.mappingActions.setFeatureCollectionKeyPostfix('MarkerSvgSize:' + size);
	}

	aevGazeteerhHit(selectedObject) {
		this.props.aevActions.searchForAEVs({ gazObject: selectedObject });
		//this.props.bplanActions.searchForPlans(selectedObject);
	}

	aevSearchButtonHit(event) {
		this.props.aevActions.searchForAEVs({
			boundingBox: this.props.mapping.boundingBox,
			mappingActions: this.props.mappingActions
		});
		//this.props.bplanActions.searchForPlans();
	}

	featureClick(event) {
		if (event.target.feature.selected) {
			this.props.mappingActions.fitSelectedFeatureBounds();
			if (event.target.feature.twin != null) {
				this.props.mappingActions.setSelectedFeatureIndex(event.target.feature.twin);
			}
		} else {
			this.props.mappingActions.setSelectedFeatureIndex(
				this.props.mapping.featureCollection.indexOf(event.target.feature)
			);
		}
	}
	doubleMapClick(event) {
		const pos = proj4(proj4.defs('EPSG:4326'), proj4crs25832def, [
			event.latlng.lng,
			event.latlng.lat
		]);
		this.props.aevActions.searchForAEVs({
			point: { x: pos[0], y: pos[1] },
			mappingActions: this.props.mappingActions
		});
	}

	selectNextIndex() {
		let potIndex = this.props.mapping.selectedIndex + 1;
		if (potIndex >= this.props.mapping.featureCollection.length) {
			potIndex = 0;
		}
		this.props.mappingActions.setSelectedFeatureIndex(potIndex);
		//this.props.mappingActions.fitSelectedFeatureBounds(stateConstants.AUTO_FIT_MODE_NO_ZOOM_IN);
	}

	selectPreviousIndex() {
		let potIndex = this.props.mapping.selectedIndex - 1;
		if (potIndex < 0) {
			potIndex = this.props.mapping.featureCollection.length - 1;
		}
		this.props.mappingActions.setSelectedFeatureIndex(potIndex);
		//this.props.mappingActions.fitSelectedFeatureBounds(stateConstants.AUTO_FIT_MODE_NO_ZOOM_IN);
	}

	fitAll() {
		this.props.mappingActions.fitAll();
	}

	render() {
		let currentZoom = new URLSearchParams(this.props.routing.location.search).get('zoom') || 8;

		let titleContent;
		let backgrounds = [];
		if (
			this.props.match.params.mode !== 'arbeitskarte' &&
			this.props.match.params.mode !== 'rechtsplan'
		) {
			this.props.routingActions.push('/fnp/rechtsplan' + this.props.routing.location.search);
		} else if (this.props.match.params.mode === 'arbeitskarte') {
			titleContent = (
				<div>
					<b>Arbeitskarte: </b> fortgeschriebene Hauptnutzungen (informeller FNP-Auszug)<div
						style={{ float: 'right', paddingRight: 10 }}
					>
						<a href={'/#/fnp/rechtsplan' + this.props.routing.location.search}>
							<FontAwesomeIcon icon={switchIcon} style={{ marginRight: 5 }} />zum
							Rechtsplan
						</a>
					</div>
				</div>
			);
			backgrounds = [
				<WMSTileLayer
					key={
						'UWZ.with.background' +
						(this.props.match.params.layers || reduxBackground || 'wupp-plan-live') +
						backgroundStyling
					}
					url='https://geodaten.metropoleruhr.de/spw2/service'
					layers={'spw2_graublau'}
					version='1.3.0'
					transparent='true'
					format='image/png'
					tiled='false'
					styles='default'
					maxZoom={19}
					opacity={1}
					caching={true}
				/>,
				<WMSTileLayer
					key={'Hauptnutzungen.flaeche' + backgroundStyling}
					url='https://maps.wuppertal.de/deegree/wms'
					layers={'r102:fnp_haupt_fl'}
					version='1.1.1'
					transparent='true'
					format='image/png'
					tiled='false'
					styles='default'
					maxZoom={19}
					opacity={0.4}
					caching={true}
				/>
			];
		} else {
			titleContent = (
				<div>
					<b>Rechtsplan: </b> Flächennutzungsplan (FNP) mit Änderungsverfahren (ÄV)<div
						style={{ float: 'right', paddingRight: 10 }}
					>
						<a href={'/#/fnp/arbeitskarte' + this.props.routing.location.search}>
							<FontAwesomeIcon icon={switchIcon} style={{ marginRight: 5 }} /> zur
							Arbeitskarte
						</a>
					</div>
				</div>
			);
			backgrounds = [
				// <WMSTileLayer
				// 	key={
				// 		'UWZ.with.background' +
				// 		(this.props.match.params.layers || reduxBackground || 'wupp-plan-live') +
				// 		backgroundStyling
				// 	}
				// 	url='https://geodaten.metropoleruhr.de/spw2/service'
				// 	layers={'spw2_light'}
				// 	version='1.3.0'
				// 	transparent='true'
				// 	format='image/png'
				// 	tiled='false'
				// 	styles='default'
				// 	maxZoom={19}
				// 	opacity={0.4}
				// 	caching={true}
				// />,
				<WMSTileLayer
					key={
						'UWZ.with.background' +
						(this.props.match.params.layers || reduxBackground || 'wupp-plan-live') +
						backgroundStyling
					}
					url='https://maps.wuppertal.de/deegree/wms?SRS=EPSG:25832'
					layers={'r102:fnp'}
					version='1.1.1'
					transparent='true'
					format='image/png'
					tiled='true'
					styles='default'
					maxZoom={19}
					opacity={currentZoom >= searchMinZoom ? 1 : 0.2}
					caching={true}
				/>
			];
		}

		let secondaryInfo = false;
		let info;
		if (this.props.mapping.featureCollection.length > 0) {
			info = (
				<AEVInfo
					pixelwidth={350}
					featureCollection={this.props.mapping.featureCollection}
					selectedIndex={this.props.mapping.selectedIndex || 0}
					next={this.selectNextIndex}
					previous={this.selectPreviousIndex}
					fitAll={this.fitAll}
					// downloadPlan={this.openDocViewer}
					// downloadEverything={this.openDocViewer}
					// preparedDownload={this.props.bplaene.preparedDownload}
					// resetPreparedDownload={this.resetPreparedDownload}
					// loadingError={this.props.bplaene.documentsLoadingError}
				/>
			);
		} else {
			//TODO better way to follow the jsx-a11y/anchor-is-valid rule
			/* eslint-disable */
			info = (
				<Well bsSize='small' pixelwidth={400}>
					<h5>Aktuell keine Änderungsverfahren (ÄV) geladen.</h5>
					<ul>
						<li>
							<b>ein ÄV laden:</b> Doppelklick auf Plan in Hintergrundkarte
						</li>
						<li>
							<b>alle ÄV im Kartenausschnitt laden:</b> <Icon name='search' />
						</li>
						<li>
							<b>bekannten ÄV laden:</b> Nummer als Suchbegriff eingeben, Auswahl aus
							Vorschlagsliste
						</li>
						<li>
							<b>Suche nach ÄV:</b> BPlan (mit B-Präfix), Adresse oder POI als
							Suchbegriff eingeben, Auswahl aus Vorschlagsliste
						</li>
					</ul>
					<a onClick={() => this.props.uiStateActions.showApplicationMenu(true)}>
						Kompaktanleitung
					</a>
				</Well>
			);
			/* eslint-ensable */
		}

		let reduxBackground = undefined;
		let backgroundStyling = queryString.parse(this.props.routing.location.search).mapStyle;
		try {
			reduxBackground = this.props.mapping.backgrounds[this.props.mapping.selectedBackground]
				.layerkey;
		} catch (e) {}
		let selectedFeature;

		let title = null;

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

		return (
			<div>
				{title}
				{isSecondaryInfoBoxVisible(this.props.aev) === true &&
				selectedFeature !== undefined && (
					<SecondaryInfoModal
						visible={isSecondaryInfoBoxVisible(this.props.aev)}
						anlagenFeature={selectedFeature}
						setVisibleState={this.props.aevActions.setSecondaryInfoVisible}
						uiHeight={this.props.uiState.height}
					/>
				)}
				<TopicMap
					ref={(comp) => {
						this.topicMap = comp;
					}}
					initialLoadingText='Laden der Änderungen ...'
					fullScreenControl
					locatorControl
					gazetteerSearchBox
					searchMinZoom={searchMinZoom}
					searchMaxZoom={18}
					gazeteerHitTrigger={this.aevnGazeteerhHit}
					searchButtonTrigger={this.aevSearchButtonHit}
					searchAfterGazetteer={true}
					gazetteerTopicsList={[
						'bplaene',
						'pois',
						'kitas',
						'quartiere',
						'bezirke',
						'adressen'
					]}
					gazetteerSearchBoxPlaceholdertext='ÄV | BPläne | Stadtteil | Adresse | POI'
					gazeteerHitTrigger={(selectedObject) => {
						if (
							selectedObject &&
							selectedObject[0] &&
							selectedObject[0].more &&
							selectedObject[0].more.id
						) {
							this.props.aevActions.setSelectedAEV(selectedObject[0].more.id);
						}
					}}
					photoLightBox
					infoBox={info}
					backgroundlayers={
						'nothing' ||
						this.props.match.params.layers ||
						reduxBackground ||
						'wupp-plan-live'
					}
					dataLoader={this.props.aevActions.loadAEVs}
					getFeatureCollectionForData={() => {
						return this.props.mapping.featureCollection;
					}}
					featureCollectionKeyPostfix={this.props.mapping.featureCollectionKeyPostfix}
					featureStyler={aevFeatureStyler}
					featureStyler__={(feature) => {
						const style = {
							color: '#155317',
							weight: 3,
							opacity: 0.8,
							fillColor: '#ffffff',
							fillOpacity: 0.6
						};
						if (feature.properties.status === 'r') {
							style.color = '#155317';
							style.fillColor = '#155317';
							style.opacity = 0.0;
						} else {
							style.color = '#9F111B';
							style.fillColor = '#9F111B';
							style.opacity = 0.0;
						}
						return style;
					}}
					featureLabeler={aevLabeler}
					featureLabeler_={(feature) => {
						return (
							<h3
								style={{
									color: '#155317',
									opacity: 0.7,
									textShadow:
										'1px 1px 0px  #000000,-1px 1px 0px  #000000, 1px -1px 0px  #000000, -1px -1px 0px  #000000, 2px 2px 15px #000000'
								}}
							>
								{feature.text}
							</h3>
						);
					}}
					featureClickHandler={this.featureClick}
					ondblclick={this.doubleMapClick}
					refreshFeatureCollection={this.props.aevActions.refreshFeatureCollection}
					setSelectedFeatureIndex={this.props.aevActions.setSelectedFeatureIndex}
					applicationMenuTooltipString='Einstellungen | Kompaktanleitung'
					modalMenu_={
						<div />
						// <PRBRModalMenu
						// 	uiState={this.props.uiState}
						// 	uiStateActions={this.props.uiStateActions}
						// 	urlPathname={this.props.routing.location.pathname}
						// 	urlSearch={this.props.routing.location.search}
						// 	pushNewRoute={this.props.routingActions.push}
						// 	currentMarkerSize={getPRBRSvgSize(this.props.aev)}
						// 	changeMarkerSymbolSize={this.changeMarkerSymbolSize}
						// 	topicMapRef={this.topicMap}
						// 	setLayerByKey={this.props.mappingActions.setSelectedMappingBackground}
						// 	activeLayerKey={this.props.mapping.selectedBackground}
						// 	setFeatureCollectionKeyPostfix={
						// 		this.props.mappingActions.setFeatureCollectionKeyPostfix
						// 	}
						// 	refreshFeatureCollection={
						// 		this.props.aevActions.refreshFeatureCollection
						// 	}
						// 	filter={getPRBRFilter(this.props.aev)}
						// 	setFilter={this.props.aevActions.setFilter}
						// 	filteredObjects={getPRBRFilteredData(this.props.aev)}
						// 	featureCollectionObjectsCount={
						// 		getPRBRFeatureCollection(this.props.aev).length
						// 	}
						// 	envZoneVisible={isEnvZoneVisible(this.props.aev)}
						// 	setEnvZoneVisible={this.props.aevActions.setEnvZoneVisible}
						// />
					}
				>
					<FeatureCollectionDisplayWithTooltipLabels
						key={'allAEVs'}
						featureCollection={getAEVFeatures(this.props.aev)}
						boundingBox={{
							left: 353122.1056720067,
							top: 5696995.497378283,
							right: 392372.51969633374,
							bottom: 5655795.93913269
						}}
						style={(feature) => {
							const style = {
								color: '#155317',
								weight: 3,
								opacity: 0.8,
								fillColor: '#ffffff',
								fillOpacity: 0.6
							};
							if (currentZoom >= searchMinZoom) {
								if (feature.properties.status === 'r') {
									style.color = '#155317';
								} else {
									style.color = '#9F111B';
								}
							} else {
								if (feature.properties.status === 'r') {
									style.color = '#155317';
									style.fillColor = '#155317';
									style.opacity = 0.0;
								} else {
									style.color = '#9F111B';
									style.fillColor = '#9F111B';
									style.opacity = 0.0;
								}
							}

							return style;
						}}
						_labeler={(feature) => {
							return (
								<h3
									style={{
										color: '#155317',
										opacity: 0.7,
										textShadow:
											'1px 1px 0px  #000000,-1px 1px 0px  #000000, 1px -1px 0px  #000000, -1px -1px 0px  #000000, 2px 2px 15px #000000'
									}}
								>
									Umweltzone
								</h3>
							);
						}}
						featureClickHandler={() => {}}
					/>
					{backgrounds}
				</TopicMap>
			</div>
		);
	}
}

const Container = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Container_);

export default Container;

Container.propTypes = {
	ui: PropTypes.object,
	uiState: PropTypes.object
};
