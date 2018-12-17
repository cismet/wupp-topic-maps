import PropTypes from 'prop-types';
import React from 'react';
import objectAssign from 'object-assign';

import { connect } from 'react-redux';
import { Navbar, Nav, NavItem, OverlayTrigger, Tooltip, MenuItem} from 'react-bootstrap';
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
import Loadable from 'react-loading-overlay';
import { isThisQuarter } from 'date-fns';

//pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.943/pdf.worker.min.js';

const WIDTH = 'WIDTH';
const HEIGHT = 'HEIGHT';
const BOTH = 'BOTH';

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
		this.pushRouteForForPage = this.pushRouteForForPage.bind(this);
		this.changeState = this.changeState.bind(this);
		this.showMainDoc = this.showMainDoc.bind(this);
		this.getLayerBoundsForOffscreenCanvas = this.getLayerBoundsForOffscreenCanvas.bind(this);
		this.getOptimalBounds = this.getOptimalBounds.bind(this);
		this.gotoWholeDocument = this.gotoWholeDocument.bind(this);
		this.getPDFPage=this.getPDFPage.bind(this);

		const topic = this.props.match.params.topic || 'bplaene';
		const docPackageId = this.props.match.params.docPackageId || '1179V';
		const file = this.props.match.params.file || 1;
		const page = this.props.match.params.page || 1;

		this.state = {
			docPackageId: undefined,
			pageLoadingInProgress: false,
			enablePageLoadingInProgressMessage: false,

			pdfdoc: undefined,
			page: undefined,

			docIndex: undefined,
			pageIndex: undefined,

			doc: undefined,
			caching: 0,

			docs: [],
			offScreenCanvas: document.createElement('canvas'),
			debugBounds: [ [ -0.5, -0.5 ], [ 0.5, 0.5 ] ]
		};
	}

	pushRouteForForPage(topic, docPackageId, docIndex, pageIndex) {
		console.log('this.props.routing', this.props.routing);

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
		this.pushRouteForForPage(this.props.match.params.topic, this.props.match.params.docPackageId, 1, 1);
	}

	nextDoc() {
		if (parseInt(this.props.match.params.file, 10) < this.state.docs.length) {
			this.pushRouteForForPage(
				this.props.match.params.topic,
				this.props.match.params.docPackageId,
				parseInt(this.props.match.params.file, 10) + 1,
				1
			);
		}
	}
	prevDoc() {
		if (parseInt(this.props.match.params.file, 10) > 1) {
			this.pushRouteForForPage(
				this.props.match.params.topic,
				this.props.match.params.docPackageId,
				parseInt(this.props.match.params.file, 10) - 1,
				1
			);
		}
	}

	nextPage() {
		if (parseInt(this.props.match.params.page, 10) < this.state.pdfdoc._pdfInfo.numPages) {
			this.pushRouteForForPage(
				this.props.match.params.topic,
				this.props.match.params.docPackageId,
				parseInt(this.props.match.params.file, 10),
				parseInt(this.props.match.params.page, 10) + 1
			);
		}
	}
	prevPage() {
		if (parseInt(this.props.match.params.page, 10) > 1) {
			this.pushRouteForForPage(
				this.props.match.params.topic,
				this.props.match.params.docPackageId,
				parseInt(this.props.match.params.file, 10),
				parseInt(this.props.match.params.page, 10) - 1
			);
		}
	}

	changeState(changes) {
		let newState = objectAssign({}, this.state, changes);
		this.setState(newState);
	}

	loadPage(index, pageNo = 0) {
		// let docs = [
		// 	'/tmp/B442_DBA.pdf',
		// 	'/tmp/BPL_0774_0_PB_Drs_05-1989_Beitrittsbeschluss.pdf',
		// 	'/tmp/BPL_1131_0_PB_Drs_10-2011_Auflistung-TÖB.pdf',
		// 	'/tmp/BPL_1131_0_PB_Drs_10-2011_Abwägung.pdf'
		// ];
		console.log('loadPage this.state', this.state);
		const doc = this.state.docs[index];
		let newState = objectAssign({}, this.state);
		newState.pageLoadingInProgress = true;
		this.setState(newState);
		console.log('loadPage', this.state);

		if (index !== this.state.docIndex) {
			this.changeState({pdfdoc:undefined});
			pdfjsLib.getDocument(doc.url).then((pdf) => {
				this.changeState({pdfdoc:pdf,pageLoadingInProgress:true});
				this.getPDFPage(pdf, pageNo)
			});
		} else {
			console.log('pdf already loaded');
			
			this.getPDFPage(this.state.pdfdoc, pageNo);
		}
	}

	getPDFPage(pdf, pageNo){
		pdf.getPage(pageNo + 1).then((page) => {
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
			newState.pageLoadingInProgress = true;
			this.setState(newState);
			console.log('page created', page);
			console.log('page created- state', this.state);
			console.log('page created- page.getViewport(1.0).width', page.getViewport(1.0).width);
			console.log('page created- page.getViewport(1.0).height', page.getViewport(1.0).height);
			console.log('page created- page.rotation', page);

			// let computedScale=computeScale(page, _map, layerBounds, _map.zoom)
			const viewport = page.getViewport(scale, page.rotate);
			viewport.offsetX = xCorrection;
			viewport.offsetY = yCorrection;

			page
				.render({
					intent: 'print',
					background: 'white', //'transparent'
					canvasContext: ctx,
					viewport: viewport
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
					newState.pageLoadingInProgress = false;
					this.setState(newState);
					setTimeout(() => {
						this.gotoWholeDocument();
					}, 100);
				});
		});
	}


	componentDidMount() {
		this.componentDidUpdate();
	}

	componentDidUpdate() {
		console.log('localState', this.state);
		const topic = this.props.match.params.topic || 'bplaene';
		const docPackageId = this.props.match.params.docPackageId || '1179V';
		const fileNumber = this.props.match.params.file || 1;
		const pageNumber = this.props.match.params.page || 1;
		console.log('docViewerConf:', { topic, docPackageId, fileNumber, pageNumber });




		if (this.props.match.params.file === undefined || this.props.match.params.page === undefined) {
			//not necessary to check file && page || page cause if file is undefined page must beundefined too
			this.pushRouteForForPage(topic, docPackageId, fileNumber, pageNumber);
			return;
		}

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
				this.changeState({ docPackageId, topic, docIndex:undefined });
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
							const bplan = bplanFeatures[0].properties;
							let docs = [];
							for (const rkDoc of bplan.plaene_rk) {
								docs.push({
									group: 'rechtskräftig',
									file: rkDoc.file,
									url: rkDoc.url //.replace('https://wunda-geoportal-docs.cismet.de/', 'bplandocs/')
								});
							}
							for (const nrkDoc of bplan.plaene_nrk) {
								docs.push({
									group: 'nicht rechtskräftig',
									file: nrkDoc.file,
									url: nrkDoc.url //.replace('https://wunda-geoportal-docs.cismet.de/', 'bplandocs/')
								});
							}
							for (const doc of bplan.docs) {
								docs.push({
									group: 'Zusatzdokumente',
									file: doc.file,
									url: doc.url //.replace('https://wunda-geoportal-docs.cismet.de/', 'bplandocs/')
								});
							}
							this.changeState({ docs });

							//							this.loadPage(0);

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
		} else if (
			(!this.state.pageLoadingInProgress && this.state.docIndex === undefined) ||
			// (this.state.docPackageId !== undefined && this.state.docPackageId !== this.props.match.params.docPackageId - 1) ||
			(this.state.docIndex !== undefined && this.state.docIndex !== this.props.match.params.file - 1) ||
			(this.state.pageIndex !== undefined && this.state.pageIndex !== this.props.match.params.page - 1)
		) {
			if (this.state.docs.length > 0) {
				let newState = objectAssign({}, this.state);
				newState.docIndex = fileNumber - 1;
				newState.pageIndex = pageNumber - 1;
				this.loadPage(newState.docIndex, newState.pageIndex);
				this.setState(newState);
			}
		} else {
			console.log('dont load', this.state);
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
		const w = this.state.offScreenCanvas.width;
		const h = this.state.offScreenCanvas.height;

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
		this.changeState({ debugBounds: wb });
		this.leafletRoutedMap.leafletMap.leafletElement.fitBounds(wb);
	}

	gotoWholeWidth() {
		let wb = this.getOptimalBounds(WIDTH);
		this.changeState({ debugBounds: wb });
		this.leafletRoutedMap.leafletMap.leafletElement.fitBounds(wb);
	}

	gotoWholeHeight() {
		let hb = this.getOptimalBounds(HEIGHT);
		this.changeState({ debugBounds: this.getOptimalBounds() });
		this.leafletRoutedMap.leafletMap.leafletElement.fitBounds(hb);

		// console.log('gotoWholeHeight');
		// const scale = 2;
		// const w = this.state.page.getViewport(scale).width;
		// const h = this.state.page.getViewport(scale).height;
		// let xCorrection = 0.0;
		// let yCorrection = 0.0;
		// if (w < h) {
		// 	// portrait
		// 	xCorrection = 0;
		// } else {
		// 	// landscape
		// 	yCorrection = h / w / 2;
		// }
		// console.log('xCorrection', xCorrection);
		// console.log('yCorrection', yCorrection);

		// console.log(
		// 	'	this.leafletRoutedMap.leafletMap.leafletElement.getBounds',
		// 	this.leafletRoutedMap.leafletMap.leafletElement.getBounds()
		// );
		// this.leafletRoutedMap.leafletMap.leafletElement.fitBounds([
		// 	[ -0.5 + yCorrection, -0.5 + xCorrection ],
		// 	[ 0.5 - yCorrection, 0.5 - xCorrection ]
		// ]);
		// console.log(
		// 	'	this.leafletRoutedMap.leafletMap.leafletElement.getBounds',
		// 	this.leafletRoutedMap.leafletMap.leafletElement.getBounds()
		// );
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

		let numPages;

		if (this.state.pdfdoc) {
			numPages = this.state.pdfdoc._pdfInfo.numPages;
		} else {
			numPages = '?';
		}

		return (
			<div>
				<Navbar style={{ marginBottom: 0 }} inverse collapseOnSelect>
					<Navbar.Header>
						<Navbar.Brand>
							<a onClick={() => this.showMainDoc()} disabled={this.state.pageLoadingInProgress}>
								{'BPlan ' + this.state.docPackageId}
							</a>
						</Navbar.Brand>
						<Navbar.Toggle />
					</Navbar.Header>
					<Navbar.Collapse>
						<Nav>
							<NavItem
								onClick={() => this.prevDoc()}
								disabled={this.state.pageLoadingInProgress}
								eventKey={1}
								href="#"
							>
								<Icon name="step-backward" />
							</NavItem>
							<NavItem
								onClick={() => this.prevPage()}
								disabled={this.state.pageLoadingInProgress}
								eventKey={2}
								href="#"
							>
								<Icon name="chevron-left" />
							</NavItem>
							<NavItem eventKey={1} href="#">
								{this.state.docIndex + 1} / {this.state.docs.length} - {this.state.pageIndex + 1} /{' '}
								{numPages}
							</NavItem>
							<NavItem
								onClick={() => this.nextPage()}
								disabled={this.state.pageLoadingInProgress}
								eventKey={1}
								href="#"
							>
								<Icon name="chevron-right" />
							</NavItem>
							<NavItem
								onClick={() => this.nextDoc()}
								disabled={this.state.pageLoadingInProgress}
								eventKey={2}
								href="#"
							>
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
						{/* <Nav>
							<NavItem onClick={() => this.gotoWholeWidth()} eventKey={2} href="#">
								<Icon spin={true} name="refresh" />
							</NavItem>
						</Nav> */}

						<Nav pullRight>
							
							{(this.state.docs.length>0 && this.state.docIndex !== undefined && <MenuItem href={this.state.docs[this.state.docIndex].url} target="_blank"><Icon name="download" /></MenuItem>)}
							<NavItem disabled={true} eventKey={1} href="#">
								<Icon name="file-archive-o" />
							</NavItem>
							<NavItem disabled={true} eventKey={2} href="#">
								<Icon name="question-circle" />
							</NavItem>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
				<Loadable delay={500} active={this.state.pageLoadingInProgress} spinner text="Laden der Datei ...">
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
						{/* {this.state.debugBounds && <Rectangle bounds={this.state.debugBounds} color="#D8D8D8D8" />} */}
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
									if (this.leafletRoutedMap && this.state.pageLoadingInProgress === false) {
										const layerBounds = this.getLayerBoundsForOffscreenCanvas();
										const zoom = info.map.getZoom();
										const layerBoundsTopLeft = info.map.project(layerBounds.getNorthWest(), zoom);
										const layerBoundsBottomRight = info.map.project(
											layerBounds.getSouthEast(),
											zoom
										);

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

										ctx.drawImage(
											this.state.offScreenCanvas,
											//0,0,5526,5526,
											layerBoundsTopLeft.x - mapBoundsTopLeft.x,
											layerBoundsTopLeft.y - mapBoundsTopLeft.y,
											layerBoundsPixelWidth,
											layerBoundsPixelHeight
										);
										console.log('this.state.offScreenCanvas', this.state.offScreenCanvas);
									}
									ctx.stroke();
								}}
							/>
						)}
						{this.state.docIndex !== undefined &&
						this.state.docs.length > 0 && (
							<Control position="bottomright">
								<p style={{ backgroundColor: '#D8D8D8D8', padding: '5px' }}>
									{this.state.docs[this.state.docIndex].file}
								</p>
							</Control>
						)}
					</RoutedMap>
				</Loadable>
			</div>
		);
	}

	getLayerBoundsForOffscreenCanvas() {
		const w = this.state.offScreenCanvas.width;
		const h = this.state.offScreenCanvas.height;
		let ph, pw;

		if (w > h) {
			pw = 1;
			ph = h / w;
		} else {
			ph = 1;
			pw = w / h;
		}
		console.log('[pw,ph]', [ pw, ph ]);

		// const layerBounds = new L.LatLngBounds([ v ], [ 0.5, 0.5 ]);
		const layerBounds = new L.LatLngBounds([ -ph / 2, -pw / 2 ], [ ph / 2, pw / 2 ]);
		return layerBounds;
	}
}

const DocViewer = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(DocViewer_);

export default DocViewer;

DocViewer.propTypes = {
	ui: PropTypes.object,
	uiState: PropTypes.object
};
