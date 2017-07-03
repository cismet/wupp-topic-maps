import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import { Modal, Button, Checkbox, Form, FormGroup, Col, ControlLabel, FormControl, ProgressBar, Fade } from 'react-bootstrap';
import * as UiStateActions from '../actions/uiStateActions';
import {Icon} from 'react-fa'


function mapStateToProps(state) {
  return {
    uiState: state.uiState
  };
}
function mapDispatchToProps(dispatch) {
  return {
    uiActions: bindActionCreators(UiStateActions, dispatch),
  };
}

export class BPlanModalHelp_ extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.close = this.close.bind(this);
  }

  close() {
    this.props.uiActions.showHelpComponent(false);
  }
  render() {
    return (
      <Modal show={this.props.uiState.helpTextVisible} onHide={this.close} keyboard={false}>
        <Modal.Header  >
          <Modal.Title><Icon name="info"/>&nbsp;&nbsp;&nbsp;Kompaktanleitung B-Plan-Auskunft Wuppertal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Die standardm&auml;ßig eingestellte Hintergrundkarte gibt eine &Uuml;bersicht über die Wuppertaler 
          Bebauungspläne (B-Pl&auml;ne). Gr&uuml;ne Fl&auml;chen (&Uuml;bersichtsmaßstab) bzw. Umringe stehen für 
          rechtswirksame B-Plan-Verfahren, rote Fl&auml;chen / Umringe für laufende Verfahren. Für 
          Detailinformation und Download m&uuml;ssen Sie zun&auml;chst nach B-Pl&auml;nen suchen. Die Treffer 
          werden automatisch geladen und in der Karte als transparente farbige Fl&auml;chen mit der 
          B-Plan-Nummer in jeder Teilfl&auml;che dargestellt.<br /><br />
          Grüne Fl&auml;chen/Nummern stehen für rechtswirksame Verfahren, rote Fl&auml;chen/Nummern für laufende. 
          Eine gr&uuml;ne Fl&auml;che mit roter Nummer bedeutet, dass es unter dieser Nummer ein rechtswirksames 
          und ein laufendes Verfahren gibt, die genau dasselbe Gebiet abdecken.        
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" type="submit" onClick={this.close}>Ok</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}



const BPlanModalHelp = connect(mapStateToProps, mapDispatchToProps)(BPlanModalHelp_);
export default BPlanModalHelp;

BPlanModalHelp_.propTypes = {
  uiActions: PropTypes.object,
  uiState: PropTypes.object
};
