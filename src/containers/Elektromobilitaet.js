import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { bindActionCreators } from 'redux';
import { actions as MappingActions } from '../redux/modules/mapping';
import { actions as UIStateActions } from '../redux/modules/uiState';
import { WMSTileLayer } from 'react-leaflet';
import {
	actions as EMOBActions,
	getEMOBs,
	getEMOBFeatureCollection,
	getEMOBSvgSize,
	getEMOBFeatureCollectionSelectedIndex,
	hasMinifiedInfoBox,
	getEMOBFilter,
	getEMOBFilteredData,
	isSecondaryInfoBoxVisible
} from '../redux/modules/emob';

import { routerActions as RoutingActions } from 'react-router-redux';
import {
	getFeatureStyler,
	featureHoverer,
	getPoiClusterIconCreatorFunction
} from '../utils/stadtplanHelper';
import { getColorForProperties } from '../utils/emobHelper';
import EMOBInfo from '../components/emob/Info';
import EMOBModalMenu from '../components/emob/ModalMenu';
import TopicMap from '../containers/TopicMap';
import ProjSingleGeoJson from '../components/ProjSingleGeoJson';
import SecondaryInfoModal from '../components/emob/SecondaryInfo';

function mapStateToProps(state) {
	return {
		uiState: state.uiState,
		mapping: state.mapping,
		routing: state.routing,
		emob: state.emob,
		gazetteerTopics: state.gazetteerTopics
	};
}

function mapDispatchToProps(dispatch) {
	return {
		mappingActions: bindActionCreators(MappingActions, dispatch),
		uiStateActions: bindActionCreators(UIStateActions, dispatch),
		routingActions: bindActionCreators(RoutingActions, dispatch),
		emobActions: bindActionCreators(EMOBActions, dispatch)
	};
}

export class Container_ extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.gotoHome = this.gotoHome.bind(this);
		this.changeMarkerSymbolSize = this.changeMarkerSymbolSize.bind(this);
		this.props.mappingActions.setBoundingBoxChangedTrigger((bbox) =>
			this.props.emobActions.refreshFeatureCollection(bbox)
		);
	}
	componentDidMount() {
		document.title = 'Elektromobilität in Wuppertal';
	}
	gotoHome() {
		if (this.topicMap) {
			this.topicMap.wrappedInstance.gotoHome();
		}
	}

	changeMarkerSymbolSize(size) {
		this.props.emobActions.setEMOBSvgSize(size);
		this.props.mappingActions.setFeatureCollectionKeyPostfix('MarkerSvgSize:' + size);
	}
	render() {
		let secondaryInfo = false;

		let info = (
			<EMOBInfo
				key={'EMOBInfo.' + (getEMOBFeatureCollectionSelectedIndex(this.props.emob) || 0)}
				pixelwidth={325}
				featureCollection={getEMOBFeatureCollection(this.props.emob)}
				items={getEMOBFilteredData(this.props.emob)}
				selectedIndex={getEMOBFeatureCollectionSelectedIndex(this.props.emob) || 0}
				next={() => {
					this.props.emobActions.setSelectedFeatureIndex(
						(getEMOBFeatureCollectionSelectedIndex(this.props.emob) + 1) %
							getEMOBFeatureCollection(this.props.emob).length
					);
				}}
				previous={() => {
					this.props.emobActions.setSelectedFeatureIndex(
						(getEMOBFeatureCollectionSelectedIndex(this.props.emob) +
							getEMOBFeatureCollection(this.props.emob).length -
							1) %
							getEMOBFeatureCollection(this.props.emob).length
					);
				}}
				fitAll={this.gotoHome}
				showModalMenu={(section) =>
					this.props.uiStateActions.showApplicationMenuAndActivateSection(true, section)}
				uiState={this.props.uiState}
				uiStateActions={this.props.uiStateActions}
				panelClick={(e) => {}}
				minified={hasMinifiedInfoBox(this.props.emob)}
				minify={(minified) => this.props.emobActions.setMinifiedInfoBox(minified)}
				setVisibleStateOfSecondaryInfo={this.props.emobActions.setSecondaryInfoVisible}
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
			(getEMOBFeatureCollection(this.props.emob) || []).length > 0 &&
			getEMOBFeatureCollectionSelectedIndex(this.props.emob) !== undefined
		) {
			selectedFeature = getEMOBFeatureCollection(this.props.emob)[
				getEMOBFeatureCollectionSelectedIndex(this.props.emob) || 0
			];
		}
		return (
			<div>
				{isSecondaryInfoBoxVisible(this.props.emob) === true &&
				selectedFeature !== undefined && (
					<SecondaryInfoModal
						visible={isSecondaryInfoBoxVisible(this.props.emob)}
						anlagenFeature={selectedFeature}
						setVisibleState={this.props.emobActions.setSecondaryInfoVisible}
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
						'emob',
						'pois',
						'kitas',
						'quartiere',
						'bezirke',
						'adressen'
					]}
					gazetteerSearchBoxPlaceholdertext='E-Tankstellen | Stadtteil | Adresse | POI '
					gazeteerHitTrigger={(selectedObject) => {
						if (
							selectedObject &&
							selectedObject[0] &&
							selectedObject[0].more &&
							selectedObject[0].more.id
						) {
							this.props.emobActions.setSelectedEMOB(selectedObject[0].more.id);
						}
					}}
					photoLightBox
					infoBox={info}
					backgroundlayers={
						this.props.match.params.layers || reduxBackground || 'wupp-plan-live'
					}
					dataLoader={this.props.emobActions.loadEMOBs}
					getFeatureCollectionForData={() => {
						return getEMOBFeatureCollection(this.props.emob);
					}}
					featureStyler={getFeatureStyler(
						getEMOBSvgSize(this.props.emob) || 60,
						getColorForProperties
					)}
					refreshFeatureCollection={this.props.emobActions.refreshFeatureCollection}
					setSelectedFeatureIndex={this.props.emobActions.setSelectedFeatureIndex}
					featureHoverer={featureHoverer}
					applicationMenuTooltipString='Einstellungen | Kompaktanleitung'
					modalMenu={
						<EMOBModalMenu
							uiState={this.props.uiState}
							uiStateActions={this.props.uiStateActions}
							urlPathname={this.props.routing.location.pathname}
							urlSearch={this.props.routing.location.search}
							pushNewRoute={this.props.routingActions.push}
							currentMarkerSize={getEMOBSvgSize(this.props.emob)}
							changeMarkerSymbolSize={this.changeMarkerSymbolSize}
							topicMapRef={this.topicMap}
							setLayerByKey={this.props.mappingActions.setSelectedMappingBackground}
							activeLayerKey={this.props.mapping.selectedBackground}
							setFeatureCollectionKeyPostfix={
								this.props.mappingActions.setFeatureCollectionKeyPostfix
							}
							refreshFeatureCollection={
								this.props.emobActions.refreshFeatureCollection
							}
							filter={getEMOBFilter(this.props.emob)}
							setFilter={this.props.emobActions.setFilter}
							filteredObjects={getEMOBFilteredData(this.props.emob)}
							featureCollectionObjectsCount={
								getEMOBFeatureCollection(this.props.emob).length
							}
						/>
					}
					clusteringEnabled={
						queryString.parse(this.props.routing.location.search).unclustered ===
						undefined
					}
					clusterOptions={{
						spiderfyOnMaxZoom: false,
						spiderfyDistanceMultiplier: getEMOBSvgSize(this.props.emob) / 24,
						showCoverageOnHover: false,
						zoomToBoundsOnClick: false,
						maxClusterRadius: 40,
						disableClusteringAtZoom: 19,
						animate: false,
						cismapZoomTillSpiderfy: 12,
						selectionSpiderfyMinZoom: 12,
						iconCreateFunction: getPoiClusterIconCreatorFunction(
							getEMOBSvgSize(this.props.emob) - 10,
							getColorForProperties
						)
					}}
					featureCollectionKeyPostfix={this.props.mapping.featureCollectionKeyPostfix}
				/>
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
