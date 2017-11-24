import L from 'leaflet';
import { isFunction } from 'lodash';
import PropTypes from 'prop-types';
import 'proj4leaflet';
import proj4 from 'proj4';
import { crs25832, proj4crs25832def } from '../constants/gis';

import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { actions as mappingActions, constants as mappingConstants } from '../redux/modules/mapping';
import * as gisHelpers from '../utils/gisHelper';

import pointOnSurface from '@turf/point-on-surface';
import * as turf from '@turf/turf';

import { Path } from 'react-leaflet';
import polylabel from '@mapbox/polylabel'

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
  constructor(props) {
        super(props);
  }
  componentWillMount() {
    super.componentWillMount();
    const { mappingProps, ...props } = this.props;
    
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
      };
    
    
    this.leafletElement = L.Proj.geoJson(mappingProps.featureCollection, props);
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
  labeler: PropTypes.func,
  featureClickHandler: PropTypes.func.isRequired,
  mapRef: PropTypes.object.isRequired
};
