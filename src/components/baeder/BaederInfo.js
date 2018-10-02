import React from "react";
import PropTypes from "prop-types";
import { Well } from "react-bootstrap";
import { Icon } from "react-fa";
import queryString from "query-string";
import Color from "color";
import InfoBox from "../commons/InfoBox";
import { getColorForProperties } from "../../utils/baederHelper";
import { triggerLightBoxForPOI } from "../../utils/stadtplanHelper";
import IconLink from "../commons/IconLink";
// Since this component is simple and static, there's no parent container for it.
const BaederInfo = ({
  featureCollection,
  items,
  selectedIndex,
  next,
  previous,
  fitAll,
  loadingIndicator,
  showModalMenu,
  uiState,
  uiStateActions,
  linksAndActions,
  panelClick,
  pixelwidth
}) => {
  const currentFeature = featureCollection[selectedIndex];
  if (currentFeature) {
    let header = currentFeature.properties.more.typ + ", " + currentFeature.properties.more.zugang;

    let adresse = currentFeature.properties.adresse;

    if (currentFeature.properties.stadt !== "Wuppertal") {
      adresse += ", " + currentFeature.properties.stadt;
    }

    let info = "";
    if (currentFeature.properties.info) {
      info = currentFeature.properties.info;
    }

    let links = [];
    if (currentFeature.properties.tel) {
      links.push(
        <IconLink key={`IconLink.tel`}
          tooltip="Anrufen"
          href={"tel:" + currentFeature.properties.tel}
          iconname="phone"
        />
      );
    }
    if (currentFeature.properties.email) {
      links.push(
        <IconLink key={`IconLink.email`}
          tooltip="E-Mail schreiben"
          href={"mailto:" + currentFeature.properties.email}
          iconname="envelope-square"
        />
      );
    }
    if (currentFeature.properties.url) {
      links.push(
        <IconLink key={`IconLink.web`}
          tooltip="Zur Homepage"
          href={currentFeature.properties.url}
          target="_blank"
          iconname="link"
        />
      );
    }
    if (currentFeature.properties.more.coursemanager) {
      links.push(
        <IconLink key={`IconLink.coursemanager`}
          tooltip="Kurs buchen"
          href={currentFeature.properties.more.coursemanager}
          target="coursemanager"
          iconname="calendar"
        />
      );
    }

    let fotoPreview;

    if (currentFeature.properties.foto) {
      fotoPreview = (
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td style={{ textAlign: "right", verticalAlign: "top" }}>
                <a
                  onClick={() => {
                    triggerLightBoxForPOI(currentFeature, uiStateActions);
                  }}
                  hrefx={currentFeature.properties.fotostrecke || currentFeature.properties.foto}
                  target="_fotos"
                >
                  <img
                    alt="Bild"
                    style={{ paddingBottom: "5px" }}
                    src={currentFeature.properties.foto.replace(
                      /http:\/\/.*fotokraemer-wuppertal\.de/,
                      "https://wunda-geoportal-fotos.cismet.de/"
                    )}
                    width="150"
                  />
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      );
    }

    return (
      <InfoBox
        featureCollection={featureCollection}
        items={items}
        selectedIndex={selectedIndex}
        next={next}
        previous={previous}
        fitAll={fitAll}
        loadingIndicator={loadingIndicator}
        showModalMenu={showModalMenu}
        uiState={uiState}
        uiStateActions={uiStateActions}
        linksAndActions={linksAndActions}
        panelClick={panelClick}
        colorize={getColorForProperties}
        pixelwidth={pixelwidth}
        header={header}
        headerColor={getColorForProperties(currentFeature.properties)}
        links={links}
        title={currentFeature.text}
        subtitle={adresse}
        additionalInfo={info}
        zoomToAllLabel={`${items.length} Bäder in Wuppertal`}
        currentlyShownCountLabel={`${featureCollection.length} ${
          featureCollection.length === 1 ? "Bad" : "Bäder"
        } angezeigt`}
        fotoPreview={fotoPreview}
      />
    );
  } else {
    return <div />;
  }
};

export default BaederInfo;
BaederInfo.propTypes = {
  featureCollection: PropTypes.array.isRequired,
  filteredPOIs: PropTypes.array.isRequired,
  selectedIndex: PropTypes.number.isRequired,
  next: PropTypes.func.isRequired,
  previous: PropTypes.func.isRequired,
  fitAll: PropTypes.func.isRequired,
  showModalMenu: PropTypes.func.isRequired,
  panelClick: PropTypes.func.isRequired
};

BaederInfo.defaultProps = {
  featureCollection: [],
  filteredPOIs: [],
  selectedIndex: 0,
  next: () => {},
  previous: () => {},
  fitAll: () => {},
  showModalMenu: () => {}
};
