import React from "react";
import { Icon } from "react-fa";

const KitasModalFooter = () => {
  return (
    <div>
      <span style={{ fontSize: "11px" }}>
        <b>Hintergrundkarte</b>: <a>Stadtplanwerk 2.0 (Beta)</a>,{" "}
        <Icon name="copyright" /> Regionalverband Ruhr (RVR) und
        Kooperationspartner, Datengrundlagen <Icon name="copyright" />{" "}
        OpenStreetMap contributors (
        <a
          href="http://www.opendatacommons.org/licenses/odbl/1.0/"
          target="_licensing"
        >
          ODbL
        </a>
        ) und <Icon name="copyright" /> Land NRW (2018) ,{" "}
        <a href="http://www.govdata.de/dl-de/by-2-0" target="_licensing">
          Datenlizenz Deutschland - Namensnennung - Version 2.0
        </a>
        .<br />
        <b>Technische Realisierung</b>:{" "}
        <a href="https://cismet.de/" target="_cismet">
          cismet GmbH
        </a>{" "}
        auf Basis von{" "}
        <a href="http://leafletjs.com/" target="_leaflet">
          Leaflet
        </a>{" "}
        und{" "}
        <a href="https://cismet.de/#refs" target="_cismet">
          cids | WuNDa
        </a>
        <br />
        <a target="_blank" href="https://cismet.de/datenschutzerklaerung.html">
          Datenschutzerklärung (Privacy Policy)
        </a>
      </span>
    </div>
  );
};

export default KitasModalFooter;
