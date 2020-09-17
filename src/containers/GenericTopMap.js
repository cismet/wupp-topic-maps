import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { routerActions as RoutingActions } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import BaederInfo from '../components/baeder/BaederInfo';
import BaederModalMenu from '../components/baeder/BaederModalMenu';
import InfoBoxFotoPreview from '../components/commons/InfoBoxFotoPreview';
import TopicMap from '../containers/TopicMap';
import {
	actions as BaederActions,
	getBadSvgSize,
	getBaeder,
	getBaederFeatureCollection,
	getBaederFeatureCollectionSelectedIndex,
	hasMinifiedInfoBox
} from '../redux/modules/baeder';
import { actions as MappingActions } from '../redux/modules/mapping';
import { actions as UIStateActions } from '../redux/modules/uiState';
import { getColorForProperties } from '../utils/baederHelper';
import { fotoKraemerCaptionFactory, fotoKraemerUrlManipulation } from '../utils/commonHelpers';
import { featureHoverer, getFeatureStyler } from '../utils/stadtplanHelper';

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

export class GenericTopicMap_ extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.gotoHome = this.gotoHome.bind(this);
		this.changeMarkerSymbolSize = this.changeMarkerSymbolSize.bind(this);
		this.props.mappingActions.setBoundingBoxChangedTrigger((bbox) =>
			this.props.baederActions.refreshFeatureCollection(bbox)
		);
	}
	componentDidMount() {
		document.title = 'Bäderkarte Wuppertal';
    }
    
    render() {
    }


const GenericTopicMap = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(GenericTopicMap_);

export default GenericTopicMap;

GenericTopicMap.propTypes = {
	ui: PropTypes.object,
	uiState: PropTypes.object
};
