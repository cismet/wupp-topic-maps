import React from "react";
import PropTypes from "prop-types";
import TopicMap from "../containers/TopicMap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Well } from "react-bootstrap";
import {
  actions as BaederActions,
  getBaederFeatureCollection,
  getBadSvgSize,
} from "../redux/modules/baeder";
import { getColorForProperties } from "../utils/baederHelper";

import { getFeatureStyler, featureHoverer } from "../utils/stadtplanHelper";


function mapStateToProps(state) {
  return { ui: state.uiState,
    baeder: state.baeder,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    baederActions: bindActionCreators(BaederActions, dispatch),
  };
}
export class DefaultPage_ extends React.Component {
  render() {
    let info = (
      <Well pixelwidth={300} bsSize="small">
        <h3>Topic Maps</h3>
        <p>Bei den Topic Maps handelt es sich um Karten mit einem ganz speziellen Fokus auf ein begrenztes Thema.</p>
        {/* <p>Folgende "Spezialkarten" sind verfügbar:</p>
        <a href="/#/kitas">Kita-Finder</a><br/>
        <a href="/#/ehrenamt">Info Portal Ehrenamt</a><br/>
        <a href="/#/stadtplan">Stadtplan mit den POI</a><br/>
        <a href="/#/baeder">Bäderkarte</a><br/>
        <a href="/#/bplaene">BPlan Auskunft</a><br/> */}
        <br/>
        <br/>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://cismet.de/datenschutzerklaerung.html"
        >
          Datenschutzerklärung (Privacy Policy)
        </a>
      </Well>
    );
    return (
        <TopicMap 
            fullScreenControl
            locatorControl
            gazetteerSearchBox
            noInitialLoadingText
            gazetteerSearchBoxPlaceholdertext="Suchbegriff hier eingeben."
            photoLightBox      
            infoBox={info} 
            backgroundlayers="rvrWMS@70"
        />
    );
  }
}
const DefaultPage = connect(mapStateToProps,mapDispatchToProps)(DefaultPage_);

export default DefaultPage;

DefaultPage_.propTypes = {
  ui: PropTypes.object,
  kassenzeichen: PropTypes.object,
  uiState: PropTypes.object
};
