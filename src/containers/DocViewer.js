import L from 'leaflet';
import PropTypes from 'prop-types';
import React from 'react';
import { Alert, Nav, Navbar, NavItem, ProgressBar, Well } from 'react-bootstrap';
import { RoutedMap } from 'react-cismap';
import { Rectangle, TileLayer } from 'react-leaflet';
import Control from 'react-leaflet-control';
import Loadable from 'react-loading-overlay';
import { connect } from 'react-redux';
import { routerActions as RoutingActions } from 'react-router-redux';
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';
import { Column, Row } from 'simple-flexbox';

import Icon from 'components/commons/Icon';
import { bindActionCreators } from 'redux';

import { actions as bplanActions } from '../redux/modules/bplaene';
import { actions as DocsActions } from '../redux/modules/docs';
import { constants as DOC_CONSTANTS } from '../redux/modules/docs';
import { actions as AEVActions } from '../redux/modules/fnp_aenderungsverfahren';
import {
  actions as gazetteerTopicsActions,
  getGazDataForTopicIds,
} from '../redux/modules/gazetteerTopics';
import { actions as UIStateActions } from '../redux/modules/uiState';
import {
  getDocsForAEVGazetteerEntry,
  getDocsForBPlanGazetteerEntry,
  getDocsForStaticEntry,
} from '../utils/docsHelper';
import { downloadSingleFile, prepareDownloadMultipleFiles } from '../utils/downloadHelper';
import { modifyQueryPart, removeQueryPart } from '../utils/routingHelper';

import 'url-search-params-polyfill';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripLinesVertical } from '@fortawesome/free-solid-svg-icons';

/* eslint-disable jsx-a11y/anchor-is-valid */

L.RasterCoords = function (map, imgsize, tilesize) {
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
  zoomLevel: function () {
    return Math.ceil(Math.log(Math.max(this.width, this.height) / this.tilesize) / Math.log(2));
  },
  /**
   * unproject `coords` to the raster coordinates used by the raster image projection
   * @param {Array} coords - [ x, y ]
   * @return {L.LatLng} - internal coordinates
   */
  unproject: function (coords) {
    return this.map.unproject(coords, this.zoom);
  },
  /**
   * project `coords` back to image coordinates
   * @param {Array} coords - [ x, y ]
   * @return {L.LatLng} - image coordinates
   */
  project: function (coords) {
    return this.map.project(coords, this.zoom);
  },
  /**
   * sets the max bounds on map
   */
  setMaxBounds: function () {
    var southWest = this.unproject([0, this.height]);
    var northEast = this.unproject([this.width, 0]);
    this.map.setMaxBounds(new L.LatLngBounds(southWest, northEast));
  },
};

const WIDTH = 'WIDTH';
const HEIGHT = 'HEIGHT';

const LOADING_FINISHED = 'LOADING_FINISHED';
const LOADING_OVERLAY = 'LOADING_OVERLAY';

const zipFileNameMapping = DOC_CONSTANTS.ZIP_FILE_NAME_MAPPING;
const filenameShortenerMapping = DOC_CONSTANTS.SIDEBAR_FILENAME_SHORTENER;

function mapStateToProps(state) {
  return {
    uiState: state.uiState,
    allGazetteerTopics: state.gazetteerTopics,
    routing: state.routing,
    docs: state.docs,
    mapping: state.mapping,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    uiStateActions: bindActionCreators(UIStateActions, dispatch),
    routingActions: bindActionCreators(RoutingActions, dispatch),
    bplanActions: bindActionCreators(bplanActions, dispatch),
    aevActions: bindActionCreators(AEVActions, dispatch),
    docsActions: bindActionCreators(DocsActions, dispatch),
    gazetteerTopicsActions: bindActionCreators(gazetteerTopicsActions, dispatch),
  };
}
const sideBarMinSize = 130;

export class DocViewer_ extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      downloadArchiveIcon: 'file-archive-o',
      downloadArchivePrepInProgress: false,
      gazDataLoaded: false,
      topicDataLoaded: false,
      sidebarWidth: sideBarMinSize,
    };
    this.loadData = this.loadData.bind(this);
    this.startResizing = this.startResizing.bind(this);
    this.stopResizing = this.stopResizing.bind(this);
    this.resize = this.resize.bind(this);
    this.invalidateMapSize = this.invalidateMapSize.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
  }
  onMouseDown(e) {
    //only start resizing if the user clicked with the default button
    if (e.button === 0) {
      this.startResizing(e);
    }
  }

  startResizing() {
    this.setState({ ...this.state, resizing: true });
  }
  stopResizing() {
    this.setState({ ...this.state, resizing: false });
  }

  onMouseMove(e) {
    if (this.state.resizing === true) {
      e.preventDefault();
      this.resize(e.clientX);
    }
  }
  onTouchMove(e) {
    if (this.state.resizing === true) {
      e.preventDefault();
      this.resize(e.touches[0].clientX);
    }
  }

  resize(clientX) {
    if (this.state.resizing === true) {
      const newSidebarWidth = clientX - this.sidebarRef.getBoundingClientRect().left + 5;
      if (newSidebarWidth >= sideBarMinSize) {
        this.setState({
          ...this.state,
          sidebarWidth: newSidebarWidth,
        });
      }
      // console.log('xxxx resizing', clientX - this.sidebarRef.getBoundingClientRect().left + 5);
    }
  }

  loadData(dataLoader) {
    var promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        // entweder dataLoader ist eine Funktion oder ein Array von Funktionen
        if (Array.isArray(dataLoader)) {
          this.props.uiStateActions.setPendingLoader(dataLoader.length);
          for (const loader of dataLoader) {
            loader(() => {
              this.props.uiStateActions.setPendingLoader(this.props.uiState.pendingLoader - 1);
            });
          }
        } else {
          console.log('xxx');

          this.props.uiStateActions.setPendingLoader(1);
          if (dataLoader) {
            dataLoader(() => {
              console.log('this.props.uiStateActions.setPendingLoader(0)');

              this.props.uiStateActions.setPendingLoader(0);
            });
          }
        }
        resolve('ok');
      }, 100);
    });
    return promise;
  }
  componentWillMount() {
    this.loadData([
      this.props.aevActions.loadAEVs,
      //this.props.bplanActions.loadBPlaene
    ]).then((data) => {
      // setTimeout(() => {
      this.setState({ topicDataLoaded: true });
      this.forceUpdate();
      // }, 2500);
    });
    this.props.gazetteerTopicsActions.loadTopicsData(['bplaene', 'aenderungsv']).then(() => {
      this.setState({ gazDataLoaded: true });
      this.forceUpdate();
    });
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('touchmove', this.onTouchMove);
    window.addEventListener('mouseup', this.stopResizing);
  }
  componentWillUnmount() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('mouseup', this.stopResizing);
  }

  componentDidMount() {
    this.componentDidUpdate();
    this.selectionDivElement = <div ref={(comp) => (this.selectionDivRef = comp)} />; // add SELECTION+1 as text to the divto see the principle
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('this.state', this.state);

    if (
      this.state.gazDataLoaded === false ||
      this.state.topicDataLoaded === false ||
      this.props.uiState.pendingLoader > 0
    ) {
      return;
    }
    // if (!this.props.allGazetteerTopics.bplaene || !this.props.allGazetteerTopics.aenderungsv) {
    // 	return;
    // }
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
        this.props.routing.location.pathname +
        removeQueryPart(prevProps.routing.location.search, 'keepLatLng');

      this.props.routingActions.push(newUrl);
      return;
    }

    if (topicParam !== this.props.docs.topic) {
      const gazData = getGazDataForTopicIds(this.props.allGazetteerTopics, [topicParam]);
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

    if (
      this.props.docs.docPackageId !== docPackageIdParam ||
      this.props.docs.topic !== topicParam
    ) {
      this.props.docsActions.initialize();
      let gazHit;
      this.props.docsActions.setDelayedLoadingState(docPackageIdParam, docIndex, pageIndex);

      for (let gazEntry of this.props.docs.topicData) {
        if (gazEntry.string === docPackageIdParam) {
          gazHit = gazEntry;
        }
      }

      if (gazHit || topicParam === 'static') {
        switch (topicParam) {
          case 'bplaene': {
            const p = {
              docPackageIdParam,
              docIndex,
              pageIndex,
              gazHit,
              searchForPlans: this.props.bplanActions.searchForPlans,
              getPlanFeatureByGazObject: this.props.bplanActions.getPlanFeatureByGazObject,
              docsActions: this.props.docsActions,
              docs: this.props.docs,
              gotoWholeDocument: this.gotoWholeDocument,
            };
            getDocsForBPlanGazetteerEntry(p);
            break;
          }
          case 'aenderungsv': {
            const p = {
              docPackageIdParam,
              docIndex,
              pageIndex,
              gazHit,
              searchForAEVs: this.props.aevActions.searchForAEVs,
              docsActions: this.props.docsActions,
              docs: this.props.docs,
              gotoWholeDocument: this.gotoWholeDocument,
            };
            getDocsForAEVGazetteerEntry(p);
            break;
          }
          case 'static': {
            console.log('STATIIIIIIIIIC');

            const p = {
              docPackageIdParam,
              docIndex,
              pageIndex,
              docsActions: this.props.docsActions,
              docs: this.props.docs,
              gotoWholeDocument: this.gotoWholeDocument,
            };
            getDocsForStaticEntry(p);
            break;
          }
          default:
            break;
        }
      }
    } else if (
      (this.props.docs.loadingState === LOADING_FINISHED &&
        this.props.docs.docIndex === undefined) ||
      // (this.props.docs.docPackageId !== undefined && this.props.docs.docPackageId !== this.props.match.params.docPackageId - 1) ||
      (this.props.docs.docIndex !== undefined &&
        this.props.docs.docIndex !== this.props.match.params.file - 1) ||
      (this.props.docs.pageIndex !== undefined &&
        this.props.docs.pageIndex !== this.props.match.params.page - 1)
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

    if (this.selectionDivRef) {
      this.scrollToVisible(this.selectionDivRef);
    }
  }

  filenameShortener = (original) => {
    const topicParam = this.props.match.params.topic;

    if (
      topicParam !== undefined &&
      filenameShortenerMapping[topicParam] !== undefined &&
      {}.toString.call(filenameShortenerMapping[topicParam]) === '[object Function]'
    ) {
      const shorty = filenameShortenerMapping[topicParam](original);

      return shorty;
    } else {
      return original;
    }
  };

  downloadEverything = () => {
    this.setState({ downloadArchivePrepInProgress: true, downloadArchiveIcon: 'spinner' });
    let encoding = null;
    if (navigator.appVersion.indexOf('Win') !== -1) {
      encoding = 'CP850';
    }

    let zipnamePrefix = zipFileNameMapping[this.props.docs.topic];
    if (zipnamePrefix === undefined) {
      zipnamePrefix = 'Archiv.';
    } else if (zipnamePrefix !== '') {
      zipnamePrefix = zipnamePrefix + '.';
    }

    let downloadConf = {
      name: zipnamePrefix + this.props.docs.docPackageId,
      files: [],
      encoding: encoding,
    };
    for (const doc of this.props.docs.docs) {
      downloadConf.files.push({
        uri: doc.url,
        folder: doc.group,
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
        downloadArchiveIcon: 'file-archive-o',
      });
    } else {
      downloadSingleFile(result, () => {
        setTimeout(() => {
          this.setState({
            downloadArchivePrepInProgress: false,
            downloadArchiveIcon: 'file-archive-o',
          });
        }, 250);
      });
    }
  };

  invalidateMapSize = () => {
    if (this.leafletRoutedMap) {
      this.leafletRoutedMap.leafletMap.leafletElement.invalidateSize();
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

    let w;
    if ((this.props.docs.docs || []).length > 1) {
      w = this.props.uiState.width - this.state.sidebarWidth;
    } else {
      w = this.props.uiState.width;
    }
    this.mapStyle = {
      height: this.props.uiState.height - 50,
      width: w,
      cursor: this.props.cursor,
      backgroundColor: 'white',
    };

    let numPages;
    // console.log('numPagesPostfix decission', {
    // 	docs: this.props.docs.docs,
    // 	docIndex: this.props.docs.docIndex,
    // 	xxx: this.props.docs.docs[this.props.docs.docIndex]
    // });

    if (
      this.props.docs.docs !== undefined &&
      this.props.docs.docIndex !== undefined &&
      this.props.docs.docs[this.props.docs.docIndex] !== undefined
    ) {
      const pages = this.props.docs.docs[this.props.docs.docIndex].pages;

      numPages = ' / ' + pages;
    }
    let downloadURL;
    const downloadAvailable =
      this.props.docs.docs.length > 0 && this.props.docs.docIndex !== undefined;

    if (downloadAvailable && this.props.docs.docs[this.props.docs.docIndex]) {
      downloadURL = this.props.docs.docs[this.props.docs.docIndex].url;
    }

    let docLayer = <div />;
    let layer = this.getLayer(this.props.match.params.docPackageId);
    let fallbackPosition = {
      lat: 0,
      lng: 0,
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
        lng: (layer.layerBounds[0][0].lng + layer.layerBounds[0][1].lng) / 2,
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
            left:
              (this.props.uiState.width - this.state.sidebarWidth) / 2 -
              (this.props.uiState.width - this.state.sidebarWidth) * 0.2,
            top: '30%',
            width: '100%',
            height: '100%',
            textAlign: 'center',
            position: 'absolute',
          }}
        >
          <Alert style={{ width: '40%' }} variant="danger">
            <h4>Vorschau nicht verfügbar.</h4>
            <p>
              Im Moment kann die Vorschau des Dokumentes nicht angezeigt werden. Sie können das
              Dokument aber{' '}
              <a href={downloadURL} target="_blank" rel="noopener noreferrer">
                hier <Icon name="download" />
              </a>{' '}
              herunterladen.
            </p>
          </Alert>
        </div>
      );
    }

    const navbar = (
      <Navbar style={{ marginBottom: 0 }} inverse>
        <Navbar.Header>
          <Navbar.Brand>
            <a
              onClick={() => this.showMainDoc()}
              disabled={this.props.docs.loadingState !== LOADING_FINISHED}
            >
              {this.props.docs.viewerTitle === undefined
                ? 'Dokument ' +
                  (this.props.docs.docPackageId || this.props.docs.futuredocPackageId || '')
                : this.props.docs.viewerTitle}
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
              {/* Weird bug: when using it like this, then NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node. is thrown */}
              {/* <Icon
            spin={this.state.downloadArchivePrepInProgress}
            name={this.state.downloadArchiveIcon}
          /> */}
              {/* Indicate the waiting with the cursor works */}
              <Icon
                style={{ cursor: this.state.downloadArchivePrepInProgress ? 'wait' : 'hand' }}
                spin={false}
                name="file-archive-o"
              />
            </NavItem>
            <NavItem title="Info B-Pläne" disabled={true} eventKey={2} href="#">
              <Icon name="question-circle" />
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
    const sidebar = (
      <div ref={(ref) => (this.sidebarRef = ref)}>
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
                  autofocus: 'true',
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
                marginBottom: 8,
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
                  padding: 6,
                }}
              >
                <div align="center">
                  <Icon size="3x" name={iconname} />
                  <p
                    style={{
                      marginTop: 10,
                      marginBottom: 5,
                      fontSize: 11,
                      wordWrap: 'break-word',
                    }}
                  >
                    {doc.title || this.filenameShortener(doc.file)}
                  </p>
                  {selectionMarker}
                  {progressBar}
                  <p
                    style={{
                      marginTop: 5,
                      marginBottom: 0,
                      fontSize: 11,
                      wordWrap: 'break-word',
                    }}
                  >
                    {pageStatus}
                  </p>
                </div>
              </Well>
            </div>
          );
        })}
      </div>
    );

    const docmap = (
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
                  <p
                    style={{
                      backgroundColor: '#D8D8D8D8',
                      padding: '5px',
                    }}
                  >
                    {this.props.docs.docs[this.props.docs.docIndex].file}
                  </p>
                </Control>
              )}
          </RoutedMap>
          {problemWithDocPreviewAlert}
        </div>
      </Loadable>
    );

    return (
      <div style={{ background: 'green' }}>
        {navbar}
        <div
          style={{
            height: mapHeight,
            background: 'grey',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            alignContent: 'center',
          }}
        >
          <div
            id="sidebar"
            style={{
              background: '#999999',
              backgroundX: 'yellow',
              height: mapHeight,
              width: this.state.sidebarWidth,
              padding: '5px 1px 5px 5px',
              overflow: 'scroll',
            }}
            ref={(ref) => (this.sidebarRef = ref)}
          >
            {sidebar}
          </div>
          <div
            id="sidebar-slider"
            style={{
              background: '#999999',
              backgroundx: 'red',
              height: mapHeight,
              width: 10,
              cursor: 'col-resize',
            }}
            onMouseDown={this.onMouseDown}
            onTouchStart={this.startResizing}
            onTouchEnd={this.stopResizing}
          >
            {!this.state.resizing && (
              <div
                style={{
                  position: 'relative',
                  borderLeft: '2px solid #333',
                  left: '3.5px',
                  top: mapHeight / 2 - mapHeight * 0.1,
                  height: mapHeight * 0.2,
                }}
              ></div>
            )}
            {this.state.resizing === true && (
              <div
                style={{
                  position: 'relative',
                  borderLeft: '4px solid #333',
                  left: '2px',
                  top: mapHeight / 2 - mapHeight * 0.1,
                  height: mapHeight * 0.2,
                }}
              ></div>
            )}
          </div>
          <div
            id="docviewer"
            style={{
              backgroundX: 'green',

              height: mapHeight,
              width: w,
            }}
          >
            {docmap}
          </div>
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
    const layerBounds = new L.LatLngBounds([-ph / 2, -pw / 2], [ph / 2, pw / 2]);
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
    this.pushRouteForPage(
      this.props.match.params.topic,
      this.props.match.params.docPackageId,
      1,
      1
    );
  };

  nextPage = () => {
    if (
      parseInt(this.props.match.params.page, 10) <
      this.props.docs.docs[this.props.docs.docIndex].pages
    ) {
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
        this.pushRouteForPage(
          this.props.match.params.topic,
          this.props.match.params.docPackageId,
          1,
          1
        );
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
  // getDocInfoWithHead = (doc, index) => {
  // 	return fetch(
  // 		`http://localhost:8081/rasterfariWMS?SRS=EPSG:25832&service=WMS&request=GetMap&layers=${doc.url}&styles=default&format=image%2Fpng&transparent=true&version=1.1.1&tiled=true&width=256&height=256&srs=undefined&bbox=-0.5,-0.5,0.5,0.5`,
  // 		{
  // 			method: 'head'
  // 		}
  // 	).then((response) => {
  // 		if (response.ok) {
  // 			return {
  // 				index,
  // 				height: response.headers.get('X-Rasterfari-pageHeight'),
  // 				width: response.headers.get('X-Rasterfari-pageWidth'),
  // 				numOfPages: response.headers.get('X-Rasterfari-numOfPages'),
  // 				fileSize: response.headers.get('X-Rasterfari-fileSize'),
  // 				currentPage: response.headers.get('X-Rasterfari-currentPage')
  // 			};
  // 		} else {
  // 			throw new Error("Server md5 response wasn't OK");
  // 		}
  // 	});
  // };

  getOptimalBounds = (forDimension) => {
    const meta = this.props.docs.docs[this.props.docs.docIndex].meta;
    let dimensions;
    try {
      dimensions = [
        meta['layer' + this.props.docs.pageIndex].x,
        meta['layer' + this.props.docs.pageIndex].y,
      ];
    } catch (e) {
      dimensions = [2000, 2000];
    }
    //const leafletSize = this.leafletRoutedMap.leafletMap.leafletElement._size; //x,y
    const leafletSize = { x: this.mapStyle.width, y: this.mapStyle.height };
    if (forDimension) {
      //const leafletSize = { x: this.mapStyle.width, y: this.mapStyle.height };

      if (leafletSize.x / leafletSize.y < 1) {
        if (forDimension === WIDTH) {
          let targetDimensions = [dimensions[0], dimensions[1]];
          let rc = new L.RasterCoords(
            this.leafletRoutedMap.leafletMap.leafletElement,
            targetDimensions
          );
          return [[rc.unproject([0, 0]), rc.unproject([targetDimensions[0], targetDimensions[1]])]];
        } else if (forDimension === HEIGHT) {
          let targetDimensions = [(dimensions[1] * leafletSize.x) / leafletSize.y, dimensions[1]];
          let rc = new L.RasterCoords(
            this.leafletRoutedMap.leafletMap.leafletElement,
            targetDimensions
          );
          return [[rc.unproject([0, 0]), rc.unproject([targetDimensions[0], targetDimensions[1]])]];
        }
      } else {
        if (forDimension === WIDTH) {
          let targetDimensions = [dimensions[0], (dimensions[0] * leafletSize.y) / leafletSize.x];
          let rc = new L.RasterCoords(
            this.leafletRoutedMap.leafletMap.leafletElement,
            targetDimensions
          );
          return [[rc.unproject([0, 0]), rc.unproject([targetDimensions[0], targetDimensions[1]])]];
        } else if (forDimension === HEIGHT) {
          let targetDimensions = [dimensions[0], dimensions[1]];
          let rc = new L.RasterCoords(
            this.leafletRoutedMap.leafletMap.leafletElement,
            targetDimensions
          );
          return [[rc.unproject([0, 0]), rc.unproject([targetDimensions[0], targetDimensions[1]])]];
        }
      }
    }
    // const meta = {};
    if (this.leafletRoutedMap?.leafletMap?.leafletElement) {
      const rc = new L.RasterCoords(this.leafletRoutedMap.leafletMap.leafletElement, dimensions);
      const layerBounds = [[rc.unproject([0, 0]), rc.unproject([dimensions[0], dimensions[1]])]];

      return layerBounds;
    }
  };

  gotoWholeDocument = () => {
    let wb = this.getOptimalBounds();
    //this.props.docsActions.setDebugBounds(wb);
    if (this.leafletRoutedMap?.leafletMap?.leafletElement) {
      this.leafletRoutedMap.leafletMap.leafletElement.invalidateSize();
      this.leafletRoutedMap.leafletMap.leafletElement.fitBounds(wb);
    }
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
    return [
      [llBounds[0][0].lat, llBounds[0][0].lng],
      [llBounds[0][1].lat, llBounds[0][1].lng],
    ];
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

  getLayer = () => {
    if (this.props.docs.docIndex !== undefined && this.props.docs.docs.length > 0) {
      try {
        let layerUrl = this.props.docs.docs[this.props.docs.docIndex].layer;
        const meta = this.props.docs.docs[this.props.docs.docIndex].meta;

        if (meta) {
          if (meta.pages > 1) {
            layerUrl = layerUrl.replace('.pdf/', `.pdf-${this.props.docs.pageIndex}/`);
          }

          const dimensions = [
            meta['layer' + this.props.docs.pageIndex].x,
            meta['layer' + this.props.docs.pageIndex].y,
          ];
          // const meta = {};
          const rc = new L.RasterCoords(
            this.leafletRoutedMap.leafletMap.leafletElement,
            dimensions
          );
          const layerBounds = [
            [rc.unproject([0, 0]), rc.unproject([dimensions[0], dimensions[1]])],
          ];
          const layer = {
            layerUrl,
            meta,
            layerBounds,
          };

          return layer;
        } else {
          return undefined;
        }
      } catch (e) {
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
      duration: 250,
    });
  };
  // printPdf = (url) => {
  // 	var iframe = this._printIframe;
  // 	if (!this._printIframe) {
  // 		iframe = this._printIframe = document.createElement('iframe');
  // 		document.body.appendChild(iframe);

  // 		iframe.style.display = 'none';
  // 		iframe.onload = function() {
  // 			setTimeout(function() {
  // 				iframe.focus();
  // 				iframe.contentWindow.print();
  // 			}, 1);
  // 		};
  // 	}

  // 	iframe.src = url;
  // };
}

const DocViewer = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(DocViewer_);

export default DocViewer;

DocViewer.propTypes = {
  ui: PropTypes.object,
  uiState: PropTypes.object,
};
