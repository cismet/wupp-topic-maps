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
	actions as EMOBActions,
	getEMOBFeatureCollection,
	getEMOBFeatureCollectionSelectedIndex,
	getEMOBFilter,
	getEMOBFilterDescription,
	getEMOBFilteredData,
	getEMOBs,
	getEMOBSvgSize,
	hasMinifiedInfoBox,
	isSecondaryInfoBoxVisible
} from '../redux/modules/emob';
import { actions as MappingActions } from '../redux/modules/mapping';
import { actions as UIStateActions } from '../redux/modules/uiState';
import { getColorForProperties } from '../utils/emobHelper';
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
		document.title = 'E-Auto-Ladestationskarte Wuppertal';
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
			(getEMOBFeatureCollection(this.props.emob) || []).length > 0 &&
			getEMOBFeatureCollectionSelectedIndex(this.props.emob) !== undefined
		) {
			selectedFeature = getEMOBFeatureCollection(this.props.emob)[
				getEMOBFeatureCollectionSelectedIndex(this.props.emob) || 0
			];
		}

		let title = null;
		let filterDesc = '';
		let titleContent;
		let qTitle = queryString.parse(this.props.routing.location.search).title;
		if (qTitle !== undefined) {
			if (qTitle === null || qTitle === '') {
				filterDesc = getEMOBFilterDescription(this.props.emob);
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
				getEMOBFilteredData(this.props.emob).length > 0 &&
				!(getEMOBs(this.props.emob).length === getEMOBFilteredData(this.props.emob).length)
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
				{isSecondaryInfoBoxVisible(this.props.emob) === true &&
				selectedFeature !== undefined && (
					<SecondaryInfoModal
						visible={isSecondaryInfoBoxVisible(this.props.emob)}
						feature={selectedFeature}
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
					gazetteerSearchBoxPlaceholdertext='Ladestation | Stadtteil | Adresse | POI '
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
					secondaryInfoBoxElements={[
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
					applicationMenuTooltipString='Filter | Einstellungen | Kompaktanleitung'
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
