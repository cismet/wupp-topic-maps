import L from 'leaflet';
import { isFunction } from 'lodash';
import PropTypes from 'prop-types';
import 'proj4leaflet';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as mappingActions } from '../redux/modules/mapping';

import { Path } from 'react-leaflet';

require('react-leaflet-markercluster/dist/styles.min.css');

function mapStateToProps(state) {
  return {
    mapping: state.mapping
  };
}

function mapDispatchToProps(dispatch) {
  return {
    mappingActions: bindActionCreators(mappingActions, dispatch)
  };
}

export class ProjGeoJson_ extends Path {
  componentWillMount() {
    super.componentWillMount();
    const { mappingProps, ...props } = this.props;

    props.onEachFeature = function(feature, layer) {
      //This could be the problem in /stadtplan
      //----wait for regressions -.-
      //layer._leaflet_id = feature.id;
      //----

      //TODO set a offset so that the Tooltip is shown in the current map
      layer.feature = feature;
      layer.on('click', props.featureClickHandler);
      let zoffset = new L.point(0, 0);
      if (feature.selected) {
        //ugly winning: a direct call of bringToFront has no effect -.-
        setTimeout(function() {
          try {
            layer.bringToFront();
          } catch (err) {
            //ugly winning
          }
          if (props.labeler) {
            layer.bindTooltip(props.labeler(feature), {
              className: 'customGeoJSONFeatureTooltipClass',
              permanent: true,
              direction: 'center',
              offset: zoffset,
              opacity: '0.9'
            });
          }
        }, 10);
      } else {
        if (props.labeler) {
          layer.bindTooltip(props.labeler(feature), {
            className: 'customGeoJSONFeatureTooltipClass',
            permanent: true,
            direction: 'center',
            offset: zoffset,
            opacity: '0.9'
          });
        }
      }
      if (props.hoverer) {
        let theStyle = props.style(feature, mappingProps.featureStylerScalableImageSize);

        layer.bindTooltip('' + props.hoverer(feature), {
          offset: L.point(theStyle.radius, 0),
          direction: 'right'
        });
        layer.on('mouseover', function() {
          layer.openPopup();
        });
        layer.on('mouseout', function() {
          layer.closePopup();
        });
      }
    };

    props.pointToLayer = (feature, latlng) => {
      if (props.style) {
        let theStyle = props.style(feature);
        let marker = null;
        if (theStyle.svg) {
          var divIcon = L.divIcon({
            className: 'leaflet-data-marker',
            html: theStyle.svg,
            iconAnchor: [theStyle.svgSize / 2, theStyle.svgSize / 2],
            iconSize: [theStyle.svgSize, theStyle.svgSize]
          });
          marker = L.marker(latlng, { icon: divIcon });
        } else {
          marker = L.circleMarker(latlng);
        }
        return marker;
      }
    };

    var geojson = L.Proj.geoJson(mappingProps.featureCollection, props);

    this.props.clusterOptions.customSize = 36;

    if (!this.clusteredMarkers) {
      this.clusteredMarkers = L.markerClusterGroup(this.props.clusterOptions);
    } else {
      this.clusteredMarkers = null;
      if (this.props.mapRef.leafletElement.hasLayer(this.leafletElement)) {
        this.props.mapRef.leafletElement.removeLayer(this.leafletElement);
      }
    }

    if (this.clusteredMarkers && this.props.clusteringEnabled) {
      this.leafletElement = this.clusteredMarkers.clearLayers();
      this.leafletElement = this.clusteredMarkers.addLayer(geojson);
      let that = this;

      // need to add it to the map now, because of the spiderfy functionality
      // (ensure spidefication when object is selected)
      // the test needs an already mounted layer

      //ugly winning
      // don't know exactly why there is an error when a new wms background is set
      // TypeError: Cannot read property '_leaflet_pos' of undefined
      try {
        this.props.mapRef.leafletElement.addLayer(this.leafletElement);
      } catch (e) {
        //console.log(e);
      }

      this.clusteredMarkers.on('clusterclick', function(a) {
        let zoomLevel = that.props.mapRef.leafletElement.getZoom();
        if (zoomLevel < (that.props.clusterOptions.cismapZoomTillSpiderfy || 11)) {
          that.props.mapRef.leafletElement.setZoomAround(a.latlng, zoomLevel + 1);
        } else {
          a.layer.spiderfy();
        }
      });
      let markers = this.clusteredMarkers.getLayers();
      for (let marker of markers) {
        if (marker.feature.selected === true) {
          let parent = this.clusteredMarkers.getVisibleParent(marker);
          if (parent && parent.spiderfy) {
            //   console.log("will spiderfy cluster of feature "+marker.feature.id )
            if (
              this.props.mapRef.leafletElement.getZoom() >=
              (this.props.selectionSpiderfyMinZoom || 12)
            ) {
              setTimeout(function() {
                try {
                  parent.spiderfy();
                } catch (err) {
                  //ugly winning
                }
              }, 1);
            }
            //   console.log("have spiderfied cluster of feature "+marker.feature.id )
          }
        }
      }
    } else {
      this.leafletElement = geojson;
    }
  }

  createLeafletElement() {}

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

const ProjGeoJson = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjGeoJson_);
export default ProjGeoJson;

ProjGeoJson.propTypes = {
  mappingProps: PropTypes.object.isRequired,
  clusteredMarkers: PropTypes.object,
  selectionSpiderfyMinZoom: PropTypes.number,
  labeler: PropTypes.func,
  hoverer: PropTypes.func,
  featureClickHandler: PropTypes.func.isRequired,
  mapRef: PropTypes.object.isRequired
};
