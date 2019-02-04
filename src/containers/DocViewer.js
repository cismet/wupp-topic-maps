import PropTypes from 'prop-types';
import React from 'react';
import objectAssign from 'object-assign';

import { connect } from 'react-redux';
import { Navbar, Nav, NavItem, OverlayTrigger, Tooltip, MenuItem, Well, ProgressBar } from 'react-bootstrap';
import { RoutedMap, MappingConstants, FeatureCollectionDisplay } from 'react-cismap';
import { routerActions as RoutingActions } from 'react-router-redux';
import { WMSTileLayer, Marker, Popup, Rectangle } from 'react-leaflet';
import Control from 'react-leaflet-control';
import { actions as bplanActions } from '../redux/modules/bplaene';

import L from 'leaflet';
import { bindActionCreators } from 'redux';
import { modifyQueryPart } from '../utils/routingHelper';

import 'url-search-params-polyfill';
import { actions as UIStateActions } from '../redux/modules/uiState';
import { actions as DocsActions, getCanvas, getPdfDoc } from '../redux/modules/docs';

import { Icon } from 'react-fa';
//import PDFLayer from '../components/mapping/PDFLayer';
import Coords from '../components/mapping/CoordLayer';
import CanvasLayer from '../components/mapping/ReactCanvasLayer';

import pdfjsLib from 'pdfjs-dist';
import { isThisQuarter } from 'date-fns';
import Loadable from 'react-loading-overlay';

import { Column, Row } from 'simple-flexbox';

import filesize from 'filesize';

import update from 'react-addons-update';

//pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.943/pdf.worker.min.js';

const WIDTH = 'WIDTH';
const HEIGHT = 'HEIGHT';
const BOTH = 'BOTH';
const OVERLAY_DELAY = 500;

const LOADING_STARTED = 'LOADING_STARTED';
const LOADING_FINISHED = 'LOADING_FINISHED';
const LOADING_OVERLAY = 'LOADING_OVERLAY';

const horizontalPanelHeight = 150;
const verticalPanelWidth = 100;

const detailsStyle = {
	backgroundColor: '#F6F6F6',
	padding: '5px 5px 5px 5px',
	overflow: 'auto'
};

function mapStateToProps(state) {
	return {
		uiState: state.uiState,
		gazetteerTopics: state.gazetteerTopics,
		routing: state.routing,
		docs: state.docs
	};
}

function mapDispatchToProps(dispatch) {
	return {
		uiStateActions: bindActionCreators(UIStateActions, dispatch),
		routingActions: bindActionCreators(RoutingActions, dispatch),
		bplanActions: bindActionCreators(bplanActions, dispatch),
		docsActions: bindActionCreators(DocsActions, dispatch)
	};
}

export class DocViewer_ extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.gotoWholeHeight = this.gotoWholeHeight.bind(this);
		this.gotoWholeWidth = this.gotoWholeWidth.bind(this);
		this.gotoHome = this.gotoHome.bind(this);
		this.getMapRef = this.getMapRef.bind(this);
		this.getDocInfoWithHead = this.getDocInfoWithHead.bind(this);
		this.pushRouteForPage = this.pushRouteForPage.bind(this);
		this.showMainDoc = this.showMainDoc.bind(this);
		this.getOptimalBounds = this.getOptimalBounds.bind(this);
		this.gotoWholeDocument = this.gotoWholeDocument.bind(this);
		this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);

		const topic = this.props.match.params.topic || 'bplaene';
		//const docPackageId = this.props.match.params.docPackageId || '1179V';
		const file = this.props.match.params.file || 1;
		const page = this.props.match.params.page || 1;

		const osc = document.createElement('canvas');
		osc.width = 10;
		osc.height = 10;

		// this.state = {
		// 	docPackageId: undefined,
		// 	loading: LOADING_FINISHED,
		// 	sidebarOpen: true,
		// 	pdfdoc: undefined,
		// 	pdfdocs: [],
		// 	sizes: [],
		// 	canvasCache: new Map(),
		// 	topic: undefined,
		// 	docIndex: undefined,
		// 	pageIndex: undefined,

		// 	doc: undefined,
		// 	caching: 0,

		// 	docs: [],
		// 	offScreenCanvas: osc,
		// 	debugBounds: [ [ -0.5, -0.5 ], [ 0.5, 0.5 ] ]
		// };
	}

	onSetSidebarOpen(open) {
		this.setSidebarState(open);
	}

	pushRouteForPage(topic, docPackageId, docIndex, pageIndex) {
		this.props.routingActions.push(
			'/docs/' +
				topic +
				'/' +
				docPackageId +
				'/' +
				docIndex +
				'/' +
				pageIndex +
				this.props.routing.location.search
		);
	}

	showMainDoc() {
		this.pushRouteForPage(this.props.match.params.topic, this.props.match.params.docPackageId, 1, 1);
	}

	nextPage() {
		if (parseInt(this.props.match.params.page, 10) < this.getCurrentPDFDocument()._pdfInfo.numPages) {
			this.pushRouteForPage(
				this.props.match.params.topic,
				this.props.match.params.docPackageId,
				parseInt(this.props.match.params.file, 10),
				parseInt(this.props.match.params.page, 10) + 1
			);
		} else {
			if (parseInt(this.props.match.params.file, 10) < this.getDocs().length) {
				this.pushRouteForPage(
					this.props.match.params.topic,
					this.props.match.params.docPackageId,
					parseInt(this.props.match.params.file, 10) + 1,
					1
				);
			} else {
				this.pushRouteForPage(this.props.match.params.topic, this.props.match.params.docPackageId, 1, 1);
			}
		}
	}
	prevPage() {
		if (parseInt(this.props.match.params.page, 10) > 1) {
			this.pushRouteForPage(
				this.props.match.params.topic,
				this.props.match.params.docPackageId,
				parseInt(this.props.match.params.file, 10),
				parseInt(this.props.match.params.page, 10) - 1
			);
		} else {
			if (parseInt(this.props.match.params.file, 10) > 1) {
				this.pushRouteForPage(
					this.props.match.params.topic,
					this.props.match.params.docPackageId,
					parseInt(this.props.match.params.file, 10) - 1,
					1
				);
			} else {
				this.pushRouteForPage(
					this.props.match.params.topic,
					this.props.match.params.docPackageId,
					this.getDocs().length,
					1
				);
			}
		}
	}

	changeState(changes) {
		let newState = objectAssign({}, this.state, changes);
		console.log('changeState-from:', this.state);
		console.log('changeState-to:', newState);
		this.setState(newState);
	}

	componentDidMount() {
		this.componentDidUpdate();
	}
	showPageLoadingInProgress(visible) {
		if (visible) {
			this.setLoadingState(LOADING_STARTED);

			setTimeout(() => {
				if (this.getLoadingState() === LOADING_STARTED) {
					this.setLoadingState(LOADING_OVERLAY);
				}
			}, OVERLAY_DELAY);
		} else {
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.isLoading()) {
			return;
		}
		console.log('################## componentDidUpdate');

		const topicParam = this.props.match.params.topic;
		const docPackageIdParam = this.props.match.params.docPackageId;
		const fileNumberParam = this.props.match.params.file || 1;
		const pageNumberParam = this.props.match.params.page || 1;

		if (this.props.match.params.file === undefined || this.props.match.params.page === undefined) {
			//not necessary to check file && page || page cause if file is undefined page must beundefined too
			// this corrects a url like http://localhost:3000/#/docs/bplaene/599 to http://localhost:3000/#/docs/bplaene/599/3/1
			this.pushRouteForPage(topicParam, docPackageIdParam, fileNumberParam, pageNumberParam);
			return;
		}

		if (this.getCurrentDocPackageId() !== docPackageIdParam || this.getCurrentTopic() !== topicParam) {
			let gazHit;
			this.props.docsActions.setDelayedLoadingState();
			const bpl = JSON.parse(this.props.gazetteerTopics.bplaene);
			for (let gazEntry of bpl) {
				if (gazEntry.s === docPackageIdParam) {
					gazHit = gazEntry;
				}
			}

			if (gazHit) {
				this.props.bplanActions.searchForPlans(
					[
						{
							sorter: 0,
							string: gazHit.s,
							glyph: '-',
							x: gazHit.x,
							y: gazHit.y,
							more: { zl: 18, v: gazHit.m.v }
						}
					],
					null,
					{
						skipMappingActions: true,
						done: (bplanFeatures) => {
							const bplan = bplanFeatures[0].properties;
							let docs = [];
							for (const rkDoc of bplan.plaene_rk) {
								docs.push({
									group: 'rechtskräftig',
									file: rkDoc.file,
									url: rkDoc.url.replace(
										'https://wunda-geoportal-docs.cismet.de/',
										'https://wunda-geoportal-docs.cismet.de/'
									)
								});
							}
							for (const nrkDoc of bplan.plaene_nrk) {
								docs.push({
									group: 'nicht rechtskräftig',
									file: nrkDoc.file,
									url: nrkDoc.url.replace(
										'https://wunda-geoportal-docs.cismet.de/',
										'https://wunda-geoportal-docs.cismet.de/'
									)
								});
							}
							for (const doc of bplan.docs) {
								docs.push({
									group: 'Zusatzdokumente',
									file: doc.file,
									url: doc.url.replace(
										'https://wunda-geoportal-docs.cismet.de/',
										'https://wunda-geoportal-docs.cismet.de/'
									)
								});
							}
							this.props.docsActions.setDocsInformationAndInitializeCaches(docs);
							const docIndex = fileNumberParam - 1;
							const pageIndex = pageNumberParam - 1;
							this.props.docsActions.loadPage(docPackageIdParam, docIndex, pageIndex);
						}
					}
				);
			}
		} else if (
			(this.getLoadingState() === LOADING_FINISHED && this.props.docs.docIndex === undefined) ||
			// (this.getCurrentDocPackageId() !== undefined && this.getCurrentDocPackageId() !== this.props.match.params.docPackageId - 1) ||
			(this.props.docs.docIndex !== undefined && this.props.docs.docIndex !== this.props.match.params.file - 1) ||
			(this.props.docs.pageIndex !== undefined && this.props.docs.pageIndex !== this.props.match.params.page - 1)
		) {
			if (this.getDocs().length > 0) {
				const docIndex = fileNumberParam - 1;
				const pageIndex = pageNumberParam - 1;
				this.props.docsActions.loadPage(docPackageIdParam, docIndex, pageIndex);
			}
		} else {
			//console.log('dont load', this.state);
		}
	}

	getDocInfoWithHead(doc, index) {
		return fetch(
			`http://localhost:8081/rasterfariWMS?SRS=EPSG:25832&service=WMS&request=GetMap&layers=${doc.url}&styles=default&format=image%2Fpng&transparent=true&version=1.1.1&tiled=true&width=256&height=256&srs=undefined&bbox=-0.5,-0.5,0.5,0.5`,
			{
				method: 'head'
			}
		).then((response) => {
			if (response.ok) {
				return {
					index,
					height: response.headers.get('X-Rasterfari-pageHeight'),
					width: response.headers.get('X-Rasterfari-pageWidth'),
					numOfPages: response.headers.get('X-Rasterfari-numOfPages'),
					fileSize: response.headers.get('X-Rasterfari-fileSize'),
					currentPage: response.headers.get('X-Rasterfari-currentPage')
				};
			} else {
				throw new Error("Server md5 response wasn't OK");
			}
		});
	}

	gotoHome() {
		this.leafletRoutedMap.leafletMap.leafletElement.fitBounds([ [ -0.5, -0.5 ], [ 0.5, 0.5 ] ]);
	}

	getOptimalBounds(forDimension) {
		const w = this.getCurrentOffscreenCanvas().width;
		const h = this.getCurrentOffscreenCanvas().height;

		//procentual canvas width & height
		let ph, pw;

		if (w > h) {
			pw = 1;
			ph = h / w;
		} else {
			ph = 1;
			pw = w / h;
		}

		const mapBounds = this.leafletRoutedMap.leafletMap.leafletElement.getBounds();
		const leafletSize = this.leafletRoutedMap.leafletMap.leafletElement._size; //x,y

		//procentual leaflet width & height
		let plw, plh;
		if (leafletSize.x > leafletSize.y) {
			plw = 1;
			plh = leafletSize.y / leafletSize.x;
		} else {
			plh = 1;
			plw = leafletSize.x / leafletSize.y;
		}

		//optimal bounds
		let b = [ [ -1 * (ph / 2), -pw / 2 ], [ ph / 2, pw / 2 ] ];

		switch (forDimension) {
			case WIDTH: {
				//height shrinking
				let newB;
				if (plh !== 1) {
					newB = [ [ -1 * (ph / 2) * plh, -pw / 2 ], [ ph / 2 * plh, pw / 2 ] ];
				} else {
					newB = [ [ -1 * (ph / 2) * plh, -pw / 2 ], [ ph / 2 * plh, pw / 2 ] ];
				}
				return newB;
			}
			case HEIGHT: {
				//width shrinking
				let newB;
				if (plw !== 1) {
					newB = [ [ -1 * (ph / 2), -pw / 2 * plw ], [ ph / 2, pw / 2 * plw ] ];
				} else {
					newB = [ [ -1 * (ph / 2), -pw / 2 * plw ], [ ph / 2, pw / 2 * plw ] ];
				}
				return newB;
			}
			case BOTH:
			default: {
				return b;
			}
		}
	}

	gotoWholeDocument() {
		let wb = this.getOptimalBounds();
		this.setDebugBounds(wb);
		this.leafletRoutedMap.leafletMap.leafletElement.fitBounds(wb);
	}

	gotoWholeWidth() {
		let wb = this.getOptimalBounds(WIDTH);
		this.setDebugBounds(wb);
		this.leafletRoutedMap.leafletMap.leafletElement.fitBounds(wb);
	}

	gotoWholeHeight() {
		let hb = this.getOptimalBounds();
		this.setDebugBounds(hb);
		this.leafletRoutedMap.leafletMap.leafletElement.fitBounds(hb);
	}

	getMapRef() {
		if (this.topicMap) {
			return this.topicMap.wrappedInstance.leafletRoutedMap.leafletMap.leafletElement;
		}
		return undefined;
	}
	render() {
		let mapHeight;
		if (this.props.uiState.height) {
			mapHeight = this.props.uiState.height - 55;
		} else {
			mapHeight = 50;
		}
		let urlSearchParams = new URLSearchParams(this.props.routing.location.search);

		let leafletContext;
		if (this.leafletRoutedMap) {
			leafletContext = {
				map: this.leafletRoutedMap.leafletMap.leafletElement
			};
		}
		const mapStyle = {
			height: this.props.uiState.height - 50,
			cursor: this.props.cursor,
			backgroundColor: 'white'
		};
		const mapRef = this.getMapRef();
		let menuIsHidden = false;
		if (this.props.uiState.width < 768) {
			menuIsHidden = true;
		}

		let lblDownLoadFeb = 'Flächenerfassungsbogen herunterladen (PDF)';
		let lblInfo = this.props.uiState.infoElementsEnabled ? 'Flächeninfo ausblenden' : 'Flächeninfo einblenden';
		let lblChart = this.props.uiState.chartElementsEnabled ? 'Diagramm ausblenden' : 'Diagramm einblenden';
		let lblContact = this.props.uiState.contactElementEnabled
			? 'Ansprechpartner ausblenden'
			: 'Ansprechpartner einblenden';
		let lblExit = 'Hilfe anzeigen';

		let numPages;

		if (this.props.docs.pdfdoc) {
			numPages = this.props.docs.pdfdoc._pdfInfo.numPages;
		} else {
			numPages = '?';
		}

		let downloadURL;
		const downloadAvailable = this.getDocs().length > 0 && this.props.docs.docIndex !== undefined;

		if (downloadAvailable) {
			downloadURL = this.getDocs()[this.props.docs.docIndex].url;
		}

		return (
			<div>
				<Navbar style={{ marginBottom: 0 }} inverse collapseOnSelect>
					<Navbar.Header>
						<Navbar.Brand>
							<a
								onClick={() => this.showMainDoc()}
								disabled={this.getLoadingState() !== LOADING_FINISHED}
							>
								{'BPlan ' + this.getCurrentDocPackageId()}
							</a>
						</Navbar.Brand>
						<Navbar.Toggle />
					</Navbar.Header>
					<Navbar.Collapse>
						<Nav>
							{/* <NavItem
								onClick={() => this.prevDoc()}
								disabled={this.getLoadingState() !== LOADING_FINISHED}
								eventKey={1}
								href="#"
							>
								<Icon name="step-backward" />
							</NavItem> */}
							<NavItem
								onClick={() => this.prevPage()}
								disabled={this.getLoadingState() !== LOADING_FINISHED}
								eventKey={2}
								href="#"
							>
								<Icon name="chevron-left" />
							</NavItem>
							<NavItem eventKey={1} href="#">
								{/* {this.state.docIndex + 1} / {this.getDocs().length} -  */}
								{this.props.docs.pageIndex + 1} / {numPages}
							</NavItem>
							<NavItem
								onClick={() => this.nextPage()}
								disabled={this.getLoadingState() !== LOADING_FINISHED}
								eventKey={1}
								href="#"
							>
								<Icon name="chevron-right" />
							</NavItem>
							{/* <NavItem
								onClick={() => this.nextDoc()}
								disabled={this.getLoadingState() !== LOADING_FINISHED}
								eventKey={2}
								href="#"
							>
								<Icon name="step-forward" />
							</NavItem> */}
						</Nav>
						<Navbar.Text>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </Navbar.Text>
						<Nav>
							<NavItem onClick={() => this.gotoWholeWidth()} eventKey={2} href="#">
								<Icon name="arrows-h" />
							</NavItem>
							<NavItem onClick={() => this.gotoWholeHeight()} eventKey={1} href="#">
								<Icon name="arrows-v" />
							</NavItem>
						</Nav>
						{/* <Nav>
							<NavItem onClick={() => this.gotoWholeWidth()} eventKey={2} href="#">
								<Icon spin={true} name="refresh" />
							</NavItem>
						</Nav> */}

						<Nav pullRight>
							<NavItem disabled={!downloadAvailable} href={downloadURL} target="_blank">
								<Icon name="download" />
							</NavItem>

							<NavItem disabled={true} eventKey={1} href="#">
								<Icon name="file-archive-o" />
							</NavItem>
							<NavItem disabled={true} eventKey={2} href="#">
								<Icon name="question-circle" />
							</NavItem>
						</Nav>
					</Navbar.Collapse>
				</Navbar>

				<div>
					<Row vertical="stretch" horizontal="spaced" style={{ width: '100%', height: mapHeight }}>
						<Column
							style={{
								backgroundColor: '#999999',
								backgroundColorX: 'red',
								padding: '5px 11px 5px 5px',
								overflow: 'scroll',
								height: mapHeight + 'px',
								width: '130px'
							}}
							vertical="start"
						>
							{this.getDocs().map((doc, index) => {
								let iconname = 'file-o';
								let selected = false;
								let progressBar = undefined;
								let numPages = '';
								let currentPage = '';
								let pageStatus = '';
								if (doc.group !== 'Zusatzdokumente') {
									iconname = 'file-pdf-o';
								}
								if (
									index === this.props.match.params.file - 1 &&
									this.props.docs.pdfdoc !== undefined
								) {
									numPages = this.props.docs.pdfdoc._pdfInfo.numPages;
									currentPage = this.props.match.params.page;
									selected = true;
									pageStatus = `${currentPage} / ${numPages}`;
									progressBar = (
										<ProgressBar
											style={{ height: '5px', marginTop: 0, marginBottom: 0 }}
											max={numPages}
											min={0}
											now={parseInt(currentPage, 10)}
										/>
									);
								}

								return (
									<div key={'doc.symbol.div.' + index}>
										<Well
											key={'doc.symbol.well.' + index}
											onClick={() => {
												console.log('index', index);
												this.pushRouteForPage(
													this.props.match.params.topic,
													this.props.match.params.docPackageId,
													index + 1,
													1
												);
											}}
											style={{
												background: selected ? '#777777' : undefined,
												height: '100%',
												marginBottom: 10,
												padding: 10
											}}
										>
											<div align="center">
												<Icon size="3x" name={iconname} />
												<p
													style={{
														marginTop: 10,
														marginBottom: 5,
														fontSize: 11,
														wordWrap: 'break-word'
													}}
												>
													{doc.file}
												</p>
												{progressBar}
												<p
													style={{
														marginTop: 5,
														marginBottom: 0,
														fontSize: 11,
														wordWrap: 'break-word'
													}}
												>
													{pageStatus}
												</p>
											</div>
										</Well>
									</div>
								);
							})}
						</Column>
						<Column style={{ background: 'green', width: '100%' }} horizontal="stretch">
							<Loadable
								active={this.getLoadingState() === LOADING_OVERLAY}
								spinner
								text={this.getLoadingText() || 'Laden der Datei ...'}
								content={<h1>test</h1>}
							>
								<RoutedMap
									key={'leafletRoutedMap'}
									referenceSystem={L.CRS.Simple}
									ref={(leafletMap) => {
										this.leafletRoutedMap = leafletMap;
									}}
									style={mapStyle}
									fallbackPosition={{
										lat: 0,
										lng: 0
									}}
									ondblclick={this.props.ondblclick}
									//onclick={this.props.onclick}
									locationChangedHandler={(location) => {
										this.props.routingActions.push(
											this.props.routing.location.pathname +
												modifyQueryPart(this.props.routing.location.search, location)
										);
										//this.props.locationChangedHandler(location);
									}}
									autoFitProcessedHandler={() => this.props.mappingActions.setAutoFit(false)}
									urlSearchParams={urlSearchParams}
									boundingBoxChangedHandler={(bbox) => {
										// this.props.mappingActions.mappingBoundsChanged(bbox);
										// this.props.mappingBoundsChanged(bbox);
									}}
									backgroundlayers={'no'}
									fallbackZoom={10}
									fullScreenControlEnabled={true}
									locateControlEnabled={false}
									zoomSnap={0.1}
									zoomDelta={1}
									onclick={(e) => {}}
								>
									{/* {this.state.activePage && (
						<WMSTileLayer
							ref={(c) => (this.modelLayer = c)}
							key={'docLayer'}
							url="http://localhost:8081/rasterfariWMS?SRS=EPSG:25832"
							//layers='vermessungsregister/Vermessungsrisse/3485/VR_501-3485-009-00000001.jpg'
							//						layers="bplandocs/bplaene/rechtswirksam/B84A.pdf"
							layers={this.state.activePage.url}
							version="1.1.1"
							transparent="true"
							format="image/png"
							tiled="true"
							styles="default"
							maxZoom={19}
							opacity={1}
							//caching={this.getCachingHelperCounter()}
						/>
					)} */}
									{/* <PDFLayer /> */}
									{/* <Coords/> */}
									{/* {debugMarker} */}
									{/* {this.getDebugBounds() && <Rectangle bounds={this.getDebugBounds()} color="#D8D8D8D8" />} */}
									{this.leafletRoutedMap && (
										<CanvasLayer
											key={'CANVAS' + this.getCachingHelperCounter() + this.changeState.state}
											leaflet={leafletContext}
											drawMethod={(info) => {
												const ctx = info.canvas.getContext('2d');
												ctx.fillStyle = 'black';
												ctx.clearRect(0, 0, info.canvas.width, info.canvas.height);
												var point = info.map.latLngToContainerPoint([ 0, 0 ]);

												// ctx.fillText('Center ', point.x, point.y);
												if (
													this.leafletRoutedMap &&
													(this.getLoadingState() === undefined ||
														this.getLoadingState() === LOADING_FINISHED) &&
													this.getCurrentDocPackageId() ===
														this.props.match.params.docPackageId
												) {
													const layerBounds = this.getLayerBoundsForOffscreenCanvas();
													const zoom = info.map.getZoom();
													const layerBoundsTopLeft = info.map.project(
														layerBounds.getNorthWest(),
														zoom
													);
													const layerBoundsBottomRight = info.map.project(
														layerBounds.getSouthEast(),
														zoom
													);

													const mapBoundsTopLeft = info.map.project(
														info.bounds.getNorthWest(),
														zoom
													);
													const layerBoundsPixelWidth =
														-1 * (layerBoundsTopLeft.x - layerBoundsBottomRight.x);
													const layerBoundsPixelHeight =
														-1 * (layerBoundsTopLeft.y - layerBoundsBottomRight.y);
													ctx.drawImage(
														this.getCurrentOffscreenCanvas(),
														//0,0,5526,5526,
														layerBoundsTopLeft.x - mapBoundsTopLeft.x,
														layerBoundsTopLeft.y - mapBoundsTopLeft.y,
														layerBoundsPixelWidth,
														layerBoundsPixelHeight
													);
												}
												ctx.stroke();
											}}
										/>
									)}
									{this.props.docs.docIndex !== undefined &&
									this.getDocs().length > 0 && (
										<Control position="bottomright">
											<p style={{ backgroundColor: '#D8D8D8D8', padding: '5px' }}>
												{this.getDocs()[this.props.docs.docIndex].file} ({this.getSizeStorage()[
													this.props.docs.docIndex
												] ? (
													filesize(this.getSizeStorage()[this.props.docs.docIndex])
												) : (
													''
												)})
											</p>
										</Control>
									)}
								</RoutedMap>
							</Loadable>
						</Column>
					</Row>
				</div>
			</div>
		);
	}

	getLayerBoundsForOffscreenCanvas = () => {
		const w = this.getCurrentOffscreenCanvas().width;
		const h = this.getCurrentOffscreenCanvas().height;
		let ph, pw;

		if (w > h) {
			pw = 1;
			ph = h / w;
		} else {
			ph = 1;
			pw = w / h;
		}

		// const layerBounds = new L.LatLngBounds([ v ], [ 0.5, 0.5 ]);
		const layerBounds = new L.LatLngBounds([ -ph / 2, -pw / 2 ], [ ph / 2, pw / 2 ]);
		return layerBounds;
	};

	getCurrentDocPackageId = () => {
		return this.props.docs.docPackageId;
	};
	getCurrentTopic = () => {
		return this.props.docs.topic;
	};
	getDocs = () => {
		return this.props.docs.docs;
	};
	getSizeStorage = () => {
		return this.props.docs.sizes;
	};
	// getCanvasCache = () => {
	// 	return this.state.canvasCache;
	// };
	getCachingHelperCounter = () => {
		return this.props.docs.caching;
	};
	getLoadingState = () => {
		return this.props.docs.loadingState;
	};
	getLoadingText = () => {
		return this.props.docs.loadingText;
	};
	isLoading = () => {
		return this.props.docs.loadingState !== LOADING_FINISHED;
	};

	getCurrentOffscreenCanvas = () => {
		return this.props.docs.canvas;
	};
	// getDebugBounds = () => {
	// 	return this.state.debugBounds;
	// };

	////////////////////

	// setSize = (index, contentLength) => {
	// 	const newState = update(this.state, {
	// 		sizes: { [index]: { $set: parseInt(contentLength, 10) } }
	// 	});
	// 	//console.log('newState',newState);

	// 	this.setState(newState);
	// };

	// setSidebarState = (open) => {
	// 	const newState = update(this.state, {
	// 		sidebarOpen: { $set: open }
	// 	});
	// 	this.setState(newState);
	// };

	// clearCurrentPDF = () => {
	// 	const newState = update(this.state, {
	// 		pdfdoc: { $set: undefined }
	// 	});
	// 	this.setState(newState);
	// };

	// setPDF = (pdf, index) => {
	// 	let newState;
	// 	if (index !== undefined) {
	// 		newState = update(this.state, {
	// 			pdfdoc: { $set: pdf },
	// 			pdfdocs: {
	// 				[index]: { $set: pdf }
	// 			}
	// 		});
	// 	} else {
	// 		newState = update(this.state, {
	// 			pdfdoc: { $set: pdf }
	// 		});
	// 	}
	// 	this.setState(newState);
	// };
	// setOffscreenCanvas = (canvas) => {
	// 	const newState = update(this.state, {
	// 		offScreenCanvas: { $set: canvas }
	// 	});
	// 	this.setState(newState);
	// };

	// setDebugBounds = (bounds) => {
	// 	const newState = update(this.state, {
	// 		debugBounds: { $set: bounds }
	// 	});
	// 	this.setState(newState);
	// };

	// setLoadingState = (loadingstate) => {
	// 	const newState = update(this.state, {
	// 		loading: { $set: loadingstate }
	// 	});
	// 	this.setState(newState);
	// };

	// setCanvasToCache = (index, canvas) => {
	// 	const newcache = new Map(this.state.canvasCache);
	// 	newcache.set(index, canvas);
	// 	const newState = update(this.state, {
	// 		canvasCache: { $set: newcache }
	// 	});
	// 	this.setState(newState);
	// };

	// incrementCachingNonce = () => {
	// 	const newState = update(this.state, {
	// 		caching: { $set: this.state.caching + 1 }
	// 	});
	// 	this.setState(newState);
	// };

	// initializeLocalState = (docPackageId, topic) => {
	// 	const newState = update(this.state, {
	// 		docPackageId: { $set: docPackageId },
	// 		topic: { $set: topic },
	// 		docIndex: { $set: undefined },
	// 		docs: { $set: [] }
	// 	});
	// 	console.log('initializeLocalState2.oldState', this.state);
	// 	console.log('initializeLocalState2.newState', newState);
	// 	if (
	// 		this.state.docPackageId !== newState.docPackageId ||
	// 		this.state.docIndex !== undefined ||
	// 		this.state.docs !== []
	// 	) {
	// 		this.setState(newState);
	// 	}
	// };
	// setDocIndex = (docIndex) => {
	// 	const newState = update(this.state, {
	// 		docIndex: { $set: docIndex }
	// 	});
	// 	this.setState(newState);
	// };
	// setPageIndex = (pageIndex) => {
	// 	const newState = update(this.state, {
	// 		pageIndex: { $set: pageIndex }
	// 	});
	// 	this.setState(newState);
	// };
	// setDocsInformationAndInitializeCaches = (docs) => {
	// 	const newState = update(this.state, {
	// 		docs: { $set: docs },
	// 		pdf: { $set: undefined },
	// 		pdfdocs: { $set: [] },

	// 		page: { $set: undefined },
	// 		canvasCache: { $set: new Map() },
	// 		page: { $set: undefined },
	// 		docIndex: { $set: undefined },
	// 		pageIndex: { $set: undefined },
	// 		doc: { $set: undefined },
	// 		debugBounds: { $set: [ [ -0.5, -0.5 ], [ 0.5, 0.5 ] ] },
	// 		offScreenCanvas: { $set: document.createElement('canvas') }
	// 	});
	// 	this.setState(newState);
	// };
	// setPage = (page) => {
	// 	const newState = update(this.state, {
	// 		page: { $set: page }
	// 	});
	// 	this.setState(newState);
	// };
}

const DocViewer = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(DocViewer_);

export default DocViewer;

DocViewer.propTypes = {
	ui: PropTypes.object,
	uiState: PropTypes.object
};
