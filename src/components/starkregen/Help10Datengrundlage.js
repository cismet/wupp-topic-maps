import React from "react";
import GenericModalMenuSection from "../commons/GenericModalMenuSection";

const Component = ({ uiState, uiStateActions }) => {
  return (
    <GenericModalMenuSection
      uiState={uiState}
      uiStateActions={uiStateActions}
      sectionKey="datengrundlage"
      sectionTitle="Datengrundlagen"
      sectionBsStyle="warning"
      sectionContent={
        <div>
          <p>
            Die Starkregengefahrenkarte stellt Ihnen drei verschiedene Hintergrundkarten bereit, die
            auf den folgenden Geodatendiensten und Geodaten basieren:
          </p>

          <ul>
            <li>
              <strong>Topographische Karte</strong>: (1) Kartendienste (WMS) der Stadt Wuppertal.
              Datengrundlagen: (a) <strong>Amtliche Basiskarte ABK Graustufen</strong>. (Wöchentlich
              in einem automatisierten Prozess aus dem Fachverfahren ALKIS des
              Liegenschaftskatasters abgeleitete großmaßstäbige topographische Karte in Graustufen.)
              © Stadt Wuppertal (
              <a href="http://www.govdata.de/dl-de/by-2-0">
                Datenlizenz Deutschland - Namensnennung - Version 2.0
              </a>
              ). (b) <strong>Hillshade</strong> (Schummerungsdarstellung eines für hydrologische
              Fragestellungen optimierten Digitalen Geländemodells aus Laserscanner-Befliegungen
              (12/2008 und 01/2009) mit ergänztem Gebäudebestand (Auflösung 25cm x 25cm), ausgeführt
              in 2012 vom Ingenieurbüro Reinhard Beck GmbH &amp; Co. KG / Wuppertal.) © Wuppertaler
              Stadtwerke WSW Energie &amp; Wasser AG. (2) Kartendienst (WMS) des Bundesamtes für
              Kartographie und Geodäsie (BKG). Datengrundlage:{" "}
              <strong>
                <a href="http://www.geodatenzentrum.de/geodaten/gdz_rahmen.gdz_div?gdz_spr=deu&amp;gdz_akt_zeile=4&amp;gdz_anz_zeile=4&amp;gdz_unt_zeile=0&amp;gdz_user_id=0#dok">
                  WebAtlasDE
                </a>
              </strong>{" "}
              © GeoBasis-DE / BKG 2018
            </li>

            <li>
              <strong>Luftbild</strong>: Kartendienst (WMS) der Stadt Wuppertal. Datengrundlage:{" "}
              <strong>True Orthophoto aus Bildflug vom 19.04.2018</strong>, hergestellt durch Aero
              West GmbH/Dortmund, Bodenauflösung 5 cm. (True Orthophoto: Aus Luftbildern mit hoher
              Längs- und Querüberdeckung in einem automatisierten Bildverarbeitungsprozess
              berechnetes Bild in Parallelprojektion, also ohne Gebäudeverkippung und sichttote
              Bereiche.) © Stadt Wuppertal (
              <a href="https://www.wuppertal.de/geoportal/Nutzungsbedingungen/NB-GDIKOM-B_Geodaten.pdf">
                NB-GDIKOM B
              </a>
              ).
            </li>

            <li>
              <strong>Stadtplan</strong>: Kartendienst (WMS) des Regionalverbandes Ruhr (RVR).
              Datengrundlage: <strong>Stadtplanwerk 2.0 Beta</strong>. (Wöchentlich in einem
              automatischen Prozess aktualisierte Zusammenführung des Straßennetzes der
              OpenStreetMap mit Gebäuden und Flächennutzungen aus dem Fachverfahren ALKIS des
              Liegenschaftskatasters.) © RVR und Kooperationspartner (
              <a href="https://creativecommons.org/licenses/by/4.0/legalcode.de">CC BY 4.0</a>).
              Lizenzen der Ausgangsprodukte: Land NRW (2018){" "}
              <a href="http://www.govdata.de/dl-de/by-2-0">
                Datenlizenz Deutschland - Namensnennung - Version 2.0
              </a>{" "}
              und OpenStreetMap contributors (
              <a href="http://www.opendatacommons.org/licenses/odbl/1.0/">ODbL</a>).{" "}
            </li>
          </ul>
        </div>
      }
    />
  );
};
export default Component;
