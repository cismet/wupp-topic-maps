import L from 'leaflet';
import { isFunction } from 'lodash';
import { PropTypes } from 'react';
import 'proj4leaflet';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import * as mappingActions from '../actions/mappingActions';

import { Path } from 'react-leaflet';

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
        if (feature.selected) {
          //ugly winning: a direct call of bringToFront has no effect -.-
          setTimeout(function () {
            try {
              layer.bringToFront();
            }
            catch (err) {
              //ugly winning
            }
            layer.bindTooltip(props.labeler(feature), {className: 'customGeoJSONFeatureTooltipClass', permanent:true, direction:'center', opacity: '0.9'});

          }, 10);
        } 
        else {
            layer.bindTooltip(props.labeler(feature), {className: 'customGeoJSONFeatureTooltipClass', permanent:true, direction:'center', opacity: '0.9'});
        }
      };
    
    this.leafletElement = L.Proj.geoJson(mappingProps.featureCollection, props);
    //console.log(this.leafletElement);
  }

  createLeafletElement () {} 

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
  labeler: PropTypes.func.isRequired,
};
