import PropTypes from 'prop-types';
import React from 'react';
import objectAssign from 'object-assign';
import CanvasLayer from 'react-leaflet-canvas-layer';

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

export class DocViewer_ extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.gotoWholeHeight = this.gotoWholeHeight.bind(this);
		this.gotoWholeWidth = this.gotoWholeWidth.bind(this);
		this.gotoHome = this.gotoHome.bind(this);
		this.getMapRef = this.getMapRef.bind(this);
		this.getDocInfoWithHead = this.getDocInfoWithHead.bind(this);

		const topic = this.props.match.params.topic || 'bplaene';
		const docPackageId = this.props.match.params.docPackageId || '1179V';
		const file = this.props.match.params.file || 1;
		const page = this.props.match.params.page || 1;

		this.state = {
			docPackageId: undefined,
			docIndex: undefined,
			pageIndex: undefined,
			doc: undefined,
			caching: 0,
			docs: []
		};
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
							const bplan = bplanFeatures[0].properties;
							newState.docs = [];
							for (const rkDoc of bplan.plaene_rk) {
								newState.docs.push({
									group: 'rechtskräftig',
									file: rkDoc.file,
									url: rkDoc.url.replace('https://wunda-geoportal-docs.cismet.de/', 'bplandocs/')
								});
							}
							// for (const nrkDoc of bplan.plaene_nrk) {
							// 	newState.docs.push({
							// 		group: 'nicht rechtskräftig',
							// 		file: nrkDoc.file,
							// 		url: nrkDoc.url.replace('https://wunda-geoportal-docs.cismet.de/', 'bplandocs/')
							// 	});
							// }
							// for (const doc of bplan.docs) {
							// 	newState.docs.push({
							// 		group: 'Zusatzdokumente',
							// 		file: doc.file,
							// 		url: doc.url.replace('https://wunda-geoportal-docs.cismet.de/', 'bplandocs/')
							// 	});
							// }
							this.setState(newState);

							// this.getDocInfoWithHead(newState.docs[0], 0).then((result) => {
							// 	console.log('First HEAD Fetch done', result);
							// 	let newState = objectAssign({}, this.state);
							// 	newState.activePage = objectAssign({}, newState.docs[0], result);
							// 	this.setState(newState);

							// 	//now head fetch all other docs
							// 	let getInfoWithHeadPromises = this.state.docs.map(this.getDocInfoWithHead);
							// 	Promise.all(getInfoWithHeadPromises).then((results) => {
							// 		console.log('all HEAD Fetches done', results);
							// 	});
							// });

							console.log('------------------------------');
						}
					}
				);
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

		let xCorrection = 0.0;
		let yCorrection = 0.0;
		if (this.state.activePage.width < this.state.activePage.height) {
			// portrait
			xCorrection = 0;
		} else {
			// landscape

			yCorrection = this.state.activePage.height / this.state.activePage.width / 2;
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

		let xCorrection = 0.0;
		let yCorrection = 0.0;
		if (this.state.activePage.width < this.state.activePage.height) {
			// portrait
			xCorrection = this.state.activePage.width / this.state.activePage.height / 2;
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
							<NavItem eventKey={2} href="#">
								<Icon name="chevron-left" />
							</NavItem>
							<NavItem eventKey={1} href="#">
								1 / 1
							</NavItem>
							<NavItem eventKey={1} href="#">
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
					zoomSnap={0.25}
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
					<PDFLayer />
					{/* <Coords/> */}
					{/* {debugMarker} */}
					<Rectangle bounds={[ [ -0.5, -0.5 ], [ 0.5, 0.5 ] ]} color="#D8D8D8D8" />
					<CanvasLayer
            drawMethod={(info)=>{
				const ctx = info.canvas.getContext('2d');
    ctx.clearRect(0, 0, info.canvas.width, info.canvas.height);
    ctx.fillStyle = 'rgba(255,116,0, 0.2)';
    var point = info.map.latLngToContainerPoint([-37, 175]);
    ctx.beginPath();
    ctx.arc(point.x, point.y, 200, 0, Math.PI * 2.0, true, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
			}}
          />
					{ this.state.activePage!==undefined && (<Control position="bottomright">
						<p style={{ backgroundColor: '#D8D8D8D8', padding: '5px' }}>
							{this.state.activePage!==undefined ? '   ' + this.state.activePage.file + '   ' : ''} 
						</p>
					</Control>)}
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
