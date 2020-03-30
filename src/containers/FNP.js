import { faRandom } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Icon from 'components/commons/Icon';
import proj4 from 'proj4';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import React from 'react';
import { OverlayTrigger, Tooltip, Well } from 'react-bootstrap';
import { FeatureCollectionDisplayWithTooltipLabels, FeatureCollectionDisplay } from 'react-cismap';
import { WMSTileLayer, ScaleControl } from 'react-leaflet';
import VectorGrid from 'react-leaflet-vectorgrid';
import { connect } from 'react-redux';
import { routerActions as RoutingActions } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import AEVInfo from '../components/fnp/AEVInfo';
import ShowAEVModeButton from '../components/fnp/ShowAEVModeButton';
import { proj4crs25832def } from '../constants/gis';
import TopicMap from '../containers/TopicMap';
import { actions as AEVActions, getAEVFeatures } from '../redux/modules/fnp_aenderungsverfahren';
import { actions as HNActions, getHNFeatures } from '../redux/modules/fnp_hauptnutzungen';
import { actions as MappingActions } from '../redux/modules/mapping';
import { actions as UIStateActions } from '../redux/modules/uiState';
import {
	aevFeatureStyler,
	aevLabeler,
	hnFeatureStyler,
	hnLabeler,
	getColorForHauptnutzung
} from '../utils/fnpHelper';
import { removeQueryPart } from '../utils/routingHelper';
import { Control } from 'leaflet';
import CollapsibleABWell from 'components/commons/CollapsibleABWell';
import InfoBoxHeader from 'components/commons/InfoBoxHeader';
import FNPModalHelp from 'components/fnp/help/Help00MainComponent';
import Color from 'color';

//printf 'const validFNPIcons=['; for file  in *.svg; printf '"'$file'"',; printf ']'

const validFNPIcons = [
	'0200.svg',
	'0410.svg',
	'0420.svg',
	'0431.svg',
	'0432.svg',
	'0433.svg',
	'0434.svg',
	'0435.svg',
	'0436.svg',
	'0437.svg',
	'0439.svg',
	'0440.svg',
	'1100.svg',
	'1200.svg',
	'1300.svg',
	'1400.svg',
	'1500.svg',
	'1600.svg',
	'1800.svg',
	'1840.svg',
	'1860.svg',
	'2120.svg',
	'3110.svg',
	'3115.svg',
	'3120.svg',
	'3140.svg',
	'3210.svg',
	'3220.svg',
	'3310.svg',
	'3320.svg',
	'3330.svg',
	'3341.svg',
	'3342.svg',
	'3343.svg',
	'3344.svg',
	'3345.svg',
	'3360.svg',
	'3370.svg',
	'3382.svg',
	'3390.svg',
	'4101.svg'
];

let reduxBackground = undefined;

const options = {
	type: 'protobuf',
	url2: 'http://localhost:8080/data/xx/{z}/{x}/{y}.pbf',
	url: 'http://localhost:8080/data/v3/{z}/{x}/{y}.pbf',
	subdomains: ''

	// vectorTileLayerStyles: { ... }
};
const switchIcon = faRandom;
const searchMinZoom = 7;
function mapStateToProps(state) {
	return {
		uiState: state.uiState,
		mapping: state.mapping,
		routing: state.routing,
		aev: state.fnpAenderungsverfahren,
		hn: state.fnpHauptnutzungen,
		gazetteerTopics: state.gazetteerTopics
	};
}

function mapDispatchToProps(dispatch) {
	return {
		mappingActions: bindActionCreators(MappingActions, dispatch),
		uiStateActions: bindActionCreators(UIStateActions, dispatch),
		routingActions: bindActionCreators(RoutingActions, dispatch),
		aevActions: bindActionCreators(AEVActions, dispatch),
		hnActions: bindActionCreators(HNActions, dispatch)
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

		const { aevVisible, scaleVisible, currentZoom } = this.getNeededUrlParams();

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
		if (
			this.props.mapping.featureCollection.length > 0 &&
			(aevVisible === true || this.isArbeitskarte() === true)
		) {
			if (this.isRechtsplan()) {
				info = (
					<AEVInfo
						pixelwidth={350}
						featureCollection={this.props.mapping.featureCollection}
						selectedIndex={this.props.mapping.selectedIndex || 0}
						next={this.selectNextIndex}
						previous={this.selectPreviousIndex}
						fitAll={this.fitAll}
						collapsed={this.props.aev.infoBoxState.minified}
						setCollapsed={(collapsed) => {
							this.props.aevActions.setCollapsedInfoBox(collapsed);
						}}
						// downloadPlan={this.openDocViewer}
						// downloadEverything={this.openDocViewer}
						// preparedDownload={this.props.bplaene.preparedDownload}
						// resetPreparedDownload={this.resetPreparedDownload}
						// loadingError={this.props.bplaene.documentsLoadingError}
					/>
				);
			} else if (this.isArbeitskarte() === true) {
				const selectedFeature = this.props.mapping.featureCollection[
					this.props.mapping.selectedIndex || 0
				];

				const name = selectedFeature.text;

				const nameParts = name.split('-');
				const datetimeParts = (selectedFeature.properties.rechtswirksam || '').split(' ');
				const dateParts = datetimeParts[0].split('-');
				const date = dateParts[2] + '.' + dateParts[1] + '.' + dateParts[0];
				const oberbegriff = nameParts[0];
				const headerText = oberbegriff;
				const os = selectedFeature.properties.os;
				console.log(
					'selectedFeature.properties.fnp_aender',
					selectedFeature.properties.fnp_aender
				);

				const getLinkFromAEV = (aev, defaultEl) => {
					if (aev !== undefined) {
						let statusText;
						let status = aev.properties.status;
						if (status === 'r') {
							statusText = '';
						} else if (status === 'n') {
							statusText = ' (nicht rechtswirksam)';
						} else {
							statusText = ' (nicht rechtswirksame Teile9';
						}
						return (
							<b>
								<a
									href={'/#/docs/aenderungsv/' + aev.text + '/'}
									target='_aenderungsv'
								>
									{aev.text +
										(aev.properties.verfahren === ''
											? '. FNP-Änderung' + statusText
											: '. FNP-Berichtigung' + statusText)}
								</a>
							</b>
						);
					} else {
						return defaultEl;
					}
				};

				const festgelegt = getLinkFromAEV(
					selectedFeature.properties.fnp_aender,
					<span>FNP vom 17.01.2005</span>
				);
				const intersectAEV = getLinkFromAEV(
					selectedFeature.properties.intersect_fnp_aender
				);
				let infoText;
				if (nameParts.length > 1) {
					infoText = nameParts[1];
				} else {
					infoText = name;
				}
				if (selectedFeature.properties.area > 0) {
					infoText = (
						<div>
							<span>{infoText} </span>
							<span style={{ whiteSpace: 'nowrap' }}>
								{'(' +
									(selectedFeature.properties.area + '').replace('.', ',') +
									' ha)'}
							</span>
						</div>
					);
				} else if (selectedFeature.properties.area === 0) {
					infoText = (
						<div>
							<span>{infoText} </span>
							<span style={{ whiteSpace: 'nowrap' }}>({'<'} 0,1 ha)</span>
						</div>
					);
				}

				let headerBackgroundColor = Color(getColorForHauptnutzung(selectedFeature));

				let header = (
					<InfoBoxHeader
						headerColor={headerBackgroundColor.alpha(0.8)}
						content={headerText}
					/>
				);
				let icon;
				if (validFNPIcons.indexOf(os + '.svg') !== -1) {
					icon = (
						<img
							alt=''
							style={{
								paddingTop: 10,
								paddingLeft: 10,
								paddingRight: 10,
								float: 'right',
								paddingBottom: '5px'
							}}
							src={'/images/fnp/' + os + '.svg'}
							onError={"this.style.display='none'"}
							width='80'
						/>
					);
				}

				info = (
					<div pixelwidth={350}>
						{header}
						<Well bsSize='small'>
							{icon}
							<h4>{infoText}</h4>
							<p>
								<b>rechtswirksam seit: </b>
								{date}
							</p>

							<p>
								<b>festgelegt durch:</b> {festgelegt}
							</p>
							{intersectAEV !== undefined && (
								<p>
									<b>siehe auch:</b> {intersectAEV}
								</p>
							)}
							{selectedFeature.properties.bplan_nr !== undefined && (
								<p>
									<b>Anlass: </b>{' '}
									<b>
										<a
											href={
												'/#/docs/bplaene/' +
												selectedFeature.properties.bplan_nr
											}
											target='_bplaene'
										>
											B-Plan {selectedFeature.properties.bplan_nr}
										</a>
									</b>
								</p>
							)}
						</Well>
					</div>
				);
			}
		} else {
			//TODO better way to follow the jsx-a11y/anchor-is-valid rule
			/* eslint-disable */
			let largeDiv = (
				<div>
					<table border={0} style={{ width: '100%' }}>
						<tbody>
							<tr>
								<td
									style={{
										textAlign: 'left',
										verticalAlign: 'top',
										padding: '5px',
										maxWidth: '160px',
										overflowWrap: 'break-word'
									}}
								>
									<h4>Flächennutzungsplan Wuppertal vom 17.01.2005</h4>
								</td>
								<td
									style={{
										textAlign: 'center',
										verticalAlign: 'center',
										padding: '5px',
										paddingTop: '1px'
									}}
								>
									<a
										href={`/#/docs/static/FNP.Legende.und.Dokumente`}
										target='_fnp'
										style={{ color: '#333' }}
									>
										<h4 style={{ marginLeft: 5, marginRight: 5 }}>
											{/* <OverlayTrigger placement='left' overlay={'legende '}> */}
											<font size='28'>
												<Icon
													style={{ textDecoration: 'none' }}
													name='file-pdf-o'
												/>
											</font>

											{/* </OverlayTrigger> */}
										</h4>
									</a>
								</td>
							</tr>
						</tbody>
					</table>
					{/* <h4>
						Flächennutzungsplan Wuppertal vom 17.01.2005
						<font size='30'>
							<Icon style={{ textDecoration: 'none' }} name='file-pdf-o' />
						</font>
					</h4> */}
					{/* <a onClick={() => this.props.uiStateActions.showApplicationMenu(true)}>
						Legende und Dokumente
					</a> */}
					<div style={{ height: '1px', background: 'black' }} />
					<h5>Laden der Infos zu Änderungsverfahren (ÄV)</h5>

					<p>
						für ein ÄV Doppelklick auf Geltungsbereich | <Icon name='search' /> für alle
						ÄV im Kartenausschnitt | ÄV-Nummer im Suchfeld eingeben und Auswahl{' '}
						<Icon name='file' overlay='F' marginRight='2px' />aus Vorschlagsliste |
						zurück mit Doppelklick außerhalb eines ÄV
					</p>

					<a onClick={() => this.props.uiStateActions.showApplicationMenu(true)}>
						Kompaktanleitung
					</a>
				</div>
			);

			largeDiv = (
				<div>
					{/* <table border={0} style={{ width: '100%' }}>
						<tbody>
							<tr>
								<td
									style={{
										textAlign: 'left',
										verticalAlign: 'top',
										padding: '5px',
										maxWidth: '180px',
										overflowWrap: 'break-word'
									}}
								/>
								<td
									style={{
										textAlign: 'center',
										verticalAlign: 'top',
										padding: '5px',
										paddingTop: '1px'
									}}
								/>
							</tr>
						</tbody>
					</table> */}

					<a
						href={`/#/docs/static/FNP.Legende.und.Dokumente`}
						target='_fnp'
						style={{ color: '#333', float: 'right', paddingLeft: '15px' }}
					>
						<h4
							style={{
								marginLeft: 5,
								marginRight: 5,
								paddingTop: '0px',
								marginTop: '0px',
								marginBottom: '4px',
								textAlign: 'center'
							}}
						>
							{/* <OverlayTrigger placement='left' overlay={'legende '}> */}
							<font size='28'>
								<Icon style={{ textDecoration: 'none' }} name='file-pdf-o' />
							</font>

							{/* </OverlayTrigger> */}
						</h4>
						{/* <OverlayTrigger placement='left' overlay={planTooltip}> */}
						<strong>Legende</strong>
						{/* </OverlayTrigger> */}
					</a>
					<h4>Hinweise | Legende </h4>
					<p>
						für ein Änderungsverfahren (ÄV) Doppelklick auf Geltungsbereich |{' '}
						<Icon name='search' /> für alle ÄV im Kartenausschnitt | ÄV-Nummer im
						Suchfeld eingeben und Auswahl{' '}
						<Icon name='file' overlay='F' marginRight='2px' />aus Vorschlagsliste |
						zurück mit Doppelklick außerhalb eines ÄV{' '}
						<a onClick={() => this.props.uiStateActions.showApplicationMenu(true)}>
							<Icon name='angle-double-right' /> Kompaktanleitung
						</a>
					</p>
				</div>
			);

			let smallDiv = (
				<div>
					<table border={0} style={{ width: '100%' }}>
						<tbody>
							<tr>
								<td
									style={{
										textAlign: 'left',
										verticalAlign: 'top',
										padding: '5px',
										maxWidth: '160px',
										overflowWrap: 'break-word'
									}}
								>
									<h4>Legende und Dokumente</h4>
								</td>
								<td
									style={{
										textAlign: 'center',
										verticalAlign: 'center',
										padding: '5px',
										paddingTop: '1px'
									}}
								>
									<a
										href={`/#/docs/static/FNP.Legende.und.Dokumente`}
										target='_fnp'
										style={{ color: '#333' }}
									>
										<h4 style={{ marginLeft: 5, marginRight: 5 }}>
											{/* <OverlayTrigger placement='left' overlay={'legende '}> */}
											<Icon
												style={{ textDecoration: 'none', fontSize: 26 }}
												name='file-pdf-o'
											/>
											{/* </OverlayTrigger> */}
										</h4>
									</a>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			);

			info = (
				<div pixelwidth={350}>
					<InfoBoxHeader content='FNP vom 17.01.2005' />
					<CollapsibleABWell
						collapsed={this.props.aev.infoBoxState.minified}
						divWhenLarge={largeDiv}
						divWhenCollapsed={smallDiv}
						setCollapsed={(collapsed) => {
							this.props.aevActions.setCollapsedInfoBox(collapsed);
						}}
					/>
				</div>
			);

			/* eslint-ensable */
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
					initialLoadingText='Laden der Änderungen ...'
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
						this.props.hnActions.loadHauptnutzungen
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
							console.log('this.state', this.state);
						}
					}}
				>
					{aevVisible === true &&
					this.isRechtsplan() && (
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
					)}

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
