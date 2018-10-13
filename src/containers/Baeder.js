import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import { bindActionCreators } from "redux";
import { actions as MappingActions } from "../redux/modules/mapping";
import { actions as UIStateActions } from "../redux/modules/uiState";
import {
  actions as BaederActions,
  getBaeder,
  getBaederFeatureCollection,
  getBadSvgSize,
  getBaederFeatureCollectionSelectedIndex
} from "../redux/modules/baeder";

import { routerActions as RoutingActions } from "react-router-redux";
import { getFeatureStyler, featureHoverer } from "../utils/stadtplanHelper";
import { getColorForProperties } from "../utils/baederHelper";
import BaederInfo from "../components/baeder/BaederInfo";
import BaederModalMenu from "../components/baeder/BaederModalMenu";
import TopicMap from "../containers/TopicMap";

function mapStateToProps(state) {
  return {
    uiState: state.uiState,
    mapping: state.mapping,
    routing: state.routing,
    baeder: state.baeder,
    gazetteerTopics: state.gazetteerTopics
  };
}

function mapDispatchToProps(dispatch) {
  return {
    mappingActions: bindActionCreators(MappingActions, dispatch),
    uiStateActions: bindActionCreators(UIStateActions, dispatch),
    routingActions: bindActionCreators(RoutingActions, dispatch),
    baederActions: bindActionCreators(BaederActions, dispatch),
  };
}

export class Baeder_ extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.props.mappingActions.setBoundingBoxChangedTrigger(bbox =>
      this.props.baederActions.refreshFeatureCollection(bbox)
    );
  }
  
  render() {

    let info = (
      <BaederInfo
        key={"BaederInfo." + (getBaederFeatureCollectionSelectedIndex(this.props.baeder) || 0)}
        pixelwidth={330}
        featureCollection={getBaederFeatureCollection(this.props.baeder)}
        items={getBaeder(this.props.baeder)}
        selectedIndex={getBaederFeatureCollectionSelectedIndex(this.props.baeder) || 0}
        next={() => {
          this.props.baederActions.setSelectedFeatureIndex(
            (getBaederFeatureCollectionSelectedIndex(this.props.baeder) + 1) %
              getBaederFeatureCollection(this.props.baeder).length
          );
        }}
        previous={() => {
          this.props.baederActions.setSelectedFeatureIndex(
            (getBaederFeatureCollectionSelectedIndex(this.props.baeder) +
              getBaederFeatureCollection(this.props.baeder).length -
              1) %
              getBaederFeatureCollection(this.props.baeder).length
          );
        }}
        fitAll={this.gotoHome}
        showModalMenu={section =>
          this.props.uiStateActions.showApplicationMenuAndActivateSection(true, section)
        }
        uiState={this.props.uiState}
        uiStateActions={this.props.uiStateActions}
        panelClick={e => {}}
      />
    );
    
    return (
      <TopicMap 
          fullScreenControl
          locatorControl
          gazetteerSearchBox
          gazetteerSearchBoxPlaceholdertext="Suchbegriff hier eingeben."
          photoLightBox      
          infoBox={info} 
          backgroundlayers="rvrWMS@70"
          dataLoader={this.props.baederActions.loadBaeder}
          getFeatureCollectionForData={()=>{return getBaederFeatureCollection(this.props.baeder)}}
          featureStyler={getFeatureStyler(
            getBadSvgSize(this.props.baeder) || 30,
            getColorForProperties
          )}
          refreshFeatureCollection={this.props.baederActions.refreshFeatureCollection}
          setSelectedFeatureIndex={this.props.baederActions.setSelectedFeatureIndex}
          featureHovererX={featureHoverer}
          modalMenu={<BaederModalMenu
            uiState={this.props.uiState}
            uiStateActions={this.props.uiStateActions}
          />}
      />
    );
  }
}

const Baeder = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(Baeder_);

export default Baeder;

Baeder.propTypes = {
  ui: PropTypes.object,
  uiState: PropTypes.object
};
