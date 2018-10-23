import React from 'react';
import { Link } from 'react-scroll';
import { Icon } from 'react-fa';
import { Label } from 'react-bootstrap';
import GenericModalMenuSection from '../commons/GenericModalMenuSection';

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
						<Link to="Datengrundlage" containerId="myMenu" style={{ textDecoration: 'none' }}>
							{' '}
							<Label bsStyle="default">Datengrundlage</Label>{' '}
						</Link>

						<Link to="POIauswahluabfragen" containerId="myMenu" style={{ textDecoration: 'none' }}>
							{' '}
							<Label bsStyle="warning">Bäder auswählen und abfragen</Label>{' '}
						</Link>
						<Link to="InKartePositionieren" containerId="myMenu" style={{ textDecoration: 'none' }}>
							{' '}
							<Label bsStyle="warning">In Karte positionieren</Label>{' '}
						</Link>
						<Link to="MeinStandort" containerId="myMenu" style={{ textDecoration: 'none' }}>
							{' '}
							<Label bsStyle="warning">Mein Standort</Label>{' '}
						</Link>
						<Link to="Einstellungen" containerId="myMenu" style={{ textDecoration: 'none' }}>
							{' '}
							<Label bsStyle="success">Einstellungen</Label>{' '}
						</Link>
						<Link to="Personalisierung" containerId="myMenu" style={{ textDecoration: 'none' }}>
							{' '}
							<Label bsStyle="success">Personalisierung</Label>{' '}
						</Link>
					</div>

					<div name="Datengrundlage">
						<br />
					</div>
					<h4>
						Datengrundlage{' '}
						<Link to="help" containerId="myMenu" style={{ color: '#00000044' }}>
							<Icon name="arrow-circle-up" />
						</Link>
					</h4>
					<p>
						Die <strong>Bäder-Karte Wuppertal</strong> benutzt als Kartengrundlage das Stadtplanwerk 2.0 des
						Regionalverbandes Ruhrgebiet. Dieses innovative Kartenwerk kombiniert das Straßennetz der
						OpenStreetMap mit den Gebäuden und Flächennutzungen aus dem Fachverfahren ALKIS des
						Liegenschaftskatasters. Das Stadtplanwerk 2.0 wird wöchentlich in einem automatischen Prozess
						aktualisiert. Zusätzlich nutzt die Bäder-Karte den Datensatz{' '}
						<a
							href="https://offenedaten-wuppertal.de/dataset/interessante-orte-wuppertal-poi"
							target="_opendata"
						>
							POI Wuppertal
						</a>{' '}
						des{' '}
						<a
							href="https://www.wuppertal.de/rathaus-buergerservice/karten_vermessung/index.php"
							target="_r102"
						>
							Ressorts Vermessung, Katasteramt und Geodaten
						</a>{' '}
						aus dem Open-Data-Angebot der Stadt Wuppertal, der auch die Wuppertaler Schwimmbäder umfasst.
					</p>

					<div name="POIauswahluabfragen">
						<br />
					</div>
					<h4>
						Bäder auswählen und abfragen{' '}
						<Link to="help" containerId="myMenu" style={{ color: '#00000044' }}>
							<Icon name="arrow-circle-up" />
						</Link>
					</h4>
					<p>
						Bewegen Sie den Mauszeiger im Kartenfenster auf eines der Schwimmbad-Symbole, um sich den Namen
						des Bades anzeigen zu lassen. Ein Klick auf das Symbol setzt den Fokus auf dieses Schwimmbad. Es
						wird dann blau hinterlegt und die zugehörigen Informationen (Name, Kurzinformation, Straße und
						Hausnummer) werden unten rechts in der Info-Box angezeigt. (Auf einem Tablet-PC wird der Fokus
						durch das erste Antippen des Schwimmbad-Symbols gesetzt, das zweite Antippen blendet den Namen
						ein.) Außerdem werden Ihnen in der Info-Box weiterführende (Kommunikations-) Links zu diesem
						Schwimmbad angezeigt: <Icon name="link" /> Internet, <Icon name="envelope-square" /> E-Mail und{' '}
						<Icon name="phone" />
						Telefon. Durch Anklicken des Kalender-Symbols <Icon name="calendar" /> gelangen Sie bei einigen
						städtischen Bädern zum Aqua-Aktiv-Kursprogramm des Sport- und Bäderamtes. Dort können Sie online
						Fitnesskurse in diesen Bädern buchen.
					</p>
					<p>
						Wenn Sie noch kein Schwimmbad im aktuellen Kartenausschnitt selektiert haben, wird der Fokus
						automatisch auf das nördlichste Bad gesetzt. Mit den Funktionen{' '}
						<img alt="Cluster" src="images/vorher_treffer.png" /> vorheriger Treffer und{' '}
						<img alt="Cluster" src="images/nachher_treffer.png" /> nächster Treffer können Sie ausgehend von
						dem Schwimmbad, auf dem gerade der Fokus liegt, in nördlicher bzw. südlicher Richtung alle
						aktuell im Kartenfenster angezeigten Bäder durchmustern.
					</p>
					<p>
						Zu einigen Schwimmbädern bieten wir Ihnen Fotos oder Fotoserien an. Sie finden dann ein
						Vorschaubild direkt über der Info-Box. Klicken Sie auf das Vorschaubild, um einen Bildbetrachter
						("Leuchtkasten") mit dem Foto / der Fotoserie zu öffnen. Wenn wir hier auf Bildmaterial
						zugreifen, das der Urheber auch selbst im Internet publiziert, finden Sie im Fußbereich des
						Bildbetrachters einen Link auf dieses Angebot.
					</p>
					<div name="InKartePositionieren">
						<br />
					</div>
					<h4>
						In Karte positionieren{' '}
						<Link to="help" containerId="myMenu" style={{ color: '#00000044' }}>
							<Icon name="arrow-circle-up" />
						</Link>
					</h4>
					<p>
						Um die Schwimmbäder in einem bestimmten Bereich des Stadtgebietes zu erkunden, geben Sie den
						Anfang eines Stadtteils (Stadtbezirk oder Quartier), einer Adresse, eines Straßennamens oder
						eines POI im Eingabefeld links unten ein (mindestens 2 Zeichen). In der inkrementellen
						Auswahlliste werden Ihnen passende Treffer angeboten. (Wenn Sie weitere Zeichen eingeben, wird
						der Inhalt der Auswahlliste angepasst.) Durch das vorangestellte Symbol erkennen Sie, ob es sich
						dabei um einen <Icon name="circle" /> Stadtbezirk, ein <Icon name="pie-chart" /> Quartier, eine{' '}
						<Icon name="home" /> Adresse, eine <Icon name="road" /> Straße ohne zugeordnete Hausnummern,
						einen <Icon name="tag" /> POI oder die <Icon name="tags" /> alternative Bezeichnung eines POI
						handelt.
					</p>
					<p>
						Nach der Auswahl eines Treffers aus der Liste wird die Karte auf die zugehörige Position
						zentriert. Bei Suchbegriffen mit Punktgeometrie (Adresse, Straße, POI) wird außerdem ein großer
						Maßstab (Zoomstufe 14) eingestellt und ein Marker{' '}
						<img alt="Cluster" src="images/AdressMarker.jpg" /> auf der Zielposition platziert. Bei
						Suchbegriffen mit Flächengeometrie (Stadtbezirk, Quartier) wird der Maßstab so eingestellt, dass
						die Fläche vollständig dargestellt werden kann. Zusätzlich wird der Bereich außerhalb dieser
						Fläche abgedunkelt (Spotlight-Effekt).
					</p>
					<p>
						Durch Anklicken des Werkzeugs <Icon name="times" /> links neben dem Eingabefeld können Sie die
						Suche zurücksetzen (Entfernung von Marker bzw. Abdunklung, Löschen des Textes im Eingabefeld).
					</p>
					<p>
						Da die Wuppertaler Schwimmbäder vollständig im POI-Datensatz enthalten sind, können Sie sich
						über alle gängigen Bezeichnungen dieser Schwimmbäder in der Karte positionieren. Dabei sind auch
						die Namen der Vereine, die ein Schwimmbad betreiben, als alternative Bezeichnungen des
						jeweiligen Bades hinterlegt. (Geben Sie z. B. einmal "Wasserfreunde" ein.)
					</p>
					<div name="MeinStandort">
						<br />
					</div>
					<h4>
						Mein Standort{' '}
						<Link to="help" containerId="myMenu" style={{ color: '#00000044' }}>
							<Icon name="arrow-circle-up" />
						</Link>
					</h4>
					<p>
						Mit der Funktion Mein Standort <Icon name="map-marker" /> können Sie ihren aktuellen Standort
						mit einem blauen Kreissymbol <img alt="Cluster" src="images/MeinStandpunktMarker.jpg" /> in der
						Karte anzeigen. Das Standortsymbol ist umgeben von einem zweiten Kreis mit transparenter, blauer
						Füllung, dessen Radius die Unsicherheit der Positionsbestimmung angibt{' '}
						<img alt="Cluster" src="images/MeinStandpunktMarkerDoppel.jpg" />. Die Richtigkeit der
						Positionsanzeige ist dabei nicht garantiert, ihre Genauigkeit hängt davon ab, mit welcher
						Methode Ihr Endgerät und der von Ihnen verwendete Browser die Position bestimmen. Smartphones
						und Tablet-PC's sind i. d. R. mit einer GPS-Antenne ausgestattet, so dass Sie bei diesen Geräten
						eine Positionsgenauigkeit in der Größenordnung von 10 Metern erwarten können. Die Markierung
						Ihrer Position wird laufend automatisch aktualisiert. Ein weiterer Klick auf "Mein Standort"
						schaltet die Anzeige Ihrer Position wieder ab.
					</p>

					<div name="Einstellungen">
						<br />
					</div>
					<h4>
						Einstellungen{' '}
						<Link to="help" containerId="myMenu" style={{ color: '#00000044' }}>
							<Icon name="arrow-circle-up" />
						</Link>
					</h4>
					<p>
						Unter "<strong>Einstellungen</strong>" können Sie im Anwendungsmenü <Icon name="bars" />{' '}
						festlegen, wie die Kitas und die Hintergrundkarte und die Schwimmbäder angezeigt werden sollen.
					</p>
					<p>
						Unter "
						<em>
							<strong>Kartendarstellung</strong>
						</em>
						" können Sie auswählen, ob Sie die standardmäßig aktivierte farbige Hintergrundkarte verwenden
						möchten ("
						<em>Tag</em>
						") oder lieber eine farblich zurückgenommene Karte in Blautönen ("blau"), auf der sich die
						Schwimmbad-Symbole noch besser abheben. Die unterschiedlichen Flächennutzungen lassen sich
						dagegen in der Blauton-Karte nicht mehr so gut unterscheiden wie in der mehrfarbigen. Hinweis:
						Diese Auswahl wird Ihnen nur angeboten, wenn Ihr Browser CSS3-Filtereffekte unterstützt, also z.
						B. nicht beim Microsoft Internet Explorer.
					</p>
					<p>
						Unter "
						<em>
							<strong>Symbolgröße</strong>
						</em>
						" können Sie in Abhängigkeit von Ihrer Bildschirmauflösung und Ihrem Sehvermögen auswählen, ob die
						Schwimmbäder mit kleinen (25 Pixel), mittleren (35 Pixel) oder großen (45 Pixel) Symbolen
						angezeigt werden.
					</p>

					<p>Im Vorschaubild sehen Sie direkt die prinzipielle Wirkung ihrer Einstellungen.</p>

					<div name="Personalisierung">
						<br />
					</div>
					<h4>
						Personalisierung{' '}
						<Link to="help" containerId="myMenu" style={{ color: '#00000044' }}>
							<Icon name="arrow-circle-up" />
						</Link>
					</h4>
					<p>
						Ihre Einstellungen bleiben auch nach einem Neustart der Anwendung erhalten. (Es sei denn, Sie
						löschen den Browser-Verlauf einschließlich der gehosteten App-Daten.)
					</p>
				</div>
			}
		/>
	);
};
export default BaederModalMenuHelpSection;
