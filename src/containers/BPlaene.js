import React from "react";
import PropTypes from "prop-types";
import Cismap from "../containers/Cismap";
import { connect } from "react-redux";
import { Well, Tooltip } from "react-bootstrap";

import { actions as bplanActions } from "../redux/modules/bplaene";
import { actions as mappingActions } from "../redux/modules/mapping";
import { actions as uiStateActions } from "../redux/modules/uiState";

import { bindActionCreators } from "redux";
import { bplanFeatureStyler, bplanLabeler } from "../utils/bplanHelper";
import {
  downloadSingleFile,
  prepareDownloadMultipleFiles,
  prepareMergeMultipleFiles
} from "../utils/downloadHelper";
import BPlanModalHelp from "../components/BPlanModalHelpComponent";
import BPlanInfo from "../components/BPlanInfo";
import { Icon } from "react-fa";

import { proj4crs25832def } from "../constants/gis";
import proj4 from "proj4";

function mapStateToProps(state) {
  return {
    ui: state.uiState,
    mapping: state.mapping,
    routing: state.routing,
    bplaene: state.bplaene
  };
}

function mapDispatchToProps(dispatch) {
  return {
    bplanActions: bindActionCreators(bplanActions, dispatch),
    mappingActions: bindActionCreators(mappingActions, dispatch),
    uiStateActions: bindActionCreators(uiStateActions, dispatch)
  };
}

export class BPlaene_ extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.bplanSearchButtonHit = this.bplanSearchButtonHit.bind(this);
    this.bplanGazeteerhHit = this.bplanGazeteerhHit.bind(this);
    this.selectNextIndex = this.selectNextIndex.bind(this);
    this.selectPreviousIndex = this.selectPreviousIndex.bind(this);
    this.fitAll = this.fitAll.bind(this);
    this.featureClick = this.featureClick.bind(this);
    this.downloadPlan = this.downloadPlan.bind(this);
    this.downloadEverything = this.downloadEverything.bind(this);
    this.downloadPreparationDone = this.downloadPreparationDone.bind(this);
    this.doubleMapClick = this.doubleMapClick.bind(this);
    this.resetPreparedDownload = this.resetPreparedDownload.bind(this);
    this.openDocViewer = this.openDocViewer.bind(this);
  }

  bplanGazeteerhHit(selectedObject) {
    this.props.bplanActions.searchForPlans(selectedObject);
  }

  bplanSearchButtonHit(event) {
    console.log(this.props);
    this.props.bplanActions.searchForPlans();
  }

  selectNextIndex() {
    let potIndex = this.props.mapping.selectedIndex + 1;
    if (potIndex >= this.props.mapping.featureCollection.length) {
      potIndex = 0;
    }
    this.props.mappingActions.setSelectedFeatureIndex(potIndex);
    //this.props.mappingActions.fitSelectedFeatureBounds(stateConstants.AUTO_FIT_MODE_NO_ZOOM_IN);
  }

  doubleMapClick(event) {
    const pos = proj4(proj4.defs("EPSG:4326"), proj4crs25832def, [
      event.latlng.lng,
      event.latlng.lat
    ]);
    let wkt = `POINT(${pos[0]} ${pos[1]})`;
    this.props.bplanActions.searchForPlans(null, wkt);
  }

  selectPreviousIndex() {
    let potIndex = this.props.mapping.selectedIndex - 1;
    if (potIndex < 0) {
      potIndex = this.props.mapping.featureCollection.length - 1;
    }
    this.props.mappingActions.setSelectedFeatureIndex(potIndex);
    //this.props.mappingActions.fitSelectedFeatureBounds(stateConstants.AUTO_FIT_MODE_NO_ZOOM_IN);
  }

  fitAll() {
    this.props.mappingActions.fitAll();
  }


  openDocViewer() {
    const currentFeature = this.props.mapping.featureCollection[this.props.mapping.selectedIndex];
    try {
      let link = document.createElement("a");
      document.body.appendChild(link);
      link.setAttribute("type", "hidden");

      link.href = "/#/docs/bplaene/"+currentFeature.properties.nummer+"/1/1";
      link.target = "_docviewer";
      link.click();
     
    } catch (err) {
      window.alert(err);
    }
  }
  downloadPlan() {
    const currentFeature = this.props.mapping.featureCollection[this.props.mapping.selectedIndex];
    if (
      currentFeature.properties.plaene_rk.length + currentFeature.properties.plaene_nrk.length ===
      1
    ) {
      if (currentFeature.properties.plaene_rk.length === 1) {
        downloadSingleFile(currentFeature.properties.plaene_rk[0]);
      } else {
        downloadSingleFile(currentFeature.properties.plaene_nrk[0]);
      }
    } else {
      this.props.bplanActions.setDocumentLoadingIndicator(true);
      let downloadConf = {
        name: "BPLAN_Plaene." + currentFeature.properties.nummer,
        files: []
      };
      for (let index = 0; index < currentFeature.properties.plaene_rk.length; ++index) {
        let prk = currentFeature.properties.plaene_rk[index];
        downloadConf.files.push({
          uri: prk.url,
          folder: "rechtskraeftig"
        });
      }
      for (let index = 0; index < currentFeature.properties.plaene_nrk.length; ++index) {
        let pnrk = currentFeature.properties.plaene_nrk[index];
        downloadConf.files.push({
          uri: pnrk.url,
          folder: "nicht rechtskraeftig"
        });
      }
      prepareMergeMultipleFiles(downloadConf, this.downloadPreparationDone);
    }
  }

  downloadEverything() {
    this.props.bplanActions.setDocumentLoadingIndicator(true);
    const currentFeature = this.props.mapping.featureCollection[this.props.mapping.selectedIndex];
    // downloadMultipleFiles(
    //     [
    //       {"folder":"rechtskraeftig/","downloads":currentFeature.properties.plaene_rk},
    //       {"folder":"nicht rechtskraeftig/","downloads":currentFeature.properties.plaene_nrk},
    //       {"folder":"Zusatzdokumente/","downloads":currentFeature.properties.docs}
    //     ], "BPLAN_Plaene_und_Zusatzdokumente."+currentFeature.properties.nummer,this.downloadDone);

    let encoding = null;
    if (navigator.appVersion.indexOf("Win") !== -1) {
      encoding = "CP850";
    }

    let downloadConf = {
      name: "BPLAN_Plaene_und_Zusatzdokumente." + currentFeature.properties.nummer,
      files: [],
      encoding: encoding
    };
    for (let index = 0; index < currentFeature.properties.plaene_rk.length; ++index) {
      let prk = currentFeature.properties.plaene_rk[index];
      downloadConf.files.push({
        uri: prk.url,
        folder: "rechtskraeftig"
      });
    }
    for (let index = 0; index < currentFeature.properties.plaene_nrk.length; ++index) {
      let pnrk = currentFeature.properties.plaene_nrk[index];
      downloadConf.files.push({
        uri: pnrk.url,
        folder: "nicht rechtskraeftig"
      });
    }
    for (let index = 0; index < currentFeature.properties.docs.length; ++index) {
      let doc = currentFeature.properties.docs[index];
      downloadConf.files.push({
        uri: doc.url,
        folder: "Zusatzdokumente"
      });
    }
    prepareDownloadMultipleFiles(downloadConf, this.downloadPreparationDone);
  }
  resetPreparedDownload() {
    this.props.bplanActions.setPreparedDownload(null);
  }
  downloadPreparationDone(result) {
    if (result.error) {
      this.props.bplanActions.setDocumentHasLoadingError(true);
      setTimeout(() => {
        this.props.bplanActions.setDocumentLoadingIndicator(false);
      }, 2000);
    } else {
      this.props.bplanActions.setDocumentLoadingIndicator(false);
      this.props.bplanActions.setPreparedDownload(result);
    }
  }

  featureClick(event) {
    if (event.target.feature.selected) {
      this.props.mappingActions.fitSelectedFeatureBounds();
      if (event.target.feature.twin != null) {
        this.props.mappingActions.setSelectedFeatureIndex(event.target.feature.twin);
      }
    } else {
      this.props.mappingActions.setSelectedFeatureIndex(
        this.props.mapping.featureCollection.indexOf(event.target.feature)
      );
    }
  }

  searchTooltip() {
    return (
      <Tooltip style={{ zIndex: 3000000000 }} id="searchTooltip">
        B-Pl&auml;ne im Kartenausschnitt laden
      </Tooltip>
    );
  }

  render() {
    let info = null;
    if (this.props.mapping.featureCollection.length > 0) {
      info = (
        <BPlanInfo
          pixelwidth={250}
          featureCollection={this.props.mapping.featureCollection}
          selectedIndex={this.props.mapping.selectedIndex || 0}
          next={this.selectNextIndex}
          previous={this.selectPreviousIndex}
          fitAll={this.fitAll}
          loadingIndicator={this.props.bplaene.documentsLoading}
          downloadPlan={this.openDocViewer}
          downloadEverything={this.openDocViewer}
          preparedDownload={this.props.bplaene.preparedDownload}
          resetPreparedDownload={this.resetPreparedDownload}
          loadingError={this.props.bplaene.documentsLoadingError}
        />
      );
    } else {
      info = (
        <Well bsSize="small" pixelwidth={350}>
          <h5>Aktuell keine Bebauungspl&auml;ne geladen.</h5>
          <ul>
            <li>
              <b>einen B-Plan laden:</b> Doppelklick auf Plan in Hintergrundkarte
            </li>
            <li>
              <b>alle B-Pl&auml;ne im Kartenausschnitt laden:</b> <Icon name="search" />
            </li>
            <li>
              <b>bekannten B-Plan laden:</b> Nummer als Suchbegriff eingeben, Auswahl aus
              Vorschlagsliste
            </li>
            <li>
              <b>Suche nach B-Pl&auml;nen:</b> Adresse oder POI als Suchbegriff eingeben, Auswahl
              aus Vorschlagsliste
            </li>
          </ul>
          <a onClick={() => this.props.uiStateActions.showApplicationMenu(true)}>
            vollst&auml;ndige Bedienungsanleitung
          </a>
        </Well>
      );
    }

    return (
      <div>
        <BPlanModalHelp key={"BPlanModalHelp.visible:" + this.props.ui.applicationMenuVisible} />

        <Cismap
          layers={this.props.match.params.layers || "uwBPlan|wupp-plan-live@20"}
          gazeteerHitTrigger={this.bplanGazeteerhHit}
          searchButtonTrigger={this.bplanSearchButtonHit}
          applicationMenuTooltipProvider={() => {
            return (
              <Tooltip
                style={{
                  zIndex: 3000000000
                }}
                id="helpTooltip"
              >
                Bedienungsanleitung anzeigen
              </Tooltip>
            );
          }}
          applicationMenuIcon="info"
          featureStyler={bplanFeatureStyler}
          labeler={bplanLabeler}
          featureClickHandler={this.featureClick}
          ondblclick={this.doubleMapClick}
          searchTooltipProvider={this.searchTooltip}
          searchMinZoom={12}
          searchMaxZoom={18}
          searchAfterGazetteer={true}
          gazTopics={["pois", "bplaene", "adressen"]}
          infoBox={info}
        />
      </div>
    );
  }
}

const BPlaene = connect(
  mapStateToProps,
  mapDispatchToProps
)(BPlaene_);

export default BPlaene;

BPlaene.propTypes = {
  ui: PropTypes.object,
  kassenzeichen: PropTypes.object,
  uiState: PropTypes.object,
  bplaene: PropTypes.object
};
