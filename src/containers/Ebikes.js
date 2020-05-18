import PropTypes from 'prop-types';
import queryString from 'query-string';
import React from 'react';
import { connect } from 'react-redux';
import { routerActions as RoutingActions } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import InfoBoxFotoPreview from '../components/commons/InfoBoxFotoPreview';
import EMOBInfo from '../components/emob/Info';
import EMOBModalMenu from '../components/emob/ModalMenu';
import SecondaryInfoModal from '../components/emob/SecondaryInfo';
import TopicMap from '../containers/TopicMap';
import {
	actions as EBikesActions,
	getEBikesFeatureCollection,
	getEBikesFeatureCollectionSelectedIndex,
	getEBikesFilter,
	getEBikesFilterDescription,
	getEBikesFilteredData,
	getEBikes,
	getEBikesSvgSize,
	hasMinifiedInfoBox,
	isSecondaryInfoBoxVisible
} from '../redux/modules/ebikes';
import { actions as MappingActions } from '../redux/modules/mapping';
import { actions as UIStateActions } from '../redux/modules/uiState';
import { getColorForProperties } from '../utils/ebikesHelper';
import {
	featureHoverer,
	getFeatureStyler,
	getPoiClusterIconCreatorFunction
} from '../utils/stadtplanHelper';
import { proj4crs25832def } from '../constants/gis';
import proj4 from 'proj4';

function mapStateToProps(state) {
	return {
		uiState: state.uiState,
		mapping: state.mapping,
		routing: state.routing,
		ebikes: state.ebikes,
		gazetteerTopics: state.gazetteerTopics
	};
}

function mapDispatchToProps(dispatch) {
	return {
		mappingActions: bindActionCreators(MappingActions, dispatch),
		uiStateActions: bindActionCreators(UIStateActions, dispatch),
		routingActions: bindActionCreators(RoutingActions, dispatch),
		ebikesActions: bindActionCreators(EBikesActions, dispatch)
	};
}

export class Container_ extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.gotoHome = this.gotoHome.bind(this);
		this.changeMarkerSymbolSize = this.changeMarkerSymbolSize.bind(this);
		this.props.mappingActions.setBoundingBoxChangedTrigger((bbox) =>
			this.props.ebikesActions.refreshFeatureCollection(bbox)
		);
	}
	componentDidMount() {
		document.title = 'E-Auto-Ladestationskarte Wuppertal';
	}
	gotoHome() {
		if (this.topicMap) {
			this.topicMap.wrappedInstance.gotoHome();
		}
	}

	changeMarkerSymbolSize(size) {
		this.props.ebikesActions.setEBikesSvgSize(size);
		this.props.mappingActions.setFeatureCollectionKeyPostfix('MarkerSvgSize:' + size);
	}

	render() {
		let info = (
			<EMOBInfo
				key={
					'EMOBInfo.' + (getEBikesFeatureCollectionSelectedIndex(this.props.ebikes) || 0)
				}
				pixelwidth={325}
				featureCollection={getEBikesFeatureCollection(this.props.ebikes)}
				items={getEBikesFilteredData(this.props.ebikes)}
				selectedIndex={getEBikesFeatureCollectionSelectedIndex(this.props.ebikes) || 0}
				next={() => {
					this.props.ebikesActions.setSelectedFeatureIndex(
						(getEBikesFeatureCollectionSelectedIndex(this.props.ebikes) + 1) %
							getEBikesFeatureCollection(this.props.ebikes).length
					);
				}}
				previous={() => {
					this.props.ebikesActions.setSelectedFeatureIndex(
						(getEBikesFeatureCollectionSelectedIndex(this.props.ebikes) +
							getEBikesFeatureCollection(this.props.ebikes).length -
							1) %
							getEBikesFeatureCollection(this.props.ebikes).length
					);
				}}
				fitAll={this.gotoHome}
				showModalMenu={(section) =>
					this.props.uiStateActions.showApplicationMenuAndActivateSection(true, section)}
				uiState={this.props.uiState}
				uiStateActions={this.props.uiStateActions}
				panelClick={(e) => {}}
				minified={hasMinifiedInfoBox(this.props.ebikes)}
				minify={(minified) => this.props.ebikesActions.setMinifiedInfoBox(minified)}
				setVisibleStateOfSecondaryInfo={this.props.ebikesActions.setSecondaryInfoVisible}
				zoomToFeature={(feature) => {
					if (this.topicMap !== undefined) {
						const pos = proj4(proj4crs25832def, proj4.defs('EPSG:4326'), [
							feature.geometry.coordinates[0],
							feature.geometry.coordinates[1]
						]);
						this.topicMap.wrappedInstance.leafletRoutedMap.leafletMap.leafletElement.setView(
							[ pos[1], pos[0] ],
							14
						);
					}
				}}
			/>
		);
		let reduxBackground = undefined;
		try {
			reduxBackground = this.props.mapping.backgrounds[this.props.mapping.selectedBackground]
				.layerkey;
		} catch (e) {}
		let selectedFeature;
		if (
			(getEBikesFeatureCollection(this.props.ebikes) || []).length > 0 &&
			getEBikesFeatureCollectionSelectedIndex(this.props.ebikes) !== undefined
		) {
			selectedFeature = getEBikesFeatureCollection(this.props.ebikes)[
				getEBikesFeatureCollectionSelectedIndex(this.props.ebikes) || 0
			];
		}

		let title = null;
		let filterDesc = '';
		let titleContent;
		let qTitle = queryString.parse(this.props.routing.location.search).title;
		if (qTitle !== undefined) {
			if (qTitle === null || qTitle === '') {
				filterDesc = getEBikesFilterDescription(this.props.ebikes);
				titleContent = (
					<div>
						<b>Meine Ladestationen: </b> {filterDesc}
					</div>
				);
			} else {
				filterDesc = qTitle;
				titleContent = <div>{filterDesc}</div>;
			}
			if (
				filterDesc !== '' &&
				getEBikesFilteredData(this.props.ebikes).length > 0 &&
				!(
					getEBikes(this.props.ebikes).length ===
					getEBikesFilteredData(this.props.ebikes).length
				)
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
				{isSecondaryInfoBoxVisible(this.props.ebikes) === true &&
				selectedFeature !== undefined && (
					<SecondaryInfoModal
						visible={isSecondaryInfoBoxVisible(this.props.ebikes)}
						feature={selectedFeature}
						setVisibleState={this.props.ebikesActions.setSecondaryInfoVisible}
						uiHeight={this.props.uiState.height}
					/>
				)}
				<TopicMap
					ref={(comp) => {
						this.topicMap = comp;
					}}
					initialLoadingText='Laden der Anlagen'
					fullScreenControl
					locatorControl
					gazetteerSearchBox
					gazetteerTopicsList={[
						'ebikes',
						'pois',
						'kitas',
						'quartiere',
						'bezirke',
						'adressen'
					]}
					gazetteerSearchBoxPlaceholdertext='Stationen | Stadtteil | Adresse | POI '
					gazeteerHitTrigger={(selectedObject) => {
						if (
							selectedObject &&
							selectedObject[0] &&
							selectedObject[0].more &&
							selectedObject[0].more.id
						) {
							this.props.ebikesActions.setSelectedEBike(selectedObject[0].more.id);
						}
					}}
					photoLightBox
					_off_infoBox={info}
					_off_secondaryInfoBoxElements={[
						<InfoBoxFotoPreview
							currentFeature={selectedFeature}
							getPhotoUrl={(feature) => {
								if ((feature || { properties: {} }).properties.foto !== undefined) {
									return (
										'https://www.wuppertal.de/geoportal/emobil/autos/fotos/' +
										feature.properties.foto
									);
								} else {
									return undefined;
								}
							}}
							uiStateActions={this.props.uiStateActions}
						/>
					]}
					backgroundlayers={
						this.props.match.params.layers || reduxBackground || 'wupp-plan-live'
					}
					dataLoader={this.props.ebikesActions.loadEBikes}
					getFeatureCollectionForData={() => {
						return getEBikesFeatureCollection(this.props.ebikes);
					}}
					featureStyler={getFeatureStyler(
						getEBikesSvgSize(this.props.ebikes) || 60,
						getColorForProperties
					)}
					refreshFeatureCollection={this.props.ebikesActions.refreshFeatureCollection}
					setSelectedFeatureIndex={this.props.ebikesActions.setSelectedFeatureIndex}
					featureHoverer={featureHoverer}
					applicationMenuTooltipString='Filter | Einstellungen | Kompaktanleitung'
					modalMenu={
						<EMOBModalMenu
							uiState={this.props.uiState}
							uiStateActions={this.props.uiStateActions}
							urlPathname={this.props.routing.location.pathname}
							urlSearch={this.props.routing.location.search}
							pushNewRoute={this.props.routingActions.push}
							currentMarkerSize={getEBikesSvgSize(this.props.ebikes)}
							changeMarkerSymbolSize={this.changeMarkerSymbolSize}
							topicMapRef={this.topicMap}
							setLayerByKey={this.props.mappingActions.setSelectedMappingBackground}
							activeLayerKey={this.props.mapping.selectedBackground}
							setFeatureCollectionKeyPostfix={
								this.props.mappingActions.setFeatureCollectionKeyPostfix
							}
							refreshFeatureCollection={
								this.props.ebikesActions.refreshFeatureCollection
							}
							filter={getEBikesFilter(this.props.ebikes)}
							setFilter={this.props.ebikesActions.setFilter}
							filteredObjects={getEBikesFilteredData(this.props.ebikes)}
							featureCollectionObjectsCount={
								getEBikesFeatureCollection(this.props.ebikes).length
							}
						/>
					}
					clusteringEnabled={
						queryString.parse(this.props.routing.location.search).unclustered ===
						undefined
					}
					clusterOptions={{
						spiderfyOnMaxZoom: false,
						spiderfyDistanceMultiplier: getEBikesSvgSize(this.props.ebikes) / 24,
						showCoverageOnHover: false,
						zoomToBoundsOnClick: false,
						maxClusterRadius: 40,
						disableClusteringAtZoom: 19,
						animate: false,
						cismapZoomTillSpiderfy: 12,
						selectionSpiderfyMinZoom: 12,
						iconCreateFunction: getPoiClusterIconCreatorFunction(
							getEBikesSvgSize(this.props.ebikes) - 10,
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
