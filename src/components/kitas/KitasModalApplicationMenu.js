import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  Modal,
  Button,
  Accordion,
  Panel,
  FormGroup,
  Checkbox,
  Radio,
  ControlLabel,
  Label
} from "react-bootstrap";
import { actions as UiStateActions } from "../../redux/modules/uiState";

import { Icon } from "react-fa";
import "react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.min.css";
import queryString from "query-string";

import MultiToggleButton from "../MultiToggleButton";

import { Link } from "react-scroll";

import ReactChartkick, { PieChart } from "react-chartkick";
import Chart from "chart.js";

import { removeQueryPart, modifyQueryPart } from "../../utils/routingHelper";
import { routerActions } from "react-router-redux";

import KitasFilterPanelContent from "./KitasFilterPaneContent";
import KitasSettingsPanelContent from "./KitasSettingsPanelContent";
import KitasHelpTextPanelContent from "./KitasHelpTextPanelContent";
import KitasModalFooterContent from "./KitasModalFooterContent";

ReactChartkick.addAdapter(Chart);

const KitasModalApplicationMenu = ({
  uiState,
  uiActions,
  kitasState,
  kitasActions,
  mappingState,
  mappingActions,
  routingState,
  routingActions
}) => {
  const close = () => {
    uiActions.showApplicationMenu(false);
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

  let kitaOrKitas;
  if (kitasState.filteredKitas.length === 1) {
    kitaOrKitas = "Kita";
  } else {
    kitaOrKitas = "Kitas";
  }
  let filterString = `(${
    kitasState.filteredKitas.length
  } ${kitaOrKitas} gefunden, davon ${
    mappingState.featureCollection.length
  } in der Karte)`;

  let customTitle = queryString.parse(routingState.location.search).title;
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
          <Icon name="bars" />
          &nbsp;&nbsp;&nbsp;Filter, Einstellungen und Kompaktanleitung
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={modalBodyStyle}
        id="myMenu"
        key={uiState.applicationMenuActiveKey}
      >
        <span>
          Benutzen Sie die Auswahlmöglichkeiten unter{" "}
          <Link
            to="filter"
            containerId="myMenu"
            smooth={true}
            delay={100}
            onClick={() => uiActions.setApplicationMenuActiveKey("filter")}
          >
            Filtern
          </Link>
          , um die in der Karte angezeigten Kindertageseinrichtungen (Kitas) auf
          die für Sie relevanten Kitas zu beschränken. Über{" "}
          <Link
            to="settings"
            containerId="myMenu"
            smooth={true}
            delay={100}
            onClick={() => uiActions.setApplicationMenuActiveKey("settings")}
          >
            Einstellungen
          </Link>{" "}
          können Sie die Darstellung der Hintergrundkarte und der Kitas an Ihre
          Vorlieben anpassen. Wählen Sie{" "}
          <Link
            to="help"
            containerId="myMenu"
            smooth={true}
            delay={100}
            onClick={() => uiActions.setApplicationMenuActiveKey("help")}
          >
            Kompaktanleitung
          </Link>{" "}
          für detailliertere Bedienungsinformationen.
        </span>
        <br />
        <br />

        <Accordion
          key={"filter"}
          defaultActiveKey={uiState.applicationMenuActiveKey || "filter"}
          onSelect={() => {
            if (uiState.applicationMenuActiveKey === "filter") {
              uiActions.setApplicationMenuActiveKey("none");
            } else {
              uiActions.setApplicationMenuActiveKey("filter");
            }
          }}
        >
          <Panel
            header={"Filtern " + filterString}
            eventKey="filter"
            bsStyle="primary"
          >
            <KitasFilterPanelContent
              width={uiState.width}
              filter={kitasState.filter}
              addFilterFor={kitasActions.addFilterFor}
              removeFilterFor={kitasActions.removeFilterFor}
            />
          </Panel>
        </Accordion>

        <Accordion
          key={"settings"}
          defaultActiveKey={uiState.applicationMenuActiveKey}
          onSelect={() => {
            if (uiState.applicationMenuActiveKey === "settings") {
              uiActions.setApplicationMenuActiveKey("none");
            } else {
              uiActions.setApplicationMenuActiveKey("settings");
            }
          }}
        >
          <Panel header="Einstellungen" eventKey="settings" bsStyle="success">
            <KitasSettingsPanelContent
              width={uiState.width}
              titleDisplay={customTitle !== undefined}
              clusteredMarkers={
                queryString.parse(routingState.location.search).unclustered !==
                null
              }
              markerSize={kitasState.kitaSvgSize}
              namedMapStyle={
                queryString.parse(routingState.location.search).mapStyle ||
                "default"
              }
              changeMarkerSymbolSize={changeMarkerSymbolSize}
              routing={routingState}
              routingActions={routingActions}
              refreshFeatureCollection={
                kitasActions.createFeatureCollectionFromKitas
              }
            />
          </Panel>
        </Accordion>
        <Accordion
          name="help"
          key={"helptext" + uiState.applicationMenuActiveKey}
          defaultActiveKey={uiState.applicationMenuActiveKey}
          onSelect={() => {
            if (uiState.applicationMenuActiveKey === "help") {
              uiActions.setApplicationMenuActiveKey("none");
            } else {
              uiActions.setApplicationMenuActiveKey("help");
            }
          }}
        >
          <Panel header="Kompaktanleitung" eventKey="help" bsStyle="default">
            <KitasHelpTextPanelContent />
          </Panel>
        </Accordion>
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
                <KitasModalFooterContent />
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

export default KitasModalApplicationMenu;
KitasModalApplicationMenu.propTypes = {
  uiActions: PropTypes.object,
  uiState: PropTypes.object,
  kitasState: PropTypes.object,
  kitasActions: PropTypes.object,
  mappingState: PropTypes.object,
  mappingActions: PropTypes.object
};
