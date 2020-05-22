import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Icon from 'components/commons/Icon';
import React from 'react';
import { Label } from 'react-bootstrap';
import { Link } from 'react-scroll';
import { getSymbolSVG, ladestationSVG, verleihstationSVG } from '../../utils/ebikesHelper';
import MeinStandortHelpText from 'components/commons/GenericHelpTextForMyLocation';
import GenericModalMenuSection from 'components/commons/GenericModalMenuSection';
/* eslint-disable jsx-a11y/anchor-is-valid */

const chargingOnlineSVG = getSymbolSVG(30, '#1EA342', 'pr', 'onlineSVGinHELP', ladestationSVG);
const chargingOfflineSVG = getSymbolSVG(30, '#999999', 'pr', 'offlineSVGinHELP', ladestationSVG);
const rentingSVG = getSymbolSVG(30, '#EC7529', 'pr', 'verleihSVGinHELP', verleihstationSVG);

const HelpSection = ({ uiState, uiStateActions }) => {
	return (
		<GenericModalMenuSection
			uiState={uiState}
			uiStateActions={uiStateActions}
			sectionKey='help'
			sectionTitle='Kompaktanleitung'
			sectionBsStyle='success'
			sectionContent={
				<div>
					<div>
						<Link
							id='lnkHelpHeader_datengrundlage'
							to='Datengrundlage'
							containerId='myMenu'
							style={{ textDecoration: 'none' }}
						>
							{' '}
							<Label bsStyle='default'>Datengrundlage</Label>{' '}
						</Link>
						<Link
							id='lnkHelpHeader_styling'
							to='kartendarstellung'
							containerId='myMenu'
							style={{ textDecoration: 'none' }}
						>
							{' '}
							<Label bsStyle='success'>Kartendarstellung</Label>{' '}
						</Link>

						<Link
							id='lnkHelpHeader_auswahl'
							to='POIauswahluabfragen'
							containerId='myMenu'
							style={{ textDecoration: 'none' }}
						>
							{' '}
							<Label bsStyle='success'>Ladestationen abfragen</Label>{' '}
						</Link>

						<Link
							id='lnkHelpHeader_positionieren'
							to='InKartePositionieren'
							containerId='myMenu'
							style={{ textDecoration: 'none' }}
						>
							{' '}
							<Label bsStyle='warning'>In Karte positionieren</Label>{' '}
						</Link>

						<Link
							id='lnkHelpHeader_standort'
							to='MeinStandort'
							containerId='myMenu'
							style={{ textDecoration: 'none' }}
						>
							{' '}
							<Label bsStyle='warning'>Mein Standort</Label>{' '}
						</Link>

						<Link
							to='MeinThemenstadtplan'
							containerId='myMenu'
							style={{ textDecoration: 'none' }}
						>
							{' '}
							<Label bsStyle='info'>Filtern</Label>{' '}
						</Link>

						<Link
							id='lnkHelpHeader_settings'
							to='Einstellungen'
							containerId='myMenu'
							style={{ textDecoration: 'none' }}
						>
							{' '}
							<Label bsStyle='info'>Einstellungen</Label>{' '}
						</Link>
						<Link
							id='lnkHelpHeader_personalisierung'
							to='Personalisierung'
							containerId='myMenu'
							style={{ textDecoration: 'none' }}
						>
							{' '}
							<Label bsStyle='info'>Personalisierung</Label>{' '}
						</Link>
					</div>

					<div id='anchorDivInHelp_datengrundlage' name='Datengrundlage'>
						<br />
					</div>
					<h4>
						Datengrundlage{' '}
						<Link
							id='lnkUpInHelp_datengrundlage'
							to='help'
							containerId='myMenu'
							style={{ color: '#00000044' }}
						>
							<Icon name='arrow-circle-up' />
						</Link>
					</h4>
					<p>
						Die <strong>E-Fahrrad-Karte Wuppertal</strong> bietet ihnen die folgenden
						Hintergrundkarten an, die auf verschiedenen Geodatendiensten und Geodaten
						basieren:
					</p>

					<ul>
						<li>
							<strong>Stadtplan (Tag | Nacht)</strong>: Kartendienst (WMS) des
							Regionalverbandes Ruhr (RVR). Datengrundlage:{' '}
							<strong>Stadtplanwerk 2.0 Beta</strong>. (Wöchentlich in einem
							automatischen Prozess aktualisierte Zusammenführung des Straßennetzes
							der OpenStreetMap mit Gebäuden und Flächennutzungen aus dem
							Fachverfahren ALKIS des Liegenschaftskatasters.) © RVR und
							Kooperationspartner (<a
								target='_legal'
								href='https://creativecommons.org/licenses/by/4.0/legalcode.de'
							>
								CC BY 4.0
							</a>). Lizenzen der Ausgangsprodukte: Land NRW (2018){' '}
							<a target='_legal' href='http://www.govdata.de/dl-de/by-2-0'>
								Datenlizenz Deutschland - Namensnennung - Version 2.0
							</a>{' '}
							und OpenStreetMap contributors (<a
								target='_legal'
								href='https://www.opendatacommons.org/licenses/odbl/1.0/'
							>
								ODbL
							</a>).
						</li>

						<li>
							<strong>Luftbildkarte</strong>: (1) Kartendienst (WMS) der Stadt
							Wuppertal. Datengrundlage:{' '}
							<strong>True Orthophoto aus Bildflug vom 19.04.2018</strong>,
							hergestellt durch Aerowest GmbH/Dortmund, Bodenauflösung 10 cm. (True
							Orthophoto: Aus Luftbildern mit hoher Längs- und Querüberdeckung in
							einem automatisierten Bildverarbeitungsprozess berechnetes Bild in
							Parallelprojektion, also ohne Gebäudeverkippung und sichttote Bereiche.)
							© Stadt Wuppertal (<a
								target='_legal'
								href='https://www.wuppertal.de/geoportal/Nutzungsbedingungen/NB-GDIKOM-C_Geodaten.pdf'
							>
								NB-GDIKOM C
							</a>). (2) Kartendienste (WMS) des Regionalverbandes Ruhr (RVR).
							Datengrundlagen: <strong>Stadtplanwerk 2.0 Beta</strong> und{' '}
							<strong>Kartenschrift aus dem Stadtplanwerk 2.0 Beta</strong>. (Details
							s. Hintergrundkarte Stadtplan).
						</li>
					</ul>

					<p>
						Zusätzlich nutzt die E-Fahrrad-Karte die Datensätze{' '}
						<a
							target='_legal'
							href='https://offenedaten-wuppertal.de/dataset/verleih-e-fahrr%C3%A4der-wuppertal'
						>
							Verleih E-Fahrräder Wuppertal
						</a>{' '}
						und{' '}
						<a
							target='_legal'
							href='https://offenedaten-wuppertal.de/dataset/ladestationen-e-fahrr%C3%A4der-wuppertal'
						>
							Ladestationen E-Fahrräder Wuppertal
						</a>{' '}
						aus dem Open-Data-Angebot der Stadt Wuppertal.
					</p>

					<div id='anchorDivInHelp_styling' name='kartendarstellung'>
						<br />
					</div>
					<h4>
						Kartendarstellung der Stationen{' '}
						<Link
							id='lnkUpInHelp_styling'
							to='help'
							containerId='myMenu'
							style={{ color: '#00000044' }}
						>
							<Icon name='arrow-circle-up' />
						</Link>
					</h4>
					<p>
						Zur Darstellung der Ladestationen in der Karte verwenden wir zwei
						unterschiedliche Symbole für die Ladestationen, die derzeit in Betrieb
						("online") {chargingOnlineSVG} sind, und diejenigen, die wegen länger
						dauernder Maßnahmen nicht in Betrieb ("offline") {chargingOfflineSVG} sind.
						Zur Darstellung der Verleihstationen verwenden wir das Symbol {rentingSVG}.
						Die Farben der Symbole werden in der Titelzeile der Info-Box unten rechts
						aufgegriffen. Zusätzlich wird dort der der Typ und der Betriebszustand der
						Ladestation - Ladestation für E-Fahrräder (online) bzw. Ladestation für
						E-Fahrräder (offline) bzw. Verleihstationen von E-Fahrrädern - wiederholt.
						Räumlich nah beieinander liegende Anlagen werden standardmäßig
						maßstabsabhängig zu größeren Kreis-Symbolen zusammengefasst, jeweils mit der
						Anzahl der repräsentierten Anlagen im Zentrum{' '}
						<img alt='Cluster' width='32' src='images/ebikes_cluster.png' />. Vergrößern
						Sie ein paar Mal durch direktes Anklicken eines solchen Punktes oder mit{' '}
						<FontAwesomeIcon icon={faPlus} /> die Darstellung, so werden die
						zusammengefassten Stationen Schritt für Schritt in die kleineren Symbole für
						die Einzel-Stationen zerlegt.
					</p>

					<div id='anchorDivInHelp_auswahl' name='POIauswahluabfragen'>
						<br />
					</div>
					<h4>
						Ladestationen / Verleihstationen abfragen{' '}
						<Link
							id='lnkUpInHelp_auswahl'
							to='help'
							containerId='myMenu'
							style={{ color: '#00000044' }}
						>
							<Icon name='arrow-circle-up' />
						</Link>
					</h4>
					<p>
						Bewegen Sie den Mauszeiger im Kartenfenster auf eines der Symbole für die
						Stationen, um sich den Namen der Station anzeigen zu lassen. Ein Klick auf
						das Symbol setzt den Fokus auf diese Ladestation. Sie wird dann blau
						hinterlegt und die zugehörigen Informationen (Name, ggf. Lagebeschreibung,
						Adresse) werden in der Info-Box angezeigt. (Auf einem Tablet-PC wird der
						Fokus durch das erste Antippen des Symbols gesetzt, das zweite Antippen
						blendet den Namen ein.) Durch Anklicken des Symbols <Icon name='info' />{' '}
						rechts neben dem Namen der Ladestation öffnen Sie das Datenblatt mit den
						vollständigen Informationen zu dieser Station einschließlich einer
						Verknüpfung zu eventuellen weiteren Informationen des Betreibers oder
						Eigentümers. Mit dem Lupensymbol <Icon name='search' /> links daneben wird
						die Karte auf die Station, die gerade den Fokus hat, zentriert und
						gleichzeitig ein großer Betrachtungsmaßstab (Zoomstufe 14) eingestellt. Mit
						den Symbolen <Icon name='phone' /> und <Icon name='external-link-square' />{' '}
						rechts daneben können Sie den Betreiber oder Inhaber via Smartphone direkt
						anrufen oder zu seiner Website wechseln.
					</p>
					<p>
						Wenn Sie noch keine Station im aktuellen Kartenausschnitt selektiert haben,
						wird der Fokus automatisch auf die nördlichste Station gesetzt. Mit den
						Funktionen <a>&lt;&lt;</a> vorheriger Treffer und <a>&gt;&gt;</a> nächster
						Treffer können Sie ausgehend von der Station, auf der gerade der Fokus
						liegt, in nördlicher bzw. südlicher Richtung alle aktuell im Kartenfenster
						angezeigten Stationen durchmustern.
					</p>
					<p>
						Mit der Schaltfläche <Icon name='chevron-circle-down' /> im dunkelgrau
						abgesetzten rechten Rand der Info-Box lässt sich diese so verkleinern, dass
						nur noch der Betriebszustand und die Art der Station (Verleihstation oder
						Ladestation online / offline), ihr Name und die Symbole{' '}
						<Icon name='search-location' />, <Icon name='info' />, <Icon name='phone' />{' '}
						und <Icon name='external-link-square' /> angezeigt werden - nützlich für
						Endgeräte mit kleinem Display. Mit der Schaltfläche{' '}
						<Icon name='chevron-circle-up' /> an derselben Stelle können Sie die
						Info-Box wieder vollständig einblenden.
					</p>
					<p>
						Ein kleines Foto über der Info-Box vermittelt Ihnen bei den meisten
						Stationen einen Eindruck vom Aussehen der Station vor Ort. Klicken Sie auf
						dieses Vorschaubild, um einen Bildbetrachter ("Leuchtkasten") mit dem Foto
						zu öffnen.
					</p>

					<div id='anchorDivInHelp_positionieren' name='InKartePositionieren'>
						<br />
					</div>
					<h4>
						In Karte positionieren{' '}
						<Link
							id='lnkUpInHelp_positionieren'
							to='help'
							containerId='myMenu'
							style={{ color: '#00000044' }}
						>
							<Icon name='arrow-circle-up' />
						</Link>
					</h4>

					<p>
						Um direkt zu einer Lade- oder Verleihstation zu gelangen, geben Sie den
						Anfang des Namens dieser Station im Eingabefeld links unten ein (mindestens
						2 Zeichen). In der inkrementellen Auswahlliste werden Ihnen passende Treffer
						angeboten. (Wenn Sie weitere Zeichen eingeben, wird der Inhalt der
						Auswahlliste angepasst.) Sie können auch andere Suchbegriffe eingeben,
						nämlich Stadtteil (Stadtbezirk oder Quartier), Adresse, Straßenname oder
						POI. Durch das in der Auswahlliste vorangestellte Symbol erkennen Sie, ob es
						sich bei einem Treffer um eine <Icon name='charging-station' /> Ladestation,
						eine <Icon name='bicycle' /> Verleihstation, einen <Icon name='circle' />{' '}
						Stadtbezirk, ein <Icon name='pie-chart' /> Quartier, eine{' '}
						<Icon name='home' /> Adresse, eine <Icon name='road' /> Straße ohne
						zugeordnete Hausnummern, einen <Icon name='tag' /> POI, die{' '}
						<Icon name='tags' /> alternative Bezeichnung eines POI oder eine{' '}
						<Icon name='child' /> Kindertageseinrichtung handelt.
					</p>
					<p>
						Nach der Auswahl eines Treffers aus der Liste wird die Karte auf die
						zugehörige Position zentriert. Bei Suchbegriffen mit Punktgeometrie
						(Ladestation, Verleihstationen, Adresse, Straße, POI) wird außerdem ein
						großer Maßstab (Zoomstufe 14) eingestellt und ein Marker{' '}
						<Icon name='map-marker' /> auf der Zielposition platziert. Bei Suchbegriffen
						mit Flächengeometrie (Stadtbezirk, Quartier) wird der Maßstab so
						eingestellt, dass die Fläche vollständig dargestellt werden kann. Zusätzlich
						wird der Bereich außerhalb dieser Fläche abgedunkelt (Spotlight-Effekt).
					</p>
					<p>
						Durch Anklicken des Werkzeugs <Icon name='times' /> links neben dem
						Eingabefeld können Sie die Suche zurücksetzen (Entfernung von Marker bzw.
						Abdunklung, Löschen des Textes im Eingabefeld).
					</p>
					<p>
						Wenn Sie die Karte wie oben beschrieben auf eine Station positionieren,
						erhält diese sofort den Fokus, sodass die zugehörigen Informationen direkt
						in der Info-Box angezeigt werden. Voraussetzung dafür ist, dass die
						aktuellen{' '}
						<Link to='MeinThemenstadtplan' containerId='myMenu'>
							Filtereinstellungen
						</Link>{' '}
						die Darstellung der Ladestation in der Karte erlauben.
					</p>

					<div id='anchorDivInHelp_standort' name='MeinStandort'>
						<br />
					</div>
					<h4>
						Mein Standort{' '}
						<Link to='help' containerId='myMenu' style={{ color: '#00000044' }}>
							<Icon id='lnkUpInHelp_standort' name='arrow-circle-up' />
						</Link>
					</h4>
					<MeinStandortHelpText />

					<div name='MeinThemenstadtplan'>
						<br />
					</div>
					<h4>
						Filtern{' '}
						<Link to='help' containerId='myMenu' style={{ color: '#00000044' }}>
							<Icon name='arrow-circle-up' />
						</Link>
					</h4>

					<p>
						Im Bereich "<b>Filter</b>" können Sie im Anwendungsmenü <Icon name='bars' />{' '}
						die in der Karte angezeigten Lade- oder Verleihstationen so ausdünnen, dass
						nur die für Sie interessanten Stationen übrig bleiben. Standardmäßig sind
						die Einstellungen hier so gesetzt, dass alle Stationen angezeigt werden.
					</p>

					<p>
						Mit der Optionsgruppe "<b>
							<i>Typ</i>
						</b>" können Sie die Kartenanzeige auf Ladestationen oder Verleihstationen
						beschränken. Mit den Optionsgruppen "<b>
							<i>Verfügbarkeit</i>
						</b>", "<b>
							<i>Öffnungszeiten</i>
						</b>", "<b>
							<i>Ökostrom</i>
						</b>" und "<b>
							<i>Ladebox vorhanden</i>
						</b>" können Sie die Kartenanzeige auf Ladestationen beschränken (diese
						Optionsgruppen sind nur Verfügbar, wenn überhaupt Ladestationen in der Karte
						dargestellt werden), die aktuell verfügbar (online) sind, die durchgehend
						(jeweils 24 Stunden an 7 Tagen die Woche) benutzbar sind, die ökologisch
						erzeugten Strom bereitstellen oder bei denen eine abschließbare Ladebox
						vorhanden ist. Mit der in jeder dieser Gruppen verfügbaren Option "alle
						Ladestationen" wird das jeweilige Filterkriterium nicht ausgewertet. Alle
						Filterkriterien werden mit einem logischen "und" kombiniert: Wenn Sie z. B.
						unter "<b>
							<i>Öffnungszeiten</i>
						</b>" den Wert "24/7" wählen und unter "<b>
							<i>Ökostrom</i>
						</b>" den Wert "nur Ökostrom-Ladestationen", werden alle Stationen
						angezeigt, die durchgehend erreichbar sind <b>und</b> ökologisch erzeugten
						Strom bereitstellen.
					</p>
					<p>
						Ihre Einstellungen werden direkt in der blauen Titelzeile des Bereichs "<b>Filter</b>"
						und in dem Donut-Diagramm, das Sie rechts neben oder unter den
						Filteroptionen finden, ausgewertet. Die Titelzeile zeigt die Gesamtanzahl
						der Stationen, die den von Ihnen gesetzten Filterbedingungen entsprechen.
						Das Donut-Diagramm zeigt zusätzlich die Verteilung auf die drei Kategorien
						Verleihstationen, verfügbare Ladestationen (online) und nicht verfügbare
						Ladestationen (offline). Bewegen Sie dazu den Mauszeiger auf eines der
						farbigen Segmente des Diagramms.
					</p>

					<div id='anchorDivInHelp_settings' name='Einstellungen'>
						<br />
					</div>
					<h4>
						Einstellungen{' '}
						<Link to='help' containerId='myMenu' style={{ color: '#00000044' }}>
							<Icon id='lnkUpInHelp_settings' name='arrow-circle-up' />
						</Link>
					</h4>
					<p>
						Unter "<strong>Einstellungen</strong>" können Sie im Anwendungsmenü{' '}
						<Icon name='bars' /> festlegen, wie die Stationen und die Hintergrundkarte
						angezeigt werden sollen.
					</p>
					<p>
						Zu den Stationen können Sie unter "<b>
							<i>Einstellungen Lade- und Verleihstationen</i>
						</b>" auswählen, ob Ihre unter "<b>Filter</b>" festgelegten
						Filterbedingungen in einer Titelzeile ausgeprägt werden oder nicht. Weiter
						können Sie dort festlegen, ob räumlich nah beieinander liegende Stationen
						maßstabsabhängig zu einem Punktsymbol zusammengefasst werden oder nicht.
						Unter "<b>
							<i>Symbolgröße</i>
						</b>" können Sie in Abhängigkeit von Ihrer Bildschirmauflösung und Ihrem
						Sehvermögen auswählen, ob die Ladestationen mit kleinen (35 Pixel),
						mittleren (45 Pixel) oder großen (55 Pixel) Symbolen angezeigt werden.
					</p>

					<p>
						Unter "<strong>
							<em>Hintergrundkarte</em>
						</strong>" können Sie auswählen, ob Sie die standardmäßig aktivierte farbige
						Hintergrundkarte verwenden möchten ("<em>Stadtplan (Tag)</em>") oder lieber
						eine invertierte Graustufenkarte ("<em>Stadtplan (Nacht)</em>"), zu der uns
						die von vielen PKW-Navis bei Dunkelheit eingesetzte Darstellungsweise
						inspiriert hat. <strong>Hinweis</strong>: Der Stadtplan (Nacht) wird Ihnen
						nur angeboten, wenn Ihr Browser CSS3-Filtereffekte unterstützt, also z. B.
						nicht beim Microsoft Internet Explorer. Die Nacht-Karte erzeugt einen
						deutlicheren Kontrast mit den farbigen Symbolen der Lade- und
						Verleihstationen, die unterschiedlichen Flächennutzungen in der
						Hintergrundkarte lassen sich aber nicht mehr so gut unterscheiden wie in der
						Tag-Karte. Als dritte Möglichkeit steht eine <i>Luftbildkarte</i> zur
						Verfügung, die die Anschaulichkeit des Luftbildes mit der Eindeutigkeit des
						Stadtplans (Kartenschrift, durchscheinende Linien) verbindet.
					</p>

					<p>
						In der{' '}
						<b>
							<i>Vorschau</i>
						</b>{' '}
						sehen Sie direkt die Wirkung ihrer Einstellungen in einem fest eingestellten
						Kartenausschnitt.
					</p>

					<div id='anchorDivInHelp_personalisierung' name='Personalisierung'>
						<br />
					</div>
					<h4>
						Personalisierung{' '}
						<Link to='help' containerId='myMenu' style={{ color: '#00000044' }}>
							<Icon id='lnkUpInHelp_personalisierung' name='arrow-circle-up' />
						</Link>
					</h4>
					<p>
						Ihre Einstellungen bleiben auch nach einem Neustart der Anwendung erhalten.
						(Es sei denn, Sie löschen den Browser-Verlauf einschließlich der gehosteten
						App-Daten.)
					</p>
				</div>
			}
		/>
	);
};
export default HelpSection;
