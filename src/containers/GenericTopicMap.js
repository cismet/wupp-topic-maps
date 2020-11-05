import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { routerActions as RoutingActions } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import BaederInfo from '../components/baeder/BaederInfo';
import BaederModalMenu from '../components/baeder/BaederModalMenu';
import InfoBoxFotoPreview from '../components/commons/InfoBoxFotoPreview';
import TopicMap from './TopicMap';
import { getActionLinksForFeature, faqEntriesFactory } from 'utils/uiHelper';
import { proj4crs25832def } from '../constants/gis';
import proj4 from 'proj4';
import {
	actions as BaederActions,
	getBadSvgSize,
	getBaeder,
	getBaederFeatureCollection,
	getBaederFeatureCollectionSelectedIndex,
	hasMinifiedInfoBox
} from '../redux/modules/baeder';
import { actions as MappingActions } from '../redux/modules/mapping';
import { actions as UIStateActions } from '../redux/modules/uiState';
import {
	actions as GenericsActions,
	getGenericsFeatureCollection,
	getGenericsFeatureCollectionSelectedIndex,
	getGenericItemSvgSize
} from '../redux/modules/generics';

import { fotoKraemerCaptionFactory, fotoKraemerUrlManipulation } from '../utils/commonHelpers';
import { featureHoverer, getFeatureStyler } from '../utils/stadtplanHelper';
import Icon from 'components/commons/Icon';
import { Well } from 'react-bootstrap';
import GenericModalApplicationMenu from '../components/commons/GenericModalApplicationMenu';
import GenericMenuHelpSection from '../components/generic/GenericMenuHelpSection';
import GenericMenuIntroduction from '../components/generic/GenericMenuIntroduction';
import InfoBox from '../components/commons/InfoBox';
// import { config as configX, createConfigJSON } from 'components/generic/Config';
import SecondaryInfoModal from 'components/generic/SecondaryInfo';
import GenericMenuSettingsPanel from 'components/generic/GenericMenuSettingsPanel';
import GenericHelpTextForMyLocation from 'components/commons/GenericHelpTextForMyLocation';
import LicenseLuftbildkarte from 'components/commons/LicenseLuftbildkarte';
import LicenseStadtplanTagNacht from 'components/commons/LicenseStadtplanTagNacht';
import ConfigurableDocBlocks from 'components/generic/ConfigurableDocBlocks';
import { getSymbolSVGGetter, getClusterIconCreatorFunction } from '../utils/uiHelper';
import { getSimpleHelpForGenericTM } from '../utils/genericTopicMapHelper';
import slugify from 'slugify';
//------

async function getConfig(slugName, configType, server, path, noCache) {
	try {
		let options;
		if (noCache === 'true') {
			options = { cache: 'no-cache' };
		} else {
			options = {};
		}
		const u = server + path + slugName + '/' + configType + '.json';
		console.log('try to read rconfig at ', u);
		const result = await fetch(u, options);
		const resultObject = await result.json();
		console.log('config: loaded ' + slugName + '/' + configType);
		return resultObject;
	} catch (ex) {
		console.log('error for rconfig', ex);
	}
}
async function getMarkdown(slugName, configType, server, path, noCache) {
	try {
		let options;
		if (noCache === 'true') {
			options = { cache: 'no-cache' };
		} else {
			options = {};
		}
		const u = server + path + slugName + '/' + configType + '.md';
		console.log('xxx try to read rconfig at ', u);
		const result = await fetch(u, options);
		const resultObject = await result.text();
		console.log('config: loaded ' + slugName + '/' + configType);
		return resultObject;
	} catch (ex) {
		console.log('error for rconfig', ex);
	}
}

async function initialize({
	slugName,
	setConfig,
	setFeatureCollection,
	path = '/dev/',
	server = 'https://raw.githubusercontent.com/cismet/wupp-generic-topic-map-config',
	noCache
}) {
	const config = await getConfig(slugName, 'config', server, path);

	const featureDefaultProperties = await getConfig(
		slugName,
		'featureDefaultProperties',
		server,
		path
	);
	const featureDefaults = await getConfig(slugName, 'featureDefaults', server, path, noCache);
	const helpTextBlocks = await getConfig(slugName, 'helpTextBlocks', server, path, noCache);
	const simpleHelpMd = await await getMarkdown(slugName, 'simpleHelp', server, path, noCache);
	const simpleHelp = await await getConfig(slugName, 'simpleHelp', server, path, noCache);
	const infoBoxConfig = await getConfig(slugName, 'infoBoxConfig', server, path, noCache);
	const features = await getConfig(slugName, 'features', server, path, noCache);

	if (helpTextBlocks !== undefined) {
		config.helpTextblocks = helpTextBlocks;
	} else if (simpleHelpMd !== undefined) {
		const simpleHelpObject = { type: 'MARKDOWN', content: simpleHelpMd };
		config.helpTextblocks = getSimpleHelpForGenericTM(document.title, simpleHelpObject);
	} else {
		config.helpTextblocks = getSimpleHelpForGenericTM(document.title, simpleHelp);
	}
	if (features !== undefined) {
		config.features = features;
	}

	if (infoBoxConfig !== undefined) {
		config.info = infoBoxConfig;
	}

	const fc = [];
	let i = 0;
	for (const f of config.features) {
		const ef = { ...featureDefaults, ...f };
		ef.id = i;
		ef.index = i;
		i++;
		ef.properties = { ...featureDefaultProperties, ...ef.properties };
		fc.push(ef);
	}
	config.features = fc;

	setConfig(config);
	setFeatureCollection(fc);
}

function mapStateToProps(state) {
	return {
		uiState: state.uiState,
		mapping: state.mapping,
		routing: state.routing,
		gazetteerTopics: state.gazetteerTopics,
		generics: state.generics
	};
}

function mapDispatchToProps(dispatch) {
	return {
		mappingActions: bindActionCreators(MappingActions, dispatch),
		uiStateActions: bindActionCreators(UIStateActions, dispatch),
		routingActions: bindActionCreators(RoutingActions, dispatch),
		genericsActions: bindActionCreators(GenericsActions, dispatch)
	};
}
export const getColorForProperties = (props = { color: '#dddddd' }) => {
	return props.color;
};

export class GenericTopicMap_ extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.zoomToFeature = this.zoomToFeature.bind(this);
		this.state = {
			secondaryInfoVisible: false,
			currentMarkerSize: 30,
			initialized: undefined,
			config: undefined
		};
		this.gotoHome = this.gotoHome.bind(this);

		// this.gotoHome = this.gotoHome.bind(this);
		// this.changeMarkerSymbolSize = this.changeMarkerSymbolSize.bind(this);
		// this.props.mappingActions.setBoundingBoxChangedTrigger((bbox) =>
		// 	this.props.baederActions.refreshFeatureCollection(bbox)
		// );
		this.props.mappingActions.setBoundingBoxChangedTrigger((bbox) =>
			this.props.genericsActions.refreshFeatureCollection(bbox)
		);
	}
	componentDidMount() {
		this.props.mappingActions.setFeatureCollection([]);
	}
	gotoHome() {
		if (this.topicMap) {
			this.topicMap.wrappedInstance.gotoHome();
		}
	}
	componentDidUpdate() {
		if (this.props.match.params.name !== undefined) {
			document.title = this.props.match.params.name.replace(/_/g, ' ');
			if (this.state.initialized === undefined) {
				const slugName = slugify(this.props.match.params.name).toLowerCase();
				console.log('not initialized. will initialize: ' + slugName);
				this.setState({ initialized: slugName });
				const setConfig = (config) => this.setState({ config });
				const usp = new URLSearchParams(this.props.routing.location.search);
				initialize({
					slugName,
					setConfig,
					setFeatureCollection: (fc) => {
						this.props.genericsActions.setFeatureCollectionDataSource(fc);
						this.props.genericsActions.createFeatureCollection();
					},

					server: usp.get('genericConfigServer') || undefined,
					path: usp.get('genericConfigPath') || undefined,
					noCache: usp.get('noCache') || 'false'
				});
			} else {
			}
		} else {
			document.title = 'Meine Karte';
		}
	}
	zoomToFeature(feature) {
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
	}

	render() {
		if (this.state.config === undefined) {
			return <div />;
		}

		const featureCollection = getGenericsFeatureCollection(this.props.generics);
		let currentFeature, info;
		let previewFeatureCollection = [];

		if (featureCollection !== undefined) {
			let previewCount = -1;
			try {
				previewCount = this.state.config.tm.previewFeatureCollectionCount || -1;
			} catch (e) {}

			if (previewCount === -1) {
				previewFeatureCollection = this.state.config.features;
			} else {
				previewFeatureCollection = this.state.config.features.slice(0, previewCount);
			}

			const selectedIndex = getGenericsFeatureCollectionSelectedIndex(this.props.generics);
			currentFeature = featureCollection[selectedIndex];
			let links = [];
			let header, title, subtitle, additionalInfo;
			if (currentFeature !== undefined) {
				links = getActionLinksForFeature(currentFeature, {
					entityClassName: this.state.config.info.navigator.noun.singular,
					displayZoomToFeature: true,
					zoomToFeature: this.zoomToFeature,
					displaySecondaryInfoAction:
						this.state.config.info.displaySecondaryInfoAction === true ||
						this.state.config.info.displaySecondaryInfoAction === undefined,
					setVisibleStateOfSecondaryInfo: (vis) =>
						this.setState({ secondaryInfoVisible: vis })
				});
				header = (
					<span>
						{currentFeature.properties.info.header || this.state.config.info.header}
					</span>
				);
				title = currentFeature.properties.info.title;
				subtitle = currentFeature.properties.info.subtitle;
				additionalInfo = currentFeature.properties.info.additionalInfo;
			}
			const headerColor = getColorForProperties((currentFeature || {}).properties);

			const items = this.state.config.features;
			const minified = undefined;
			const minify = undefined;
			const fitAll = this.gotoHome;
			info = (
				<InfoBox
					isCollapsible={currentFeature !== undefined}
					featureCollection={featureCollection}
					items={items}
					selectedIndex={selectedIndex}
					showModalMenu={() => {}}
					uiState={this.props.uiState}
					uiStateActions={this.props.uiStateActions}
					panelClick={() => {}}
					colorize={getColorForProperties}
					pixelwidth={this.state.config.info.pixelwidth}
					header={header}
					headerColor={headerColor}
					links={links}
					title={title}
					subtitle={subtitle}
					additionalInfo={additionalInfo}
					zoomToAllLabel={`${items.length} ${items.length === 1
						? this.state.config.info.navigator.noun.singular
						: this.state.config.info.navigator.noun.plural} in ${this.state.config
						.city}`}
					currentlyShownCountLabel={`${featureCollection.length} ${featureCollection.length ===
					1
						? this.state.config.info.navigator.noun.singular
						: this.state.config.info.navigator.noun.plural} angezeigt`}
					collapsedInfoBox={minified}
					setCollapsedInfoBox={minify}
					noCurrentFeatureTitle={<h5>{this.state.config.info.noFeatureTitle}</h5>}
					noCurrentFeatureContent={
						<div style={{ marginRight: 9 }}>
							{(this.state.config.info.noCurrentFeatureContent === undefined ||
								this.state.config.info.noCurrentFeatureContent === '') && (
								<p>
									Für mehr {this.state.config.info.navigator.noun.plural} Ansicht
									mit <Icon name='minus-square' /> verkleinern oder mit dem
									untenstehenden Link alle{' '}
									{this.state.config.info.navigator.noun.plural} anzeigen.
								</p>
							)}
							{this.state.config.info.noCurrentFeatureContent !== undefined &&
							this.state.config.info.noCurrentFeatureContent !== '' && (
								<p>{this.state.config.info.noCurrentFeatureContent}</p>
							)}

							<div align='center'>
								<a onClick={fitAll}>
									{items.length}{' '}
									{items.length === 1 ? (
										this.state.config.info.navigator.noun.singular
									) : (
										this.state.config.info.navigator.noun.plural
									)}{' '}
									in {this.state.config.city}
								</a>
							</div>
						</div>
					}
					next={() => {
						this.props.genericsActions.setSelectedFeatureIndex(
							(getGenericsFeatureCollectionSelectedIndex(this.props.generics) + 1) %
								getGenericsFeatureCollection(this.props.generics).length
						);
					}}
					previous={() => {
						this.props.genericsActions.setSelectedFeatureIndex(
							(getGenericsFeatureCollectionSelectedIndex(this.props.generics) +
								getGenericsFeatureCollection(this.props.generics).length -
								1) %
								getGenericsFeatureCollection(this.props.generics).length
						);
					}}
					hideNavigator={this.state.config.features.length <= 1}
					fitAll={fitAll}
				/>
			);

			const showOnSeperatePage = false;

			this.state.config.tm.clusterOptions.iconCreateFunction = getClusterIconCreatorFunction(
				getGenericItemSvgSize(this.props.generics),
				getColorForProperties
			);
			if (this.state.config.tm.clusteringEnabled === true) {
			}
		}

		const compactHelpTextConfiguration = this.state.config.helpTextblocks;

		let choosenBackground = (this.state.config.tm.fallbackBackgroundlayers =
			'wupp-plan-live@90');
		if (this.props.mapping.selectedBackground !== undefined) {
			choosenBackground = this.props.mapping.backgrounds[
				this.props.mapping.selectedBackground
			];
		}

		return (
			<div>
				{this.state.secondaryInfoVisible === true &&
				currentFeature !== undefined && (
					<SecondaryInfoModal
						visible={this.state.secondaryInfoVisible}
						feature={currentFeature}
						setVisibleState={(vis) => this.setState({ secondaryInfoVisible: vis })}
						uiHeight={this.props.uiState.height}
					/>
				)}
				<TopicMap
					ref={(comp) => {
						this.topicMap = comp;
					}}
					{...this.state.config.tm}
					backgroundlayers={choosenBackground.layerkey}
					infoBox={info}
					dataLoader={(finishedHandler) => {
						this.props.genericsActions.setFeatureCollectionDataSource(
							this.state.config.features
						);
						this.props.genericsActions.createFeatureCollection();
						finishedHandler();
					}}
					getFeatureCollectionForData={() => {
						return getGenericsFeatureCollection(this.props.generics);
					}}
					refreshFeatureCollection={this.props.genericsActions.refreshFeatureCollection}
					setSelectedFeatureIndex={this.props.genericsActions.setSelectedFeatureIndex}
					featureStyler={getFeatureStyler(
						this.state.currentMarkerSize,
						getColorForProperties
					)}
					featureKeySuffixCreator={() => {
						return '.' + this.state.currentMarkerSize;
					}}
					secondaryInfoBoxElements={[
						<InfoBoxFotoPreview
							currentFeature={currentFeature}
							getPhotoUrl={(feature) => {
								if (
									(feature || { properties: {} }).properties.fotos !== undefined
								) {
									return feature.properties.foto;
								} else if (
									(feature || { properties: {} }).properties.foto !== undefined
								) {
									return feature.properties.foto;
								} else {
									return undefined;
								}
							}}
							getPhotoSeriesUrl={(feature) => {
								console.log('feature', feature);

								if (
									(feature || { properties: {} }).properties.fotos !== undefined
								) {
									return feature.properties.foto;
								} else {
									return undefined;
								}
							}}
							uiStateActions={this.props.uiStateActions}
						/>
					]}
					modalMenu={
						<GenericModalApplicationMenu
							uiState={this.props.uiState}
							uiStateActions={this.props.uiStateActions}
							menuIntroduction={
								<GenericMenuIntroduction
									uiStateActions={this.props.uiStateActions}
									markdown={`Über **Einstellungen** können Sie die Darstellung der
									 Hintergrundkarte und der Wasserstofftankstellen an Ihre 
									 Vorlieben anpassen. Wählen Sie **Kompaktanleitung** 
									 für detailliertere Bedienungsinformationen.`}
								/>
							}
							menuSections={[
								<GenericMenuSettingsPanel
									key={'GenericMenuSettingsPanel' + previewFeatureCollection}
									uiState={this.props.uiState}
									uiStateActions={this.props.uiStateActions}
									width={this.props.uiState.width}
									urlPathname={this.props.routing.location.pathname}
									urlSearch={this.props.routing.location.search}
									pushNewRoute={this.props.routingActions.push}
									changeMarkerSymbolSize={(size) => {
										this.setState({ currentMarkerSize: size });
									}}
									previewFeatureCollection={previewFeatureCollection}
									previewMapPosition={this.state.config.tm.previewMapPosition}
									currentMarkerSize={this.state.currentMarkerSize}
									topicMapRef={this.topicMap}
									setLayerByKey={
										this.props.mappingActions.setSelectedMappingBackground
									}
									activeLayerKey={this.props.mapping.selectedBackground}
									getSymbolSVG={getSymbolSVGGetter(
										this.state.config.features[0].properties.svgBadge,
										this.state.config.features[0].properties.svgBadgeDimension
									)}
								/>,
								<GenericMenuHelpSection
									key='DemoMenuHelpSection'
									uiState={this.props.uiState}
									uiStateActions={this.props.uiStateActions}
									markdown={`Über **Einstellungen** können Sie die Darstellung der
									Hintergrundkarte und der Wasserstofftankstellen an Ihre 
									Vorlieben anpassen. Wählen Sie **Kompaktanleitung** 
									für detailliertere Bedienungsinformationen.`}
									content={
										<ConfigurableDocBlocks
											configs={compactHelpTextConfiguration}
										/>
									}
								/>
							]}
						/>
					}
					// featureCollection={this.state.config.features}
					featureHoverer={(feature) => {
						return (
							'<div>' + (feature.properties.hoverString || feature.text) + '</div>'
						);
					}}
				/>
			</div>
		);
	}
}

const GenericTopicMap = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(
	GenericTopicMap_
);

export default GenericTopicMap;

GenericTopicMap.propTypes = {
	ui: PropTypes.object,
	uiState: PropTypes.object
};
