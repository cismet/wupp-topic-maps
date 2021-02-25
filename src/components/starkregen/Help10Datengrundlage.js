import React from 'react';
import GenericModalMenuSection from 'components/commons/GenericModalMenuSection';
import LicenseStadtplanTagNacht from 'components/commons/LicenseStadtplanTagNacht';
import LicenseLBK from 'components/commons/LicenseLuftbildkarte';
/* eslint-disable jsx-a11y/anchor-is-valid */

const Component = ({ uiState, uiStateActions, showModalMenu }) => {
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
            Die Starkregengefahrenkarte Wuppertal stellt in zwei umschaltbaren Kartenansichten
            maximale Wasserstände bzw. maximale Fließgeschwindigkeiten dar, die im Verlauf von
            simulierten Starkregenereignissen auftreten. Dazu wird ein Raster mit einer Kantenlänge
            von 1 m benutzt. Die Wasserstände und Fließgeschwindigkeiten werden jeweils mit einem
            Farbverlauf visualisiert. Der Farbverlauf für die <strong>Wasserstände</strong> benutzt
            die Eckwerte 20 cm (blau), 40 cm (gelb), 75 cm (orange) und 100 cm (rot). Wasserstände
            unter 10 cm werden nicht farbig ausgeprägt (transparente Darstellung). Zur
            Visualisierung der <strong>Fließgeschwindigkeiten</strong>, angegeben in Meter pro
            Sekunde (m/s), werden die Eckwerte 0,5 m/s (gelb), 2,0 m/s (orange), 4,0 m/s (hellrot)
            und 6 m/s (dunkelrot) verwendet. Der untere Grenzwert für die farbige Anzeige einer
            Fließgeschwindigkeit liegt bei 0,5 m/s. Die Simulationsberechnungen wurden im Auftrag
            der Stadt Wuppertal und der Wuppertaler Stadtwerke (WSW Energie und Wasser AG) durch das
            Ingenieurbüro Dr. Pecher AG (Erkrath) durchgeführt. Der Regenwasserabfluss im Kanalnetz
            und durch Überstau aus dem Kanalnetz austretendes Wasser wurden hierbei vereinfacht
            berücksichtigt, ebenso die unterschiedlichen Abflussgeschwindigkeiten auf Oberflächen
            mit unterschiedlicher Rauhigkeit (z. B. auf einer Straße schneller als auf einer Wiese).
            Die Informationen zur Oberflächenbeschaffenheit stammen dabei zum größten Teil aus dem
            Versiegelungsdaten-Informationssystem VerDIS der Stadtverwaltung Wuppertal.
          </p>

          <p>
            Die Simulationen basieren auf einem Digitalen Geländemodell (DGM) von Wuppertal,
            abgeleitet aus flächenhaften Höhenmessungen, die das Land NRW turnusmäßig mit einem
            Laserscanner aus einem Flugzeug heraus durchführt (verwendeter Datenstand überwiegend
            Anfang 2015). Das DGM wurde um die Gebäude aus dem Wuppertaler Liegenschaftskataster und
            das Kanalnetz inklusive verrohrter Gewässerabschnitte aus der Kanalnetzdatenbank der WSW
            Energie &amp; Wasser AG ergänzt, um eine hydrologisch korrekte Abflussberechnung zu
            gewährleisten. Für eine präzisere Simulation des Fließgeschehens wurden ab Version 2.0
            der Simulationsberechnungen 39 Brücken manuell rekonstruiert und zehn
            Regenrückhaltebecken des Wupperverbandes mitsamt ihren Zuleitungen berücksichtigt.
          </p>

          <p>
            Darüber hinaus ist das Ergebnis der Simulation natürlich von der Dauer und Intensität
            des Regens abhängig, der für die Simulation angenommen wird. Wir bieten Ihnen hierzu
            vier unterschiedliche{' '}
            <a onClick={() => showModalMenu('szenarien')}>simulierte Szenarien</a> an, drei
            "Modellregen" sowie das anhand der Niederschlagsmessungen desselben Tages nachgestellte
            Starkregenereignis vom 29.05.2018.{' '}
          </p>

          <p>
            Zur Betrachtung der Wasserstände stellen wir Ihnen drei verschiedene Hintergrundkarten
            bereit, die auf den folgenden Geodatendiensten und Geodaten basieren:
          </p>

          <ul>
            <li>
              <strong>Topographische Karte</strong>: (1) Kartendienste (WMS) der Stadt Wuppertal.
              Datengrundlagen: (a) <strong>Amtliche Basiskarte ABK Graustufen</strong>.(Wöchentlich
              in einem automatisierten Prozess aus dem Fachverfahren ALKIS des
              Liegenschaftskatasters abgeleitete großmaßstäbige topographische Karte in Graustufen.)
              © Stadt Wuppertal (
              <a target="_more" href="https://www.govdata.de/dl-de/zero-2-0">
                Datenlizenz Deutschland - Zero - Version 2.0
              </a>
              ). (b) <strong>Hillshade</strong> (Schummerungsdarstellung eines für hydrologische
              Fragestellungen optimierten Digitalen Geländemodells aus Laserscanner-Befliegungen
              (12/2008 und 01/2009) mit ergänztem Gebäudebestand (Auflösung 25cm x 25cm), ausgeführt
              in 2012 vom Ingenieurbüro Reinhard Beck GmbH &amp; Co. KG / Wuppertal.) © Wuppertaler
              Stadtwerke WSW Energie &amp; Wasser AG. (2) Kartendienst (WMS) des Bundesamtes für
              Kartographie und Geodäsie (BKG). Datengrundlage:{' '}
              <strong>
                <a
                  target="_more"
                  href="http://www.geodatenzentrum.de/geodaten/gdz_rahmen.gdz_div?gdz_spr=deu&amp;gdz_akt_zeile=4&amp;gdz_anz_zeile=4&amp;gdz_unt_zeile=0&amp;gdz_user_id=0#dok"
                >
                  WebAtlasDE
                </a>
              </strong>{' '}
              © GeoBasis-DE / BKG 2018
            </li>

            <LicenseLBK />

            <LicenseStadtplanTagNacht stylesDesc="" />
          </ul>
        </div>
      }
    />
  );
};
export default Component;
