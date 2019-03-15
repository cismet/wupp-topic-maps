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
import { actions as gazetteerTopicsActions, getGazDataForTopicIds } from '../redux/modules/gazetteerTopics';
import { downloadSingleFile, prepareDownloadMultipleFiles, prepareMergeMultipleFiles } from '../utils/downloadHelper';

import L from 'leaflet';
import { bindActionCreators } from 'redux';
import { modifyQueryPart, removeQueryPart } from '../utils/routingHelper';
import { Simple as ownSimpleCRS } from '../utils/gisHelper';

import 'url-search-params-polyfill';
import { actions as UIStateActions } from '../redux/modules/uiState';
import { actions as DocsActions, getCanvas, getPdfDoc } from '../redux/modules/docs';

import { Icon } from 'react-fa';
//import PDFLayer from '../components/mapping/PDFLayer';
import Coords from '../components/mapping/CoordLayer';

import { isThisQuarter } from 'date-fns';
import Loadable from 'react-loading-overlay';

import { Column, Row } from 'simple-flexbox';

import filesize from 'filesize';
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';

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

const WIDTH = 'WIDTH';
const HEIGHT = 'HEIGHT';
const BOTH = 'BOTH';
const OVERLAY_DELAY = 500;

const LOADING_STARTED = 'LOADING_STARTED';
const LOADING_FINISHED = 'LOADING_FINISHED';
const LOADING_OVERLAY = 'LOADING_OVERLAY';

const horizontalPanelHeight = 150;
const sidebarWidth = 130;

const detailsStyle = {
	backgroundColor: '#F6F6F6',
	padding: '5px 5px 5px 5px',
	overflow: 'auto'
};

const tileservice = 'https://aaa.cismet.de/tiles/';

function mapStateToProps(state) {
	return {
		uiState: state.uiState,
		allGazetteerTopics: state.gazetteerTopics,
		routing: state.routing,
		docs: state.docs,
		mapping: state.mapping
	};
}

function mapDispatchToProps(dispatch) {
	return {
		uiStateActions: bindActionCreators(UIStateActions, dispatch),
		routingActions: bindActionCreators(RoutingActions, dispatch),
		bplanActions: bindActionCreators(bplanActions, dispatch),
		docsActions: bindActionCreators(DocsActions, dispatch),
		gazetteerTopicsActions: bindActionCreators(gazetteerTopicsActions, dispatch)
	};
}

export class DocViewer_ extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			downloadArchiveIcon: 'file-archive-o',
			downloadArchivePrepInProgress: false
		};
	}
	componentWillMount() {}

	componentDidMount() {
		this.componentDidUpdate();
		this.selectionDivElement = <div ref={(comp) => (this.selectionDivRef = comp)} />; // add SELECTION+1 as text to the divto see the principle
	}

	componentDidUpdate(prevProps, prevState) {
		if (!this.props.allGazetteerTopics.bplaene) {
			console.log('this.props.allGazetteerTopics', this.props.allGazetteerTopics);

			this.props.gazetteerTopicsActions.loadTopicsData([ 'bplaene' ]).then(() => {
				console.log('gazDataLoaded');
			});
			return;
		}
		const topicParam = this.props.match.params.topic;
		const docPackageIdParam = this.props.match.params.docPackageId;
		const fileNumberParam = this.props.match.params.file || 1;
		const pageNumberParam = this.props.match.params.page || 1;
		const docIndex = fileNumberParam - 1;
		const pageIndex = pageNumberParam - 1;
		const currentlyLoading = this.isLoading();
		document.title = 'Dokumentenansicht | ' + this.props.match.params.docPackageId;

		const keepLatLng = new URLSearchParams(this.props.routing.location.search).get('keepLatLng');

		if (keepLatLng !== null && prevProps) {
			const newUrl =
				this.props.routing.location.pathname + removeQueryPart(prevProps.routing.location.search, 'keepLatLng');
			console.log('keepLatLng');

			this.props.routingActions.push(newUrl);
			return;
		}

		if (topicParam !== this.props.docs.topic) {
			const gazData = getGazDataForTopicIds(this.props.allGazetteerTopics, [ topicParam ]);
			this.props.docsActions.setTopic(topicParam, gazData);
			return;
		}

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
			this.props.docsActions.initialize();
			let gazHit;
			this.props.docsActions.setDelayedLoadingState(docPackageIdParam, docIndex, pageIndex);

			for (let gazEntry of this.props.docs.topicData) {
				if (gazEntry.string === docPackageIdParam) {
					gazHit = gazEntry;
				}
			}

			if (gazHit) {
				this.props.bplanActions.searchForPlans(
					[
						{
							sorter: 0,
							string: gazHit.string,
							glyph: '-',
							x: gazHit.x,
							y: gazHit.y,
							more: { zl: 18, v: gazHit.more.v }
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
										'https://wunda-geoportal-docs.cismet.de/'
									),
									layer: this.replaceUmlauteAndSpaces(
										doc.url.replace('https://wunda-geoportal-docs.cismet.de/', tileservice) +
											'/{z}/{x}/{y}.png'
									),
									meta: this.replaceUmlauteAndSpaces(
										doc.url.replace('https://wunda-geoportal-docs.cismet.de/', tileservice) +
											'/meta.json'
									)
								});
							}
							for (const doc of bplan.plaene_nrk) {
								docs.push({
									group: 'nicht_rechtskraeftig',
									file: doc.file,
									url: doc.url.replace(
										'https://wunda-geoportal-docs.cismet.de/',
										'https://wunda-geoportal-docs.cismet.de/'
									),

									layer: this.replaceUmlauteAndSpaces(
										doc.url.replace('https://wunda-geoportal-docs.cismet.de/', tileservice) +
											'/{z}/{x}/{y}.png'
									),
									meta: this.replaceUmlauteAndSpaces(
										doc.url.replace('https://wunda-geoportal-docs.cismet.de/', tileservice) +
											'/meta.json'
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
									),
									hideInDocViewer: doc.hideInDocViewer,
									layer: this.replaceUmlauteAndSpaces(
										doc.url.replace('https://wunda-geoportal-docs.cismet.de/', tileservice) +
											'/{z}/{x}/{y}.png'
									),

									meta: this.replaceUmlauteAndSpaces(
										doc.url.replace('https://wunda-geoportal-docs.cismet.de/', tileservice) +
											'/meta.json'
									)
								});
							}
							this.props.docsActions.setDocsInformation(docs, () => {
								this.props.docsActions.finished(docPackageIdParam, docIndex, pageIndex, () => {
									setTimeout(() => {
										if (this.props.docs.docs[docIndex] && this.props.docs.docs[docIndex].meta) {
											this.gotoWholeDocument();
										} else {
											console.log('dont go breaking my heart');
											console.log(
												'this.props.docs.docs[docIndex]',
												this.props.docs.docs[docIndex]
											);
											console.log(
												'this.props.docs.docs[docIndex].meta',
												this.props.docs.docs[docIndex].meta
											);
										}
									}, 1);
								});
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
			//Existing docPackage but newPage or new documnet but finished with loading
			if (this.props.docs.docs.length > 0) {
				this.props.docsActions.finished(docPackageIdParam, docIndex, pageIndex, () => {
					setTimeout(() => {
						if (this.props.docs.docs[docIndex] && this.props.docs.docs[docIndex].meta) {
							this.gotoWholeDocument();
						}
					}, 1);
				});
			}
		} else {
			//console.log('dont load', this.state);
		}

		console.log('this.selectionDivRef', this.selectionDivRef);
		if (this.selectionDivRef) {
			this.scrollToVisible(this.selectionDivRef);
		}
	}

	downloadEverything = () => {
		this.setState({ downloadArchivePrepInProgress: true, downloadArchiveIcon: 'spinner' });

		let encoding = null;
		if (navigator.appVersion.indexOf('Win') !== -1) {
			encoding = 'CP850';
		}

		let downloadConf = {
			name: 'BPLAN_Plaene_und_Zusatzdokumente.' + this.props.docs.docPackageId,
			files: [],
			encoding: encoding
		};
		for (const doc of this.props.docs.docs) {
			downloadConf.files.push({
				uri: doc.url,
				folder: doc.group
			});
		}
		prepareDownloadMultipleFiles(downloadConf, this.downloadPreparationDone);
	};

	downloadPreparationDone = (result) => {
		if (result.error) {
			// this.props.bplanActions.setDocumentHasLoadingError(true);
			// setTimeout(() => {
			// 	this.props.bplanActions.setDocumentLoadingIndicator(false);
			// }, 2000);
			this.setState({
				downloadArchivePrepInProgress: false,
				downloadArchiveIcon: 'file-archive-o'
			});
		} else {
			console.log('result', result);
			downloadSingleFile(result, () => {
				this.setState({
					downloadArchivePrepInProgress: false,
					downloadArchiveIcon: 'file-archive-o'
				});
			});
		}
	};

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

		let w;
		if ((this.props.docs.docs || []).length > 1) {
			w = this.props.uiState.width - sidebarWidth + 17;
		} else {
			w = this.props.uiState.width;
		}

		this.mapStyle = {
			height: this.props.uiState.height - 50,
			width: w,
			cursor: this.props.cursor,
			backgroundColor: 'white'
		};

		let menuIsHidden = false;
		if (this.props.uiState.width < 768) {
			menuIsHidden = true;
		}

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
		let layer = this.getLayer(this.props.match.params.docPackageId);
		let fallbackPosition = {
			lat: 0,
			lng: 0
		};
		let fallbackZoom = 2;

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
			if (this.leafletRoutedMap) {
				this.leafletRoutedMap.leafletMap.leafletElement.invalidateSize();
				fallbackZoom = this.leafletRoutedMap.leafletMap.leafletElement.getBoundsZoom(
					this.getPureArrayBounds4LatLngBounds(layer.layerBounds)
				);
			}

			fallbackPosition = {
				lat: (layer.layerBounds[0][0].lat + layer.layerBounds[0][1].lat) / 2,
				lng: (layer.layerBounds[0][0].lng + layer.layerBounds[0][1].lng) / 2
			};
		}

		let problemWithDocPreviewAlert = null;
		if (
			layer === undefined &&
			this.props.docs.docIndex !== undefined &&
			this.props.docs.loadingState === LOADING_FINISHED
		) {
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
							aber{' '}
							<a href={downloadURL} target="_blank">
								hier <Icon name="download" />
							</a>{' '}
							herunterladen.
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
							<NavItem
								onClick={() => this.prevPage()}
								title="vorherige Seite"
								disabled={this.props.docs.loadingState !== LOADING_FINISHED}
								eventKey={2}
								href="#"
							>
								<Icon name="chevron-left" />
							</NavItem>
							<NavItem onClick={() => this.gotoWholeDocument()} eventKey={1} href="#">
								{/* {this.state.docIndex + 1} / {this.props.docs.docs.length} -  */}
								{(this.props.docs.pageIndex || this.props.docs.futurePageIndex) + 1} {numPages}
							</NavItem>
							<NavItem
								onClick={() => this.nextPage()}
								title="nächste Seite"
								disabled={this.props.docs.loadingState !== LOADING_FINISHED}
								eventKey={1}
								href="#"
							>
								<Icon name="chevron-right" />
							</NavItem>
						</Nav>
						<Navbar.Text>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </Navbar.Text>
						<Nav>
							<NavItem
								title="an Fensterbreite anpassen"
								onClick={() => this.gotoWholeWidth()}
								eventKey={2}
								href="#"
							>
								<Icon name="arrows-h" />
							</NavItem>
							<NavItem
								title="an Fensterhöhe anpassen"
								onClick={() => this.gotoWholeHeight()}
								eventKey={1}
								href="#"
							>
								<Icon name="arrows-v" />
							</NavItem>
						</Nav>

						<Nav pullRight>
							<NavItem
								title="Dokument herunterladen (pdf)"
								disabled={false && !downloadAvailable}
								href={downloadURL}
								target="_blank"
							>
								<Icon name="download" />
							</NavItem>
							{/* <NavItem
								title="Dokument drucken"
								disabled={false && !downloadAvailable}
								onClick={() => printJS(downloadURL)}
								target="_blank"
							>
								<Icon name="print" />
							</NavItem> */}

							<NavItem
								disabled={!downloadAvailable || this.props.docs.docs.length < 2}
								title="alles herunterladen (zip)"
								eventKey={1}
								href="#"
								onClick={() => {
									if (!this.state.downloadArchivePrepInProgress) {
										this.downloadEverything();
									}
								}}
							>
								<Icon
									spin={this.state.downloadArchivePrepInProgress}
									name={this.state.downloadArchiveIcon}
								/>
							</NavItem>
							<NavItem title="Info B-Pläne" disabled={true} eventKey={2} href="#">
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
									width: sidebarWidth + 'px'
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
									let selectionMarker = undefined;
									if (index === this.props.match.params.file - 1) {
										numPages = doc.pages;
										currentPage = this.props.docs.pageIndex + 1;
										selected = true;
										pageStatus = `${currentPage} / ${numPages}`;
										progressBar = (
											<ProgressBar
												style={{
													height: '5px',
													marginTop: 0,
													marginBottom: 0,
													autofocus: 'true'
												}}
												max={numPages}
												min={0}
												now={parseInt(currentPage, 10)}
											/>
										);
									}
									if (index === parseInt(this.props.match.params.file, 10)) {
										selectionMarker = this.selectionDivElement;
									}
									return (
										<div
											style={{
												marginBottom: 8
											}}
											key={'doc.symbol.div.' + index}
										>
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
													padding: 6
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
														{doc.file
															.replace(/.pdf$/, '')
															.replace(/^BPL_n*\d*_(0_)*/, '')
															.replace(
																/Info_BPlan-Zusatzdokumente_WUP_.*/,
																'Info Dateinamen'
															)}
													</p>
													{selectionMarker}
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
						<Column style={{ width: '100%' }} horizontal="stretch">
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
										style={this.mapStyle}
										fallbackPosition={fallbackPosition}
										fallbackZoom={fallbackZoom}
										ondblclick={this.props.ondblclick}
										// onclick={this.props.onclick}
										locationChangedHandler={(location) => {
											this.props.routingActions.push(
												this.props.routing.location.pathname +
													modifyQueryPart(this.props.routing.location.search, location)
											);
										}}
										autoFitProcessedHandler={() => this.props.mappingActions.setAutoFit(false)}
										urlSearchParams={urlSearchParams}
										boundingBoxChangedHandler={(bbox) => {
											// this.props.mappingActions.mappingBoundsChanged(bbox);
											// this.props.mappingBoundsChanged(bbox);
										}}
										backgroundlayers={'no'}
										fullScreenControlEnabled={true}
										locateControlEnabled={false}
										minZoom={1}
										maxZoom={6}
										zoomSnap={0.1}
										zoomDelta={1}
										onclick={(e) => {}}
									>
										{this.documentBoundsRectangle()}
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
		console.log('TCL: DocViewer_ -> getOptimalBounds');

		const meta = this.props.docs.docs[this.props.docs.docIndex].meta;
		const dimensions = [ meta['layer' + this.props.docs.pageIndex].x, meta['layer' + this.props.docs.pageIndex].y ];
		//const leafletSize = this.leafletRoutedMap.leafletMap.leafletElement._size; //x,y
		const leafletSize = { x: this.mapStyle.width, y: this.mapStyle.height };
		if (forDimension) {
			//const leafletSize = { x: this.mapStyle.width, y: this.mapStyle.height };
			let layer = this.getLayer();

			if (leafletSize.x / leafletSize.y < 1) {
				if (forDimension === WIDTH) {
					let targetDimensions = [ dimensions[0], dimensions[1] ];
					let rc = new L.RasterCoords(this.leafletRoutedMap.leafletMap.leafletElement, targetDimensions);
					return [ [ rc.unproject([ 0, 0 ]), rc.unproject([ targetDimensions[0], targetDimensions[1] ]) ] ];
				} else if (forDimension === HEIGHT) {
					let targetDimensions = [ dimensions[1] * leafletSize.x / leafletSize.y, dimensions[1] ];
					let rc = new L.RasterCoords(this.leafletRoutedMap.leafletMap.leafletElement, targetDimensions);
					return [ [ rc.unproject([ 0, 0 ]), rc.unproject([ targetDimensions[0], targetDimensions[1] ]) ] ];
				}
			} else {
				if (forDimension === WIDTH) {
					let targetDimensions = [ dimensions[0], dimensions[0] * leafletSize.y / leafletSize.x ];
					let rc = new L.RasterCoords(this.leafletRoutedMap.leafletMap.leafletElement, targetDimensions);
					return [ [ rc.unproject([ 0, 0 ]), rc.unproject([ targetDimensions[0], targetDimensions[1] ]) ] ];
				} else if (forDimension === HEIGHT) {
					let targetDimensions = [ dimensions[0], dimensions[1] ];
					let rc = new L.RasterCoords(this.leafletRoutedMap.leafletMap.leafletElement, targetDimensions);
					return [ [ rc.unproject([ 0, 0 ]), rc.unproject([ targetDimensions[0], targetDimensions[1] ]) ] ];
				}
			}
		}
		// const meta = {};
		const rc = new L.RasterCoords(this.leafletRoutedMap.leafletMap.leafletElement, dimensions);
		const layerBounds = [ [ rc.unproject([ 0, 0 ]), rc.unproject([ dimensions[0], dimensions[1] ]) ] ];

		return layerBounds;
	};

	gotoWholeDocument = () => {
		console.log('TCL: DocViewer_ -> gotoWholeDocument -> gotoWholeDocument');
		let wb = this.getOptimalBounds();
		//this.props.docsActions.setDebugBounds(wb);
		this.leafletRoutedMap.leafletMap.leafletElement.invalidateSize();
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

	getPureArrayBounds4LatLngBounds = (llBounds) => {
		return [ [ llBounds[0][0].lat, llBounds[0][0].lng ], [ llBounds[0][1].lat, llBounds[0][1].lng ] ];
	};

	documentBoundsRectangle = () => {
		if (this.getLayer() && this.getLayer().layerBounds) {
			const lb = this.getLayer().layerBounds;
			const bounds = this.getPureArrayBounds4LatLngBounds(lb);
			return <Rectangle bounds={bounds} color="#D8D8D8D8" />;
		} else {
			return null;
		}
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

	pad = (num, size) => {
		var s = '000000000' + num;
		return s.substr(s.length - size);
	};
	scrollToVisible = (element) => {
		scrollIntoViewIfNeeded(element, false, {
			duration: 250
		});
	};
	printPdf = (url) => {
		var iframe = this._printIframe;
		if (!this._printIframe) {
			iframe = this._printIframe = document.createElement('iframe');
			document.body.appendChild(iframe);

			iframe.style.display = 'none';
			iframe.onload = function() {
				setTimeout(function() {
					iframe.focus();
					iframe.contentWindow.print();
				}, 1);
			};
		}

		iframe.src = url;
	};
}

const DocViewer = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(DocViewer_);

export default DocViewer;

DocViewer.propTypes = {
	ui: PropTypes.object,
	uiState: PropTypes.object
};
