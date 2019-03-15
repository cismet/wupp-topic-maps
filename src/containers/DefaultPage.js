import React from 'react';
import PropTypes from 'prop-types';
import TopicMap from '../containers/TopicMap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Well } from 'react-bootstrap';
import { actions as UIStateActions } from '../redux/modules/uiState';

import GenericModalApplicationMenu from '../components/commons/GenericModalApplicationMenu';
import DemoMenuIntroduction from '../components/demo/DemoMenuIntroduction';
import DemoMenuSettingsSection from '../components/demo/DemoMenuSettingsSection';
import DemoMenuHelpSection from '../components/demo/DemoMenuHelpSection';

function mapStateToProps(state) {
  return {
    uiState: state.uiState
  };
}
function mapDispatchToProps(dispatch) {
  return {
    uiStateActions: bindActionCreators(UIStateActions, dispatch)
  };
}
export class DefaultPage_ extends React.Component {
  render() {
    let info = (
      <Well pixelwidth={300} bsSize="small">
        <h3>Topic Maps</h3>
        <p>
          Bei den Topic Maps handelt es sich um Karten mit einem ganz speziellen Fokus auf ein
          begrenztes Thema.
        </p>
        <br />
        <br />
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
        modalMenu={
          <GenericModalApplicationMenu
            uiState={this.props.uiState}
            uiStateActions={this.props.uiStateActions}
            menuIntroduction={<DemoMenuIntroduction uiStateActions={this.props.uiStateActions} />}
            menuSections={[
              <DemoMenuSettingsSection
                key="DemoMenuSettingsSection"
                uiState={this.props.uiState}
                uiStateActions={this.props.uiStateActions}
              />,
              <DemoMenuHelpSection
                key="DemoMenuHelpSection"
                uiState={this.props.uiState}
                uiStateActions={this.props.uiStateActions}
              />
            ]}
          />
        }
      />
    );
  }
}
const DefaultPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(DefaultPage_);

export default DefaultPage;

DefaultPage_.propTypes = {
  uiState: PropTypes.object
};
