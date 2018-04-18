import React from 'react';
import L from 'leaflet';
import { WMSTileLayer } from 'react-leaflet';

import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { actions as mappingActions } from '../redux/modules/mapping';


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


export class StyledWMSTileLayer_ extends WMSTileLayer {
    constructor(props){
        super(props);
    }
  
    createLeafletElement(props) {
        return super.createLeafletElement(props);
      }
    
      updateLeafletElement(fromProps, toProps) {
        super.updateLeafletElement(fromProps, toProps)
        if (this.props.cssFilter){
            this.leafletElement._container.style.cssText+=" "+this.props.cssFilter;
        }
      }
    
      getOptions(params) {
        return super.getOptions(params);
      }

//   render() {
//     let superRet=super.render();

//     return (
//         <div id="4711" style={style}>
//             {superRet}
//         </div>
//     );
//   }
}

const StyledWMSTileLayer = connect(mapStateToProps, mapDispatchToProps)(StyledWMSTileLayer_);
export default StyledWMSTileLayer;

// StyledWMSTileLayer.propTypes = {
//   style: PropTypes.string.isRequired,
//   masked: PropTypes.bool,
//   maskingPolygon: PropTypes.string,
//   style: PropTypes.func,
//   mapRef: PropTypes.object.isRequired
// };
// ProjSingleGeoJson.defaultProps = {
//   masked: false,
//   maskingPolygon: "POLYGON((292872.70820260537 5734812.567828996,454766.33411074313 5734812.567828996,454766.33411074313 5622450.136249692,292872.70820260537 5622450.136249692,292872.70820260537 5734812.567828996))",
//   style: (feature) => {
//         const style = {
//           "color": "black",
//           "weight": 3,
//           "opacity": 0.6,
//           "fillColor": "black",
//           "fillOpacity": 0.2
//         };
//         return style;
//       }
//   }
