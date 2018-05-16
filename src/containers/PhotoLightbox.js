import React from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from "react-redux";

import {actions as uiStateActions} from '../redux/modules/uiState';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import Lightbox from 'react-image-lightbox';

function mapStateToProps(state) {
    return {uiState: state.uiState};
}

function mapDispatchToProps(dispatch) {
    return {
        uiStateActions: bindActionCreators(uiStateActions, dispatch)
    };
}

export class PhotoLightbox_ extends React.Component {
    render() {
        if (this.props.uiState.lightboxvisible) {
            let nextSrc=this.props.uiState.lightboxurls[(this.props.uiState.lightboxindex + 1) % this.props.uiState.lightboxurls.length];
            let prevSrc=this.props.uiState.lightboxurls[(this.props.uiState.lightboxindex + this.props.uiState.lightboxurls.length - 1) % this.props.uiState.lightboxurls.length];

            if (this.props.uiState.lightboxurls.length===1){
                nextSrc=null;
                prevSrc=null;
            }
            return (
            <Lightbox
                mainSrc={this.props.uiState.lightboxurls[this.props.uiState.lightboxindex]}
                nextSrc={nextSrc}
                prevSrc={prevSrc}
                onCloseRequest={() => this.props.uiStateActions.setLightboxVisible(false)}
                onMovePrevRequest={() => this.props.uiStateActions.setLightboxIndex((this.props.uiState.lightboxindex + this.props.uiState.lightboxurls.length - 1) % this.props.uiState.lightboxurls.length)}
                onMoveNextRequest={() => this.props.uiStateActions.setLightboxIndex((this.props.uiState.lightboxindex + 1) % this.props.uiState.lightboxurls.length)}     
                imageTitle={this.props.uiState.lightboxtitle}
                imageCaption={this.props.uiState.lightboxcaption}    
                animationDuration={600}       
            />
            );
        }
        else {
            return (<div/>);
        }
    }
}

const PhotoLightbox = connect(mapStateToProps, mapDispatchToProps)(PhotoLightbox_);

export default PhotoLightbox;

PhotoLightbox.propTypes = {
    ui: PropTypes.object
};