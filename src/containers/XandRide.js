import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { bindActionCreators } from 'redux';
import { actions as MappingActions } from '../redux/modules/mapping';
import { actions as UIStateActions } from '../redux/modules/uiState';
import { WMSTileLayer } from 'react-leaflet';
import uwz from '../components/prbr/UWZ';
import {
	actions as PRBRActions,
	getPRBRs,
	getPRBRFeatureCollection,
	getPRBRSvgSize,
	getPRBRFeatureCollectionSelectedIndex,
	hasMinifiedInfoBox,
	getPRBRFilter,
	getPRBRFilteredData,
	isSecondaryInfoBoxVisible,
	getPRBRFilterDescription
} from '../redux/modules/prbr';

import { routerActions as RoutingActions } from 'react-router-redux';
import {
	getFeatureStyler,
	featureHoverer,
	getPoiClusterIconCreatorFunction
} from '../utils/stadtplanHelper';
import { getColorForProperties } from '../utils/prbrHelper';
import PRBRInfo from '../components/prbr/Info';
import PRBRModalMenu from '../components/prbr/ModalMenu';
import TopicMap from '../containers/TopicMap';
import ProjSingleGeoJson from '../components/ProjSingleGeoJson';
import SecondaryInfoModal from '../components/prbr/SecondaryInfo';

function mapStateToProps(state) {
	return {
		uiState: state.uiState,
		mapping: state.mapping,
		routing: state.routing,
		prbr: state.prbr,
		gazetteerTopics: state.gazetteerTopics
	};
}

function mapDispatchToProps(dispatch) {
	return {
		mappingActions: bindActionCreators(MappingActions, dispatch),
		uiStateActions: bindActionCreators(UIStateActions, dispatch),
		routingActions: bindActionCreators(RoutingActions, dispatch),
		prbrActions: bindActionCreators(PRBRActions, dispatch)
	};
}

export class Container_ extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.gotoHome = this.gotoHome.bind(this);
		this.changeMarkerSymbolSize = this.changeMarkerSymbolSize.bind(this);
		this.props.mappingActions.setBoundingBoxChangedTrigger((bbox) =>
			this.props.prbrActions.refreshFeatureCollection(bbox)
		);
	}
	componentDidMount() {
		document.title = 'Park+Ride-Karte Wuppertal';
	}
	gotoHome() {
		if (this.topicMap) {
			this.topicMap.wrappedInstance.gotoHome();
		}
	}

	changeMarkerSymbolSize(size) {
		this.props.prbrActions.setPRBRSvgSize(size);
		this.props.mappingActions.setFeatureCollectionKeyPostfix('MarkerSvgSize:' + size);
	}
	render() {
		let secondaryInfo = false;

		let info = (
			<PRBRInfo
				key={'PRBRInfo.' + (getPRBRFeatureCollectionSelectedIndex(this.props.prbr) || 0)}
				pixelwidth={325}
				featureCollection={getPRBRFeatureCollection(this.props.prbr)}
				items={getPRBRFilteredData(this.props.prbr)}
				selectedIndex={getPRBRFeatureCollectionSelectedIndex(this.props.prbr) || 0}
				next={() => {
					this.props.prbrActions.setSelectedFeatureIndex(
						(getPRBRFeatureCollectionSelectedIndex(this.props.prbr) + 1) %
							getPRBRFeatureCollection(this.props.prbr).length
					);
				}}
				previous={() => {
					this.props.prbrActions.setSelectedFeatureIndex(
						(getPRBRFeatureCollectionSelectedIndex(this.props.prbr) +
							getPRBRFeatureCollection(this.props.prbr).length -
							1) %
							getPRBRFeatureCollection(this.props.prbr).length
					);
				}}
				fitAll={this.gotoHome}
				showModalMenu={(section) =>
					this.props.uiStateActions.showApplicationMenuAndActivateSection(true, section)}
				uiState={this.props.uiState}
				uiStateActions={this.props.uiStateActions}
				panelClick={(e) => {}}
				minified={hasMinifiedInfoBox(this.props.prbr)}
				minify={(minified) => this.props.prbrActions.setMinifiedInfoBox(minified)}
				setVisibleStateOfSecondaryInfo={this.props.prbrActions.setSecondaryInfoVisible}
			/>
		);
		let reduxBackground = undefined;
		let backgroundStyling = queryString.parse(this.props.routing.location.search).mapStyle;
		try {
			reduxBackground = this.props.mapping.backgrounds[this.props.mapping.selectedBackground]
				.layerkey;
		} catch (e) {}
		let selectedFeature;
		if (
			(getPRBRFeatureCollection(this.props.prbr) || []).length > 0 &&
			getPRBRFeatureCollectionSelectedIndex(this.props.prbr) !== undefined
		) {
			selectedFeature = getPRBRFeatureCollection(this.props.prbr)[
				getPRBRFeatureCollectionSelectedIndex(this.props.prbr) || 0
			];
		}

		let title = null;
		let filterDesc = '';
		let titleContent;
		let qTitle = queryString.parse(this.props.routing.location.search).title;
		if (qTitle !== undefined) {
			if (qTitle === null || qTitle === '') {
				filterDesc = getPRBRFilterDescription(this.props.prbr);
				titleContent = (
					<div>
						<b>Eingeschränkte Auswahl: </b> {filterDesc}
					</div>
				);
			} else {
				filterDesc = qTitle;
				titleContent = <div>{filterDesc}</div>;
			}

			let filteredDataLength = getPRBRFilteredData(this.props.prbr).length;
			let allDataLength = getPRBRs(this.props.prbr).length;

			if (
				filterDesc !== '' &&
				filteredDataLength > 0 &&
				!(filteredDataLength === allDataLength)
			) {
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

		return (
			<div>
				{title}
				{isSecondaryInfoBoxVisible(this.props.prbr) === true &&
				selectedFeature !== undefined && (
					<SecondaryInfoModal
						visible={isSecondaryInfoBoxVisible(this.props.prbr)}
						anlagenFeature={selectedFeature}
						setVisibleState={this.props.prbrActions.setSecondaryInfoVisible}
						uiHeight={this.props.uiState.height}
					/>
				)}
				<TopicMap
					ref={(comp) => {
						this.topicMap = comp;
					}}
					initialLoadingText='Laden der Anlagen ...'
					fullScreenControl
					locatorControl
					gazetteerSearchBox
					gazetteerTopicsList={[
						'prbr',
						'pois',
						'kitas',
						'quartiere',
						'bezirke',
						'adressen'
					]}
					gazetteerSearchBoxPlaceholdertext='P+R | B+R | Stadtteil | Adresse | POI'
					gazeteerHitTrigger={(selectedObject) => {
						if (
							selectedObject &&
							selectedObject[0] &&
							selectedObject[0].more &&
							selectedObject[0].more.id
						) {
							this.props.prbrActions.setSelectedPRBR(selectedObject[0].more.id);
						}
					}}
					photoLightBox
					infoBox={info}
					backgroundlayers={
						this.props.match.params.layers || reduxBackground || 'wupp-plan-live'
					}
					dataLoader={this.props.prbrActions.loadPRBRs}
					getFeatureCollectionForData={() => {
						return getPRBRFeatureCollection(this.props.prbr);
					}}
					featureStyler={getFeatureStyler(
						getPRBRSvgSize(this.props.prbr) || 60,
						getColorForProperties
					)}
					refreshFeatureCollection={this.props.prbrActions.refreshFeatureCollection}
					setSelectedFeatureIndex={this.props.prbrActions.setSelectedFeatureIndex}
					featureHoverer={featureHoverer}
					applicationMenuTooltipString='Filter | Einstellungen | Kompaktanleitung'
					modalMenu={
						<PRBRModalMenu
							uiState={this.props.uiState}
							uiStateActions={this.props.uiStateActions}
							urlPathname={this.props.routing.location.pathname}
							urlSearch={this.props.routing.location.search}
							pushNewRoute={this.props.routingActions.push}
							currentMarkerSize={getPRBRSvgSize(this.props.prbr)}
							changeMarkerSymbolSize={this.changeMarkerSymbolSize}
							topicMapRef={this.topicMap}
							setLayerByKey={this.props.mappingActions.setSelectedMappingBackground}
							activeLayerKey={this.props.mapping.selectedBackground}
							setFeatureCollectionKeyPostfix={
								this.props.mappingActions.setFeatureCollectionKeyPostfix
							}
							refreshFeatureCollection={
								this.props.prbrActions.refreshFeatureCollection
							}
							filter={getPRBRFilter(this.props.prbr)}
							setFilter={this.props.prbrActions.setFilter}
							filteredObjects={getPRBRFilteredData(this.props.prbr)}
							featureCollectionObjectsCount={
								getPRBRFeatureCollection(this.props.prbr).length
							}
						/>
					}
					clusteringEnabled={
						queryString.parse(this.props.routing.location.search).unclustered ===
						undefined
					}
					clusterOptions={{
						spiderfyOnMaxZoom: false,
						spiderfyDistanceMultiplier: getPRBRSvgSize(this.props.prbr) / 24,
						showCoverageOnHover: false,
						zoomToBoundsOnClick: false,
						maxClusterRadius: 40,
						disableClusteringAtZoom: 19,
						animate: false,
						cismapZoomTillSpiderfy: 12,
						selectionSpiderfyMinZoom: 12,
						iconCreateFunction: getPoiClusterIconCreatorFunction(
							getPRBRSvgSize(this.props.prbr) - 10,
							getColorForProperties
						)
					}}
					featureCollectionKeyPostfix={this.props.mapping.featureCollectionKeyPostfix}
				>
					<WMSTileLayer
						key={
							'UWZ.with.background' +
							(this.props.match.params.layers ||
								reduxBackground ||
								'wupp-plan-live') +
							backgroundStyling
						}
						url='https://maps.wuppertal.de/deegree/wms'
						layers={'uwz'}
						version='1.1.1'
						transparent='true'
						format='image/png'
						tiled='true'
						styles='default'
						maxZoom={19}
						opacity={0.5}
						caching={true}
					/>
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
