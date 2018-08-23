import React from "react";
import {
  FormGroup,
  Checkbox,
  Radio,
  ControlLabel
} from "react-bootstrap";
import { removeQueryPart, modifyQueryPart } from "../../utils/routingHelper";
import { constants as kitasConstants } from "../../redux/modules/kitas";

// Since this component is simple and static, there's no parent container for it.
const KitasSettingsPanel = ({
  width,
  titleDisplay,
  clusteredMarkers,
  markerSize,
  namedMapStyle,
  changeMarkerSymbolSize,
  routing,
  routingActions,
  refreshFeatureCollection,
  featureRendering,
  setFeatureRendering
}) => {
  let widePreviewPlaceholder = null;
  let narrowPreviewPlaceholder = null;

  let markerPreviewPrefix = "kitas";
  let markerPreviewName;
  if (clusteredMarkers) {
    if (markerSize >= 45) {
      markerPreviewName = markerPreviewPrefix + ".preview.clustered.l.png";
    } else if (markerSize <= 25) {
      markerPreviewName = markerPreviewPrefix + ".preview.clustered.s.png";
    } else {
      markerPreviewName = markerPreviewPrefix + ".preview.clustered.m.png";
    }
  } else {
    if (markerSize >= 45) {
      markerPreviewName = markerPreviewPrefix + ".preview.unclustered.l.png";
    } else if (markerSize <= 25) {
      markerPreviewName = markerPreviewPrefix + ".preview.unclustered.s.png";
    } else {
      markerPreviewName = markerPreviewPrefix + ".preview.unclustered.m.png";
    }
  }

  let titlePreview = null;
  if (titleDisplay) {
    titlePreview = (
      <div style={{ align: "center", width: "100%" }}>
        <div style={{ height: "10px" }} />
        <table
          style={{
            width: "96%",
            height: "30px",
            margin: "0 auto",
            //position: 'absolute',
            // left: 54,
            top: 12
            // zIndex: 999655
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
                  paddingleft: "10px"
                }}
              >
                <b>Mein Kita-Stadtplan: </b> alle Kitas | unter 2 + ab 2 Jahre |
                35h pro Woche
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  let preview = (
    <div>
      <FormGroup>
        <ControlLabel>Vorschau:</ControlLabel>
        <br />
        <div
          style={{
            backgroundImage:
              "url('/images/" +
              markerPreviewName +
              "')" +
              ",url('/images/map.preview." +
              namedMapStyle +
              ".png')",
            width: "100%",
            height: "250px",
            backgroundPosition: "center"
          }}
        >
          {titlePreview}
        </div>
      </FormGroup>
    </div>
  );

  if (width < 995) {
    narrowPreviewPlaceholder = (
      <div>
        <br />
        {preview}
      </div>
    );
  } else {
    widePreviewPlaceholder = <td>{preview}</td>;
  }
  return (
    <div>
      <table border={0} width="100%">
        <tbody>
          <tr>
            <td valign="top" style={{ width: "330px" }}>
              <FormGroup>
                <ControlLabel>Kita-Einstellungen:</ControlLabel>
                <br />
                <Checkbox
                  readOnly={true}
                  key={"title.checkbox" + titleDisplay}
                  checked={titleDisplay}
                  onClick={e => {
                    console.log("routing.location.search");
                    console.log(routing.location.search);

                    if (e.target.checked === false) {
                      routingActions.push(
                        routing.location.pathname +
                          removeQueryPart(routing.location.search, "title")
                      );
                    } else {
                      routingActions.push(
                        routing.location.pathname +
                          (routing.location.search !== ""
                            ? routing.location.search
                            : "?") +
                          "&title"
                      );
                    }
                  }}
                  inline
                >
                  Titel bei individueller Kita-Filterung anzeigen
                </Checkbox>
                <br />
                <Checkbox
                  readOnly={true}
                  key={"clustered.checkbox" + clusteredMarkers}
                  onClick={e => {
                    if (e.target.checked === true) {
                      routingActions.push(
                        routing.location.pathname +
                          removeQueryPart(
                            routing.location.search,
                            "unclustered"
                          )
                      );
                    } else {
                      routingActions.push(
                        routing.location.pathname +
                          (routing.location.search !== ""
                            ? routing.location.search
                            : "?") +
                          "&unclustered"
                      );
                    }
                    refreshFeatureCollection();
                  }}
                  checked={clusteredMarkers}
                  inline
                >
                  Kitas ma&szlig;stabsabh&auml;ngig zusammenfassen
                </Checkbox>
                <br />
              </FormGroup>
              <br/>
              <FormGroup key={"featureRenderingCombos."+featureRendering}>                
                <ControlLabel>Zeichenvorschrift:</ControlLabel>
                <br />
                <Radio
                  readOnly={true}
                  onClick={e => {
                    if (e.target.checked === true) {
                      setFeatureRendering(kitasConstants.FEATURE_RENDERING_BY_TRAEGERTYP);
                    }
                  }}
                  checked={featureRendering===kitasConstants.FEATURE_RENDERING_BY_TRAEGERTYP}
                  name="featureRendering"
                  inline
                >
                  nach Trägertyp
                </Radio>{" "}
                <br/>
                <Radio
                  readOnly={true}
                  onClick={e => {
                    if (e.target.checked === true) {
                      setFeatureRendering(kitasConstants.FEATURE_RENDERING_BY_TRAEGERTYP2);
                    }
                  }}
                  checked={featureRendering===kitasConstants.FEATURE_RENDERING_BY_TRAEGERTYP2}
                  name="featureRendering"
                  inline
                >
                  nach Trägertyp-2
                </Radio>{" "}
                <br/>
                <Radio
                  readOnly={true}
                  onClick={e => {
                    if (e.target.checked === true) {
                      setFeatureRendering(kitasConstants.FEATURE_RENDERING_BY_TRAEGERTYP3);
                    }
                  }}
                  checked={featureRendering===kitasConstants.FEATURE_RENDERING_BY_TRAEGERTYP3}
                  name="featureRendering"
                  inline
                >
                  nach Trägertyp-3
                </Radio>{" "}
                <br/>
                <Radio
                  readOnly={true}
                  onClick={e => {
                    if (e.target.checked === true) {
                      setFeatureRendering(kitasConstants.FEATURE_RENDERING_BY_PROFIL);
                    }
                  }}
                  name="featureRendering"
                  checked={featureRendering===kitasConstants.FEATURE_RENDERING_BY_PROFIL}
                  inline
                >
                  nach Profil (Inklusionsschwerpunkt j/n)
                </Radio>{" "}
                </FormGroup>
              <FormGroup>
                <br />
                <ControlLabel>Kartendarstellung:</ControlLabel>
                <br />
                <Radio
                  readOnly={true}
                  onClick={e => {
                    if (e.target.checked === true) {
                      routingActions.push(
                        routing.location.pathname +
                          removeQueryPart(routing.location.search, "mapStyle")
                      );
                    }
                  }}
                  checked={namedMapStyle === "default"}
                  name="mapBackground"
                  inline
                >
                  Tag
                </Radio>{" "}
                <Radio
                  readOnly={true}
                  onClick={e => {
                    if (e.target.checked === true) {
                      routingActions.push(
                        routing.location.pathname +
                          modifyQueryPart(routing.location.search, {
                            mapStyle: "night"
                          })
                      );
                    }
                  }}
                  name="mapBackground"
                  checked={namedMapStyle === "night"}
                  inline
                >
                  Nacht
                </Radio>{" "}
              </FormGroup>
              <FormGroup>
                <br />
                <ControlLabel>Symbolgr&ouml;&szlig;e:</ControlLabel>
                <br />

                <table border={0}>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          paddingLeft: "6px",
                          paddingRight: "15px"
                        }}
                      >
                        <a onClick={() => changeMarkerSymbolSize(25)}>
                          <img alt="minimal" src="images/kita.25.png" />
                        </a>
                      </td>
                      <td
                        style={{
                          paddingLeft: "3px",
                          paddingRight: "15px"
                        }}
                      >
                        <a onClick={() => changeMarkerSymbolSize(35)}>
                          <img alt="minimal" src="images/kita.35.png" />
                        </a>
                      </td>
                      <td>
                        <a onClick={() => changeMarkerSymbolSize(45)}>
                          <img alt="minimal" src="images/kita.45.png" />
                        </a>
                      </td>
                    </tr>
                    <tr border={0} style={{ verticalAlign: "top" }}>
                      <td style={{ textAlign: "center" }}>
                        <Radio
                          style={{ marginTop: "0px" }}
                          readOnly={true}
                          onClick={() => changeMarkerSymbolSize(25)}
                          name="poiSize25"
                          checked={markerSize <= 25}
                        />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <Radio
                          style={{ marginTop: "0px", marginLeft: "0px" }}
                          readOnly={true}
                          onClick={() => changeMarkerSymbolSize(35)}
                          name="poiSize35"
                          checked={markerSize > 25 && markerSize < 45}
                        />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <Radio
                          style={{ marginTop: "0px", marginLeft: "7px" }}
                          readOnly={true}
                          onClick={() => changeMarkerSymbolSize(45)}
                          name="poiSize45"
                          checked={markerSize >= 45}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </FormGroup>
             
            </td>
            {widePreviewPlaceholder}
          </tr>
        </tbody>
      </table>
      {narrowPreviewPlaceholder}
    </div>
  );
};

export default KitasSettingsPanel;
