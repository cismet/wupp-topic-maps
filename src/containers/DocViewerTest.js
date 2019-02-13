import PropTypes from 'prop-types';
import React from 'react';
import objectAssign from 'object-assign';

import { connect } from 'react-redux';
import { Navbar, Nav, NavItem, OverlayTrigger, Tooltip, MenuItem, Well, ProgressBar, Alert } from 'react-bootstrap';
import { RoutedMap, MappingConstants, FeatureCollectionDisplay } from 'react-cismap';
import { routerActions as RoutingActions } from 'react-router-redux';
import { WMSTileLayer, Marker, Popup, Rectangle, TileLayer } from 'react-leaflet';
import Control from 'react-leaflet-control';
import { actions as bplanActions } from '../redux/modules/bplaene';

import L from 'leaflet';
import { bindActionCreators } from 'redux';
import { modifyQueryPart } from '../utils/routingHelper';
import { Simple as ownSimpleCRS } from '../utils/gisHelper';

import 'url-search-params-polyfill';
import { actions as UIStateActions } from '../redux/modules/uiState';
import { actions as DocsActions, getCanvas, getPdfDoc } from '../redux/modules/docstest';

import { Icon } from 'react-fa';
//import PDFLayer from '../components/mapping/PDFLayer';
import Coords from '../components/mapping/CoordLayer';

import pdfjsLib from 'pdfjs-dist';
import { isThisQuarter } from 'date-fns';
import Loadable from 'react-loading-overlay';

import { Column, Row } from 'simple-flexbox';

import filesize from 'filesize';

L.RasterCoords = function(map, imgsize, tilesize) {
	this.map = map;
	this.width = imgsize[0];
	this.height = imgsize[1];
	this.tilesize = tilesize || 256;
	this.zoom = this.zoomLevel();
	if (this.width && this.height) {
		// this.setMaxBounds()
	}
};
L.RasterCoords.prototype = {
	/**
	 * calculate accurate zoom level for the given image size
	 */
	zoomLevel: function() {
		return Math.ceil(Math.log(Math.max(this.width, this.height) / this.tilesize) / Math.log(2));
	},
	/**
	 * unproject `coords` to the raster coordinates used by the raster image projection
	 * @param {Array} coords - [ x, y ]
	 * @return {L.LatLng} - internal coordinates
	 */
	unproject: function(coords) {
		return this.map.unproject(coords, this.zoom);
	},
	/**
	 * project `coords` back to image coordinates
	 * @param {Array} coords - [ x, y ]
	 * @return {L.LatLng} - image coordinates
	 */
	project: function(coords) {
		return this.map.project(coords, this.zoom);
	},
	/**
	 * sets the max bounds on map
	 */
	setMaxBounds: function() {
		var southWest = this.unproject([ 0, this.height ]);
		var northEast = this.unproject([ this.width, 0 ]);
		this.map.setMaxBounds(new L.LatLngBounds(southWest, northEast));
	}
};

//import '../components/external/rastercoords';

//pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

//L.RasterCoords = RasterCoords;

//pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.943/pdf.worker.min.js';

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

const tileservice = 'https://aaa.cismet.de/';

function mapStateToProps(state) {
	return {
		uiState: state.uiState,
		gazetteerTopics: state.gazetteerTopics,
		routing: state.routing,
		docs: state.docstest
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
	}

	componentDidMount() {
		this.componentDidUpdate();
	}

	componentDidUpdate(prevProps, prevState) {
		const topicParam = this.props.match.params.topic;
		const docPackageIdParam = this.props.match.params.docPackageId;
		const fileNumberParam = this.props.match.params.file || 1;
		const pageNumberParam = this.props.match.params.page || 1;
		const docIndex = fileNumberParam - 1;
		const pageIndex = pageNumberParam - 1;
		const currentlyLoading = this.isLoading();

		if (
			currentlyLoading &&
			docPackageIdParam === this.props.docs.futureDocPackageId &&
			docIndex === this.props.docs.futureDocIndex &&
			pageIndex === this.props.docs.futurePageIndex
		) {
			return;
		}
		if (this.props.match.params.file === undefined || this.props.match.params.page === undefined) {
			// not necessary to check file && page || page cause if file is undefined page must beundefined too
			// this corrects a url like http://localhost:3000/#/docs/bplaene/599 to http://localhost:3000/#/docs/bplaene/599/3/1
			this.pushRouteForPage(topicParam, docPackageIdParam, fileNumberParam, pageNumberParam);
			return;
		}

		if (this.props.docs.docPackageId !== docPackageIdParam || this.props.docs.topic !== topicParam) {
			let gazHit;
			this.props.docsActions.setDelayedLoadingState(docPackageIdParam, docIndex, pageIndex);
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
							for (const doc of bplan.plaene_rk) {
								// let pagecount = this.props.docs.pages[this.replaceUmlauteAndSpaces(doc.file)].pages;
								// let pageinfo = [];

								// for (let i = 0; i < pagecount; ++i) {
								// 	if (pagecount > 1) {
								// 		pageinfo.push(
								// 			this.props.docs.layers[this.replaceUmlauteAndSpaces(doc.file + '-' + i)]
								// 		);
								// 	} else {
								// 		pageinfo.push(this.props.docs.layers[this.replaceUmlauteAndSpaces(doc.file)]);
								// 	}
								// }
								docs.push({
									group: 'rechtskraeftig',
									file: doc.file,
									url: doc.url.replace(
										'https://wunda-geoportal-docs.cismet.de/',
										'https://wunda-geoportal-dox.cismet.de/'
									),
									layer: this.replaceUmlauteAndSpaces(
										doc.url.replace(
											'https://wunda-geoportal-docs.cismet.de/',
											'http://localhost:3030/'
										) + '/{z}/{x}/{y}.png'
									),
									meta: this.replaceUmlauteAndSpaces(
										doc.url.replace(
											'https://wunda-geoportal-docs.cismet.de/',
											'http://localhost:3030/'
										) + '/meta.json'
									)
								});
							}
							for (const doc of bplan.plaene_nrk) {
								// let pagecount = this.props.docs.pages[this.replaceUmlauteAndSpaces(doc.file)].pages;
								// let pageinfo = [];

								// for (let i = 0; i < pagecount; ++i) {
								// 	if (pagecount > 1) {
								// 		pageinfo.push(
								// 			this.props.docs.layers[this.replaceUmlauteAndSpaces(doc.file + '-' + i)]
								// 		);
								// 	} else {
								// 		pageinfo.push(
								// 			this.props.docs.layers[this.replaceUmlauteAndSpaces(doc.file)]
								// 		);
								// 	}
								// }
								docs.push({
									group: 'nicht_rechtskraeftig',
									file: doc.file,
									url: doc.url.replace(
										'https://wunda-geoportal-docs.cismet.de/',
										'https://wunda-geoportal-dox.cismet.de/'
									),

									layer: this.replaceUmlauteAndSpaces(
										doc.url.replace(
											'https://wunda-geoportal-docs.cismet.de/',
											'http://localhost:3030/'
										) + '/{z}/{x}/{y}.png'
									),
									meta: this.replaceUmlauteAndSpaces(
										doc.url.replace(
											'https://wunda-geoportal-docs.cismet.de/',
											'http://localhost:3030/'
										) + '/meta.json'
									)
								});
							}
							for (const doc of bplan.docs) {
								// let pagecount = this.props.docs.pages[this.replaceUmlauteAndSpaces(doc.file)].pages;
								// let pageinfo = [];

								// for (let i = 0; i < pagecount; ++i) {
								// 	if (pagecount > 1) {
								// 		pageinfo.push(
								// 			this.props.docs.layers[this.replaceUmlauteAndSpaces(doc.file + '-' + i)]
								// 		);
								// 	} else {
								// 		pageinfo.push(this.props.docs.layers[this.replaceUmlauteAndSpaces(doc.file)]);
								// 	}
								// }

								docs.push({
									group: 'Zusatzdokumente',
									file: doc.file,
									url: doc.url.replace(
										'https://wunda-geoportal-docs.cismet.de/',
										'https://wunda-geoportal-dox.cismet.de/'
									),

									layer: this.replaceUmlauteAndSpaces(
										doc.url.replace(
											'https://wunda-geoportal-docs.cismet.de/',
											'http://localhost:3030/'
										) + '/{z}/{x}/{y}.png'
									),

									meta: this.replaceUmlauteAndSpaces(
										doc.url.replace(
											'https://wunda-geoportal-docs.cismet.de/',
											'http://localhost:3030/'
										) + '/meta.json'
									)
								});
							}
							this.props.docsActions.setDocsInformationAndInitializeCaches(docs);

							this.props.docsActions.loadPage(docPackageIdParam, docIndex, pageIndex, () => {
								setTimeout(() => {
									if (this.props.docs.docs[docIndex].meta) {
										this.gotoWholeDocument();
									}
								}, 50);
							});
						}
					}
				);
			}
		} else if (
			(this.props.docs.loadingState === LOADING_FINISHED && this.props.docs.docIndex === undefined) ||
			// (this.props.docs.docPackageId !== undefined && this.props.docs.docPackageId !== this.props.match.params.docPackageId - 1) ||
			(this.props.docs.docIndex !== undefined && this.props.docs.docIndex !== this.props.match.params.file - 1) ||
			(this.props.docs.pageIndex !== undefined && this.props.docs.pageIndex !== this.props.match.params.page - 1)
		) {
			if (this.props.docs.docs.length > 0) {
				this.props.docsActions.loadPage(docPackageIdParam, docIndex, pageIndex, () =>
					setTimeout(() => {
						setTimeout(() => {
							if (this.props.docs.docs[docIndex].meta) {
								this.gotoWholeDocument();
							}
						}, 50);
					})
				);
			}
		} else {
			//console.log('dont load', this.state);
		}
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

		if (this.props.docs.docs && this.props.docs.docIndex && this.props.docs.docs[this.props.docs.docIndex]) {
			numPages = ' / ' + this.props.docs.docs[this.props.docs.docIndex].pages;
		}
		let downloadURL;
		const downloadAvailable = this.props.docs.docs.length > 0 && this.props.docs.docIndex !== undefined;

		if (downloadAvailable) {
			downloadURL = this.props.docs.docs[this.props.docs.docIndex].url;
		}

		let docLayer = <div />;
		let layer = this.getLayer();

		if (layer) {
			docLayer = (
				<TileLayer
					key={
						'tileLayer.' +
						JSON.stringify(layer.layerBounds) +
						'.' +
						layer.meta['layer' + this.props.docs.pageIndex].maxZoom
					}
					url={layer.layerUrl}
					bounds={layer.layerBounds}
					minNativeZoom={1}
					tms={true}
					noWrap={true}
					maxNativeZoom={layer.meta['layer' + this.props.docs.pageIndex].maxZoom}
				/>
			);
		} else {
		}

		let problemWithDocPreviewAlert = null;
		if (this.getLayer() === undefined && this.props.docs.docIndex) {
			problemWithDocPreviewAlert = (
				<div
					style={{
						zIndex: 234098,
						left: (this.props.uiState.width - 130) / 2 - (this.props.uiState.width - 130) * 0.2,
						top: '30%',
						width: '100%',
						height: '100%',
						textAlign: 'center',
						position: 'absolute'
					}}
				>
					<Alert style={{ width: '40%' }} variant="danger">
						<h4>Vorschau nicht verfügbar.</h4>
						<p>
							Im Moment kann die Vorschau des Dokumentes nicht angezeigt werden. Sie können das Dokument
							aber <a href={downloadURL} target="_blank">hier <Icon name="download" />
							</a> herunterladen. 
						</p>
					</Alert>
				</div>
			);
		}

		return (
			<div>
				<Navbar style={{ marginBottom: 0 }} inverse>
					<Navbar.Header>
						<Navbar.Brand>
							<a
								onClick={() => this.showMainDoc()}
								disabled={this.props.docs.loadingState !== LOADING_FINISHED}
							>
								{'BPlan ' + (this.props.docs.docPackageId || this.props.docs.futuredocPackageId || '')}
							</a>
						</Navbar.Brand>
						<Navbar.Toggle />
					</Navbar.Header>
					<Navbar.Collapse>
						<Nav>
							{/* <NavItem
								onClick={() => this.prevDoc()}
								disabled={this.props.docs.loadingState !== LOADING_FINISHED}
								eventKey={1}
								href="#"
							>
								<Icon name="step-backward" />
							</NavItem> */}
							<NavItem
								onClick={() => this.prevPage()}
								disabled={this.props.docs.loadingState !== LOADING_FINISHED}
								eventKey={2}
								href="#"
							>
								<Icon name="chevron-left" />
							</NavItem>
							<NavItem eventKey={1} href="#">
								{/* {this.state.docIndex + 1} / {this.props.docs.docs.length} -  */}
								{(this.props.docs.pageIndex || this.props.docs.futurePageIndex) + 1} {numPages}
							</NavItem>
							<NavItem
								onClick={() => this.nextPage()}
								disabled={this.props.docs.loadingState !== LOADING_FINISHED}
								eventKey={1}
								href="#"
							>
								<Icon name="chevron-right" />
							</NavItem>
							{/* <NavItem
								onClick={() => this.nextDoc()}
								disabled={this.props.docs.loadingState !== LOADING_FINISHED}
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
							<NavItem disabled={false && !downloadAvailable} href={downloadURL} target="_blank">
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
						{(this.props.docs.docs || []).length > 1 && (
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
								{this.props.docs.docs.map((doc, index) => {
									let iconname = 'file-o';
									let selected = false;
									let progressBar = undefined;
									let numPages = '';
									let currentPage = '';
									let pageStatus = '';
									if (doc.group !== 'Zusatzdokumente') {
										iconname = 'file-pdf-o';
									}
									if (index === this.props.match.params.file - 1) {
										numPages = doc.pages;
										currentPage = this.props.docs.pageIndex + 1;
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
						)}
						<Column style={{ background: 'green', width: '100%' }} horizontal="stretch">
							<Loadable
								active={this.props.docs.loadingState === LOADING_OVERLAY}
								spinner
								text={this.props.docs.loadingText || 'Laden der Datei ...'}
								content={<h1>test</h1>}
							>
								<div>
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
										// onclick={this.props.onclick}
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
										fallbackZoom={2}
										fullScreenControlEnabled={true}
										locateControlEnabled={false}
										minZoom={1}
										maxZoom={6}
										zoomSnap={0.5}
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
							//caching={this.props.docs.caching}
						/>
					)} */}
										{/* <PDFLayer /> */}
										{/* <Marker position={[0,0]}>
										<Popup>
											<span>
												0,0
											</span>
										</Popup>
									</Marker> */}
										{this.getLayer() && (
											<Rectangle bounds={this.getLayer().layerBounds} color="#D8D8D8D8" />
										)}
										{docLayer}
										{this.props.docs.docIndex !== undefined &&
										this.props.docs.docs.length > 0 &&
										!this.isLoading() && (
											<Control position="bottomright">
												<p style={{ backgroundColor: '#D8D8D8D8', padding: '5px' }}>
													{this.props.docs.docs[this.props.docs.docIndex].file}
												</p>
											</Control>
										)}
									</RoutedMap>
									{problemWithDocPreviewAlert}
								</div>
							</Loadable>
						</Column>
					</Row>
				</div>
			</div>
		);
	}

	getLayerBoundsForOffscreenCanvas = () => {
		const w = this.props.docs.canvas.width;
		const h = this.props.docs.canvas.height;
		let ph, pw;

		if (w > h) {
			pw = 1;
			ph = h / w;
		} else {
			ph = 1;
			pw = w / h;
		}

		//const layerBounds = new L.LatLngBounds([ -0.5, -0.5 ], [ 0.5, 0.5 ]);
		const layerBounds = new L.LatLngBounds([ -ph / 2, -pw / 2 ], [ ph / 2, pw / 2 ]);
		return layerBounds;
	};

	isLoading = () => {
		return this.props.docs.loadingState !== LOADING_FINISHED;
	};
	pushRouteForPage = (topic, docPackageId, docIndex, pageIndex) => {
		this.props.routingActions.push(
			'/docstest/' +
				topic +
				'/' +
				docPackageId +
				'/' +
				docIndex +
				'/' +
				pageIndex +
				this.props.routing.location.search
		);
	};

	showMainDoc = () => {
		this.pushRouteForPage(this.props.match.params.topic, this.props.match.params.docPackageId, 1, 1);
	};

	nextPage = () => {
		if (parseInt(this.props.match.params.page, 10) < this.props.docs.docs[this.props.docs.docIndex].pages) {
			this.pushRouteForPage(
				this.props.match.params.topic,
				this.props.match.params.docPackageId,
				parseInt(this.props.match.params.file, 10),
				parseInt(this.props.match.params.page, 10) + 1
			);
		} else {
			if (parseInt(this.props.match.params.file, 10) < this.props.docs.docs.length) {
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
	};
	prevPage = () => {
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
					this.props.docs.docs.length,
					1
				);
			}
		}
	};
	getDocInfoWithHead = (doc, index) => {
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
	};

	getOptimalBounds = (forDimension) => {
		// var img = [
		// 	12047,
		// 	8504
		// 	]
		// 	var rc = new L.RasterCoords(this.leafletRoutedMap.leafletMap.leafletElement, img)
		// 	return [ [ rc.unproject([ 0, 0 ]), rc.unproject([ img[0], img[1] ]) ] ]

		// if (forDimension){
		// 	const leafletSize = this.leafletRoutedMap.leafletMap.leafletElement._size; //x,y
		// 	let layer=this.getLayer();
		// 	let dimensions = [ layer.meta.x, layer.meta.y ];
		// 	if (forDimension===WIDTH){
		// 		let targetDimensions = [ layer.meta.x, layer.meta.y * leafletSize.x/leafletSize.y ];
		// 		let rc = new L.RasterCoords(this.leafletRoutedMap.leafletMap.leafletElement, targetDimensions);
		// 		return [ [ rc.unproject([ 0, 0 ]), rc.unproject([ targetDimensions[0], targetDimensions[1] ]) ] ];
		// 	}
		// 	else if (forDimension===HEIGHT){
		// 		let targetDimensions = [ layer.meta.x * leafletSize.x/leafletSize.y, layer.meta.y  ];
		// 		let rc = new L.RasterCoords(this.leafletRoutedMap.leafletMap.leafletElement, targetDimensions);
		// 		return [ [ rc.unproject([ 0, 0 ]), rc.unproject([ targetDimensions[0], targetDimensions[1] ]) ] ];
		// 	}
		// }
		// else {
		return this.getLayer().layerBounds;
		// }
		// let layer=this.getLayer();
		// let dimensions = [ layer.meta.x, layer.meta.y ];
		// const w = layer.meta.x;
		// const h = layer.meta.y;

		// //procentual canvas width & height
		// let ph, pw;

		// if (w > h) {
		// 	pw = 1;
		// 	ph = h / w;
		// } else {
		// 	ph = 1;
		// 	pw = w / h;
		// }
		// const leafletSize = this.leafletRoutedMap.leafletMap.leafletElement._size; //x,y

		// //procentual leaflet width & height
		// let plw, plh;
		// if (leafletSize.x > leafletSize.y) {
		// 	plw = 1;
		// 	plh = leafletSize.y / leafletSize.x;
		// } else {
		// 	plh = 1;
		// 	plw = leafletSize.x / leafletSize.y;
		// }

		// //optimal bounds
		// let b = [ [ -1 * (ph / 2), -pw / 2 ], [ ph / 2, pw / 2 ] ];

		// switch (forDimension) {
		// 	case WIDTH: {
		// 		//height shrinking
		// 		let newB;
		// 		if (plh !== 1) {
		// 			newB = [ [ -1 * (ph / 2) * plh, -pw / 2 ], [ ph / 2 * plh, pw / 2 ] ];
		// 		} else {
		// 			newB = [ [ -1 * (ph / 2) * plh, -pw / 2 ], [ ph / 2 * plh, pw / 2 ] ];
		// 		}
		// 		return newB;
		// 	}
		// 	case HEIGHT: {
		// 		//width shrinking
		// 		let newB;
		// 		if (plw !== 1) {
		// 			newB = [ [ -1 * (ph / 2), -pw / 2 * plw ], [ ph / 2, pw / 2 * plw ] ];
		// 		} else {
		// 			newB = [ [ -1 * (ph / 2), -pw / 2 * plw ], [ ph / 2, pw / 2 * plw ] ];
		// 		}
		// 		return newB;
		// 	}
		// 	case BOTH:
		// 	default: {
		// 		return b;
		// 	}
		// }
	};

	gotoWholeDocument = () => {
		let wb = this.getOptimalBounds();
		// this.props.docsActions.setDebugBounds(wb);
		this.leafletRoutedMap.leafletMap.leafletElement.fitBounds(wb);
		//this.leafletRoutedMap.leafletMap.leafletElement.setView(wb);
	};

	gotoWholeWidth = () => {
		let wb = this.getOptimalBounds(WIDTH);
		// this.props.docsActions.setDebugBounds(wb);
		this.leafletRoutedMap.leafletMap.leafletElement.fitBounds(wb);
	};

	gotoWholeHeight = () => {
		let hb = this.getOptimalBounds(HEIGHT);
		// this.props.docsActions.setDebugBounds(hb);
		this.leafletRoutedMap.leafletMap.leafletElement.fitBounds(hb);
	};

	replaceUmlauteAndSpaces(str) {
		const umlautMap = {
			Ü: 'UE',
			Ä: 'AE',
			Ö: 'OE',
			ü: 'ue',
			ä: 'ae',
			ö: 'oe',
			ß: 'ss',
			' ': '_'
		};
		return str
			.replace(/[\u00dc|\u00c4|\u00d6][a-z]/g, (a) => {
				var big = umlautMap[a.slice(0, 1)];
				return big.charAt(0) + big.charAt(1).toLowerCase() + a.slice(1);
			})
			.replace(new RegExp('[' + Object.keys(umlautMap).join('|') + ']', 'g'), (a) => umlautMap[a]);
	}
	getLayer = () => {
		if (this.props.docs.docIndex !== undefined && this.props.docs.docs.length > 0) {
			let layerUrl = this.props.docs.docs[this.props.docs.docIndex].layer;
			const meta = this.props.docs.docs[this.props.docs.docIndex].meta;

			if (meta) {
				if (meta.pages > 1) {
					layerUrl = layerUrl.replace('.pdf/', `.pdf-${this.props.docs.pageIndex}/`);
				}

				//			 const meta = this.props.docs.docs[this.props.docs.docIndex].pageinfo[this.props.docs.pageIndex];
				const dimensions = [
					meta['layer' + this.props.docs.pageIndex].x,
					meta['layer' + this.props.docs.pageIndex].y
				];
				// const meta = {};
				const rc = new L.RasterCoords(this.leafletRoutedMap.leafletMap.leafletElement, dimensions);
				const layerBounds = [ [ rc.unproject([ 0, 0 ]), rc.unproject([ dimensions[0], dimensions[1] ]) ] ];
				const layer = {
					layerUrl,
					meta,
					layerBounds
				};

				return layer;
			} else {
				return undefined;
			}
		} else {
			return undefined;
		}
	};
}

const DocViewer = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(DocViewer_);

export default DocViewer;

DocViewer.propTypes = {
	ui: PropTypes.object,
	uiState: PropTypes.object
};
