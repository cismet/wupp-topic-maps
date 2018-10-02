import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
//import 'proj4leaflet';
//import proj4 from 'proj4';
import { RoutedMap, MappingConstants, FeatureCollectionDisplay } from "react-cismap";
import { bindActionCreators } from "redux";
import { actions as MappingActions } from "../redux/modules/mapping";
import { actions as UIStateActions } from "../redux/modules/uiState";
import {
  actions as BaederActions,
  getBaeder,
  getBaederFeatureCollection,
  getBadSvgSize,
  getBaederFeatureCollectionSelectedIndex
} from "../redux/modules/baeder";

import { routerActions as RoutingActions } from "react-router-redux";
import { modifyQueryPart } from "../utils/routingHelper";

import { getFeatureStyler } from "../utils/stadtplanHelper";

import { getColorForProperties } from "../utils/baederHelper";
import BaederInfo from "../components/baeder/BaederInfo";
import PhotoLightbox from "./PhotoLightbox";
import Control from "react-leaflet-control";
import {
  actions as gazetteerTopicsActions,
  getGazDataForTopicIds
} from "../redux/modules/gazetteerTopics";

import { Form, FormGroup, InputGroup, Button, OverlayTrigger, Tooltip } from "react-bootstrap";

//tmp
import ProjSingleGeoJson from "../components/ProjSingleGeoJson";
import GazetteerHitDisplay from "../components/GazetteerHitDisplay";
import GazetteerSearchControl from "../components/commons/GazetteerSearchControl";

import { Icon } from "react-fa";

import { builtInGazetteerHitTrigger } from "../utils/gazetteerHelper";

const position = {
  lat: 51.25533692525824,
  lng: 7.182187127378716
};
function mapStateToProps(state) {
  return {
    uiState: state.uiState,
    mapping: state.mapping,
    routing: state.routing,
    baeder: state.baeder,
    gazetteerTopics: state.gazetteerTopics
  };
}

function mapDispatchToProps(dispatch) {
  return {
    mappingActions: bindActionCreators(MappingActions, dispatch),
    uiStateActions: bindActionCreators(UIStateActions, dispatch),
    routingActions: bindActionCreators(RoutingActions, dispatch),
    baederActions: bindActionCreators(BaederActions, dispatch),
    gazetteerTopicsActions: bindActionCreators(gazetteerTopicsActions, dispatch)
  };
}

export class Baeder_ extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.loadBaeder = this.loadBaeder.bind(this);
    this.featureClick = this.featureClick.bind(this);
    this.gotoHome = this.gotoHome.bind(this);
    this.props.mappingActions.setBoundingBoxChangedTrigger(bbox =>
      this.props.baederActions.refreshFeatureCollection(bbox)
    );
  }
  componentWillMount() {
    this.dataLoaded = false;
    this.loadBaeder().then(data => {
      this.dataLoaded = true;
    });

    //tmp
    this.props.uiStateActions.setGazetteerBoxEnabled(false);
    this.props.uiStateActions.setGazetteerBoxInfoText("Ortsinformationen werden geladen ...");

    this.props.gazetteerTopicsActions
      .loadTopicsData(["adressen", "bezirke", "quartiere", "pois"])
      .then(() => {
        if (this.props.gazetteerTopics.adressen === undefined) {
          console.log("this.props.gazetteerTopics.adressen === undefined");
        }

        this.gazData = getGazDataForTopicIds(this.props.gazetteerTopics, [
          "adressen",
          "bezirke",
          "quartiere",
          "pois"
        ]);

        // console.log("++++++++++++++++++++++++ done with parsing " + ( from - Date.now()))
        this.props.uiStateActions.setGazetteerBoxEnabled(true);
        this.props.uiStateActions.setGazetteerBoxInfoText(this.props.gazBoxInfoText);
        this.forceUpdate(); //ugly winning: prevent typeahead to have shitty behaviour
      });
  }

  featureClick(event) {
    if (event.target.feature) {
      this.props.baederActions.setSelectedFeatureIndex(event.target.feature.index);
    }
  }
  loadBaeder() {
    var promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        this.props.baederActions.loadBaeder();
        resolve("ok");
      }, 100);
    });
    return promise;
  }
  gotoHome() {
    //x1=361332.75015625&y1=5669333.966678483&x2=382500.79703125&y2=5687261.576954328
    this.props.routingActions.push(
        this.props.routing.location.pathname +
          modifyQueryPart(this.props.routing.location.search, {
            lat: 51.25861849982617,
            lng:7.151010223705116,
            zoom:8
          })
      );
  }
  render() {
    const mapStyle = {
      height: this.props.uiState.height
    };
    let urlSearchParams = new URLSearchParams(this.props.routing.location.search);

    let info = (
      <BaederInfo
        key={"BaederInfo." + (getBaederFeatureCollectionSelectedIndex(this.props.baeder) || 0)}
        pixelwidth={330}
        featureCollection={getBaederFeatureCollection(this.props.baeder)}
        items={getBaeder(this.props.baeder)}
        selectedIndex={getBaederFeatureCollectionSelectedIndex(this.props.baeder) || 0}
        next={() => {
          this.props.baederActions.setSelectedFeatureIndex(
            (getBaederFeatureCollectionSelectedIndex(this.props.baeder) + 1) %
              getBaederFeatureCollection(this.props.baeder).length
          );
        }}
        previous={() => {
          this.props.baederActions.setSelectedFeatureIndex(
            (getBaederFeatureCollectionSelectedIndex(this.props.baeder) +
              getBaederFeatureCollection(this.props.baeder).length -
              1) %
              getBaederFeatureCollection(this.props.baeder).length
          );
        }}
        fitAll={this.gotoHome}
        showModalMenu={section =>
          this.props.uiStateActions.showApplicationMenuAndActivateSection(true, section)
        }
        uiState={this.props.uiState}
        uiStateActions={this.props.uiStateActions}
        panelClick={e => {}}
      />
    );
    let searchControlPosition = "bottomleft";

    //tmp
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

    let searchControl = (
      <GazetteerSearchControl
        ref={comp => {
          this.searchControl = comp;
        }}
        enabled={this.props.uiState.gazetteerBoxEnabled}
        placeholder={"Stadtteil | Adresse | POI"}
        pixelwidth={300}
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
        //warum geht der default nicht (ist identisch)
        renderMenuItemChildren={(option, props, index) => (
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
        )}
        searchAfterGazetteer={false}
        searchInProgress={this.props.mapping.searchInProgress}
        searchAllowed={false}
        searchTooltipProvider={() => <div />}
        searchIcon={searchIcon}
        overlayFeature={this.props.mapping.overlayFeature}
        gazetteerHit={this.props.mapping.gazetteerHit}
        searchButtonTrigger={this.props.searchButtonTrigger}
        gazClearTooltipProvider={() => (
          <Tooltip
            style={{
              zIndex: 3000000000
            }}
            id="gazClearTooltip"
          >
            Suche zurücksetzen
          </Tooltip>
        )}
      />
    );

    return (
      <div>
        <PhotoLightbox />
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
          backgroundlayers={
            this.props.match.params.layers ||
            "rvrWMS@70" ||
            'rvrWMS@{"opacity":1.0,"css-filter":"filter:sepia(1.0) hue-rotate(150deg) contrast(0.9) opacity(1) invert(0) saturate(1);"}'
          }
          fallbackZoom={8}
          fullScreenControlEnabled={true}
          locateControlEnabled={true}
        >
          {overlayFeature}
          <GazetteerHitDisplay
            key={"gazHit" + JSON.stringify(this.props.mapping.gazetteerHit)}
            mappingProps={this.props.mapping}
          />
          <FeatureCollectionDisplay
            key={JSON.stringify(getBaederFeatureCollection(this.props.baeder))}
            featureCollection={getBaederFeatureCollection(this.props.baeder)}
            boundingBox={this.props.mapping.boundingBox}
            clusteringEnabled={false}
            style={getFeatureStyler(getBadSvgSize(this.props.baeder) || 30, getColorForProperties)}
            hoverer={this.props.hoverer}
            featureClickHandler={this.featureClick}
            mapRef={this.leafletRoutedMap}
            showMarkerCollection={false}
          />
          {searchControl}
          <Control position="bottomright">{info}</Control>
        </RoutedMap>
      </div>
    );
  }
}

const Baeder = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(Baeder_);

export default Baeder;

Baeder.propTypes = {
  ui: PropTypes.object,
  uiState: PropTypes.object
};
