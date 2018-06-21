import React from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from "react-redux";

import {actions as uiStateActions} from '../redux/modules/uiState';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import PhotoLightbox from './PhotoLightbox';
 
function mapStateToProps(state) {
    return {uiState: state.uiState};
}

function mapDispatchToProps(dispatch) {
    return {
        uiStateActions: bindActionCreators(uiStateActions, dispatch)
    };
}

export class LightboxExample_ extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.props.uiStateActions.setLightboxCaption("Caption");
        this.props.uiStateActions.setLightboxTitle((
            <a href="https://cismet.de" target="_blank" rel="noopener noreferrer">cismet.de</a>
        ));
       
    }
    render() {
        return (
        <div>
        <button type="button" onClick={() => this.props.uiStateActions.setLightboxVisible(true)}>
          Open Lightbox
        </button>
        <PhotoLightbox/>
      </div>
        );
    }
}

const LightboxExample = connect(mapStateToProps, mapDispatchToProps)(LightboxExample_);

export default LightboxExample;

LightboxExample.propTypes = {
    ui: PropTypes.object
};