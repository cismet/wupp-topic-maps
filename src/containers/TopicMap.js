import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import { RoutedMap, MappingConstants, FeatureCollectionDisplay } from "react-cismap";
import { bindActionCreators } from "redux";
import { actions as MappingActions } from "../redux/modules/mapping";
import { actions as UIStateActions } from "../redux/modules/uiState";


import { routerActions as RoutingActions } from "react-router-redux";
import { modifyQueryPart } from "../utils/routingHelper";

import PhotoLightbox from "./PhotoLightbox";
import Control from "react-leaflet-control";
import {
  actions as gazetteerTopicsActions,
  getGazDataForTopicIds
} from "../redux/modules/gazetteerTopics";

import {Button, OverlayTrigger, Tooltip } from "react-bootstrap";

import ProjSingleGeoJson from "../components/ProjSingleGeoJson";
import GazetteerHitDisplay from "../components/GazetteerHitDisplay";
import GazetteerSearchControl from "../components/commons/GazetteerSearchControl";

import { Icon } from "react-fa";

import { builtInGazetteerHitTrigger } from "../utils/gazetteerHelper";
import Loadable from "react-loading-overlay";

const position = {
  lat: 51.25533692525824,
  lng: 7.182187127378716
};
function mapStateToProps(state) {
  return {
    uiState: state.uiState,
    mapping: state.mapping,
    routing: state.routing,
    gazetteerTopics: state.gazetteerTopics
  };
}

function mapDispatchToProps(dispatch) {
  return {
    mappingActions: bindActionCreators(MappingActions, dispatch),
    uiStateActions: bindActionCreators(UIStateActions, dispatch),
    routingActions: bindActionCreators(RoutingActions, dispatch),
    gazetteerTopicsActions: bindActionCreators(gazetteerTopicsActions, dispatch)
  };
}

export class TopicMap_ extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.loadData = this.loadData.bind(this);
    this.featureClick = this.featureClick.bind(this);
    this.gotoHome = this.gotoHome.bind(this);
    this.props.mappingActions.setBoundingBoxChangedTrigger(bbox =>
      this.props.refreshFeatureCollection(bbox)
    );
  }
  componentWillMount() {
    this.dataLoaded = false;
    this.loadData().then(data => {
      this.dataLoaded = true;
      if (this.props.dataLoader===undefined) {
        this.forceUpdate();
      }
    });


    if (this.props.gazetteerSearchBox) {
      this.props.uiStateActions.setGazetteerBoxEnabled(false);
      this.props.uiStateActions.setGazetteerBoxInfoText("Ortsinformationen werden geladen ...");
      this.props.gazetteerTopicsActions
        .loadTopicsData(this.props.gazetteerTopicsList)
        .then(() => {
          if (this.props.gazetteerTopics.adressen === undefined) {
            console.log("this.props.gazetteerTopics.adressen === undefined");
          }
          this.gazData = getGazDataForTopicIds(this.props.gazetteerTopics, this.props.gazetteerTopicsList);
          this.props.uiStateActions.setGazetteerBoxEnabled(true);
          this.props.uiStateActions.setGazetteerBoxInfoText(this.props.gazBoxInfoText);
          this.forceUpdate(); //ugly winning: prevent typeahead to have shitty behaviour
        });
    }
  }

  featureClick(event) {
    if (event.target.feature) {
      this.props.setSelectedFeatureIndex(event.target.feature.index);
    }
  }
  loadData() {
    var promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.props.dataLoader) {
          this.props.dataLoader();
        }
        resolve("ok");
      }, 100);
    });
    return promise;
  }
  gotoHome() {
    this.leafletRoutedMap.leafletMap.leafletElement.setView(
      this.props.home.center,
      this.props.home.zoom
    );
  }
  render() {
    const mapStyle = {
      height: this.props.uiState.height
    };
    let urlSearchParams = new URLSearchParams(this.props.routing.location.search);

    let info = this.props.infoBox ;

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



    let searchIcon = <Icon name="search" />;
    if (this.props.mapping.searchInProgress) {
      searchIcon = <Icon spin={true} name="refresh" />;
    }


    let widthRight = info.props.pixelwidth;
    let width = this.props.uiState.width;
    let gap = 25;

    let infoBoxControlPosition = "bottomright";
    let searchControlPosition = "bottomleft";
    let searchControlWidth = 300;
    let widthLeft = searchControlWidth;
    let infoStyle = {
      opacity: "0.9",
      width: info.props.pixelwidth
    };

    if (width - gap - widthLeft - widthRight <= 0) {
      infoBoxControlPosition = "bottomleft";
      searchControlWidth = width - gap;
      infoStyle = {
        ...infoStyle,
        width: searchControlWidth + "px"
      };
    }



    let searchControl;
    if (this.props.gazetteerSearchBox) {
      searchControl = (
        <GazetteerSearchControl
          ref={comp => {
            this.searchControl = comp;
          }}
          enabled={this.props.uiState.gazetteerBoxEnabled}
          placeholder={this.props.gazetteerSearchBoxPlaceholdertext}
          pixelwidth={searchControlWidth}
          searchControlPosition={searchControlPosition}
          gazData={this.gazData}
          gazeteerHitTrigger={hit => {
            builtInGazetteerHitTrigger(
              hit,
              this.leafletRoutedMap.leafletMap.leafletElement,
              this.props.mappingActions,
              this.props.gazeteerHitTrigger
            );
          }}
          
          searchAfterGazetteer={false}
          searchInProgress={this.props.mapping.searchInProgress}
          searchAllowed={false}
          searchTooltipProvider={() => <div />}
          searchIcon={searchIcon}
          overlayFeature={this.props.mapping.overlayFeature}
          gazetteerHit={this.props.mapping.gazetteerHit}
          searchButtonTrigger={this.props.searchButtonTrigger}
        />
      );
    }
      
    let photoLightBox;
    if (this.props.photoLightBox){
      photoLightBox=<PhotoLightbox />;
    }
    
    return (
      <Loadable active={!this.dataLoaded&&!this.props.noInitialLoadingText} spinner text={this.props.initialLoadingText}>
        <div>
          {photoLightBox}
          <RoutedMap
            key={"leafletRoutedMap"}
            referenceSystem={MappingConstants.crs25832}
            referenceSystemDefinition={MappingConstants.proj4crs25832def}
            ref={leafletMap => {
              this.leafletRoutedMap = leafletMap;
            }}
            layers=""
            style={mapStyle}
            fallbackPosition={position}
            ondblclick={this.mapDblClick}
            doubleClickZoom={false}
            locationChangedHandler={location => {
              this.props.routingActions.push(
                this.props.routing.location.pathname +
                  modifyQueryPart(this.props.routing.location.search, location)
              );
            }}
            autoFitConfiguration={{
              autoFitBounds: this.props.mapping.autoFitBounds,
              autoFitMode: this.props.mapping.autoFitMode,
              autoFitBoundsTarget: this.props.mapping.autoFitBoundsTarget
            }}
            autoFitProcessedHandler={() => this.props.mappingActions.setAutoFit(false)}
            urlSearchParams={urlSearchParams}
            boundingBoxChangedHandler={bbox => this.props.mappingActions.mappingBoundsChanged(bbox)}
            backgroundlayers={this.props.backgroundlayers }
            fallbackZoom={8}
            fullScreenControlEnabled={this.props.locatorControl}
            locateControlEnabled={this.props.locatorControl}
          >
            {overlayFeature}
            <GazetteerHitDisplay
              key={"gazHit" + JSON.stringify(this.props.mapping.gazetteerHit)}
              mappingProps={this.props.mapping}
            />
            <FeatureCollectionDisplay
              key={JSON.stringify(this.props.getFeatureCollectionForData())}
              featureCollection={this.props.getFeatureCollectionForData()}
              boundingBox={this.props.mapping.boundingBox}
              clusteringEnabled={false}
              style={this.props.featureStyler}
              hoverer={this.props.featureHoverer}
              featureStylerScalableImageSize={32}
              featureClickHandler={this.featureClick}
              mapRef={this.leafletRoutedMap}
              showMarkerCollection={false}
            />
            {searchControl}
            <Control position={infoBoxControlPosition}>
            <div style={infoStyle}>{info}</div></Control>
            <Control position="topright">
              <OverlayTrigger
                placement="left"
                overlay={
                  <Tooltip style={{ zIndex: 3000000000 }} id="helpTooltip">
                    Einstellungen | Anleitung
                  </Tooltip>
                }
              >
                <Button onClick={this.showModalApplicationMenu}>
                  <Icon name="bars" />
                </Button>
              </OverlayTrigger>
            </Control>
          </RoutedMap>
        </div>
      </Loadable>
    );
  }
}

const TopicMap = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(TopicMap_);

export default TopicMap;

TopicMap.propTypes = {
  infoBox: PropTypes.object,
  backgroundLayers: PropTypes.string,
  initialLoadingText: PropTypes.string,
  noInitialLoadingText:  PropTypes.bool,
  gazetteerSearchBox: PropTypes.bool,
  gazetteerSearchBoxPlaceholdertext: PropTypes.string,
  gazetteerTopicsList: PropTypes.array,
  fullScreenControl: PropTypes.bool,
  locator: PropTypes.bool,
  photoLightBox: PropTypes.bool,
  dataLoader: PropTypes.func,
  getFeatureCollectionForData: PropTypes.func,
  featureStyler: PropTypes.func,
  featureHoverer: PropTypes.func,
  home: PropTypes.object,

};

TopicMap.defaultProps = {
  infoBox: (<div></div>),
  backgroundlayers: "rvrWMS@30",
  noInitialLoadingText: false,
  initialLoadingText: "Laden der Daten ...",
  gazetteerSearchBox: false,
  gazetteerTopicsList: ["adressen", "bezirke", "quartiere", "pois"],
  gazetteerSearchBoxPlaceholdertext: "Geben Sie einen Suchbegriff ein.",
  fullScreenControl: false,
  locatorControl: false,
  photoLightBox: false,
  getFeatureCollectionForData: ()=>[],
  refreshFeatureCollection: ()=>{},
  getFeatureStyler: ()=>{},

  home: {
    center: [51.25861849982617, 7.15101022370511],
    zoom: 8
  }
};
