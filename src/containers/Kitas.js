import React from "react";
import PropTypes from "prop-types";
import Cismap from "../containers/Cismap";

import { connect } from "react-redux";
import { Tooltip, Well } from "react-bootstrap";

import { actions as mappingActions } from "../redux/modules/mapping";
import { actions as uiStateActions } from "../redux/modules/uiState";
import { actions as kitasActions } from "../redux/modules/kitas";
import { routerActions } from "react-router-redux";

import { bindActionCreators } from "redux";

import {
  getFeatureStyler,
  featureHoverer,
  getKitaClusterIconCreatorFunction,
  getFilterDescription
} from "../utils/kitasHelper";

import Loadable from "react-loading-overlay";
import queryString from "query-string";

import KitaInfo from "../components/kitas/KitaInfo";
import KitasModalApplicationMenu from "../components/kitas/KitasModalApplicationMenu";

import "react-image-lightbox/style.css";

function mapStateToProps(state) {
  return {
    uiState: state.uiState,
    mapping: state.mapping,
    routing: state.routing,
    kitas: state.kitas
  };
}

function mapDispatchToProps(dispatch) {
  return {
    mappingActions: bindActionCreators(mappingActions, dispatch),
    uiStateActions: bindActionCreators(uiStateActions, dispatch),
    kitasActions: bindActionCreators(kitasActions, dispatch),
    routingActions: bindActionCreators(routerActions, dispatch)
  };
}

export class Kitas_ extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.gazeteerhHit = this.gazeteerhHit.bind(this);
    this.searchButtonHit = this.searchButtonHit.bind(this);
    this.featureClick = this.featureClick.bind(this);
    this.gotoHome = this.gotoHome.bind(this);
    this.doubleMapClick = this.doubleMapClick.bind(this);
    this.searchTooltip = this.searchTooltip.bind(this);
    this.selectNextIndex = this.selectNextIndex.bind(this);
    this.selectPreviousIndex = this.selectPreviousIndex.bind(this);
    this.createfeatureCollectionByBoundingBox = this.createfeatureCollectionByBoundingBox.bind(
      this
    );
    this.filterChanged = this.filterChanged.bind(this);
    this.resetFilter = this.resetFilter.bind(this);
    this.centerOnPoint = this.centerOnPoint.bind(this);
    this.props.mappingActions.setBoundingBoxChangedTrigger(
      this.createfeatureCollectionByBoundingBox
    );
  }
  componentWillUnmount() {
    // console.log("Ehrenamt unmount")
  }

  componentWillMount() {
    // console.log("Ehrenamt mount")
    this.dataLoaded = false;
    this.loadTheKitas().then(data => {
      this.dataLoaded = true;
    });
    //this.props.uiStateActions.setApplicationMenuActiveKey("filtertab");
  }
  componentWillUpdate() {
    if (this.props.kitas.kitas.length === 0) {
      return;
    }
  }

  loadTheKitas() {
    var promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        this.props.kitasActions.loadKitas();
        resolve("ok");
      }, 100);
    });
    return promise;
  }
  createfeatureCollectionByBoundingBox(bbox) {
    this.props.kitasActions.createFeatureCollectionFromKitas(bbox);
  }

  gazeteerhHit(selectedObject) {
    if (
      selectedObject &&
      selectedObject[0] &&
      selectedObject[0].more &&
      selectedObject[0].more.kid
    ) {
      //this.props.stadtplanActions.setPoiGazHit(selectedObject[0].more.pid);
      this.props.kitasActions.setSelectedKita(selectedObject[0].more.kid);
    }
  }

  searchButtonHit(event) {}

  featureClick(event) {
    if (event.target.feature) {
      this.props.mappingActions.setSelectedFeatureIndex(
        event.target.feature.index
      );
    }
  }

  doubleMapClick(event) {}

  gotoHome() {
    //x1=361332.75015625&y1=5669333.966678483&x2=382500.79703125&y2=5687261.576954328
    this.cismapRef.wrappedInstance.gotoHomeBB();
  }

  centerOnPoint(x, y, z) {
    this.cismapRef.wrappedInstance.centerOnPoint(x, y, z);
  }

  selectNextIndex() {
    let potIndex = this.props.mapping.selectedIndex + 1;
    if (potIndex >= this.props.mapping.featureCollection.length) {
      potIndex = 0;
    }
    this.props.mappingActions.setSelectedFeatureIndex(potIndex);
    //this.props.mappingActions.fitSelectedFeatureBounds(stateConstants.AUTO_FIT_MODE_NO_ZOOM_IN);
  }

  selectPreviousIndex() {
    let potIndex = this.props.mapping.selectedIndex - 1;
    if (potIndex < 0) {
      potIndex = this.props.mapping.featureCollection.length - 1;
    }
    this.props.mappingActions.setSelectedFeatureIndex(potIndex);
  }
  filterChanged(filtergroup, filter) {
    //this.props.ehrenamtActions.toggleFilter(filtergroup,filter);
  }

  resetFilter() {
    // if (this.props.ehrenamt.mode===ehrenamtConstants.FILTER_FILTER){
    //     this.props.ehrenamtActions.resetFilter();
    // }
    // else {
    //     this.props.ehrenamtActions.setMode(ehrenamtConstants.FILTER_FILTER);
    // }
  }
  searchTooltip() {
    return <div />;
  }

  render() {
    let info = null;
    info = (
      <KitaInfo
        key={"kitaInfo." + (this.props.mapping.selectedIndex || 0)}
        pixelwidth={300}
        featureCollection={this.props.mapping.featureCollection}
        filteredKitas={this.props.kitas.filteredKitas}
        selectedIndex={this.props.mapping.selectedIndex || 0}
        next={this.selectNextIndex}
        previous={this.selectPreviousIndex}
        fitAll={this.gotoHome}
        showModalMenu={section =>
          this.props.uiStateActions.showApplicationMenuAndActivateSection(
            true,
            section
          )
        }
        uiState={this.props.uiState}
        uiStateActions={this.props.uiStateActions}
        panelClick={e => {
          //this.props.kitasActions.refreshFeatureCollection();
        }}
      />
    );

    let title = null;
    let filterDesc = "";
    let titleContent;
    let qTitle = queryString.parse(this.props.routing.location.search).title;
    if (qTitle !== undefined) {
      if (qTitle === null || qTitle === "") {
        filterDesc = getFilterDescription(this.props.kitas.filter);
        titleContent = (
          <div>
            <b>Mein Kita-Stadtplan: </b> {filterDesc}
          </div>
        );
      } else {
        filterDesc = qTitle;
        titleContent = <div>{filterDesc}</div>;
      }
      if (
        filterDesc !== "" &&
        !(
          this.props.kitas.filteredKitas.length ===
          this.props.kitas.kitas.length
        ) &&
        this.props.kitas.filteredKitas.length > 0
      ) {
        title = (
          <table
            style={{
              width: this.props.uiState.width - 54 - 12 - 38 - 12 + "px",
              height: "30px",
              position: "absolute",
              left: 54,
              top: 12,
              zIndex: 555
            }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    textAlign: "center",
                    verticalAlign: "middle",
                    background: "#ffffff",
                    color: "black",
                    opacity: "0.9",
                    paddingLeft: "10px"
                  }}
                >
                  {titleContent}
                </td>
              </tr>
            </tbody>
          </table>
        );
      }
    }

    return (
      <div>
        <KitasModalApplicationMenu
          key={
            "StadtplanModalApplicationMenu.visible:" +
            this.props.uiState.applicationMenuVisible
          }
          uiState={this.props.uiState}
          uiActions={this.props.uiStateActions}
          kitasState={this.props.kitas}
          kitasActions={this.props.kitasActions}
          mappingState={this.props.mapping}
          mappingActions={this.props.mappingActions}
          routingState={this.props.routing}
          routingActions={this.props.routingActions}
          filterChanged={this.filterChanged}
          centerOnPoint={this.centerOnPoint}
        />
        <Loadable active={!this.dataLoaded} spinner text="Laden der Kitas ...">
          {title}
          <Cismap
            ref={cismap => {
              this.cismapRef = cismap;
            }}
            initialZoom={8}
            fallbackposition={{
              lat: 51.24929,
              lng: 7.180562
            }}
            layers={this.props.match.params.layers || "wupp-plan-live@90"}
            gazeteerHitTrigger={this.gazeteerhHit}
            searchButtonTrigger={this.searchButtonHit}
            featureStyler={getFeatureStyler(this.props.kitas.kitaSvgSize)}
            hoverer={featureHoverer}
            featureClickHandler={this.featureClick}
            ondblclick={this.doubleMapClick}
            searchTooltipProvider={this.searchTooltip}
            searchMinZoom={99}
            searchMaxZoom={98}
            gazTopics={["adressen", "bezirke", "quartiere", "kitas"]}
            clustered={
              queryString.parse(this.props.routing.location.search)
                .unclustered === undefined
            }
            minZoom={6}
            clusterOptions={{
              spiderfyOnMaxZoom: false,
              spiderfyDistanceMultiplier: this.props.kitas.kitaSvgSize / 24,
              showCoverageOnHover: false,
              zoomToBoundsOnClick: false,
              maxClusterRadius: 40,
              disableClusteringAtZoom: 19,
              animate: false,
              cismapZoomTillSpiderfy: 12,
              selectionSpiderfyMinZoom: 12,
              iconCreateFunction: getKitaClusterIconCreatorFunction(
                this.props.kitas.kitaSvgSize
              )
            }}
            infoBox={info}
            applicationMenuTooltipProvider={() => (
              <Tooltip
                style={{
                  zIndex: 3000000000
                }}
                id="helpTooltip"
              >
                Filter | Einstellungen | Anleitung
              </Tooltip>
            )}
            gazBoxInfoText="Stadtteil | Adresse | Kita"
          />
        </Loadable>
      </div>
    );
  }
}

//<Control position = "bottomleft"> <Button>xxx</Button></Control>

const Kitas = connect(
  mapStateToProps,
  mapDispatchToProps
)(Kitas_);

export default Kitas;

Kitas.propTypes = {
  ui: PropTypes.object,
  uiState: PropTypes.object
};
