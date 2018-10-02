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

const position = {
  lat: 51.25533692525824,
  lng: 7.182187127378716
};
function mapStateToProps(state) {
  return {
    uiState: state.uiState,
    mapping: state.mapping,
    routing: state.routing,
    baeder: state.baeder
  };
}

function mapDispatchToProps(dispatch) {
  return {
    mappingActions: bindActionCreators(MappingActions, dispatch),
    uiStateActions: bindActionCreators(UIStateActions, dispatch),
    routingActions: bindActionCreators(RoutingActions, dispatch),
    baederActions: bindActionCreators(BaederActions, dispatch)
  };
}

export class Baeder_ extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.loadBaeder = this.loadBaeder.bind(this);
    this.featureClick = this.featureClick.bind(this);
    this.props.mappingActions.setBoundingBoxChangedTrigger(bbox =>
      this.props.baederActions.refreshFeatureCollection(bbox)
    );
  }
  componentWillMount() {
    this.dataLoaded = false;
    this.loadBaeder().then(data => {
      this.dataLoaded = true;
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
            'rvrWMS@70' ||
            'rvrWMS@{"opacity":1.0,"css-filter":"filter:sepia(1.0) hue-rotate(150deg) contrast(0.9) opacity(1) invert(0) saturate(1);"}'
          }
          fallbackZoom={8}
          fullScreenControlEnabled={true}
      locateControlEnabled={true}
        >
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
