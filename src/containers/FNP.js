import { faRandom } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import proj4 from 'proj4';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import React from 'react';
import { FeatureCollectionDisplayWithTooltipLabels } from 'react-cismap';
import { WMSTileLayer, ScaleControl } from 'react-leaflet';
import { connect } from 'react-redux';
import { routerActions as RoutingActions } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import EmptyAEVInfo from '../components/fnp/EmptytAEVInfo';
import AEVInfo from '../components/fnp/AEVInfo';
import HNInfo from '../components/fnp/HNInfo';
import HN9999Info from '../components/fnp/HN9999Info';
import EmptyHNInfo from '../components/fnp/EmptytHNInfo';
import ShowAEVModeButton from '../components/fnp/ShowAEVModeButton';
import { proj4crs25832def } from '../constants/gis';
import TopicMap from '../containers/TopicMap';
import { actions as AEVActions, getAEVFeatures } from '../redux/modules/fnp_aenderungsverfahren';
import { actions as HNActions } from '../redux/modules/fnp_hauptnutzungen';
import { actions as MappingActions } from '../redux/modules/mapping';
import { actions as UIStateActions } from '../redux/modules/uiState';
import { actions as PlanoffenlegungsActions } from '../redux/modules/planoffenlegungen';

import { aevFeatureStyler, aevLabeler, hnFeatureStyler, hnLabeler } from '../utils/fnpHelper';
import { removeQueryPart } from '../utils/routingHelper';
import FNPModalHelp from 'components/fnp/help/Help00MainComponent';
import ContactButton from '../components/commons/ContactButton';

let reduxBackground = undefined;

const switchIcon = faRandom;
const searchMinZoom = 7;
function mapStateToProps(state) {
	return {
		uiState: state.uiState,
		mapping: state.mapping,
		routing: state.routing,
		aev: state.fnpAenderungsverfahren,
		hn: state.fnpHauptnutzungen,
		gazetteerTopics: state.gazetteerTopics,
		planoffenlegungen: state.planoffenlegungen
	};
}

function mapDispatchToProps(dispatch) {
	return {
		mappingActions: bindActionCreators(MappingActions, dispatch),
		uiStateActions: bindActionCreators(UIStateActions, dispatch),
		routingActions: bindActionCreators(RoutingActions, dispatch),
		aevActions: bindActionCreators(AEVActions, dispatch),
		hnActions: bindActionCreators(HNActions, dispatch),
		planoffenlegungsActions: bindActionCreators(PlanoffenlegungsActions, dispatch)
	};
}

export class Container_ extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.gotoHome = this.gotoHome.bind(this);
		this.aevGazeteerHit = this.aevGazeteerHit.bind(this);
		this.aevSearchButtonHit = this.aevSearchButtonHit.bind(this);
		this.featureClick = this.featureClick.bind(this);
		this.doubleMapClick = this.doubleMapClick.bind(this);
		this.selectNextIndex = this.selectNextIndex.bind(this);
		this.selectPreviousIndex = this.selectPreviousIndex.bind(this);
		this.getNeededUrlParams = this.getNeededUrlParams.bind(this);
		this.fitAll = this.fitAll.bind(this);
		this.setAevVisible = this.setAevVisible.bind(this);
		this.changeMarkerSymbolSize = this.changeMarkerSymbolSize.bind(this);
		this.isRechtsplan = this.isRechtsplan.bind(this);
		this.isArbeitskarte = this.isArbeitskarte.bind(this);

		// this.props.mappingActions.setBoundingBoxChangedTrigger((bbox) =>
		// 	this.props.aevActions.refreshFeatureCollection(bbox)
		// );
		this.props.mappingActions.setBoundingBoxChangedTrigger((bbox) =>
			console.log('CHANGE BB', bbox)
		);

		this.state = {
			smallState: undefined,
			mode: undefined
		};
	}
	componentDidMount() {
		document.title = 'FNP-Inspektor Wuppertal';
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

	aevGazeteerHit(selectedObject) {
		if (this.state.mode === 'rechtsplan') {
			this.props.aevActions.searchForAEVs({
				gazObject: selectedObject,
				mappingActions: this.props.mappingActions,
				done: (o) => {
					if (o && o.length > 0) {
						this.setAevVisible(true);
					}
				}
			});
		} else {
			this.props.hnActions.searchForHauptnutzungen({
				point: { x: selectedObject[0].x, y: selectedObject[0].y },
				mappingActions: this.props.mappingActions,
				skipMappingActions: true,
				fitAll: false
			});
		}
	}

	isRechtsplan() {
		return this.state.mode === 'rechtsplan';
	}
	isArbeitskarte() {
		return this.state.mode === 'arbeitskarte';
	}
	aevSearchButtonHit(event) {
		this.props.aevActions.searchForAEVs({
			boundingBox: this.props.mapping.boundingBox,
			mappingActions: this.props.mappingActions,
			done: (o) => {
				if (o && o.length > 0) {
					this.setAevVisible(true);
				}
			},
			fitAll: false
		});
	}

	setAevVisible(visible) {
		const { aevVisible } = this.getNeededUrlParams();
		if (visible === true && aevVisible === false) {
			this.props.routingActions.push(
				this.props.routing.location.pathname +
					(this.props.routing.location.search || '?') +
					'&aevVisible'
			);
		} else if (visible === false && aevVisible === true) {
			this.props.routingActions.push(
				this.props.routing.location.pathname +
					removeQueryPart(this.props.routing.location.search || '', 'aevVisible')
			);
		}
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

		if (this.isRechtsplan()) {
			this.props.aevActions.searchForAEVs({
				point: { x: pos[0], y: pos[1] },
				mappingActions: this.props.mappingActions,
				fitAll: false
			});
		} else if (this.isArbeitskarte() === true) {
			this.props.hnActions.searchForHauptnutzungen({
				point: { x: pos[0], y: pos[1] },
				mappingActions: this.props.mappingActions,
				skipMappingActions: true,
				fitAll: false
			});
		}
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

	getNeededUrlParams() {
		const uSearch = new URLSearchParams(this.props.routing.location.search);
		let aevVisible = uSearch.get('aevVisible') !== null;
		let scaleVisible = uSearch.get('scaleVisible') !== null;
		let currentZoom = uSearch.get('zoom') || 8;

		return { aevVisible, scaleVisible, currentZoom };
	}

	componentDidUpdate() {
		if (
			this.props.match.params.mode !== 'arbeitskarte' &&
			this.props.match.params.mode !== 'rechtsplan'
		) {
			this.props.routingActions.push('/fnp/rechtsplan' + this.props.routing.location.search);
			this.setState({ mode: 'rechtsplan' });
		} else if (this.props.match.params.mode === 'arbeitskarte') {
			if (this.state.mode !== 'arbeitskarte') {
				this.props.mappingActions.setFeatureCollection([]);
				this.setState({ mode: 'arbeitskarte' });
			}
		} else {
			if (this.state.mode !== 'rechtsplan') {
				this.setState({ mode: 'rechtsplan' });
				this.props.mappingActions.setFeatureCollection([]);
			}
		}
	}

	render() {
		let backgroundStyling = queryString.parse(this.props.routing.location.search).mapStyle;

		const { aevVisible, currentZoom } = this.getNeededUrlParams();

		let titleContent;
		let backgrounds = [];
		if (this.state.mode === 'arbeitskarte') {
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
					key={'Hauptnutzungen.flaeche:aevVisible:' + aevVisible}
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
		} else if (this.state.mode === 'rechtsplan') {
			titleContent = (
				<div>
					<b>Rechtsplan: </b> Flächennutzungsplan (FNP){' '}
					{aevVisible === true ? 'mit Änderungsverfahren (ÄV)' : ''}
					<div style={{ float: 'right', paddingRight: 10 }}>
						<a href={'/#/fnp/arbeitskarte' + this.props.routing.location.search}>
							<FontAwesomeIcon icon={switchIcon} style={{ marginRight: 5 }} /> zur
							Arbeitskarte
						</a>
					</div>
				</div>
			);

			backgrounds = [
				<WMSTileLayer
					key={'rechtsplan:aevVisible:' + aevVisible}
					url='https://maps.wuppertal.de/deegree/wms?SRS=EPSG:25832'
					layers={'r102:fnp_clip'}
					version='1.1.1'
					transparent='true'
					format='image/png'
					tiled='true'
					styles='default'
					maxZoom={19}
					opacity={aevVisible === false ? 1.0 : currentZoom >= searchMinZoom ? 0.5 : 0.2}
					caching={true}
				/>
			];
		}

		let info;
		let inPlanoffenlegung = false;
		let selectedFeature;

		if (
			this.props.mapping.featureCollection !== undefined &&
			this.props.mapping.selectedIndex !== undefined &&
			this.props.mapping.selectedIndex !== -1
		) {
			selectedFeature = this.props.mapping.featureCollection[
				this.props.mapping.selectedIndex
			];
			if (
				selectedFeature !== undefined &&
				this.props.planoffenlegungen.dataState.items.aenderungsv.includes(
					selectedFeature.properties.name
				) &&
				selectedFeature.properties.status === 'n'
			) {
				inPlanoffenlegung = true;
			}
		}
		if (
			this.props.mapping.featureCollection.length > 0 &&
			(aevVisible === true || this.isArbeitskarte() === true)
		) {
			if (this.isRechtsplan()) {
				info = (
					<AEVInfo
						pixelwidth={370}
						featureCollection={this.props.mapping.featureCollection}
						selectedIndex={this.props.mapping.selectedIndex || 0}
						next={this.selectNextIndex}
						previous={this.selectPreviousIndex}
						fitAll={this.fitAll}
						collapsed={this.props.aev.infoBoxState.minified}
						setCollapsed={(collapsed) => {
							this.props.aevActions.setCollapsedInfoBox(collapsed);
						}}
						inPlanoffenlegung={inPlanoffenlegung}
					/>
				);
			} else if (this.isArbeitskarte() === true) {
				if (selectedFeature.properties.os !== '9999') {
					info = (
						<HNInfo
							pixelwidth={370}
							selectedFeature={selectedFeature}
							collapsed={this.props.aev.infoBoxState.minified}
							setCollapsed={(collapsed) => {
								this.props.aevActions.setCollapsedInfoBox(collapsed);
							}}
						/>
					);
				} else {
					info = (
						<HN9999Info
							pixelwidth={370}
							selectedFeature={selectedFeature}
							collapsed={this.props.aev.infoBoxState.minified}
							setCollapsed={(collapsed) => {
								this.props.aevActions.setCollapsedInfoBox(collapsed);
							}}
						/>
					);
				}
			}
		} else {
			if (this.isRechtsplan() === true) {
				info = (
					<EmptyAEVInfo
						pixelwidth={370}
						collapsed={this.props.aev.infoBoxState.minified}
						setCollapsed={(collapsed) => {
							this.props.aevActions.setCollapsedInfoBox(collapsed);
						}}
						showApplicationMenu={this.props.uiStateActions.showApplicationMenu}
					/>
				);
			} else if (this.isArbeitskarte() === true) {
				info = (
					<EmptyHNInfo
						pixelwidth={370}
						collapsed={this.props.aev.infoBoxState.minified}
						setCollapsed={(collapsed) => {
							this.props.aevActions.setCollapsedInfoBox(collapsed);
						}}
						showApplicationMenu={this.props.uiStateActions.showApplicationMenu}
					/>
				);
			}
		}

		try {
			reduxBackground = this.props.mapping.backgrounds[this.props.mapping.selectedBackground]
				.layerkey;
		} catch (e) {}

		let title = null;
		let width = this.props.uiState.width;
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
		let secondaryInfoEl;
		if (this.isRechtsplan()) {
			secondaryInfoEl = [
				<ShowAEVModeButton aevVisible={aevVisible} setAevVisible={this.setAevVisible} />
			];
		}
		return (
			<div>
				{title}
				<TopicMap
					minZoom={7}
					maxZoom={15}
					ref={(comp) => {
						this.topicMap = comp;
					}}
					initialLoadingText='Laden der FNP-Daten'
					fullScreenControl
					locatorControl
					gazetteerSearchBox
					searchMinZoom={this.state.mode === 'rechtsplan' ? searchMinZoom : 20}
					searchMaxZoom={18}
					gazeteerHitTrigger={this.aevGazeteerHit}
					searchButtonTrigger={this.aevSearchButtonHit}
					searchAfterGazetteer={true}
					gazetteerTopicsList={[
						'aenderungsv',
						'bplaene',
						'pois',
						'kitas',
						'quartiere',
						'bezirke',
						'adressen'
					]}
					locationChangedHandler={() => {}}
					gazSearchMinLength={1}
					gazetteerSearchBoxPlaceholdertext='ÄV | BPL | Stadtteil | Adresse | POI'
					_gazeteerHitTrigger={(selectedObject) => {
						if (
							selectedObject &&
							selectedObject[0] &&
							selectedObject[0].more &&
							selectedObject[0].more.id
						) {
							this.props.aevActions.setSelectedAEV(selectedObject[0].more.id);
						}
					}}
					infoBox={info}
					secondaryInfoBoxElements={secondaryInfoEl}
					backgroundlayers={
						'nothing' ||
						this.props.match.params.layers ||
						reduxBackground ||
						'wupp-plan-live'
					}
					dataLoader={[
						this.props.aevActions.loadAEVs,
						this.props.hnActions.loadHauptnutzungen,
						this.props.planoffenlegungsActions.loadPlanoffenlegungen
					]}
					getFeatureCollectionForData={() => {
						if (aevVisible === false && this.isRechtsplan()) {
							return [];
						} else {
							return this.props.mapping.featureCollection;
						}
					}}
					featureCollectionKeyPostfix={this.props.mapping.featureCollectionKeyPostfix}
					featureStyler={this.isRechtsplan() ? aevFeatureStyler : hnFeatureStyler}
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
					featureLabeler={this.isRechtsplan() ? aevLabeler : hnLabeler}
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
					_refreshFeatureCollection={this.props.aevActions.refreshFeatureCollection}
					setSelectedFeatureIndex={this.props.aevActions.setSelectedFeatureIndex}
					applicationMenuTooltipString='Kompaktanleitung anzeigen'
					applicationMenuIconname='info'
					modalMenu={
						<FNPModalHelp
							uiState={this.props.uiState}
							uiStateActions={this.props.uiStateActions}
						/>
					}
					responsiveTrigger={(smallState) => {
						if (this.state.smallState !== smallState) {
							this.setState({ smallState: smallState });
						}
					}}
				>
					{inPlanoffenlegung === true && (
						<ContactButton
							id='329487'
							key='dsjkhfg'
							position='topleft'
							title='Stellungnahme einreichen'
							action={() => {
								let link = document.createElement('a');
								link.setAttribute('type', 'hidden');
								const br = '\n';

								let mailToHref =
									'mailto:bauleitplaene@stadt.wuppertal.de?subject=Stellungnahme%20zur%20' +
									selectedFeature.properties.name +
									'. FNP-Änderung' +
									'&body=' +
									encodeURI(
										`Sehr geehrte Damen und Herren,${br}${br}` +
											`zur offenliegenden ${selectedFeature.properties
												.name}. FNP-Änderung äußere ich mich ` +
											`wie folgt:${br}` +
											`${br}${br}` +
											`[Tragen Sie hier bitte Ihre Stellungnahme ein.]${br}` +
											`${br}${br}` +
											`Mit freundlichen Grüßen${br}` +
											`${br}${br}${br}` +
											`[Bitte überschreiben Sie den nachfolgenden Block mit Ihren Kontaktinformationen, damit wir Ihnen das Ergebnis der Prüfung Ihrer Stellungnahme mitteilen können:]` +
											`${br}${br}` +
											`Vor- und Nachname${br}` +
											`ggf. Firma / Organisation${br}` +
											`Straße und Hausnummer${br}` +
											`Postleitzahl und Ort${br}` +
											`E-Mail-Adresse${br}` +
											`Telefonnummer${br}${br}` +
											`!! Mit Absenden dieser E-Mail erkläre ich mein Einverständnis mit der zweckgebundenen Verarbeitung meiner personenbezogenen Daten gemäß der Information nach Artikel 13 bzw. Art. 14 Datenschutz-Grundverordnung (DS-GVO).`
									);
								document.body.appendChild(link);
								//link.href = downloadOptions.url;
								link.href = mailToHref;
								//link.download = downloadOptions.file;
								//link.target = "_blank";
								link.click();
							}}
						/>
					)}
					{aevVisible === true &&
						(this.isRechtsplan() && (
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
								style_hn={(feature) => {
									const style = {
										color: '#155317',
										weight: 1,
										opacity: 0.8,
										fillColor: '#ffffff',
										fillOpacity: 0.6
									};

									const key = feature.properties.key;
									const os = parseInt(key);

									let c;
									if (os === 100) {
										c = '#CC1800';
									} else if (os === 200 || os === 220) {
										c = '#7D6666';
									} else if (os === 230) {
										c = '#4C1900';
									} else if (os === 240) {
										c = '#964646';
									} else if (os === 300) {
										c = '#9999A6';
									} else if (os >= 410 && os <= 442) {
										c = '#FF7F00';
									} else if (os >= 1100 && os <= 1900) {
										c = '#AB66AB';
									} else if (os >= 2111 && os <= 2130) {
										c = '#FFCC66';
									} else if (os >= 2141 && os <= 2146) {
										c = '#8C9445';
									} else if (os === 2210 || os === 2220) {
										c = '#7C7CA6';
									} else if (os >= 3110 && os <= 3223) {
										c = '#F2F017';
									} else if (os >= 3300 && os <= 3390) {
										c = '#8CCC33';
									} else if (os === 4010 || os === 4101) {
										c = '#B2FFFF';
									} else if (os === 5000) {
										c = '#D9FF99';
									} else if (os === 5100) {
										c = '#05773C';
									} else {
										c = '#000';
									}
									style.color = c;
									style.fillColor = c;

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
						))}

					<ScaleControl
						key={'scalecontrol' + width}
						position={this.state.smallState === true ? 'topleft' : 'bottomleft'}
						imperial={false}
						padding={100}
					/>

					{/* <VectorGrid {...options} /> */}

					<WMSTileLayer
						key={'background.spw2_extralight' + aevVisible + backgroundStyling}
						url='https://geodaten.metropoleruhr.de/spw2/service'
						layers={'spw2_extralight'}
						version='1.3.0'
						transparent='true'
						format='image/png'
						tiled='false'
						styles='default'
						maxZoom={19}
						opacity={0.4}
						caching={true}
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
