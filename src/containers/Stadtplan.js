import PropTypes from 'prop-types';
import queryString from 'query-string';
import React from 'react';
import 'react-image-lightbox/style.css';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import InfoBoxFotoPreview from '../components/commons/InfoBoxFotoPreview';
import StadtplanModalApplicationMenu from '../components/stadtplan/ModalMenu';
import StadtplanInfo from '../components/stadtplan/StadtplanInfo';
import { actions as mappingActions } from '../redux/modules/mapping';
import {
	actions as stadtplanActions,
	getApps,
	getFilter,
	getFilteredPOIs,
	getLebenslagen,
	getPOIs,
	getPOIsMD5,
	getPoiSvgSize,
	hasMinifiedInfoBox
} from '../redux/modules/stadtplan';
import { actions as uiStateActions } from '../redux/modules/uiState';
import { fotoKraemerCaptionFactory, fotoKraemerUrlManipulation } from '../utils/commonHelpers';
import {
	featureHoverer,
	getFeatureStyler,
	getPoiClusterIconCreatorFunction
} from '../utils/stadtplanHelper';
import PhotoLightbox from './PhotoLightbox';
//import Cismap from '../containers/Cismap';
import TopicMap from './TopicMap';

function mapStateToProps(state) {
	return {
		uiState: state.uiState,
		mapping: state.mapping,
		routing: state.routing,
		stadtplan: state.stadtplan
	};
}

function mapDispatchToProps(dispatch) {
	return {
		mappingActions: bindActionCreators(mappingActions, dispatch),
		uiStateActions: bindActionCreators(uiStateActions, dispatch),
		stadtplanActions: bindActionCreators(stadtplanActions, dispatch),
		routingActions: bindActionCreators(routerActions, dispatch)
	};
}

export class Stadtplan_ extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.gazeteerhHit = this.gazeteerhHit.bind(this);
		this.searchButtonHit = this.searchButtonHit.bind(this);
		this.featureClick = this.featureClick.bind(this);
		this.gotoHome = this.gotoHome.bind(this);
		this.doubleMapClick = this.doubleMapClick.bind(this);
		this.searchTooltip = this.searchTooltip.bind(this);
		this.selectNextIndex = this.selectNextIndex.bind(this);
		this.selectPreviousIndex = this.selectPreviousIndex.bind(this);
		this.createfeatureCollectionByBoundingBox = this.createfeatureCollectionByBoundingBox.bind(
			this
		);
		this.filterChanged = this.filterChanged.bind(this);
		this.resetFilter = this.resetFilter.bind(this);
		this.centerOnPoint = this.centerOnPoint.bind(this);
		this.props.mappingActions.setBoundingBoxChangedTrigger(
			this.createfeatureCollectionByBoundingBox
		);
	}
	componentWillUnmount() {
		// console.log("Ehrenamt unmount")
	}

	componentWillMount() {
		// console.log("Ehrenamt mount")
		this.dataLoaded = false;
		this.loadThePOIs().then((data) => {
			this.dataLoaded = true;
		});
		//this.props.uiStateActions.setApplicationMenuActiveKey("filtertab");
	}

	componentDidMount() {
		document.title = 'Online-Stadtplan Wuppertal';
	}

	componentWillUpdate() {
		if (getPOIs(this.props.stadtplan).length === 0) {
			return;
		}
	}

	loadThePOIs() {
		var promise = new Promise((resolve, reject) => {
			setTimeout(() => {
				this.props.stadtplanActions.loadPOIs();
				resolve('ok');
			}, 100);
		});
		return promise;
	}
	createfeatureCollectionByBoundingBox(bbox) {
		this.props.stadtplanActions.createFeatureCollectionFromPOIs(bbox);
	}

	gazeteerhHit(selectedObject) {
		if (
			selectedObject &&
			selectedObject[0] &&
			selectedObject[0].more &&
			(selectedObject[0].more.pid || selectedObject[0].more.kid)
		) {
			//this.props.stadtplanActions.setPoiGazHit(selectedObject[0].more.pid);
			this.props.stadtplanActions.setSelectedPOI(
				selectedObject[0].more.pid || selectedObject[0].more.kid
			);
		}
	}

	searchButtonHit(event) {}

	featureClick(event) {
		if (event.target.feature) {
			this.props.mappingActions.setSelectedFeatureIndex(event.target.feature.index);
		}
	}

	doubleMapClick(event) {}

	gotoHome() {
		if (this.topicMap) {
			this.topicMap.wrappedInstance.gotoHome();
		}
	}

	centerOnPoint(x, y, z) {
		this.cismapRef.wrappedInstance.centerOnPoint(x, y, z);
	}

	selectNextIndex() {
		let potIndex = this.props.mapping.selectedIndex + 1;
		if (potIndex >= this.props.mapping.featureCollection.length) {
			potIndex = 0;
		}
		this.props.mappingActions.setSelectedFeatureIndex(potIndex);
	}

	selectPreviousIndex() {
		let potIndex = this.props.mapping.selectedIndex - 1;
		if (potIndex < 0) {
			potIndex = this.props.mapping.featureCollection.length - 1;
		}
		this.props.mappingActions.setSelectedFeatureIndex(potIndex);
	}
	filterChanged(filtergroup, filter) {}

	resetFilter() {}
	searchTooltip() {
		return <div />;
	}

	render() {
		let info = null;
		if (getFilter(this.props.stadtplan).positiv.length > 0) {
			info = (
				<StadtplanInfo
					key={'stadtplanInfo.' + (this.props.mapping.selectedIndex || 0)}
					pixelwidth={325}
					featureCollection={this.props.mapping.featureCollection}
					filteredPOIs={getFilteredPOIs(this.props.stadtplan)}
					selectedIndex={this.props.mapping.selectedIndex || 0}
					next={this.selectNextIndex}
					previous={this.selectPreviousIndex}
					fitAll={this.gotoHome}
					showModalMenu={(section) =>
						this.props.uiStateActions.showApplicationMenuAndActivateSection(
							true,
							section
						)}
					uiState={this.props.uiState}
					uiStateActions={this.props.uiStateActions}
					panelClick={(e) => {
						this.props.stadtplanActions.refreshFeatureCollection();
					}}
					minified={hasMinifiedInfoBox(this.props.stadtplan)}
					minify={(minified) => this.props.stadtplanActions.setMinifiedInfoBox(minified)}
				/>
			);
		} else {
			info = <div />;
		}

		let title = null;
		let themenstadtplanDesc = '';
		let titleContent;
		let qTitle = queryString.parse(this.props.routing.location.search).title;
		if (qTitle !== undefined) {
			if (qTitle === null || qTitle === '') {
				if (
					getFilter(this.props.stadtplan).positiv.length > 0 &&
					getFilter(this.props.stadtplan).positiv.length <
						getLebenslagen(this.props.stadtplan).length
				) {
					if (getFilter(this.props.stadtplan).positiv.length <= 4) {
						themenstadtplanDesc += getFilter(this.props.stadtplan).positiv.join(', ');
					} else {
						themenstadtplanDesc +=
							getFilter(this.props.stadtplan).positiv.length + ' Themen';
					}
					if (getFilter(this.props.stadtplan).negativ.length > 0) {
						if (getFilter(this.props.stadtplan).negativ.length <= 3) {
							themenstadtplanDesc += ' ohne ';
							themenstadtplanDesc += getFilter(this.props.stadtplan).negativ.join(
								', '
							);
						} else {
							themenstadtplanDesc +=
								' (' +
								getFilter(this.props.stadtplan).negativ.length +
								' Themen ausgeschlossen)';
						}
					}
				}
				titleContent = (
					<div>
						<b>Mein Themenstadtplan:</b> {themenstadtplanDesc}
					</div>
				);
			} else {
				themenstadtplanDesc = qTitle;
				titleContent = <div>{themenstadtplanDesc}</div>;
			}
			if (themenstadtplanDesc !== '') {
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
			}
		}

		let reduxBackground = undefined;
		try {
			reduxBackground = this.props.mapping.backgrounds[this.props.mapping.selectedBackground]
				.layerkey;
		} catch (e) {}
		let selectedFeature = (this.props.mapping.featureCollection || [ {} ])[
			this.props.mapping.selectedIndex || 0
		];
		return (
			<div>
				<PhotoLightbox /> {title}
				<TopicMap
					ref={(cismap) => {
						this.cismapRef = cismap;
						this.topicMap = cismap;
					}}
					initialLoadingText='Laden der POIs ...'
					home={{
						center: [ 51.2724, 7.199806 ],
						zoom: 8
					}}
					fullScreenControl
					locatorControl
					gazetteerSearchBox
					gazeteerHitTrigger={this.gazeteerhHit}
					gazetteerTopicsList={[ 'pois', 'kitas', 'bezirke', 'quartiere', 'adressen' ]}
					gazetteerSearchBoxPlaceholdertext='Stadtteil | Adresse | POI'
					infoBox={info}
					secondaryInfoBoxElements={[
						<InfoBoxFotoPreview
							currentFeature={selectedFeature}
							getPhotoUrl={(feature) => {
								return (feature || { properties: {} }).properties.foto;
							}}
							uiStateActions={this.props.uiStateActions}
							urlManipulation={fotoKraemerUrlManipulation}
							captionFactory={fotoKraemerCaptionFactory}
						/>
					]}
					backgroundlayers={
						this.props.match.params.layers || reduxBackground || 'wupp-plan-live@90'
					}
					dataLoader={this.props.stadtplanActions.getPOIs}
					getFeatureCollectionForData={() => {
						return this.props.mapping.featureCollection;
					}}
					featureCollectionKeyPostfix={this.props.mapping.featureCollectionKeyPostfix}
					featureStyler={getFeatureStyler(getPoiSvgSize(this.props.stadtplan))}
					featureHoverer={featureHoverer}
					refreshFeatureCollection={() =>
						this.props.stadtplanActions.createFeatureCollectionFromPOIs(
							this.props.mapping.boundingBox
						)}
					setSelectedFeatureIndex={this.props.mappingActions.setSelectedFeatureIndex}
					gazTopics={[ 'pois', 'kitas', 'bezirke', 'quartiere', 'adressen' ]}
					clusteringEnabled={
						queryString.parse(this.props.routing.location.search).unclustered ===
						undefined
					}
					clusterOptions={{
						spiderfyOnMaxZoom: false,
						spiderfyDistanceMultiplier: getPoiSvgSize(this.props.stadtplan) / 24,
						showCoverageOnHover: false,
						zoomToBoundsOnClick: false,
						maxClusterRadius: 40,
						disableClusteringAtZoom: 19,
						animate: false,
						cismapZoomTillSpiderfy: 12,
						selectionSpiderfyMinZoom: 12,
						iconCreateFunction: getPoiClusterIconCreatorFunction(
							getPoiSvgSize(this.props.stadtplan)
						)
					}}
					applicationMenuTooltipString='Themenstadtplan | Einstellungen | Kompaktanleitung'
					modalMenu={
						<StadtplanModalApplicationMenu
							// key={
							// 	'StadtplanModalApplicationMenu.visible:' +
							// 	this.props.uiState.applicationMenuVisible
							// }
							lebenslagen={getLebenslagen(this.props.stadtplan)}
							apps={getApps(this.props.stadtplan)}
							filter={getFilter(this.props.stadtplan)}
							filterChanged={this.filterChanged}
							offersMD5={getPOIsMD5(this.props.stadtplan)}
							// centerOnPoint={this.centerOnPoint}
							stadtplanActions={this.props.stadtplanActions}
							// mappingActions={this.props.mappingActions}
							poiSvgSize={getPoiSvgSize(this.props.stadtplan)}
							uiState={this.props.uiState}
							uiStateActions={this.props.uiStateActions}
							urlPathname={this.props.routing.location.pathname}
							urlSearch={this.props.routing.location.search}
							pushNewRoute={this.props.routingActions.push}
							currentMarkerSize={getPoiSvgSize(this.props.stadtplan)}
							changeMarkerSymbolSize={(size) => {
								this.props.stadtplanActions.setPoiSvgSize(size);
								this.props.mappingActions.setFeatureCollectionKeyPostfix(
									'PoiSvgSize:' + size
								);
							}}
							topicMapRef={this.topicMap}
							selectedBackground={this.props.mapping.selectedBackground}
							availableBackgrounds={this.props.mapping.backgrounds}
							filteredPOIs={getFilteredPOIs(this.props.stadtplan) || []}
							featureCollectionCount={this.props.mapping.featureCollection.length}
							setLayerByKey={this.props.mappingActions.setSelectedMappingBackground}
							activeLayerKey={this.props.mapping.selectedBackground}
							setFeatureCollectionKeyPostfix={(pf) => {
								// console.log('setFeatureCollectionKeyPostfix', pf);

								this.props.mappingActions.setFeatureCollectionKeyPostfix(pf);
							}}
						/>
					}
				/>
			</div>
		);
	}
}

//<Control position = "bottomleft"> <Button>xxx</Button></Control>

const Stadtplan = connect(mapStateToProps, mapDispatchToProps)(Stadtplan_);

export default Stadtplan;

Stadtplan.propTypes = {
	ui: PropTypes.object,
	uiState: PropTypes.object
};
