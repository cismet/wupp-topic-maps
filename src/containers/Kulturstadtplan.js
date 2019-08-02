import React from 'react';
import PropTypes from 'prop-types';
import TopicMap from './TopicMap';

import { connect } from 'react-redux';
import { Tooltip } from 'react-bootstrap';

import { actions as mappingActions } from '../redux/modules/mapping';
import { actions as uiStateActions } from '../redux/modules/uiState';
import { actions as stadtplanActions } from '../redux/modules/kulturstadtplan';

import {
	getPOIs,
	getPOIsMD5,
	getFilteredPOIs,
	getVeranstaltungsarten,
	getLebenslagen,
	getFilter,
	getFilterMode,
	getPoiSvgSize,
	getApps,
	hasMinifiedInfoBox
} from '../redux/modules/kulturstadtplan';

import { routerActions } from 'react-router-redux';

import { bindActionCreators } from 'redux';

import {
	getFeatureStyler,
	featureHoverer,
	getPoiClusterIconCreatorFunction
} from '../utils/stadtplanHelper';

import {
	getColorForProperties,
	getHeaderTextForProperties,
	getAllEinrichtungen,
	textConversion
} from '../utils/kulturstadtplanHelper';

import Loadable from 'react-loading-overlay';
import queryString from 'query-string';

import StadtplanInfo from '../components/stadtplan/StadtplanInfo';
import StadtplanModalApplicationMenu from '../components/kulturstadtplan/ModalMenu';
import PhotoLightbox from './PhotoLightbox';

import 'react-image-lightbox/style.css';

function mapStateToProps(state) {
	return {
		uiState: state.uiState,
		mapping: state.mapping,
		routing: state.routing,
		stadtplan: state.kulturstadtplan
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
		document.title = 'Kulturstadtplan Wuppertal';
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
		// x1=361332.75015625&y1=5669333.966678483&x2=382500.79703125&y2=5687261.5769543
		// 2 8
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
		// this.props.mappingActions.fitSelectedFeatureBounds(stateConstants.AUTO_FIT_MO
		// D E_NO_ZOOM_IN);
	}

	selectPreviousIndex() {
		let potIndex = this.props.mapping.selectedIndex - 1;
		if (potIndex < 0) {
			potIndex = this.props.mapping.featureCollection.length - 1;
		}
		this.props.mappingActions.setSelectedFeatureIndex(potIndex);
	}
	filterChanged(filtergroup, filter) {
		//this.props.ehrenamtActions.toggleFilter(filtergroup,filter);
	}

	resetFilter() {
		// if (this.props.ehrenamt.mode===ehrenamtConstants.FILTER_FILTER){
		// this.props.ehrenamtActions.resetFilter(); } else {
		// this.props.ehrenamtActions.setMode(ehrenamtConstants.FILTER_FILTER); }
	}
	searchTooltip() {
		return <div />;
	}

	render() {
		let info = null;
		let headerText = '';
		let headerColor = undefined;
		if (
			this.props.mapping.selectedIndex != undefined &&
			this.props.mapping.featureCollection[this.props.mapping.selectedIndex] &&
			this.props.mapping.featureCollection[this.props.mapping.selectedIndex].properties &&
			this.props.mapping.featureCollection[this.props.mapping.selectedIndex].properties
				.mainlocationtype
		) {
			let veranstaltungsort = this.props.mapping.featureCollection[
				this.props.mapping.selectedIndex
			].properties;

			headerColor = getColorForProperties(veranstaltungsort);
			headerText = getHeaderTextForProperties(veranstaltungsort);
		} else {
			// console.log(
			// 	'kein selectedIndex oder keine featureCollection',
			// 	this.props.mapping.selectedIndex,
			// 	this.props.mapping.featureCollection
			// );
		}
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
					this.props.uiStateActions.showApplicationMenuAndActivateSection(true, section)}
				uiState={this.props.uiState}
				uiStateActions={this.props.uiStateActions}
				panelClick={(e) => {
					this.props.stadtplanActions.refreshFeatureCollection();
				}}
				minified={hasMinifiedInfoBox(this.props.stadtplan)}
				minify={(minified) => this.props.stadtplanActions.setMinifiedInfoBox(minified)}
				headerText={headerText}
				headerColor={headerColor}
			/>
		);

		let title = null;
		let themenstadtplanDesc = '';
		let titleContent;
		let prefix = 'Mein Kulturstadtplan:';
		let qTitle = queryString.parse(this.props.routing.location.search).title;
		if (qTitle !== undefined) {
			if (qTitle === null || qTitle === '') {
				// if (
				// 	getFilter(this.props.stadtplan).positiv.length > 0 &&
				// 	getFilter(this.props.stadtplan).positiv.length <
				// 		getLebenslagen(this.props.stadtplan).length
				// ) {
				// 	if (getFilter(this.props.stadtplan).positiv.length <= 4) {
				// 		themenstadtplanDesc += getFilter(this.props.stadtplan).positiv.join(', ');
				// 	} else {
				// 		themenstadtplanDesc +=
				// 			getFilter(this.props.stadtplan).positiv.length + ' Themen';
				// 	}
				// 	if (getFilter(this.props.stadtplan).negativ.length > 0) {
				// 		if (getFilter(this.props.stadtplan).negativ.length <= 3) {
				// 			themenstadtplanDesc += ' ohne ';
				// 			themenstadtplanDesc += getFilter(this.props.stadtplan).negativ.join(
				// 				', '
				// 			);
				// 		} else {
				// 			themenstadtplanDesc +=
				// 				' (' +
				// 				getFilter(this.props.stadtplan).negativ.length +
				// 				' Themen ausgeschlossen)';
				// 		}
				// 	}
				// }

				const filterMode = getFilterMode(this.props.stadtplan);
				const filter = getFilter(this.props.stadtplan);
				let maxFilterCount;
				let einrichtungsEinschub;
				if (filterMode === 'einrichtungen') {
					maxFilterCount = getAllEinrichtungen().length;
					einrichtungsEinschub = '';
				} else {
					einrichtungsEinschub = 'Orte für ';
					maxFilterCount = getVeranstaltungsarten(this.props.stadtplan).length;
				}

				if (filter[filterMode].length === 1) {
					themenstadtplanDesc = 'alle ' + einrichtungsEinschub + filter[filterMode][0];
				} else if (filter[filterMode].length > 0 && filter[filterMode].length < 3) {
					themenstadtplanDesc =
						'alle ' +
						einrichtungsEinschub +
						filter[filterMode][0] +
						' und ' +
						filter[filterMode][1];
					if (themenstadtplanDesc.split(' und ').length - 1 > 1) {
						themenstadtplanDesc = themenstadtplanDesc.replace(' und ', ', ');
					}
				} else if (
					filter[filterMode].length > 0 &&
					filter[filterMode].length < maxFilterCount
				) {
					themenstadtplanDesc =
						filter[filterMode].length + ' ' + textConversion(filterMode);
				}
				titleContent = (
					<div>
						<b>{prefix}</b> {themenstadtplanDesc}
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

		return (
			<div>
				<PhotoLightbox /> {title}
				<TopicMap
					ref={(cismap) => {
						this.cismapRef = cismap;
						this.topicMap = cismap;
					}}
					initialLoadingText='Laden der Veranstaltungsorte...'
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
					backgroundlayers={
						this.props.match.params.layers || reduxBackground || 'wupp-plan-live@90'
					}
					dataLoader={this.props.stadtplanActions.getPOIs}
					getFeatureCollectionForData={() => {
						return this.props.mapping.featureCollection;
					}}
					featureCollectionKeyPostfix={this.props.mapping.featureCollectionKeyPostfix}
					featureStyler={getFeatureStyler(
						getPoiSvgSize(this.props.stadtplan),
						getColorForProperties
					)}
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
							getPoiSvgSize(this.props.stadtplan),
							getColorForProperties
						)
					}}
					applicationMenuTooltipString='Kulturstadtplan | Einstellungen | Kompaktanleitung'
					modalMenu={
						<StadtplanModalApplicationMenu
							// key={
							// 	'StadtplanModalApplicationMenu.visible:' +
							// 	this.props.uiState.applicationMenuVisible
							// }
							veranstaltungsarten={getVeranstaltungsarten(this.props.stadtplan)}
							apps={getApps(this.props.stadtplan)}
							filter={getFilter(this.props.stadtplan)}
							filtermode={getFilterMode(this.props.stadtplan)}
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
								console.log('setFeatureCollectionKeyPostfix', pf);

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
