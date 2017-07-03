import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import { Modal, Button, Checkbox, Form, FormGroup, Col, ControlLabel, FormControl, ProgressBar, Fade } from 'react-bootstrap';
import * as UiStateActions from '../actions/uiStateActions';


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
          <Modal.Title>Bebauungspläne - Bedienung</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
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
