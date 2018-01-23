import L from 'leaflet';
import { isFunction } from 'lodash';
import PropTypes from 'prop-types';
import 'proj4leaflet';

import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { actions as mappingActions } from '../redux/modules/mapping';
import React, { Component}  from 'react';

import { Path, CircleMarker } from 'react-leaflet';

require('react-leaflet-markercluster/dist/styles.min.css');

function mapStateToProps(state) {
  return {
    mapping: state.mapping,

  };
}

function mapDispatchToProps(dispatch) {
  return {
    mappingActions: bindActionCreators(mappingActions, dispatch),
  };
}


export class ProjGeoJson_ extends Path {
  componentWillMount() {
    super.componentWillMount();
    const { mappingProps, ...props } = this.props;
    console.log(props)
    props.onEachFeature=function (feature, layer) {
        //TODO set a offset so that the Tooltip is shown in the current map
        layer._leaflet_id = feature.id;
        layer.feature=feature
        layer.on('click',props.featureClickHandler);
         let zoffset=new L.point(0,0);
        if (feature.selected) {
          //ugly winning: a direct call of bringToFront has no effect -.-
          setTimeout(function () {
            try {
              layer.bringToFront();
            }
            catch (err) {
              //ugly winning
            }
            if (props.labeler) {
              layer.bindTooltip(props.labeler(feature), {className: 'customGeoJSONFeatureTooltipClass', permanent:true, direction:'center', offset: zoffset, opacity: '0.9'});
            }
          }, 10);
        }
        else {
            if (props.labeler) {
              layer.bindTooltip(props.labeler(feature), {className: 'customGeoJSONFeatureTooltipClass', permanent:true, direction:'center', offset: zoffset, opacity: '0.9'});
            }
        }
        if (props.hoverer) {
          let theStyle=props.style(feature);

          layer.bindTooltip(""+props.hoverer(feature), {offset: L.point(theStyle.radius, 0), direction:'right'});
          layer.on('mouseover', function() { layer.openPopup(); });
          layer.on('mouseout', function() { layer.closePopup(); });
        }
      };

    props.pointToLayer=(feature, latlng)=> {
      let theStyle=props.style(feature);
      if (theStyle.svg) {
        var divIcon = L.divIcon({
        	className: "leaflet-data-marker",
          html: theStyle.svg,
          iconAnchor  : [theStyle.svgSize/2, theStyle.svgSize/2],
          iconSize    : [theStyle.svgSize, theStyle.svgSize],
        });

        return L.marker(latlng, {icon: divIcon});
        // if (this.props.clusteredMarkers) {
        //   this.props.clusteredMarkers.addLayer(L.marker(latlng, {icon: divIcon})).addTo(this.props.mapRef.leafletElement);
        // }
        // else {
        //   //Could be
        //   //return L.marker(latlng, {icon: divIcon});
        //   //or
        //   L.marker(latlng, {icon: divIcon}).addTo(this.props.mapRef.leafletElement);
        // }
      }
      else {
        return L.circleMarker(latlng);
      }



    }
    var geojson=L.Proj.geoJson(mappingProps.featureCollection, props);
    if (this.props.clusteredMarkers) {
      this.leafletElement= this.props.clusteredMarkers.clearLayers();
      this.leafletElement= this.props.clusteredMarkers.addLayer(geojson);
    }
    else {
      this.leafletElement=geojson;
    }
  }

  createLeafletElement () {
  }

  componentDidUpdate(prevProps) {
    if (isFunction(this.props.style)) {
      this.setStyle(this.props.style);
    } else {
      this.setStyleIfChanged(prevProps, this.props);
    }
  }

  render() {
    return super.render();
  }
}

const ProjGeoJson = connect(mapStateToProps, mapDispatchToProps)(ProjGeoJson_);
export default ProjGeoJson;

ProjGeoJson.propTypes = {
  mappingProps: PropTypes.object.isRequired,
  clusteredMarkers: PropTypes.object,
  labeler: PropTypes.func,
  hoverer: PropTypes.func,
  featureClickHandler: PropTypes.func.isRequired,
  mapRef: PropTypes.object.isRequired
};
