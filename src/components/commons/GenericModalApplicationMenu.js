import React from "react";
import PropTypes from "prop-types";
import { Modal, Button, Accordion, Panel } from "react-bootstrap";

import { Icon } from "react-fa";
import "react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.min.css";
import queryString from "query-string";
import GenericRVRStadtplanwerkMenuFooter from "./GenericRVRStadtplanwerkMenuFooter";

const GenericModalApplicationMenu = ({
  menuIcon,
  menuTitel,
  menuIntroduction,
  menuSections,
  menuFooter,

  uiState,
  uiStateActions,
  kitasState,
  kitasActions,
  mappingState,
  mappingActions,
  routingState,
  routingActions
}) => {
  const close = () => {
    uiStateActions.showApplicationMenu(false);
  };

  const changeMarkerSymbolSize = size => {
    kitasActions.setSvgSize(size);
    mappingActions.setFeatureCollectionKeyPostfix("MarkerSvgSize:" + size);
  };

  const modalBodyStyle = {
    overflowY: "auto",
    overflowX: "hidden",
    maxHeight: uiState.height - 200
  };


  return (
    <Modal
      style={{
        zIndex: 3000000000
      }}
      height="100%"
      bsSize="large"
      show={uiState.applicationMenuVisible}
      onHide={close}
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title>
          <Icon name={menuIcon} />
          {menuTitel}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={modalBodyStyle} id="myMenu" key={uiState.applicationMenuActiveKey}>
        {menuIntroduction}

        <br />
        <br />

        {menuSections}
      </Modal.Body>
      <Modal.Footer>
        <table
          style={{
            width: "100%"
          }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  textAlign: "left",
                  verticalAlign: "top",
                  paddingRight: "30px"
                }}
              >
                {menuFooter}
              </td>
              <td>
                <Button bsStyle="primary" type="submit" onClick={close}>
                  Ok
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </Modal.Footer>
    </Modal>
  );
};

export default GenericModalApplicationMenu;
GenericModalApplicationMenu.propTypes = {
  menuIcon: PropTypes.string,
  menuTitel:PropTypes.string,
  menuIntroduction: PropTypes.object,
  menuSections: PropTypes.array,
  menuFooter: PropTypes.object,

  uiStateActions: PropTypes.object,
  uiState: PropTypes.object,
  kitasState: PropTypes.object,
  kitasActions: PropTypes.object,
  mappingState: PropTypes.object,
  mappingActions: PropTypes.object,
  
};

GenericModalApplicationMenu.defaultProps = {
  menuIcon: "bars",
  menuTitel: "   Einstellungen und Hilfe",
  menuSections: [],
  menuFooter: <GenericRVRStadtplanwerkMenuFooter/>
}