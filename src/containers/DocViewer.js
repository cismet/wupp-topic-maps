import PropTypes from 'prop-types';
import React from 'react';
import objectAssign from 'object-assign';

import { connect } from 'react-redux';
import { Navbar, Nav, NavItem, OverlayTrigger, Tooltip } from 'react-bootstrap';
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
import { Icon } from 'react-fa';
import PDFLayer from '../components/mapping/PDFLayer';
import Coords from '../components/mapping/CoordLayer';
import CanvasLayer from '../components/mapping/ReactCanvasLayer';

import pdfjsLib from 'pdfjs-dist';

//pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.943/pdf.worker.min.js';

function mapStateToProps(state) {
	return {
		uiState: state.uiState,
		gazetteerTopics: state.gazetteerTopics,
		routing: state.routing,
		state: state
	};
}

function mapDispatchToProps(dispatch) {
	return {
		uiStateActions: bindActionCreators(UIStateActions, dispatch),
		routingActions: bindActionCreators(RoutingActions, dispatch),
		bplanActions: bindActionCreators(bplanActions, dispatch)
	};
}
const computeScale = (page, map, layerBounds, zoom) => {
	const viewport = page.getViewport(1.0);

	const [ pageMinX, pageMinY, pageMaxX, pageMaxY ] = [ 0, 0, viewport.width, viewport.height ];

	const sw = map.project(layerBounds.getSouthWest(), zoom);
	const ne = map.project(layerBounds.getNorthEast(), zoom);

	const [ layerMinX, layerMinY, layerMaxX, layerMaxY ] = [ sw.x, sw.y, ne.x, ne.y ];

	const xScale = Math.abs(layerMaxX - layerMinX) / Math.abs(pageMaxX - pageMinX);
	const yScale = Math.abs(layerMaxY - layerMinY) / Math.abs(pageMaxY - pageMinY);
	const scale = Math.min(xScale, yScale);

	return scale;
};

export class DocViewer_ extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.gotoWholeHeight = this.gotoWholeHeight.bind(this);
		this.gotoWholeWidth = this.gotoWholeWidth.bind(this);
		this.gotoHome = this.gotoHome.bind(this);
		this.getMapRef = this.getMapRef.bind(this);
		this.getDocInfoWithHead = this.getDocInfoWithHead.bind(this);
		this.loadPage = this.loadPage.bind(this);
		this.nextDoc = this.nextDoc.bind(this);
		this.prevDoc = this.prevDoc.bind(this);

		const topic = this.props.match.params.topic || 'bplaene';
		const docPackageId = this.props.match.params.docPackageId || '1179V';
		const file = this.props.match.params.file || 1;
		const page = this.props.match.params.page || 1;

		this.state = {
			docPackageId: undefined,
			docIndex: undefined,
			pageIndex: undefined,
			pageLoadingInProgress: false,
			doc: undefined,
			caching: 0,
			docs: [],
			page: undefined,
			pageZoom: undefined,
			offScreenCanvas: document.createElement('canvas')
		};
	}

	nextDoc() {
		this.props.routingActions.push(
			'/docs/' +
				this.props.match.params.topic +
				'/' +
				this.props.match.params.docPackageId +
				'/' +
				(parseInt(this.props.match.params.file, 10) + 1)
		);
	}
	prevDoc() {
		this.props.routingActions.push(
			'/docs/' +
				this.props.match.params.topic +
				'/' +
				this.props.match.params.docPackageId +
				'/' +
				(parseInt(this.props.match.params.file, 10) - 1)
		);
	}

	loadPage(index) {
		console.log('loadPage', this.state);

		// let docs = [
		// 	'/tmp/B442_DBA.pdf',
		// 	'/tmp/BPL_0774_0_PB_Drs_05-1989_Beitrittsbeschluss.pdf',
		// 	'/tmp/BPL_1131_0_PB_Drs_10-2011_Auflistung-TÖB.pdf',
		// 	'/tmp/BPL_1131_0_PB_Drs_10-2011_Abwägung.pdf'
		// ];
		console.log('this.state', this.state);
		const doc = this.state.docs[index];
		let newState = objectAssign({}, this.state);
		newState.pageLoadingInProgress = true;
		this.setState(newState);

		pdfjsLib.getDocument(doc.url).then((pdf) => {
			console.log('loadPage getDocument');

			pdf.getPage(1).then((page) => {
				console.log('loadPage page');

				const layerBounds = new L.LatLngBounds([ -0.5, -0.5 ], [ 0.5, 0.5 ]);
				const _map = this.leafletRoutedMap.leafletMap.leafletElement;
				const canvas = document.createElement('canvas');
				const scale = 2;
				const w = page.getViewport(scale).width;
				const h = page.getViewport(scale).height;
				let xCorrection = 0;
				let yCorrection = 0;
				if (w > h) {
					canvas.width = w;
					canvas.height = w;
					yCorrection = (w - h) / 2;
				} else {
					canvas.width = h;
					canvas.height = h;
					xCorrection = (h - w) / 2;
				}
				canvas.width = w;
				canvas.height = h;
				const ctx = canvas.getContext('2d');
				// const layerBoundsTopLeft = _map.project(layerBounds.getNorthWest(), zoom);

				let newState = objectAssign({}, this.state);
				newState.offScreenCanvas = canvas;
				newState.page = page;
				this.setState(newState);
				console.log('page created', page);
				console.log('page created- state', this.state);
				console.log('page created- page.getViewport(1.0).width', page.getViewport(1.0).width);
				console.log('page created- page.getViewport(1.0).height', page.getViewport(1.0).height);
				console.log('page created- page.rotation', page);

				// let computedScale=computeScale(page, _map, layerBounds, _map.zoom)
				const viewport=page.getViewport(scale, page.rotate);
				viewport.offsetX=xCorrection;
				viewport.offsetY=yCorrection;
				

				page
					.render({
						intent: 'print',
						background: 'white', //'transparent'
						canvasContext: ctx,
						viewport: viewport,
						// viewport: new pdfjsLib.PageViewport(
						// 	page.view,
						// 	scale, //computedScale,
						// 	page.rotate,
						// 	xCorrection,
						// 	yCorrection
						// )
					})
					.then(() => {
						console.log('loadPage done render Page');
						console.log('page rendered', page);

						console.log('this.state.canvas', this.state.offScreenCanvas);
						let newState = objectAssign({}, this.state);
						newState.cache++;
						// newState.pageZoom=zoom;
						newState.pageLoadingInProgress = false;
						this.setState(newState);
					});
			});
		});
	}
	componentDidMount() {
		this.gotoHome();
		this.componentDidUpdate();
	}

	componentDidUpdate() {
		console.log('localState', this.state);

		const topic = this.props.match.params.topic || 'bplaene';
		const docPackageId = this.props.match.params.docPackageId || '1179V';
		const file = this.props.match.params.file || 1;
		const page = this.props.match.params.page || 1;
		console.log('docViewerConf:', { topic, docPackageId, file, page });

		if (this.state.docPackageId !== docPackageId || this.state.topic !== topic) {
			let gazHit;
			const bpl = JSON.parse(this.props.gazetteerTopics.bplaene);
			for (let gazEntry of bpl) {
				if (gazEntry.s === docPackageId) {
					gazHit = gazEntry;
				}
			}

			console.log('found bplan', gazHit);
			console.log('this.props.bplanActions', this.props.bplanActions);
			if (gazHit) {
				let newState = objectAssign({}, this.state);
				newState.docPackageId = docPackageId;
				newState.topic = topic;
				this.setState(newState);

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
							console.log('bplanFeature', bplanFeatures);
							let newState = objectAssign({}, this.state);

							const bplan = bplanFeatures[0].properties;
							newState.docs = [];
							for (const rkDoc of bplan.plaene_rk) {
								newState.docs.push({
									group: 'rechtskräftig',
									file: rkDoc.file,
									url: rkDoc.url //.replace('https://wunda-geoportal-docs.cismet.de/', 'bplandocs/')
								});
							}
							for (const nrkDoc of bplan.plaene_nrk) {
								newState.docs.push({
									group: 'nicht rechtskräftig',
									file: nrkDoc.file,
									url: nrkDoc.url //.replace('https://wunda-geoportal-docs.cismet.de/', 'bplandocs/')
								});
							}
							for (const doc of bplan.docs) {
								newState.docs.push({
									group: 'Zusatzdokumente',
									file: doc.file,
									url: doc.url //.replace('https://wunda-geoportal-docs.cismet.de/', 'bplandocs/')
								});
							}
							this.setState(newState);
							console.log('new State', newState);
							this.loadPage(0);

							// this.getDocInfoWithHead(newState.docs[0], 0).then((result) => {
							// 	console.log('First HEAD Fetch done', result);
							// 	let newState = objectAssign({}, this.state);
							// 	newState.activePage = objectAssign({}, newState.docs[0], result);
							// 	this.setState(newState);
							// 	console.log('newState', newState);
							// 	this.loadPage(newState.activePage, 10);

							// 	//now head fetch all other docs
							// 	// let getInfoWithHeadPromises = this.state.docs.map(this.getDocInfoWithHead);
							// 	// Promise.all(getInfoWithHeadPromises).then((results) => {
							// 	// 	console.log('all HEAD Fetches done', results);
							// 	// });
							// });

							console.log('------------------------------');
						}
					}
				);
			}
		} else if (!this.state.pageLoadingInProgress && this.state.docIndex !== undefined && this.state.docIndex !== this.props.match.params.file - 1) {
			if (this.state.docs.length > 0) {
				console.log('load the shit');
				let newState = objectAssign({}, this.state);
				newState.docIndex = this.props.match.params.file - 1;
				this.loadPage(newState.docIndex);
				this.setState(newState);
			}
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

	gotoWholeHeight() {
		console.log('gotoWholeHeight');
		const scale = 2;
		const w = this.state.page.getViewport(scale).width;
		const h = this.state.page.getViewport(scale).height;
		let xCorrection = 0.0;
		let yCorrection = 0.0;
		if (w < h) {
			// portrait
			xCorrection = 0;
		} else {
			// landscape
			yCorrection = h / w / 2;
		}
		console.log('xCorrection', xCorrection);
		console.log('yCorrection', yCorrection);

		console.log(
			'	this.leafletRoutedMap.leafletMap.leafletElement.getBounds',
			this.leafletRoutedMap.leafletMap.leafletElement.getBounds()
		);
		this.leafletRoutedMap.leafletMap.leafletElement.fitBounds([
			[ -0.5 + yCorrection, -0.5 + xCorrection ],
			[ 0.5 - yCorrection, 0.5 - xCorrection ]
		]);
		console.log(
			'	this.leafletRoutedMap.leafletMap.leafletElement.getBounds',
			this.leafletRoutedMap.leafletMap.leafletElement.getBounds()
		);
	}
	gotoWholeWidth() {
		console.log('gotoWholeWidth');
		const scale = 2;
		const w = this.state.page.getViewport(scale).width;
		const h = this.state.page.getViewport(scale).height;
		let xCorrection = 0.0;
		let yCorrection = 0.0;
		if (w < h) {
			// portrait
			xCorrection = w / h / 2;
		} else {
			// landscape
			yCorrection = 0;
		}
		console.log('xCorrection', xCorrection);
		console.log('yCorrection', yCorrection);

		console.log(
			'	this.leafletRoutedMap.leafletMap.leafletElement.getBounds',
			this.leafletRoutedMap.leafletMap.leafletElement.getBounds()
		);
		this.leafletRoutedMap.leafletMap.leafletElement.fitBounds([
			[ -0.5 + yCorrection, -0.5 + xCorrection ],
			[ 0.5 - yCorrection, 0.5 - xCorrection ]
		]);
	}

	getMapRef() {
		if (this.topicMap) {
			return this.topicMap.wrappedInstance.leafletRoutedMap.leafletMap.leafletElement;
		}
		return undefined;
	}
	render() {
		let urlSearchParams = new URLSearchParams(this.props.routing.location.search);

		let leafletContext;
		if (this.leafletRoutedMap) {
			leafletContext = {
				map: this.leafletRoutedMap.leafletMap.leafletElement
			};
			console.log(
				'	this.leafletRoutedMap.leafletMap.leafletElement',
				this.leafletRoutedMap.leafletMap.leafletElement
			);
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

		const debugMarker = (
			<div>
				<Marker position={[ 0, 0 ]}>
					<Popup>
						<h5>0,0</h5>
					</Popup>
				</Marker>
				<Marker position={[ -0.5, -0.5 ]}>
					<Popup>
						<h5>-0.5, -0.5</h5>
					</Popup>
				</Marker>
				<Marker position={[ 0.5, 0.5 ]}>
					<Popup>
						<h5>0.5, 0.5</h5>
					</Popup>
				</Marker>
				<Marker position={[ 0.5, -0.5 ]}>
					<Popup>
						<h5>0.5, -0.5</h5>
					</Popup>
				</Marker>
				<Marker position={[ -0.5, 0.5 ]}>
					<Popup>
						<h5>-0.5, 0.5</h5>
					</Popup>
				</Marker>
			</div>
		);

		return (
			<div>
				<Navbar style={{ marginBottom: 0 }} inverse collapseOnSelect>
					<Navbar.Header>
						<Navbar.Brand>
							<a href="#brand">{'BPlan ' + this.state.docPackageId}</a>
						</Navbar.Brand>
						<Navbar.Toggle />
					</Navbar.Header>
					<Navbar.Collapse>
						<Nav>
							<NavItem eventKey={1} href="#">
								<Icon name="step-backward" />
							</NavItem>
							<NavItem onClick={() => this.prevDoc()} eventKey={2} href="#">
								<Icon name="chevron-left" />
							</NavItem>
							<NavItem eventKey={1} href="#">
								{this.state.docIndex + 1} / 1 / {this.state.docs.length}
							</NavItem>
							<NavItem onClick={() => this.nextDoc()} eventKey={1} href="#">
								<Icon name="chevron-right" />
							</NavItem>
							<NavItem eventKey={2} href="#">
								<Icon name="step-forward" />
							</NavItem>
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
						<Nav>
							<NavItem onClick={() => this.gotoWholeWidth()} eventKey={2} href="#">
								<Icon spin={true} name="refresh" />
							</NavItem>
						</Nav>

						<Nav pullRight>
							<NavItem eventKey={1} href="#">
								<Icon name="download" />
							</NavItem>
							<NavItem eventKey={1} href="#">
								<Icon name="file-archive-o" />
							</NavItem>
							<NavItem eventKey={2} href="#">
								<Icon name="question-circle" />
							</NavItem>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
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
					onclick={(e) => console.log('click', e)}
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
							//caching={this.state.caching}
						/>
					)} */}
					{/* <PDFLayer /> */}
					{/* <Coords/> */}
					{/* {debugMarker} */}
					<Rectangle bounds={[ [ -0.5, -0.5 ], [ 0.5, 0.5 ] ]} color="#D8D8D8D8" />
					{this.leafletRoutedMap && (
						<CanvasLayer
							key={'CANVAS' + this.state.caching}
							leaflet={leafletContext}
							drawMethod={(info) => {
								console.log('in drawMethod(', info);

								const ctx = info.canvas.getContext('2d');
								ctx.fillStyle = 'black';
								ctx.clearRect(0, 0, info.canvas.width, info.canvas.height);
								var point = info.map.latLngToContainerPoint([ 0, 0 ]);
								console.log('info', info);
								console.log('info.canvas.width, info.canvas.height', [
									info.canvas.width,
									info.canvas.height
								]);

								// ctx.fillText('Center ', point.x, point.y);
								if (this.leafletRoutedMap) {
									const w=this.state.offScreenCanvas.width;
									const h=this.state.offScreenCanvas.height;
									let ph, pw;

									if (w>h){
										pw=1;
										ph=h/w;
									}
									else {
										ph=1;
										pw=w/h;
									}
									console.log('[pw,ph]',[pw,ph]);
									
									// const layerBounds = new L.LatLngBounds([ -0.5, -0.5 ], [ 0.5, 0.5 ]);
									const layerBounds = new L.LatLngBounds([ -ph/2, -pw/2  ], [ ph/2 , pw/2  ]);
									const zoom = info.map.getZoom();
									const layerBoundsTopLeft = info.map.project(layerBounds.getNorthWest(), zoom);
									const layerBoundsBottomRight = info.map.project(layerBounds.getSouthEast(), zoom);

									const mapBoundsTopLeft = info.map.project(info.bounds.getNorthWest(), zoom);
									const layerBoundsPixelWidth =
										-1 * (layerBoundsTopLeft.x - layerBoundsBottomRight.x);
									const layerBoundsPixelHeight =
										-1 * (layerBoundsTopLeft.y - layerBoundsBottomRight.y);
									console.log('layerBoundsTopLeft', layerBoundsTopLeft);
									console.log('mapBoundsTopLeft', mapBoundsTopLeft);
									console.log('layerBoundsBottomRight', layerBoundsBottomRight);
									console.log('width', -1 * (layerBoundsTopLeft.x - layerBoundsBottomRight.x));

									console.log('x', layerBoundsTopLeft.x - mapBoundsTopLeft.x);
									console.log('y', layerBoundsTopLeft.y - mapBoundsTopLeft.y);
									console.log('y', layerBoundsTopLeft.y - mapBoundsTopLeft.y);
									console.log(' info.map', zoom);
									console.log('this.state.pageZoom', this.state.pageZoom);

									ctx.drawImage(
										this.state.offScreenCanvas,
										//0,0,5526,5526,
										layerBoundsTopLeft.x - mapBoundsTopLeft.x,
										layerBoundsTopLeft.y - mapBoundsTopLeft.y,
										layerBoundsPixelWidth,
										layerBoundsPixelHeight
										//5526*zoom/this.state.pageZoom,5526*zoom/this.state.pageZoom
									);
									console.log('this.state.offScreenCanvas', this.state.offScreenCanvas);
								}
								ctx.stroke();
							}}
						/>
					)}
					{this.state.activePage !== undefined && (
						<Control position="bottomright">
							<p style={{ backgroundColor: '#D8D8D8D8', padding: '5px' }}>
								{this.state.activePage !== undefined ? '   ' + this.state.activePage.file + '   ' : ''}
							</p>
						</Control>
					)}
				</RoutedMap>
			</div>
		);
	}
}

const DocViewer = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(DocViewer_);

export default DocViewer;

DocViewer.propTypes = {
	ui: PropTypes.object,
	uiState: PropTypes.object
};
