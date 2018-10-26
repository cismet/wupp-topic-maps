import React from "react";
import PropTypes from "prop-types";
import { Map, ZoomControl } from "react-leaflet";
import { connect } from "react-redux";
import "proj4leaflet";
import { crs25832, proj4crs25832def } from "../constants/gis";
import proj4 from "proj4";
import { bindActionCreators } from "redux";
import "url-search-params-polyfill";

import { routerActions as RoutingActions } from "react-router-redux";
import { modifyQueryPart, getQueryObject } from "../utils/routingHelper";
import { actions as MappingActions, constants as MappingConstants } from "../redux/modules/mapping";
import FullscreenControl from "../components/FullscreenControl";

const fallbackposition = {
  lat: 51.272399,
  lng: 7.199712
};

function mapStateToProps(state) {
  return {
    uiState: state.uiState,
    mapping: state.mapping,
    routing: state.routing
  };
}

function mapDispatchToProps(dispatch) {
  return {
    mappingActions: bindActionCreators(MappingActions, dispatch),
    routingActions: bindActionCreators(RoutingActions, dispatch)
  };
}

export function createLeafletElement() {}

export class RoutedMap_ extends React.Component {
  constructor(props) {
    super(props);
    this.featureClick = this.featureClick.bind(this);
  }
  componentDidMount() {
    this.leafletMap.leafletElement.on("moveend", () => {
      if (typeof this.leafletMap !== "undefined" && this.leafletMap !== null) {
        const zoom = this.leafletMap.leafletElement.getZoom();
        const center = this.leafletMap.leafletElement.getCenter();
        let searchO = getQueryObject(this.props.routing.location.search);
        const latFromUrl = parseFloat(searchO.lat);
        const lngFromUrl = parseFloat(searchO.lng);
        const zoomFromUrl = parseInt(searchO.zoom, 10);
        let lat = center.lat;
        let lng = center.lng;
        if (Math.abs(latFromUrl - center.lat) < 0.000001) {
          lat = latFromUrl;
        }
        if (Math.abs(lngFromUrl - center.lng) < 0.000001) {
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
        this.storeBoundingBox(this.leafletMap);
      } else {
        //console.log("this.leafletMap is null");
      }
    });
    this.storeBoundingBox(this.leafletMap);
  }

  componentDidUpdate() {
    if (typeof this.leafletMap !== "undefined" && this.leafletMap != null) {
      if (this.props.mapping.autoFitBounds) {
        if (this.props.mapping.autoFitMode === MappingConstants.AUTO_FIT_MODE_NO_ZOOM_IN) {
          if (
            !this.leafletMap.leafletElement
              .getBounds()
              .contains(this.props.mapping.autoFitBoundsTarget)
          ) {
            this.leafletMap.leafletElement.fitBounds(this.props.mapping.autoFitBoundsTarget);
          }
        } else {
          if (
            this.props.mapping.autoFitBoundsTarget &&
            this.props.mapping.autoFitBoundsTarget.isValid()
          ) {
            this.leafletMap.leafletElement.fitBounds(this.props.mapping.autoFitBoundsTarget);
          }
        }
        this.props.mappingActions.setAutoFit(false);
      }
    }
  }

  storeBoundingBox(leafletMap) {
    //store the projected bounds in the store
    const bounds = leafletMap.leafletElement.getBounds();
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
    this.props.mappingActions.mappingBoundsChanged(bbox);
  }

  featureClick(event) {
    this.props.featureClickHandler(event);
  }

  render() {
    const positionByUrl = [
      parseFloat(new URLSearchParams(this.props.routing.location.search).get("lat")) ||
        fallbackposition.lat,
      parseFloat(new URLSearchParams(this.props.routing.location.search).get("lng")) ||
        fallbackposition.lng
    ];
    const zoomByUrl =
      parseInt(new URLSearchParams(this.props.routing.location.search).get("zoom"), 10) || 14;

    return (
      <Map
        ref={leafletMap => {
          this.leafletMap = leafletMap;
        }}
        key={"leafletMap"}
        crs={crs25832}
        style={this.props.style}
        center={positionByUrl}
        zoom={zoomByUrl}
        zoomControl={false}
        attributionControl={false}
        doubleClickZoom={false}
        ondblclick={this.props.ondblclick}
        minZoom={7}
        maxZoom={18}
      >
        <ZoomControl position="topleft" zoomInTitle="Vergr&ouml;ßern" zoomOutTitle="Verkleinern" />
        {fullscreenControl}
        {this.props.children}
      </Map>
    );
  }
}

const RoutedMap = connect(
  mapStateToProps,
  mapDispatchToProps
)(RoutedMap_);
RoutedMap_.propTypes = {
  mapping: PropTypes.object,
  routing: PropTypes.object,
  height: PropTypes.number,
  width: PropTypes.number,
  layers: PropTypes.string.isRequired,
  routingActions: PropTypes.object.isRequired,
  mappingActions: PropTypes.object.isRequired,
  featureClickHandler: PropTypes.func,
  style: PropTypes.object.isRequired,
  ondblclick: PropTypes.func,
  children: PropTypes.array,
  fullScreenControlEnabled: PropTypes.bool
};

RoutedMap_.defaultProps = {
  layers: "",
  gazeteerHitTrigger: function() {},
  searchButtonTrigger: function() {},
  featureClickHandler: function() {},
  ondblclick: function() {}
};

// not used therefore do not export to avoid confusion
//export default RoutedMap;
