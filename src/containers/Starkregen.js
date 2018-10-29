import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import { actions as MappingActions } from '../redux/modules/mapping';
import { actions as UIStateActions } from '../redux/modules/uiState';
import {
	actions as BaederActions,
	getBaeder,
	getBaederFeatureCollection,
	getBadSvgSize,
	getBaederFeatureCollectionSelectedIndex
} from '../redux/modules/baeder';

import { routerActions as RoutingActions } from 'react-router-redux';
import { getFeatureStyler, featureHoverer } from '../utils/stadtplanHelper';
import { getColorForProperties } from '../utils/baederHelper';
import BaederInfo from '../components/baeder/BaederInfo';
import BaederModalMenu from '../components/baeder/BaederModalMenu';
import TopicMap from '../containers/TopicMap';
import { WMSTileLayer } from "react-leaflet";
import Control from "react-leaflet-control";


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
		baederActions: bindActionCreators(BaederActions, dispatch)
	};
}

export class Starkregen_ extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.gotoHome = this.gotoHome.bind(this);
    this.toggleBackground = this.toggleBackground.bind(this);
    this.backgroundIndex=0;
    this.backgrounds=['wupp-plan-live@100','trueOrthoIntra@100','wupp-plan-live@100|trueOrthoIntra@50'];
	}

	gotoHome() {
		if (this.topicMap) {
			this.topicMap.wrappedInstance.gotoHome();
		}
	}
 

  toggleBackground() {
    console.log("ToggleBackground")
    this.backgroundIndex=(this.backgroundIndex+1) % this.backgrounds.length;
    this.forceUpdate();
  }


	render() {
    let options={ opacity: 0.6 };
    return (
			<TopicMap
        key={"topicmap with background no"+this.backgroundIndex}
				ref={(comp) => {
					this.topicMap = comp;
				}}
				noInitialLoadingText={true}
				fullScreenControl
				locatorControl
				gazetteerSearchBox
				gazetteerSearchBoxPlaceholdertext="Stadtteil | Adresse | POI"
				photoLightBox
				// infoBox={info}
				backgroundlayers={this.props.match.params.layers || this.backgrounds[this.backgroundIndex]}
			>
      <Control position="bottomright">
        <a onClick={()=>{this.toggleBackground()}}><img width="100px" src={"/images/rain-hazard-next-bg/"+this.backgroundIndex+".png"}></img></a>
      </Control>
     {/* <WMSTileLayer
      key={"Ortho2014"+JSON.stringify(options)}
      url="http://s10221:7098/orthofotos/services"
			layers="WTO2018"
			format="image/png"
			tiled="true"
			maxZoom={19}
			opacity={0.6}
		/> */}
      </TopicMap>
		);
	}
}

const Starkregen = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Starkregen_);

export default Starkregen;

Starkregen.propTypes = {
	ui: PropTypes.object,
	uiState: PropTypes.object
};
