import React from "react";
import { Icon } from "react-fa";

const Comp = () => {
  return (
    <div>
      <span style={{ fontSize: "11px" }}>
        {/* Hintergrundkarte: Stadtplanwerk 2.0 (Beta) © Regionalverband Ruhr und Kooperationspartner (CC BY 4.0), Datengrundlagen © Land NRW (2018), Datenlizenz Deutschland - Namensnennung - Version 2.0 und OpenStreetMap contributors (ODbL) */}
        <b>Hintergrundkarte</b>: <a>Stadtplanwerk 2.0 (Beta)</a> <Icon name="copyright" />{" "}
        Regionalverband Ruhr (RVR) und Kooperationspartner (
        <a href="https://creativecommons.org/licenses/by/4.0/legalcode.de" target="_licensing">
          CC BY 4.0
        </a>
        ), Datengrundlagen <Icon name="copyright" /> Land NRW (2018){" "}
        <a href="http://www.govdata.de/dl-de/by-2-0" target="_licensing">
          Datenlizenz Deutschland - Namensnennung - Version 2.0
        </a>{" "}
        und OpenStreetMap contributors (
        <a href="http://www.opendatacommons.org/licenses/odbl/1.0/" target="_licensing">
          ODbL
        </a>
        ).
        <br />
        <b>Modellierung und Simulationsberechnung</b> (Version 0.9 | 10/2018):{" "}
        <a target="_wsw" href="https://www.wsw-online.de/wsw-energie-wasser/privatkunden/">
          WSW Energie und Wasser AG
        </a>{" "}
        | <a target="_pecher" href="https://www.pecher.de/">Dr. Pecher AG (Erkrath)</a>
        <br />
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
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://cismet.de/datenschutzerklaerung.html"
        >
          Datenschutzerklärung (Privacy Policy)
        </a>
      </span>
    </div>
  );
};

export default Comp;
