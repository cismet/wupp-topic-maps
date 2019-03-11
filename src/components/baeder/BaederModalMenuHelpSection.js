import React from "react";
import { Link } from "react-scroll";
import { Icon } from "react-fa";
import { Label } from "react-bootstrap";
import GenericModalMenuSection from "../commons/GenericModalMenuSection";
import MeinStandortHelpText from "../commons/GenericHelpTextForMyLocation";
import { getColorForProperties, getBadSVG } from "../../utils/baederHelper";

const helpSVGSize = 18;
const hallenBadSVG = getBadSVG(helpSVGSize, "#565B5E", "Hallenbad", "helpTextSVG0");
const freibadBadSVG = getBadSVG(helpSVGSize, "#565B5E", "Freibad", "helpTextSVG1");

const staedtischesFreibadSVG = getBadSVG(
  helpSVGSize,
  getColorForProperties({
    more: { zugang: "öffentlich", betreiber: "Stadt" },
    mainlocationtype: { lebenslagen: ["Freizeit", "Sport"] }
  }),
  "Freibad",
  "helpTextSVG2"
);
const oeffentlichesVereinsbadSVG = getBadSVG(
  helpSVGSize,
  getColorForProperties({
    more: { zugang: "öffentlich", betreiber: "Verein" },
    mainlocationtype: { lebenslagen: ["Freizeit", "Sport"] }
  }),
  "Freibad",
  "helpTextSVG3"
);
const nichtOeffentlichesVereinsbadSVG = getBadSVG(
  helpSVGSize,
  getColorForProperties({
    more: { zugang: "nicht öffentlich", betreiber: "Verein" },
    mainlocationtype: { lebenslagen: ["Freizeit", "Sport"] }
  }),
  "Freibad",
  "helpTextSVG4"
);

// Zur Darstellung der Schwimmbäder in der Karte werden unterschiedliche Symbole für Hallenbäder
// [Signatur städtisches Hallenbad] und Freibäder [Signatur städtisches Freibad] verwendet. Dabei
// werden 3 unterschiedliche Hintergrundfarben verwendet: [Signatur städtisches Freibad] steht für
// städtische Bäder, die alle öffentlich zugänglich sind. [Signatur öffentlich zugängliches
// Vereinsbad] kennzeichnet öffentlich zugängliche Bäder in Vereinsregie und [Signatur nicht
// öffentlich zugängliches Vereinsbad] wird für nicht öffentlich zugängliche Vereinsbäder
// eingesetzt. Diese Farben werden in der Titelzeile der Info-Box aufgegriffen. Zusätzlich werden
// dort die Informationen zusammengefasst, die für die Kartendarstellung relevant sind, z. B.
// "Hallenbad (Verein), nicht öffentlich".

const BaederModalMenuHelpSection = ({ uiState, uiStateActions }) => {
  return (
    <GenericModalMenuSection
      uiState={uiState}
      uiStateActions={uiStateActions}
      sectionKey="help"
      sectionTitle="Kompaktanleitung"
      sectionBsStyle="success"
      sectionContent={
        <div>
          <div>
            <Link
              id="lnkHelpHeader_datengrundlage"
              to="Datengrundlage"
              containerId="myMenu"
              style={{ textDecoration: "none" }}
            >
              {" "}
              <Label bsStyle="default">Datengrundlage</Label>{" "}
            </Link>

            <Link
              id="lnkHelpHeader_auswahl"
              to="POIauswahluabfragen"
              containerId="myMenu"
              style={{ textDecoration: "none" }}
            >
              {" "}
              <Label bsStyle="danger">Bäder auswählen und abfragen</Label>{" "}
            </Link>
            <Link
              id="lnkHelpHeader_styling"
              to="kartendarstellung"
              containerId="myMenu"
              style={{ textDecoration: "none" }}
            >
              {" "}
              <Label bsStyle="primary">Kartendarstellung</Label>{" "}
            </Link>
            <Link
              id="lnkHelpHeader_positionieren"
              to="InKartePositionieren"
              containerId="myMenu"
              style={{ textDecoration: "none" }}
            >
              {" "}
              <Label bsStyle="warning">In Karte positionieren</Label>{" "}
            </Link>
            <Link
              id="lnkHelpHeader_standort"
              to="MeinStandort"
              containerId="myMenu"
              style={{ textDecoration: "none" }}
            >
              {" "}
              <Label bsStyle="info">Mein Standort</Label>{" "}
            </Link>
            <Link
              id="lnkHelpHeader_settings"
              to="Einstellungen"
              containerId="myMenu"
              style={{ textDecoration: "none" }}
            >
              {" "}
              <Label bsStyle="success">Einstellungen</Label>{" "}
            </Link>
            <Link
              id="lnkHelpHeader_personalisierung"
              to="Personalisierung"
              containerId="myMenu"
              style={{ textDecoration: "none" }}
            >
              {" "}
              <Label bsStyle="success">Personalisierung</Label>{" "}
            </Link>
          </div>

          <div id="anchorDivInHelp_datengrundlage" name="Datengrundlage">
            <br />
          </div>
          <h4>
            Datengrundlage{" "}
            <Link
              id="lnkUpInHelp_datengrundlage"
              to="help"
              containerId="myMenu"
              style={{ color: "#00000044" }}
            >
              <Icon name="arrow-circle-up" />
            </Link>
          </h4>
          <p>
            Die <strong>Bäder-Karte Wuppertal</strong> benutzt als Kartengrundlage das Stadtplanwerk
            2.0 des Regionalverbandes Ruhrgebiet. Dieses innovative Kartenwerk kombiniert das
            Straßennetz der OpenStreetMap mit den Gebäuden und Flächennutzungen aus dem
            Fachverfahren ALKIS des Liegenschaftskatasters. Das Stadtplanwerk 2.0 wird wöchentlich
            in einem automatischen Prozess aktualisiert. Zusätzlich nutzt die Bäder-Karte den
            Datensatz{" "}
            <a
              href="https://offenedaten-wuppertal.de/dataset/interessante-orte-wuppertal-poi"
              target="_opendata"
            >
              POI Wuppertal
            </a>{" "}
            des{" "}
            <a
              href="https://www.wuppertal.de/rathaus-buergerservice/karten_vermessung/index.php"
              target="_r102"
            >
              Ressorts Vermessung, Katasteramt und Geodaten
            </a>{" "}
            aus dem Open-Data-Angebot der Stadt Wuppertal, der auch die Wuppertaler Schwimmbäder
            umfasst.
          </p>

          <div id="anchorDivInHelp_auswahl" name="POIauswahluabfragen">
            <br />
          </div>
          <h4>
            Bäder auswählen und abfragen{" "}
            <Link
              id="lnkUpInHelp_auswahl"
              to="help"
              containerId="myMenu"
              style={{ color: "#00000044" }}
            >
              <Icon name="arrow-circle-up" />
            </Link>
          </h4>
          <p>
            Bewegen Sie den Mauszeiger im Kartenfenster auf eines der Schwimmbad-Symbole, um sich
            den Namen des Bades anzeigen zu lassen. Ein Klick auf das Symbol setzt den Fokus auf
            dieses Schwimmbad. Es wird dann blau hinterlegt und die zugehörigen Informationen (Name,
            Kurzinformation, Straße und Hausnummer) werden unten rechts in der Info-Box angezeigt.
            (Auf einem Tablet-PC wird der Fokus durch das erste Antippen des Schwimmbad-Symbols
            gesetzt, das zweite Antippen blendet den Namen ein.) Außerdem werden Ihnen in der
            Info-Box weiterführende (Kommunikations-) Links zu diesem Schwimmbad angezeigt:{" "}
            <Icon name="external-link-square" /> Internet,{" "}
            <span style={{ whiteSpace: "nowrap" }}>
              <Icon name="envelope-square" /> E-Mail
            </span>{" "}
            und <Icon name="phone" />
            Telefon. Durch Anklicken des Kalender-Symbols <Icon name="calendar" /> gelangen Sie bei
            einigen städtischen Bädern zum Aqua-Aktiv-Kursprogramm des Sport- und Bäderamtes. Dort
            können Sie online Fitnesskurse in diesen Bädern buchen.
          </p>
          <p>
            Wenn Sie noch kein Schwimmbad im aktuellen Kartenausschnitt selektiert haben, wird der
            Fokus automatisch auf das nördlichste Bad gesetzt. Mit den Funktionen{" "}
            <img alt="Cluster" src="images/vorher_treffer.png" /> vorheriger Treffer und{" "}
            <img alt="Cluster" src="images/nachher_treffer.png" /> nächster Treffer können Sie
            ausgehend von dem Schwimmbad, auf dem gerade der Fokus liegt, in nördlicher bzw.
            südlicher Richtung alle aktuell im Kartenfenster angezeigten Bäder durchmustern.
          </p>
          <p>
            Zu einigen Schwimmbädern bieten wir Ihnen Fotos oder Fotoserien an. Sie finden dann ein
            Vorschaubild direkt über der Info-Box. Klicken Sie auf das Vorschaubild, um einen
            Bildbetrachter ("Leuchtkasten") mit dem Foto / der Fotoserie zu öffnen. Wenn wir hier
            auf Bildmaterial zugreifen, das der Urheber auch selbst im Internet publiziert, finden
            Sie im Fußbereich des Bildbetrachters einen Link auf dieses Angebot.
          </p>
          <div id="anchorDivInHelp_styling" name="kartendarstellung">
            <br />
          </div>
          <h4>
            Kartendarstellung der Schwimmbäder{" "}
            <Link
              id="lnkUpInHelp_styling"
              to="help"
              containerId="myMenu"
              style={{ color: "#00000044" }}
            >
              <Icon name="arrow-circle-up" />
            </Link>
          </h4>
          <p>
            Zur Darstellung der Schwimmbäder in der Karte werden unterschiedliche Symbole für
            Hallenbäder {hallenBadSVG} und Freibäder {freibadBadSVG} verwendet. Dabei werden 3
            unterschiedliche Hintergrundfarben verwendet: {staedtischesFreibadSVG} steht für
            städtische Bäder, die alle öffentlich zugänglich sind. {oeffentlichesVereinsbadSVG}{" "}
            kennzeichnet öffentlich zugängliche Bäder in Vereinsregie und{" "}
            {nichtOeffentlichesVereinsbadSVG} wird für nicht öffentlich zugängliche Vereinsbäder
            eingesetzt. Diese Farben werden in der Titelzeile der Info-Box aufgegriffen. Zusätzlich
            werden dort die Informationen zusammengefasst, die für die Kartendarstellung relevant
            sind, z. B. "Hallenbad (Verein), nicht öffentlich".
          </p>
          <div id="anchorDivInHelp_positionieren" name="InKartePositionieren">
            <br />
          </div>
          <h4>
            In Karte positionieren{" "}
            <Link
              id="lnkUpInHelp_positionieren"
              to="help"
              containerId="myMenu"
              style={{ color: "#00000044" }}
            >
              <Icon name="arrow-circle-up" />
            </Link>
          </h4>
          <p>
            Um die Schwimmbäder in einem bestimmten Bereich des Stadtgebietes zu erkunden, geben Sie
            den Anfang eines Stadtteils (Stadtbezirk oder Quartier), einer Adresse, eines
            Straßennamens oder eines POI im Eingabefeld links unten ein (mindestens 2 Zeichen). In
            der inkrementellen Auswahlliste werden Ihnen passende Treffer angeboten. (Wenn Sie
            weitere Zeichen eingeben, wird der Inhalt der Auswahlliste angepasst.) Durch das
            vorangestellte Symbol erkennen Sie, ob es sich dabei um einen <Icon name="circle" />{" "}
            Stadtbezirk, ein <Icon name="pie-chart" /> Quartier, eine <Icon name="home" /> Adresse,
            eine <Icon name="road" /> Straße ohne zugeordnete Hausnummern, einen <Icon name="tag" />{" "}
            POI oder die <Icon name="tags" /> alternative Bezeichnung eines POI handelt.
          </p>
          <p>
            Nach der Auswahl eines Treffers aus der Liste wird die Karte auf die zugehörige Position
            zentriert. Bei Suchbegriffen mit Punktgeometrie (Adresse, Straße, POI) wird außerdem ein
            großer Maßstab (Zoomstufe 14) eingestellt und ein Marker{" "}
            <img alt="Cluster" src="images/AdressMarker.jpg" /> auf der Zielposition platziert. Bei
            Suchbegriffen mit Flächengeometrie (Stadtbezirk, Quartier) wird der Maßstab so
            eingestellt, dass die Fläche vollständig dargestellt werden kann. Zusätzlich wird der
            Bereich außerhalb dieser Fläche abgedunkelt (Spotlight-Effekt).
          </p>
          <p>
            Durch Anklicken des Werkzeugs <Icon name="times" /> links neben dem Eingabefeld können
            Sie die Suche zurücksetzen (Entfernung von Marker bzw. Abdunklung, Löschen des Textes im
            Eingabefeld).
          </p>
          <p>
            Da die Wuppertaler Schwimmbäder vollständig im POI-Datensatz enthalten sind, können Sie
            sich über alle gängigen Bezeichnungen dieser Schwimmbäder in der Karte positionieren.
            Dabei sind auch die Namen der Vereine, die ein Schwimmbad betreiben, als alternative
            Bezeichnungen des jeweiligen Bades hinterlegt. (Geben Sie z. B. einmal "Wasserfreunde"
            ein.)
          </p>
          <div id="anchorDivInHelp_standort" name="MeinStandort">
            <br />
          </div>
          <h4>
            Mein Standort{" "}
            <Link to="help" containerId="myMenu" style={{ color: "#00000044" }}>
              <Icon id="lnkUpInHelp_standort" name="arrow-circle-up" />
            </Link>
          </h4>
          <MeinStandortHelpText />
          <div id="anchorDivInHelp_settings" name="Einstellungen">
            <br />
          </div>
          <h4>
            Einstellungen{" "}
            <Link to="help" containerId="myMenu" style={{ color: "#00000044" }}>
              <Icon id="lnkUpInHelp_settings" name="arrow-circle-up" />
            </Link>
          </h4>
          <p>
            Unter "<strong>Einstellungen</strong>" können Sie im Anwendungsmenü <Icon name="bars" />{" "}
            festlegen, wie die Kitas und die Hintergrundkarte und die Schwimmbäder angezeigt werden
            sollen.
          </p>
          <p>
            Unter "
            <em>
              <strong>Kartendarstellung</strong>
            </em>
            " können Sie auswählen, ob Sie die standardmäßig aktivierte farbige Hintergrundkarte
            verwenden möchten ("
            <em>mehrfarbig</em>
            ") oder lieber eine farblich zurückgenommene Karte in Blautönen ("
            <em>blau</em>
            "), auf der sich die Schwimmbad-Symbole noch besser abheben. Die unterschiedlichen
            Flächennutzungen lassen sich dagegen in der Blauton-Karte nicht mehr so gut
            unterscheiden wie in der mehrfarbigen. Hinweis: Diese Auswahl wird Ihnen nur angeboten,
            wenn Ihr Browser CSS3-Filtereffekte unterstützt, also z. B. nicht beim Microsoft
            Internet Explorer.
          </p>
          <p>
            Unter "
            <em>
              <strong>Symbolgröße</strong>
            </em>
            " können Sie in Abhängigkeit von Ihrer Bildschirmauflösung und Ihrem Sehvermögen
            auswählen, ob die Schwimmbäder mit kleinen (25 Pixel), mittleren (35 Pixel) oder großen
            (45 Pixel) Symbolen angezeigt werden.
          </p>

          <p>
            Im Vorschaubild sehen Sie direkt die Wirkung ihrer Einstellungen in einem fest
            eingestellten Kartenausschnitt.
          </p>

          <div id="anchorDivInHelp_personalisierung" name="Personalisierung">
            <br />
          </div>
          <h4>
            Personalisierung{" "}
            <Link to="help" containerId="myMenu" style={{ color: "#00000044" }}>
              <Icon id="lnkUpInHelp_personalisierung" name="arrow-circle-up" />
            </Link>
          </h4>
          <p>
            Ihre Einstellungen bleiben auch nach einem Neustart der Anwendung erhalten. (Es sei
            denn, Sie löschen den Browser-Verlauf einschließlich der gehosteten App-Daten.)
          </p>
        </div>
      }
    />
  );
};
export default BaederModalMenuHelpSection;
