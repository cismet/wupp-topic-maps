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
        layer.bindTooltip(props.labeler(feature), {className: 'customGeoJSONFeatureTooltipClass', permanent:true, direction:'center', opacity: '0.9'});
        //TODO set a offset so that the Tooltip is shown in the current map 

        layer._leaflet_id = feature.id;  
        if (feature.selected) {
          //ugly winning: a direct call of bringToFront has no effect -.-
          setTimeout(function () {
            layer.bringToFront();
          }, 10);
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
    this.leafletElement.getLayer(this.props.mapping.featureCollection[this.props.mapping.selectedIndex].id).bringToFront();
    console.log(this.props.mapping.featureCollection[this.props.mapping.selectedIndex].id);
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
