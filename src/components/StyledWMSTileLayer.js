import { WMSTileLayer } from "react-leaflet";
// import filters from 'pleeease-filters'; /a postcss  plugin. worked only for the first expression
import PropTypes from "prop-types";

export class StyledWMSTileLayer_ extends WMSTileLayer {
  constructor(props) {
    console.debug("constructor");

    super(props);
    this.setFilter = this.setFilter.bind(this);
  }

  createLeafletElement(props) {
    return super.createLeafletElement(props);
  }
  componentDidMount() {
    super.componentDidMount();
    this.setFilter();
  }
  updateLeafletElement(fromProps, toProps) {
    super.updateLeafletElement(fromProps, toProps);
    this.setFilter();
  }

  setFilter() {
    if (this.props.cssFilter) {
      if (this.leafletElement) {
        if (this.leafletElement._container) {
          if (this.leafletElement._container.style) {
            this.leafletElement._container.style.cssText += " " + this.props.cssFilter;
          } else {
            console.debug("this.leafletElement._container not set");
          }
        } else {
          console.debug("this.leafletElement._container not set");
        }
      } else {
        console.debug("this.leafletElemen not set");
      }

      //  filters.process("{"+ this.props.cssFilter +"}",{}).then(result => {
      //     let newfilter=result.css.substring(1, result.css.length-1);

      //     console.log("result.css:"+newfilter);

      //     this.leafletElement._container.style.cssText+=" "+newfilter;
      //  });
    } else {
      console.debug("no cssFilter set");
    }
  }

  getOptions(params) {
    return super.getOptions(params);
  }
}

const StyledWMSTileLayer = StyledWMSTileLayer_;

export default StyledWMSTileLayer;

StyledWMSTileLayer.propTypes = {
  url: PropTypes.string,
  layers: PropTypes.string,
  format: PropTypes.string,
  tiled: PropTypes.string,
  version: PropTypes.string,
  maxZoom: PropTypes.number,
  opacity: PropTypes.number,
  cssFilter: PropTypes.string
};
