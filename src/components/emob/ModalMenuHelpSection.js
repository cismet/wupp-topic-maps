import React from 'react';
import { Link } from 'react-scroll';
import Icon from 'components/commons/Icon';
import { Label } from 'react-bootstrap';
import GenericModalMenuSection from '../commons/GenericModalMenuSection';
import MeinStandortHelpText from '../commons/GenericHelpTextForMyLocation';
import { getPRSVG } from '../../utils/prbrHelper';
import { getSymbolSVG } from '../../utils/emobHelper';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faSearchLocation, faPlus } from '@fortawesome/free-solid-svg-icons';

const helpSVGSize = 18;

const onlineSVG = getSymbolSVG(24, '#003B80', 'pr', 'onlineSVGinHELP');
const offlineSVG = getSymbolSVG(24, '#888A87', 'pr', 'offlineSVGinHELP');

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
							<Label bsStyle='success'>
								Ladestationen auswählen und abfragen
							</Label>{' '}
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
						Die <strong>E-Auto-Ladestationskarte Wuppertal</strong> bietet ihnen die
						folgenden Hintergrundkarten an, die auf verschiedenen Geodatendiensten und
						Geodaten basieren:
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
						Zusätzlich nutzt die E-Auto-Ladestationskarte den Datensatz{' '}
						<a
							target='_legal'
							href='https://offenedaten-wuppertal.de/dataset/ladestationen-e-autos-wuppertal'
						>
							Ladestationen E-Autos Wuppertal
						</a>{' '}
						aus dem Open-Data-Angebot der Stadt Wuppertal.
					</p>

					<div id='anchorDivInHelp_styling' name='kartendarstellung'>
						<br />
					</div>
					<h4>
						Kartendarstellung der Ladestationen{' '}
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
						("online") {onlineSVG} sind, und diejenigen, die wegen länger dauernder
						Maßnahmen nicht in Betrieb ("offline") {offlineSVG} sind. Die Farben der
						Symbole werden in der Titelzeile der Info-Box unten rechts aufgegriffen.
						Zusätzlich wird dort der der Betriebszustand der Ladestation - Ladestation
						für E-Autos (online) bzw. Ladestation für E-Autos (offline) - wiederholt.
						Räumlich nah beieinander liegende Anlagen werden standardmäßig
						maßstabsabhängig zu größeren Kreis-Symbolen zusammengefasst, jeweils mit der
						Anzahl der repräsentierten Anlagen im Zentrum{' '}
						<img alt='Cluster' width='32' src='images/emob_cluster.png' />. Vergrößern
						Sie ein paar Mal durch direktes Anklicken eines solchen Punktes oder mit{' '}
						<FontAwesomeIcon icon={faPlus} /> die Darstellung, so werden die
						zusammengefassten Anlagen Schritt für Schritt in die kleineren Symbole für
						die Einzel-Anlagen zerlegt.
					</p>

					<div id='anchorDivInHelp_auswahl' name='POIauswahluabfragen'>
						<br />
					</div>
					<h4>
						Ladestationen auswählen und abfragen{' '}
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
						Ladestationen (online oder offline), um sich den Namen der Station anzeigen
						zu lassen. Ein Klick auf das Symbol setzt den Fokus auf diese Ladestation.
						Sie wird dann blau hinterlegt und die zugehörigen Informationen (Name, ggf.
						Lagebeschreibung, Adresse) werden in der Info-Box angezeigt. (Auf einem
						Tablet-PC wird der Fokus durch das erste Antippen des Symbols gesetzt, das
						zweite Antippen blendet den Namen ein.) Durch Anklicken des Symbols{' '}
						<Icon name='info' /> rechts neben dem Namen der Ladestation öffnen Sie das
						Datenblatt mit den vollständigen Informationen zu dieser Station
						einschließlich einer Verknüpfung zur Ladekosten-Information des Betreibers.
						Mit den Symbolen <Icon name='phone' /> und{' '}
						<Icon name='external-link-square' /> rechts daneben können Sie den Betreiber
						via Smartphone direkt anrufen oder zu seiner Website wechseln.
					</p>
					<p>
						Wenn Sie noch keine Ladestation im aktuellen Kartenausschnitt selektiert
						haben, wird der Fokus automatisch auf die nördlichste Station gesetzt. Mit
						den Funktionen <img alt='Cluster' src='images/vorher_treffer.png' />{' '}
						vorheriger Treffer und{' '}
						<img alt='Cluster' src='images/nachher_treffer.png' /> nächster Treffer
						können Sie ausgehend von der Ladestation, auf der gerade der Fokus liegt, in
						nördlicher bzw. südlicher Richtung alle aktuell im Kartenfenster angezeigten
						Stationen durchmustern.
					</p>
					<p>
						Mit der Schaltfläche <Icon name='chevron-circle-down' /> im dunkelgrau
						abgesetzten rechten Rand der Info-Box lässt sich diese so verkleinern, dass
						nur noch der Betriebszustand der Ladestation (Ladestation online oder
						offline), ihr Name und die Symbole <Icon name='info' />,{' '}
						<Icon name='phone' /> und <Icon name='external-link-square' /> angezeigt
						werden - nützlich für Endgeräte mit kleinem Display. Mit der Schaltfläche{' '}
						<Icon name='chevron-circle-up' /> an derselben Stelle können Sie die
						Info-Box wieder vollständig einblenden.
					</p>
					<p>
						Ein kleines Foto über der Info-Box vermittelt Ihnen bei den meisten
						Ladestationen einen Eindruck vom Aussehen der Station vor Ort. Klicken Sie
						auf dieses Vorschaubild, um einen Bildbetrachter ("Leuchtkasten") mit dem
						Foto zu öffnen.
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
						Um direkt zu einer P+R- oder B+R-Anlage zu gelangen, geben Sie den Anfang
						des Namens der Anlage im Eingabefeld links unten ein (mindestens 2 Zeichen).
						In der inkrementellen Auswahlliste werden Ihnen passende Treffer angeboten.
						(Wenn Sie weitere Zeichen eingeben, wird der Inhalt der Auswahlliste
						angepasst.) Sie können auch andere Suchbegriffe eingeben, nämlich Stadtteil
						(Stadtbezirk oder Quartier), Adresse, Straßenname oder POI. Durch das in der
						Auswahlliste vorangestellte Symbol erkennen Sie, ob es sich bei einem
						Treffer um eine <Icon name='car' /> P+R-Anlage, eine <Icon name='bicycle' />{' '}
						B+R-Anlage, einen <Icon name='circle' /> Stadtbezirk, ein{' '}
						<Icon name='pie-chart' /> Quartier, eine <Icon name='home' /> Adresse, eine{' '}
						<Icon name='road' />
						Straße ohne zugeordnete Hausnummern, einen <Icon name='tag' /> POI, die{' '}
						<Icon name='tags' /> alternative Bezeichnung eines POI oder eine{' '}
						<Icon name='child' /> Kindertageseinrichtung handelt. Tipp: Durch Eingabe
						von "P+" oder "B+" erzeugen Sie eine vollständige Auswahlliste aller P+R-
						bzw. B+R-Anlagen.
					</p>
					<p>
						Nach der Auswahl eines Treffers aus der Liste wird die Karte auf die
						zugehörige Position zentriert. Bei Suchbegriffen mit Punktgeometrie (P+R-
						oder B+R-Anlage, Adresse, Straße, POI) wird außerdem ein großer Maßstab
						(Zoomstufe 14) eingestellt und ein Marker <Icon name='map-marker' /> auf der
						Zielposition platziert. Bei Suchbegriffen mit Flächengeometrie (Stadtbezirk,
						Quartier) wird der Maßstab so eingestellt, dass die Fläche vollständig
						dargestellt werden kann. Zusätzlich wird der Bereich außerhalb dieser Fläche
						abgedunkelt (Spotlight-Effekt).
					</p>
					<p>
						Durch Anklicken des Werkzeugs <Icon name='times' /> links neben dem
						Eingabefeld können Sie die Suche zurücksetzen (Entfernung von Marker bzw.
						Abdunklung, Löschen des Textes im Eingabefeld).
					</p>
					<p>
						Wenn Sie die Karte wie oben beschrieben auf eine P+R- bzw. B+R-Anlage
						positionieren, erhält diese sofort den Fokus, sodass die zugehörigen
						Informationen direkt in der Info-Box angezeigt werden. Voraussetzung dafür
						ist, dass die aktuellen{' '}
						<Link to='MeinThemenstadtplan' containerId='myMenu'>
							Filtereinstellungen
						</Link>{' '}
						die Darstellung der Anlage in der Karte erlauben.
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
						die in der Karte angezeigten P+R- und B+R-Anlagen so ausdünnen, dass nur die
						für Sie interessanten Anlagen übrig bleiben. Standardmäßig sind die
						Einstellungen hier so gesetzt, dass alle Anlagen angezeigt werden.
					</p>
					<p>
						Mit den Optionen unter "<b>
							<i>Umweltzonen</i>
						</b>" können Sie die Kartenanzeige auf Anlagen innerhalb oder außerhalb der
						beiden Wuppertaler Umweltzonen beschränken. Unter "<b>
							<i>Art der Anlage</i>
						</b>" können Sie die Anzeige auf P+R- oder B+R-Anlagen eingrenzen.
					</p>
					<p>
						Ihre Einstellungen werden direkt in der blauen Titelzeile des Bereichs "<b>Filter</b>"
						und in dem Donut-Diagramm, das Sie rechts neben oder unter den
						Filteroptionen finden, ausgewertet. Die Titelzeile zeigt die Gesamtanzahl
						der P+R- und B+R-Anlagen, die den von Ihnen gesetzten Filterbedingungen
						entsprechen. Das Donut-Diagramm zeigt zusätzlich die Verteilung auf die
						beiden Kategorien Park + Ride bzw. Bike + Ride. Bewegen Sie dazu den
						Mauszeiger auf eines der farbigen Segmente des Diagramms.
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
						<Icon name='bars' /> festlegen, wie die P+R- und B+R-Anlagen und die
						Hintergrundkarte angezeigt werden sollen.
					</p>
					<p>
						Zu den Anlagen können Sie unter "<b>
							<i>P+R / B+R Einstellungen</i>
						</b>" auswählen, ob Ihre unter "<b>Filter</b>" festgelegten
						Filterbedingungen in einer Titelzeile ausgeprägt werden oder nicht. Weiter
						können Sie dort festlegen, ob räumlich nah beieinander liegende Anlagen
						maßstabsabhängig zu einem Punktsymbol zusammengefasst werden oder nicht.
						Unter "<b>
							<i>Symbolgröße</i>
						</b>" können Sie in Abhängigkeit von Ihrer Bildschirmauflösung und Ihrem
						Sehvermögen auswählen, ob die P+R- und B+R-Anlagen mit kleinen (35 Pixel),
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
						deutlicheren Kontrast mit den farbigen Symbolen der P+R- bzw. B+R-Anlagen,
						die unterschiedlichen Flächennutzungen in der Hintergrundkarte lassen sich
						aber nicht mehr so gut unterscheiden wie in der Tag-Karte. Als dritte
						Möglichkeit steht eine Luftbildkarte zur Verfügung, die die Anschaulichkeit
						des Luftbildes mit der Eindeutigkeit des Stadtplans (Kartenschrift,
						durchscheinende Linien) verbindet. Zusätzlich können Sie mit dem
						Kontrollkästchen "<em>Umweltzonen</em>" steuern, ob die Umweltzonen
						dargestellt werden oder nicht. Die Umweltzonen lassen sich mit allen drei
						Hintergrundkarten kombinieren. Ihre Darstellung in der Karte ist vor allem
						dann sinnvoll, wenn Sie die{' '}
						<Link to='MeinThemenstadtplan' containerId='myMenu'>
							Filteroption
						</Link>{' '}
						"<em>innerhalb/außerhalb Umweltzone</em>" verwenden.
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
