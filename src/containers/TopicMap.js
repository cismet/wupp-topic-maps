import Icon from 'components/commons/Icon';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import {
	FeatureCollectionDisplay,
	FeatureCollectionDisplayWithTooltipLabels,
	MappingConstants,
	RoutedMap
} from 'react-cismap';
import Control from 'react-leaflet-control';
import Loadable from 'react-loading-overlay';
import { connect } from 'react-redux';
import { routerActions as RoutingActions } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import GazetteerSearchControl from '../components/commons/GazetteerSearchControl';
import GazetteerHitDisplay from '../components/GazetteerHitDisplay';
import ProjSingleGeoJson from '../components/ProjSingleGeoJson';
import {
	actions as gazetteerTopicsActions,
	getGazDataForTopicIds
} from '../redux/modules/gazetteerTopics';
import { actions as MappingActions } from '../redux/modules/mapping';
import { actions as UIStateActions } from '../redux/modules/uiState';
import { builtInGazetteerHitTrigger } from '../utils/gazetteerHelper';
import { modifyQueryPart, removeQueryPart } from '../utils/routingHelper';

import PhotoLightbox from './PhotoLightbox';

function mapStateToProps(state) {
	return {
		uiState: state.uiState,
		mapping: state.mapping,
		routing: state.routing,
		gazetteerTopics: state.gazetteerTopics
	};
}

function mapDispatchToProps(dispatch) {
	return {
		mappingActions: bindActionCreators(MappingActions, dispatch),
		uiStateActions: bindActionCreators(UIStateActions, dispatch),
		routingActions: bindActionCreators(RoutingActions, dispatch),
		gazetteerTopicsActions: bindActionCreators(gazetteerTopicsActions, dispatch)
	};
}

export class TopicMap_ extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.loadData = this.loadData.bind(this);
		this.featureClick = this.featureClick.bind(this);
		this.gotoHome = this.gotoHome.bind(this);
		this.defaultShowModalApplicationMenu = this.defaultShowModalApplicationMenu.bind(this);
		this.props.mappingActions.setBoundingBoxChangedTrigger((bbox) =>
			this.props.refreshFeatureCollection(bbox)
		);
	}
	componentWillMount() {
		this.dataLoaded = false;
		this.loadData().then((data) => {
			this.dataLoaded = true;
			if (this.props.dataLoader !== undefined) {
				this.forceUpdate();
			}
		});

		if (this.props.gazetteerSearchBox) {
			this.props.uiStateActions.setGazetteerBoxEnabled(false);
			this.props.uiStateActions.setGazetteerBoxInfoText(
				'Ortsinformationen werden geladen ...'
			);
			this.props.gazetteerTopicsActions
				.loadTopicsData(this.props.gazetteerTopicsList)
				.then(() => {
					if (this.props.gazetteerTopics.adressen === undefined) {
						console.log('this.props.gazetteerTopics.adressen === undefined');
					}
					this.gazData = getGazDataForTopicIds(
						this.props.gazetteerTopics,
						this.props.gazetteerTopicsList
					);
					this.props.uiStateActions.setGazetteerBoxEnabled(true);
					this.props.uiStateActions.setGazetteerBoxInfoText(this.props.gazBoxInfoText);
					this.forceUpdate(); //ugly winning: prevent typeahead to have shitty behaviour
				});
		}
	}
	componentWillUpdate() {
		let gazHitBase64 = new URLSearchParams(this.props.routing.location.search).get('gazHit');
		if (gazHitBase64 !== undefined && gazHitBase64 !== null) {
			try {
				let gazHit = JSON.parse(window.atob(gazHitBase64));
				let suppressMarker = true;
				builtInGazetteerHitTrigger(
					[ gazHit ],
					this.leafletRoutedMap.leafletMap.leafletElement,
					this.props.mappingActions,
					this.props.gazeteerHitTrigger,
					suppressMarker
				);
			} catch (err) {
				console.log('Error when injecting stuff.', err);
			} finally {
				this.props.routingActions.push(
					this.props.routing.location.pathname +
						removeQueryPart(this.props.routing.location.search, 'gazHit')
				);
			}
		}
	}
	featureClick(event) {
		if (event.target.feature) {
			this.props.setSelectedFeatureIndex(event.target.feature.index);
		}
	}
	loadData() {
		var promise = new Promise((resolve, reject) => {
			setTimeout(() => {
				// entweder dataLoader ist eine Funktion oder ein Array von Funktionen

				if (Array.isArray(this.props.dataLoader)) {
					this.props.uiStateActions.setPendingLoader(this.props.dataLoader.length);
					for (const loader of this.props.dataLoader) {
						loader(() => {
							this.props.uiStateActions.setPendingLoader(
								this.props.uiState.pendingLoader - 1
							);
						});
					}
				} else {
					this.props.uiStateActions.setPendingLoader(1);
					if (this.props.dataLoader) {
						this.props.dataLoader(() => {
							console.log('this.props.uiStateActions.setPendingLoader(0)');

							this.props.uiStateActions.setPendingLoader(0);
						});
					}
				}
				resolve('ok');
			}, 100);
		});
		return promise;
	}
	gotoHome() {
		this.leafletRoutedMap.leafletMap.leafletElement.setView(
			this.props.home.center,
			this.props.home.zoom
		);
	}

	defaultShowModalApplicationMenu() {
		this.props.uiStateActions.showApplicationMenu(true);
	}

	isSearchAllowed = () => {
		const zoomByUrl =
			parseInt(new URLSearchParams(this.props.routing.location.search).get('zoom'), 10) ||
			this.props.home.zoom;
		return zoomByUrl >= this.props.searchMinZoom && zoomByUrl <= this.props.searchMaxZoom;
	};

	render() {
		const mapStyle = {
			height: this.props.uiState.height,
			cursor: this.props.cursor
		};
		let urlSearchParams = new URLSearchParams(this.props.routing.location.search);

		let info = this.props.infoBox;
		let secondaryInfoBoxElements = this.props.secondaryInfoBoxElements;

		let overlayFeature = <div />;
		if (this.props.mapping.overlayFeature) {
			overlayFeature = (
				<ProjSingleGeoJson
					key={JSON.stringify(this.props.mapping.overlayFeature)}
					geoJson={this.props.mapping.overlayFeature}
					masked={this.props.mapping.maskedOverlay}
					mapRef={this}
				/>
			);
		}

		let searchIcon = <Icon name='search' />;
		if (this.props.mapping.searchInProgress) {
			searchIcon = <Icon spin={true} name='refresh' />;
		}

		let widthRight = info.props.pixelwidth;
		let width = this.props.uiState.width;
		let gap = 25;

		let infoBoxControlPosition = 'bottomright';
		let searchControlPosition = 'bottomleft';
		let searchControlWidth = 300;
		let widthLeft = searchControlWidth;
		let infoStyle = {
			opacity: '0.9',
			width: info.props.pixelwidth
		};

		//TODO the call of this.props.responsiveTrigger(true|false) triggers the warning
		// Cannot update during an existing state transition (such as within `render`).
		// Render methods should be a pure function of props and state.

		if (width - gap - widthLeft - widthRight <= 0) {
			infoBoxControlPosition = 'bottomright';
			searchControlPosition = 'bottomright';
			searchControlWidth = width - gap;
			infoStyle = {
				...infoStyle,
				width: searchControlWidth + 'px'
			};
			this.props.responsiveTrigger(true);
		} else {
			this.props.responsiveTrigger(false);
		}

		let searchControl;
		if (this.props.gazetteerSearchBox) {
			searchControl = (
				<GazetteerSearchControl
					className='JKHKJHKJHJK'
					key={
						'GazetteerSearchControl.' +
						infoBoxControlPosition +
						'.' +
						searchControlPosition
					}
					enabled={this.props.uiState.gazetteerBoxEnabled}
					placeholder={this.props.gazetteerSearchBoxPlaceholdertext}
					pixelwidth={searchControlWidth}
					searchControlPosition={searchControlPosition}
					gazData={this.gazData}
					gazeteerHitTrigger={(hit) => {
						builtInGazetteerHitTrigger(
							hit,
							this.leafletRoutedMap.leafletMap.leafletElement,
							this.props.mappingActions,
							this.props.gazeteerHitTrigger
						);
					}}
					searchAfterGazetteer={this.props.searchAfterGazetteer}
					searchInProgress={this.props.mapping.searchInProgress}
					searchAllowed={this.isSearchAllowed()}
					searchTooltipProvider={() => <div />}
					searchIcon={searchIcon}
					overlayFeature={this.props.mapping.overlayFeature}
					gazetteerHit={this.props.mapping.gazetteerHit}
					gazetteerHitAction={this.props.mappingActions.gazetteerHit}
					searchButtonTrigger={this.props.searchButtonTrigger}
					gazSearchMinLength={this.props.gazSearchMinLength}
					setOverlayFeature={this.props.mappingActions.setOverlayFeature}
				/>
			);
		}

		let photoLightBox;
		if (this.props.photoLightBox) {
			photoLightBox = <PhotoLightbox />;
		}

		let fcd;
		if (this.props.featureLabeler) {
			fcd = (
				<FeatureCollectionDisplayWithTooltipLabels
					key={
						JSON.stringify(this.props.mapping.featureCollection) +
						this.props.featureKeySuffixCreator() +
						'clustered:' +
						this.props.clustered +
						'.customPostfix:' +
						this.props.mapping.featureCollectionKeyPostfix
					}
					featureCollection={this.props.getFeatureCollectionForData()}
					boundingBox={this.props.mapping.boundingBox}
					clusterOptions={this.props.clusterOptions}
					clusteringEnabled={this.props.clusteringEnabled}
					selectionSpiderfyMinZoom={this.props.clusterOptions.selectionSpiderfyMinZoom}
					style={this.props.featureStyler}
					labeler={this.props.featureLabeler}
					hoverer={this.props.featureHoverer}
					featureClickHandler={this.props.featureClickHandler}
					mapRef={(this.leafletRoutedMap || {}).leafletMap}
				/>
			);
		} else {
			fcd = (
				<FeatureCollectionDisplay
					key={
						JSON.stringify(this.props.getFeatureCollectionForData()) +
						this.props.featureKeySuffixCreator() +
						'clustered:' +
						this.props.clustered +
						'.customPostfix:' +
						this.props.featureCollectionKeyPostfix
					}
					featureCollection={this.props.getFeatureCollectionForData()}
					boundingBox={this.props.mapping.boundingBox}
					clusteringEnabled={this.props.clusteringEnabled}
					style={this.props.featureStyler}
					hoverer={this.props.featureHoverer}
					labeler={this.props.featureLabeler}
					featureStylerScalableImageSize={32}
					featureClickHandler={this.featureClick}
					mapRef={(this.leafletRoutedMap || {}).leafletMap}
					showMarkerCollection={this.props.showMarkerCollection}
					markerStyle={this.props.markerStyle}
					clusterOptions={this.props.clusterOptions}
					selectionSpiderfyMinZoom={this.props.clusterOptions.selectionSpiderfyMinZoom}
				/>
			);
		}
		let infoBoxBottomMargin = 0;
		if (searchControlPosition === 'bottomright') {
			infoBoxBottomMargin = 5;
		}
		let statusPostfix = '';
		if (this.props.uiState.loadingStatus !== undefined) {
			statusPostfix = '(' + this.props.uiState.loadingStatus + ')';
		}
		return (
			<div>
				{this.props.modalMenu}
				<Loadable
					active={
						this.props.uiState.pendingLoader > 0 && !this.props.noInitialLoadingText
					}
					spinner
					text={this.props.initialLoadingText + ' ' + statusPostfix + ' ...'}
				>
					<div>
						{photoLightBox}
						<RoutedMap
							key={'leafletRoutedMap'}
							referenceSystem={MappingConstants.crs25832}
							referenceSystemDefinition={MappingConstants.proj4crs25832def}
							ref={(leafletMap) => {
								this.leafletRoutedMap = leafletMap;
							}}
							minZoom={this.props.minZoom}
							maxZoom={this.props.maxZoom}
							layers=''
							style={mapStyle}
							fallbackPosition={{
								lat: this.props.home.center[0],
								lng: this.props.home.center[1]
							}}
							ondblclick={this.props.ondblclick}
							onclick={this.props.onclick}
							locationChangedHandler={(location) => {
								this.props.routingActions.push(
									this.props.routing.location.pathname +
										modifyQueryPart(
											this.props.routing.location.search,
											location
										)
								);
								this.props.locationChangedHandler(location);
							}}
							autoFitConfiguration={{
								autoFitBounds: this.props.mapping.autoFitBounds,
								autoFitMode: this.props.mapping.autoFitMode,
								autoFitBoundsTarget: this.props.mapping.autoFitBoundsTarget
							}}
							autoFitProcessedHandler={() =>
								this.props.mappingActions.setAutoFit(false)}
							urlSearchParams={urlSearchParams}
							boundingBoxChangedHandler={(bbox) => {
								this.props.mappingActions.mappingBoundsChanged(bbox);
								this.props.mappingBoundsChanged(bbox);
							}}
							backgroundlayers={this.props.backgroundlayers}
							fallbackZoom={this.props.home.zoom}
							fullScreenControlEnabled={this.props.locatorControl}
							locateControlEnabled={this.props.locatorControl}
						>
							{overlayFeature}
							<GazetteerHitDisplay
								key={'gazHit' + JSON.stringify(this.props.mapping.gazetteerHit)}
								mappingProps={this.props.mapping}
							/>
							{fcd}

							{searchControl}

							<Control
								key={
									'InfoBoxElements.' +
									infoBoxControlPosition +
									'.' +
									searchControlPosition
								}
								id={
									'InfoBoxElements.' +
									infoBoxControlPosition +
									'.' +
									searchControlPosition
								}
								position={infoBoxControlPosition}
							>
								<div style={{ ...infoStyle, marginBottom: infoBoxBottomMargin }}>
									{info}
								</div>
							</Control>

							{secondaryInfoBoxElements.map((element, index) => (
								<Control
									key={
										'secondaryInfoBoxElements.' +
										index +
										infoBoxControlPosition +
										'.' +
										searchControlPosition
									}
									position={infoBoxControlPosition}
								>
									<div style={{ opacity: 0.9 }}>{element}</div>
								</Control>
							))}

							<Control position='topright'>
								<OverlayTrigger
									placement='left'
									overlay={
										<Tooltip style={{ zIndex: 3000000000 }} id='helpTooltip'>
											{this.props.applicationMenuTooltipString}
										</Tooltip>
									}
								>
									<Button
										id='cmdShowModalApplicationMenu'
										onClick={() => {
											if (this.props.showModalApplicationMenu) {
												this.props.showModalApplicationMenu();
											} else {
												this.defaultShowModalApplicationMenu();
											}
										}}
									>
										<Icon name={this.props.applicationMenuIconname} />
									</Button>
								</OverlayTrigger>
							</Control>
							{this.props.children}
						</RoutedMap>
					</div>
				</Loadable>
			</div>
		);
	}
}

const TopicMap = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(TopicMap_);

export default TopicMap;

TopicMap.propTypes = {
	infoBox: PropTypes.object,
	secondaryInfoBoxElements: PropTypes.array,
	backgroundLayers: PropTypes.string,
	initialLoadingText: PropTypes.string,
	noInitialLoadingText: PropTypes.bool,
	gazetteerSearchBox: PropTypes.bool,
	gazetteerSearchBoxPlaceholdertext: PropTypes.string,
	gazetteerTopicsList: PropTypes.array,
	fullScreenControl: PropTypes.bool,
	locator: PropTypes.bool,
	photoLightBox: PropTypes.bool,
	dataLoader: PropTypes.func,
	getFeatureCollectionForData: PropTypes.func,
	featureStyler: PropTypes.func,
	featureHoverer: PropTypes.func,
	home: PropTypes.object,
	modalMenu: PropTypes.object,
	showModalApplicationMenu: PropTypes.func,
	featureKeySuffixCreator: PropTypes.func,
	featureCollectionKeyPostfix: PropTypes.string,
	applicationMenuTooltipString: PropTypes.string,
	applicationMenuIconname: PropTypes.string,
	cursor: PropTypes.string,
	onclick: PropTypes.func,
	locationChangedHandler: PropTypes.func,
	mappingBoundsChanged: PropTypes.func,
	clusterOptions: PropTypes.object,
	clusteringEnabled: PropTypes.bool,
	gazeteerHitTrigger: PropTypes.func,
	gazSearchMinLength: PropTypes.number,
	responsiveTrigger: PropTypes.func
};

TopicMap.defaultProps = {
	infoBox: <div />,
	secondaryInfoBoxElements: [],
	backgroundlayers: 'rvrWMS@30',
	noInitialLoadingText: false,
	initialLoadingText: 'Laden der Daten ...',
	gazetteerSearchBox: false,
	gazetteerTopicsList: [ 'pois', 'kitas', 'quartiere', 'bezirke', 'adressen' ],
	gazetteerSearchBoxPlaceholdertext: 'Geben Sie einen Suchbegriff ein.',
	fullScreenControl: false,
	locatorControl: false,
	photoLightBox: false,
	getFeatureCollectionForData: () => [],
	refreshFeatureCollection: () => {},
	getFeatureStyler: () => {},

	home: {
		center: [ 51.25861849982617, 7.15101022370511 ],
		zoom: 8
	},
	featureKeySuffixCreator: () => '',
	featureCollectionKeyPostfix: '',
	applicationMenuTooltipString: 'Einstellungen | Anleitung',
	applicationMenuIconname: 'bars',
	cursor: 'grabbing',
	onclick: () => {},
	locationChangedHandler: () => {},
	mappingBoundsChanged: () => {},
	clusteringEnabled: false,
	clusterOptions: {
		spiderfyOnMaxZoom: false,
		showCoverageOnHover: false,
		zoomToBoundsOnClick: false,
		maxClusterRadius: 40,
		disableClusteringAtZoom: 19,
		animate: false,
		cismapZoomTillSpiderfy: 12,
		selectionSpiderfyMinZoom: 12
	},
	gazeteerHitTrigger: () => {},
	responsiveTrigger: (smallState) => {}
};
