import React from "react";
import PropTypes from "prop-types";
import { Map, ZoomControl } from "react-leaflet";
import { connect } from "react-redux";
import "proj4leaflet";
import { Layers } from "../components/Layers";
import FeatureCollectionDisplay from "../components/FeatureCollectionDisplay";
import GazetteerHitDisplay from "../components/GazetteerHitDisplay";
import { crs25832, proj4crs25832def } from "../constants/gis";
import proj4 from "proj4";
import { bindActionCreators } from "redux";
import FullscreenControl from "../components/FullscreenControl";
import NewWindowControl from "../components/NewWindowControl";
import queryString from "query-string";

import Control from "react-leaflet-control";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

import { routerActions } from "react-router-redux";
import { modifyQueryPart } from "../utils/routingHelper";
import { actions as mappingActions, constants as mappingConstants } from "../redux/modules/mapping";
import { Icon } from "react-fa";
import { actions as uiStateActions } from "../redux/modules/uiState";
import {
  actions as gazetteerTopicsActions,
  getGazDataForTopicIds
} from "../redux/modules/gazetteerTopics";
import "url-search-params-polyfill";
import { WUNDAAPI } from "../constants/services";

// need to have this import
// eslint-disable-next-line
import markerClusterGroup from "leaflet.markercluster";

import ProjSingleGeoJson from "../components/ProjSingleGeoJson";

import LocateControl from "../components/LocateControl";
import GazetteerSearchControl from "../components/commons/GazetteerSearchControl";

import { builtInGazetteerHitTrigger } from "../utils/gazetteerHelper";

function mapStateToProps(state) {
  return {
    uiState: state.uiState,
    mapping: state.mapping,
    attributionControl: false,
    routing: state.routing,
    gazetteerTopics: state.gazetteerTopics
  };
}

function mapDispatchToProps(dispatch) {
  return {
    mappingActions: bindActionCreators(mappingActions, dispatch),
    uiStateActions: bindActionCreators(uiStateActions, dispatch),
    routingActions: bindActionCreators(routerActions, dispatch),
    gazetteerTopicsActions: bindActionCreators(gazetteerTopicsActions, dispatch)
  };
}

export function createLeafletElement() {}

export class Cismap_ extends React.Component {
  constructor(props) {
    super(props);
    this.internalSearchButtonTrigger = this.internalSearchButtonTrigger.bind(this);
    this.internalClearButtonTrigger = this.internalClearButtonTrigger.bind(this);
    this.featureClick = this.featureClick.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.gotoHomeBB = this.gotoHomeBB.bind(this);
    this.loadTheGazettteerTopics = this.loadTheGazettteerTopics.bind(this);
    this.showModalApplicationMenu = this.showModalApplicationMenu.bind(this);
    this.gazData = [];
  }

  componentWillUnmount() {
    // console.log("Cismap.componentWillUnMount()")
    // console.trace();
  }

  componentWillMount() {
    // console.log("Cismap.componentWillMount()")
    this.loadTheGazettteerTopics();
  }

  loadTheGazettteerTopics() {
    ///console.log("loadTheGazettteerTopics()")
    //Über uiStateActions anzeigen dass die Combobox nocht nicht funktionsfähig ist

    this.props.uiStateActions.setGazetteerBoxEnabled(false);
    this.props.uiStateActions.setGazetteerBoxInfoText("Ortsinformationen werden geladen ...");

    this.props.gazetteerTopicsActions.loadTopicsData(this.props.gazTopics).then(() => {
      if (this.props.gazetteerTopics.adressen === undefined) {
        console.log("this.props.gazetteerTopics.adressen === undefined");
      }

      this.gazData = getGazDataForTopicIds(this.props.gazetteerTopics, this.props.gazTopics);

      // console.log("++++++++++++++++++++++++ done with parsing " + ( from - Date.now()))
      this.props.uiStateActions.setGazetteerBoxEnabled(true);
      this.props.uiStateActions.setGazetteerBoxInfoText(this.props.gazBoxInfoText);
      this.forceUpdate(); //ugly winning: prevent typeahead to have shitty behaviour
    });
  }

  componentDidMount() {
    this.refs.leafletMap.leafletElement.on("moveend", () => {
      const zoom = this.refs.leafletMap.leafletElement.getZoom();
      const center = this.refs.leafletMap.leafletElement.getCenter();
      const latFromUrl = parseFloat(
        new URLSearchParams(this.props.routing.location.search).get("lat")
      );
      const lngFromUrl = parseFloat(
        new URLSearchParams(this.props.routing.location.search).get("lng")
      );
      const zoomFromUrl = parseInt(
        new URLSearchParams(this.props.routing.location.search).get("zoom"),
        10
      );
      var lat = center.lat;
      var lng = center.lng;

      if (Math.abs(latFromUrl - center.lat) < 0.001) {
        lat = latFromUrl;
      }
      if (Math.abs(lngFromUrl - center.lng) < 0.001) {
        lng = lngFromUrl;
      }

      if (lng !== lngFromUrl || lat !== latFromUrl || zoomFromUrl !== zoom) {
        //store.dispatch(push(this.props.routing.locationBeforeTransitions.pathname + querypart))
        this.props.routingActions.push(
          this.props.routing.location.pathname +
            modifyQueryPart(this.props.routing.location.search, {
              lat: lat,
              lng: lng,
              zoom: zoom
            })
        );
      }
      this.storeBoundingBox();
    });
    this.storeBoundingBox();
  }

  gotoHomeBB() {
    this.refs.leafletMap.leafletElement.fitBounds([[51.1094, 7.00093], [51.3737, 7.3213]]);
  }

  centerOnPoint(x, y, z) {
    this.props.routingActions.push(
      this.props.routing.location.pathname +
        modifyQueryPart(this.props.routing.location.search, {
          lat: x,
          lng: y,
          zoom: z
        })
    );
  }

  componentDidUpdate() {
    if (typeof this.refs.leafletMap !== "undefined" && this.refs.leafletMap != null) {
      if (this.props.mapping.autoFitBounds) {
        if (this.props.mapping.autoFitMode === mappingConstants.AUTO_FIT_MODE_NO_ZOOM_IN) {
          if (
            !this.refs.leafletMap.leafletElement
              .getBounds()
              .contains(this.props.mapping.autoFitBoundsTarget)
          ) {
            this.refs.leafletMap.leafletElement.fitBounds(this.props.mapping.autoFitBoundsTarget);
          }
        } else {
          this.refs.leafletMap.leafletElement.fitBounds(this.props.mapping.autoFitBoundsTarget);
        }
        this.props.mappingActions.setAutoFit(false);
      }
    }
  }

  storeBoundingBox() {
    //store the projected bounds in the store
    const bounds = this.refs.leafletMap.leafletElement.getBounds();
    const projectedNE = proj4(proj4.defs("EPSG:4326"), proj4crs25832def, [
      bounds._northEast.lng,
      bounds._northEast.lat
    ]);
    const projectedSW = proj4(proj4.defs("EPSG:4326"), proj4crs25832def, [
      bounds._southWest.lng,
      bounds._southWest.lat
    ]);
    const bbox = {
      left: projectedSW[0],
      top: projectedNE[1],
      right: projectedNE[0],
      bottom: projectedSW[1]
    };
    //console.log(getPolygon(bbox));
    if (JSON.stringify(this.props.mapping.boundingBox) !== JSON.stringify(bbox)) {
      this.props.mappingActions.mappingBoundsChanged(bbox);
    }
  }

  internalClearButtonTrigger(event) {
    if (this.gazClearOverlay) {
      this.gazClearOverlay.hide();
    }
    if (this.props.mapping.overlayFeature !== null) {
      this.props.mappingActions.setOverlayFeature(null);
    }

    this.searchControl.wrappedInstance.clear();
    this.props.mappingActions.gazetteerHit(null);
  }

  internalSearchButtonTrigger(event) {
    if (this.searchOverlay) {
      this.searchOverlay.hide();
    }
    if (
      this.props.mapping.searchInProgress === false &&
      this.props.searchButtonTrigger !== undefined
    ) {
      this.searchControl.wrappedInstance.clear();
      this.props.mappingActions.gazetteerHit(null);
      this.props.searchButtonTrigger(event);
    } else {
      //console.log("search in progress or no searchButtonTrigger defined");
    }
  }

  featureClick(event) {
    this.props.featureClickHandler(event);
  }

  showModalApplicationMenu() {
    this.props.uiStateActions.showApplicationMenu(true);
  }

  renderMenuItemChildren(option, props, index) {
    return (
      <div key={option.sorter}>
        <Icon
          style={{
            marginRight: "10px",
            width: "18px"
          }}
          name={option.glyph}
          size={"lg"}
        />
        <span>{option.string}</span>
      </div>
    );
  }

  handleSearch(query) {
    if (!query) {
      return;
    }

    let queryO = {
      list: [
        {
          key: "input",
          value: query
        }
      ]
    };
    fetch(
      WUNDAAPI + "/searches/WUNDA_BLAU.BPlanAPIGazeteerSearch/results?role=all&limit=100&offset=0",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(queryO)
      }
    )
      .then(resp => resp.json())
      .then(json => {
        this.setState({ options: json.$collection });
      });
  }
  render() {
    // console.log("-------------------RENDERING CISMAP")
    const mapStyle = {
      height: this.props.uiState.height,
      width: this.props.uiState.width
    };
    if (mapStyle.height == null || mapStyle.width == null) {
      mapStyle.height = window.innerHeight;
      mapStyle.width = window.innerWidth;
    }

    //    const positionByUrl=[parseFloat(this.props.routing.locationBeforeTransitions.query.lat)||fallbackposition.lat,parseFloat(this.props.routing.locationBeforeTransitions.query.lng)||fallbackposition.lng]
    //    const zoomByUrl= parseInt(this.props.routing.locationBeforeTransitions.query.zoom)||14

    const positionByUrl = [
      parseFloat(new URLSearchParams(this.props.routing.location.search).get("lat")) ||
        this.props.fallbackposition.lat,
      parseFloat(new URLSearchParams(this.props.routing.location.search).get("lng")) ||
        this.props.fallbackposition.lng
    ];
    const zoomByUrl =
      parseInt(new URLSearchParams(this.props.routing.location.search).get("zoom"), 10) ||
      this.props.initialZoom;

    const layerArr = this.props.layers.split("|");

    //      <Icon name='search' />

    let searchIcon = <Icon name="search" />;
    if (this.props.mapping.searchInProgress) {
      searchIcon = <Icon spin={true} name="refresh" />;
    }

    const searchAllowed =
      zoomByUrl >= this.props.searchMinZoom && zoomByUrl <= this.props.searchMaxZoom;

    let widthRight = this.props.infoBox.props.pixelwidth;
    let width = this.props.uiState.width;
    let gap = 25;

    let infoBoxControlPosition = "bottomright";
    let searchControlPosition = "bottomleft";
    let searchControlWidth = 300;
    let widthLeft = searchControlWidth;
    let infoStyle = {
      opacity: "0.9",
      width: this.props.infoBox.props.pixelwidth
    };

    if (width - gap - widthLeft - widthRight <= 0) {
      infoBoxControlPosition = "bottomleft";
      searchControlWidth = width - gap;
      infoStyle = {
        ...infoStyle,
        width: searchControlWidth + "px"
      };
    }

    let searchControl = (
      <GazetteerSearchControl
        ref={comp => {
          this.searchControl = comp;
        }}
        enabled={this.props.uiState.gazetteerBoxEnabled}
        placeholder={this.props.uiState.gazeteerBoxInfoText}
        pixelwidth={searchControlWidth}
        searchControlPosition={searchControlPosition}
        gazData={this.gazData}
        gazeteerHitTrigger={hit => {
          builtInGazetteerHitTrigger(
            hit,
            this.refs.leafletMap.leafletElement,
            this.props.mappingActions,
            this.props.gazeteerHitTrigger
          );
        }}
        renderMenuItemChildren={this.renderMenuItemChildren}
        searchAfterGazetteer={this.props.searchAfterGazetteer}
        searchInProgress={this.props.mapping.searchInProgress}
        searchAllowed={searchAllowed}
        searchTooltipProvider={this.props.searchTooltipProvider}
        gazClearTooltipProvider={this.props.gazClearTooltipProvider}
        searchIcon={searchIcon}
        overlayFeature={this.props.mapping.overlayFeature}
        gazetteerHit={this.props.mapping.gazetteerHit}
        searchButtonTrigger={this.props.searchButtonTrigger}
      />
    );
    let infoBoxControl = (
      <Control position={infoBoxControlPosition}>
        <div style={infoStyle}>{this.props.infoBox}</div>
      </Control>
    );

    let fullscreenControl = (
      <FullscreenControl
        title="Vollbildmodus"
        forceSeparateButton={true}
        titleCancel="Vollbildmodus beenden"
        position="topleft"
        container={document.documentElement}
      />
    );
    let iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
    let inIframe = window.self !== window.top;
    let simulateInIframe = false;
    let simulateInIOS = false;
    let iosClass = "no-iOS-device";
    if (simulateInIOS || iOS) {
      iosClass = "iOS-device";
      if (simulateInIframe || inIframe) {
        fullscreenControl = (
          // <OverlayTrigger placement="left" overlay={(<Tooltip>Maximiert in neuem Browser-Tab öffnen.</Tooltip>)}>
          <NewWindowControl
            position="topleft"
            routing={this.props.routing}
            title="Maximiert in neuem Browser-Tab öffnen."
          />
        );
        // </OverlayTrigger>
      } else {
        fullscreenControl = <div />;
      }
    }

    let overlayFeature = <div />;
    if (this.props.mapping.overlayFeature) {
      overlayFeature = (
        <ProjSingleGeoJson
          key={JSON.stringify(this.props.mapping.overlayFeature)}
          geoJson={this.props.mapping.overlayFeature}
          masked={this.props.mapping.maskedOverlay}
          mapRef={this}
        />
      );
    }
    let namedMapStyle = queryString.parse(this.props.routing.location.search).mapStyle;

    if (namedMapStyle === undefined || namedMapStyle === "default") {
      namedMapStyle = "";
    } else {
      namedMapStyle = "." + namedMapStyle;
    }

    const mykey = "leafletMap.Layers:" + JSON.stringify(layerArr);
    return (
      <div className={iosClass}>
        <Map
          ref="leafletMap"
          key={mykey}
          crs={crs25832}
          style={mapStyle}
          center={positionByUrl}
          zoom={zoomByUrl}
          zoomControl={false}
          attributionControl={false}
          doubleClickZoom={false}
          minZoom={this.props.minZoom || 7}
          ondblclick={this.props.ondblclick}
          maxZoom={18}
          //  zoomDelta={0.5}
          //  zoomSnap={0.5}
          //  wheelPxPerZoomLevel={100}
          scrollWheelZoom={true}
        >
          {overlayFeature}
          {layerArr.map(layerWithOptions => {
            const layOp = layerWithOptions.split("@");
            if (!isNaN(parseInt(layOp[1], 10))) {
              const layerGetter = Layers.get(layOp[0] + namedMapStyle);
              if (layerGetter) {
                return layerGetter({
                  opacity: parseInt(layOp[1] || "100", 10) / 100.0
                });
              } else {
                return null;
              }
            }
            if (layOp.length === 2) {
              try {
                let options = JSON.parse(layOp[1]);
                const layerGetter = Layers.get(layOp[0] + namedMapStyle);
                if (layerGetter) {
                  return layerGetter(options);
                } else {
                  return null;
                }
              } catch (error) {
                console.error(error);
                console.error(
                  "Problems during parsing of the layer options. Skip options. You will get the 100% Layer:" +
                    layOp[0]
                );
                const layerGetter = Layers.get(layOp[0] + namedMapStyle);
                if (layerGetter) {
                  return layerGetter();
                } else {
                  return null;
                }
              }
            } else {
              const layerGetter = Layers.get(layOp[0] + namedMapStyle);
              if (layerGetter) {
                return layerGetter();
              } else {
                return null;
              }
            }
          })}
          <GazetteerHitDisplay
            key={"gazHit" + JSON.stringify(this.props.mapping.gazetteerHit)}
            mappingProps={this.props.mapping}
          />
          <FeatureCollectionDisplay
            key={
              JSON.stringify(this.props.mapping.featureCollection) +
              this.props.featureKeySuffixCreator() +
              "clustered:" +
              this.props.clustered +
              ".customPostfix:" +
              this.props.mapping.featureCollectionKeyPostfix
            }
            mappingProps={this.props.mapping}
            clusteredMarkers={this.clusteredMarkers}
            clusteringEnabled={this.props.clustered}
            style={this.props.featureStyler}
            labeler={this.props.labeler}
            hoverer={this.props.hoverer}
            featureClickHandler={this.featureClick}
            mapRef={this.refs.leafletMap}
            clusterOptions={this.props.clusterOptions}
            selectionSpiderfyMinZoom={this.props.clusterOptions.selectionSpiderfyMinZoom}
          />

          <ZoomControl
            position="topleft"
            zoomInTitle="Vergr&ouml;ßern"
            zoomOutTitle="Verkleinern"
          />
          {fullscreenControl}
          {searchControl}
          <Control position="topright">
            <OverlayTrigger placement="left" overlay={this.props.applicationMenuTooltipProvider()}>
              <Button onClick={this.showModalApplicationMenu}>
                <Icon name={this.props.applicationMenuIcon} />
              </Button>
            </OverlayTrigger>
          </Control>
          {/* <Control position="topright">
        <OverlayTrigger placement="left" overlay={(<Tooltip>Tester this should be hidden and is for Devs only</Tooltip>)}>  
          <Button onClick={()=> this.toggleFullscreen()}><Icon name="check"/></Button>
        </OverlayTrigger>
      </Control> */}
          {infoBoxControl}
          <LocateControl
            setView="once"
            flyTo={true}
            strings={{
              title: "Mein Standort",
              metersUnit: "Metern",
              feetUnit: "Feet",
              popup: "Sie befinden sich im Umkreis von {distance} {unit} um diesen Punkt.",
              outsideMapBoundsMsg: "Sie gefinden sich wahrscheinlich außerhalb der Kartengrenzen."
            }}
          />
          {this.props.children}
        </Map>
      </div>
    );
  }
}

const Cismap = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(Cismap_);
export default Cismap;

Cismap_.propTypes = {
  uiState: PropTypes.object,
  mapping: PropTypes.object,
  height: PropTypes.number,
  width: PropTypes.number,
  layers: PropTypes.string.isRequired,
  gazeteerHitTrigger: PropTypes.func.isRequired,
  searchButtonTrigger: PropTypes.func.isRequired,
  mappingAction: PropTypes.object,
  featureStyler: PropTypes.func.isRequired,
  labeler: PropTypes.func,
  hoverer: PropTypes.func,
  featureClickHandler: PropTypes.func.isRequired,
  applicationMenuTooltipProvider: PropTypes.func,
  searchTooltipProvider: PropTypes.func,
  gazClearProvider: PropTypes.func,
  searchMinZoom: PropTypes.number,
  searchMaxZoom: PropTypes.number,
  searchAfterGazetteer: PropTypes.bool,
  gazTopics: PropTypes.array.isRequired,
  ondblclick: PropTypes.func,
  clustered: PropTypes.bool,
  clusterOptions: PropTypes.object,
  infoBox: PropTypes.object.isRequired,
  gazBoxInfoText: PropTypes.string,
  featureKeySuffixCreator: PropTypes.func,
  fallbackposition: PropTypes.object,
  initialZoom: PropTypes.number
};

Cismap_.defaultProps = {
  layers: "bplan_abkg_uncached",
  ondblclick: function() {},
  gazeteerHitTrigger: function() {},
  searchButtonTrigger: function() {},
  featureClickHandler: function() {},
  applicationMenuTooltipProvider: function() {
    return (
      <Tooltip
        style={{
          zIndex: 3000000000
        }}
        id="helpTooltip"
      >
        &Ouml;ffnen für weitere Funktionen
      </Tooltip>
    );
  },
  searchTooltipProvider: function() {
    return (
      <Tooltip
        style={{
          zIndex: 3000000000
        }}
        id="searchTooltip"
      >
        Objekte suchen
      </Tooltip>
    );
  },
  gazClearTooltipProvider: function() {
    return (
      <Tooltip
        style={{
          zIndex: 3000000000
        }}
        id="gazClearTooltip"
      >
        Suche zurücksetzen
      </Tooltip>
    );
  },
  searchMinZoom: 7,
  searchMaxZoom: 18,
  gazTopics: [],
  searchAfterGazetteer: false,
  gazBoxInfoText: "Geben Sie einen Suchbegriff ein.",
  applicationMenuIcon: "bars",
  clustered: false,
  clusterOptions: {
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
    maxClusterRadius: 40,
    disableClusteringAtZoom: 19,
    animate: false,
    cismapZoomTillSpiderfy: 12,
    selectionSpiderfyMinZoom: 12
  },
  featureKeySuffixCreator: () => "",
  fallbackposition: {
    lat: 51.272399,
    lng: 7.199712
  },
  initialZoom: 14
};
