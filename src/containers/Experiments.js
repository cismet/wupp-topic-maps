import PropTypes from 'prop-types';
import React from 'react';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as uiStateActions } from '../redux/modules/uiState';
import PhotoLightbox from './PhotoLightbox';

function mapStateToProps(state) {
	return { uiState: state.uiState };
}

function mapDispatchToProps(dispatch) {
	return {
		uiStateActions: bindActionCreators(uiStateActions, dispatch)
	};
}

export class LightboxExample_ extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.props.uiStateActions.setLightboxCaption('Caption');
		this.props.uiStateActions.setLightboxTitle(
			<a href='https://cismet.de' target='_blank' rel='noopener noreferrer'>
				cismet.de
			</a>
		);
	}
	render() {
		let styles = 'dynamic';

		let sldUrl = 'https://updates.cismet.de/test/dynamic.sld';
		let url = `https://starkregen-maps.cismet.de/geoserver/wms?SERVICE=WMS&service=WMS&request=GetMap&layers=starkregen%3AS6_velocity&format=image%2Fpng&transparent=true&version=1.1.1&tiled=true&caching=0&width=256&height=256&srs=EPSG%3A25832&bbox=375004.29512409214,5681765.270153522,375042.51363823714,5681803.488667667&styles=${styles}&sld=${sldUrl}`;
		return (
			<div>
				<img src={url} />
			</div>
		);
	}
}

const LightboxExample = connect(mapStateToProps, mapDispatchToProps)(LightboxExample_);

export default LightboxExample;

LightboxExample.propTypes = {
	ui: PropTypes.object
};
