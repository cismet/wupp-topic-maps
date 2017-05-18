import L from 'leaflet';
import { isFunction } from 'lodash';
import { PropTypes } from 'react';
import 'proj4leaflet';

import { Path } from 'react-leaflet';

function onEachFeature(feature, layer) {
        layer.bindPopup("sdf");
}


export default class ProjGeoJson extends Path {

  componentWillMount() {
    super.componentWillMount();
    const { mappingProps, ...props } = this.props;
    
    props.onEachFeature=function (feature, layer) {
        layer.bindTooltip(props.labeler(feature), {className: 'customGeoJSONFeatureTooltipClass', permanent:true, direction:'center', opacity: '0.9'});
        //TODO set a offset so that the Tooltip is shown in the current map 
      };
    
    this.leafletElement = L.Proj.geoJson(mappingProps.featureCollection, props);
  }
  createLeafletElement () {} 
  componentDidUpdate(prevProps) {
    if (isFunction(this.props.style)) {
      this.setStyle(this.props.style);
    } else {
      this.setStyleIfChanged(prevProps, this.props);
    }
  }
}
ProjGeoJson.propTypes = {
  mappingProps: PropTypes.object.isRequired,
  labeler: PropTypes.func.isRequired,
};
