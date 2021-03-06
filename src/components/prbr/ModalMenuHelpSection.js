import { faInfoCircle, faPlus, faSearchLocation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Icon from 'components/commons/Icon';
import React from 'react';
import { Label } from 'react-bootstrap';
import { Link } from 'react-scroll';
import { getPRSVG } from '../../utils/prbrHelper';
import MeinStandortHelpText from 'components/commons/GenericHelpTextForMyLocation';
import GenericModalMenuSection from 'components/commons/GenericModalMenuSection';
import LicenseStadtplanTagNacht from 'components/commons/LicenseStadtplanTagNacht';
import LicenseLuftbildkarte from 'components/commons/LicenseLuftbildkarte';
/* eslint-disable jsx-a11y/anchor-is-valid */

const prSVG = getPRSVG(24, '#FFFFFF', 'pr');
const brSVG = getPRSVG(24, '#FFFFFF', 'br');

const BaederModalMenuHelpSection = ({ uiState, uiStateActions }) => {
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
							<Label bsStyle='success'>Anlagen auswählen und abfragen</Label>{' '}
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
						Die <strong> Park+Ride-Karte Wuppertal</strong> bietet ihnen die folgenden
						Hintergrundkarten an, die auf verschiedenen Geodatendiensten und Geodaten
						basieren:
					</p>

					<ul>
						<LicenseStadtplanTagNacht />
						<LicenseLuftbildkarte />
					</ul>

					<p>
						Zusätzlich nutzt die P+R-Karte die Datensätze{' '}
						<a
							target='_legal'
							href='https://offenedaten-wuppertal.de/dataset/park-and-ride-anlagen-wuppertal'
						>
							Park and Ride Anlagen Wuppertal
						</a>,{' '}
						<a
							target='_legal'
							href='https://offenedaten-wuppertal.de/dataset/bike-and-ride-anlagen-wuppertal'
						>
							Bike and Ride Anlagen Wuppertal
						</a>{' '}
						und{' '}
						<a
							target='_legal'
							href='https://offenedaten-wuppertal.de/dataset/umweltzonen-wuppertal'
						>
							Umweltzonen Wuppertal
						</a>{' '}
						aus dem Open-Data-Angebot der Stadt Wuppertal.
					</p>

					<div id='anchorDivInHelp_styling' name='kartendarstellung'>
						<br />
					</div>
					<h4>
						Kartendarstellung der Anlagen{' '}
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
						Zur Darstellung der Anlagen in der Karte verwenden wir zwei unterschiedliche
						Symbole für die P+R- {prSVG} und die B+R-Anlagen {brSVG}. Die Farben der
						Symbole werden in der Titelzeile der Info-Box unten rechts aufgegriffen.
						Zusätzlich wird dort der Typ der Anlage (Park + Ride bzw. Bike + Ride)
						wiederholt. Räumlich nah beieinander liegende Anlagen werden standardmäßig
						maßstabsabhängig zu größeren Kreis-Symbolen zusammengefasst, jeweils mit der
						Anzahl der repräsentierten Anlagen im Zentrum{' '}
						<img alt='Cluster' width='32' src='images/prbr_cluster.png' />. Vergrößern
						Sie ein paar Mal durch direktes Anklicken eines solchen Punktes oder mit{' '}
						<FontAwesomeIcon icon={faPlus} /> die Darstellung, so werden die
						zusammengefassten Anlagen Schritt für Schritt in die kleineren Symbole für
						die Einzel-Anlagen zerlegt.
					</p>

					<div id='anchorDivInHelp_auswahl' name='POIauswahluabfragen'>
						<br />
					</div>
					<h4>
						Anlagen auswählen und abfragen{' '}
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
						Bewegen Sie den Mauszeiger im Kartenfenster auf eines der Symbole für
						Park+Ride- bzw. Bike+Ride-Anlagen (P+R- bzw. B+R-Anlagen), um sich den Namen
						der Anlage anzeigen zu lassen. Ein Klick auf das Symbol setzt den Fokus auf
						diese Anlage. Sie wird dann blau hinterlegt und die zugehörigen
						Informationen (Name, Lagebeschreibung, Anzahl der Plätze) werden in der
						Info-Box angezeigt. (Auf einem Tablet-PC wird der Fokus durch das erste
						Antippen des Symbols gesetzt, das zweite Antippen blendet den Namen ein.)
						Durch Anklicken des Symbols <FontAwesomeIcon icon={faInfoCircle} /> rechts
						neben dem Namen der Anlage öffnen Sie das Datenblatt mit den vollständigen
						Informationen zu dieser Anlage einschließlich einer Verknüpfung zur
						Fahrplanauskunft des VRR für die zugehörige Haltestelle. Mit dem Lupensymbol{' '}
						<FontAwesomeIcon icon={faSearchLocation} /> wird die Karte auf die Anlage,
						die gerade den Fokus hat, zentriert und gleichzeitig ein großer
						Betrachtungsmaßstab (Zoomstufe 14) eingestellt.{' '}
					</p>
					<p>
						Wenn Sie noch keine Anlage im aktuellen Kartenausschnitt selektiert haben,
						wird der Fokus automatisch auf die nördlichste Anlage gesetzt. Mit den
						Funktionen <a>&lt;&lt;</a> vorheriger Treffer und <a>&gt;&gt;</a> nächster
						Treffer können Sie ausgehend von der Anlage, auf der gerade der Fokus liegt,
						in nördlicher bzw. südlicher Richtung alle aktuell im Kartenfenster
						angezeigten Anlagen durchmustern.
					</p>
					<p>
						Mit der Schaltfläche <Icon name='chevron-circle-down' /> im dunkelgrau
						abgesetzten rechten Rand der Info-Box lässt sich diese so verkleinern, dass
						nur noch der Typ der Anlage (Park + Ride oder Bike + Ride), ihr Name und die
						Symbole <FontAwesomeIcon icon={faSearchLocation} /> und{' '}
						<FontAwesomeIcon icon={faInfoCircle} /> angezeigt werden - nützlich für
						Endgeräte mit kleinem Display. Mit der Schaltfläche{' '}
						<Icon name='chevron-circle-up' /> an derselben Stelle können Sie die
						Info-Box wieder vollständig einblenden.
					</p>
					<p>
						Ein kleines Foto über der Info-Box vermittelt Ihnen einen Eindruck vom
						Aussehen der Anlage vor Ort. Klicken Sie auf dieses Vorschaubild, um einen
						Bildbetrachter ("Leuchtkasten") mit dem Foto zu öffnen.
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
						<Icon name='road' /> Straße ohne zugeordnete Hausnummern, einen{' '}
						<Icon name='tag' /> POI, die <Icon name='tags' /> alternative Bezeichnung
						eines POI oder eine <Icon name='child' /> Kindertageseinrichtung handelt.
						Tipp: Durch Eingabe von "P+" oder "B+" erzeugen Sie eine vollständige
						Auswahlliste aller P+R- bzw. B+R-Anlagen.
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
						Möglichkeit steht eine <i>Luftbildkarte</i> zur Verfügung, die die
						Anschaulichkeit des Luftbildes mit der Eindeutigkeit des Stadtplans
						(Kartenschrift, durchscheinende Linien) verbindet. Zusätzlich können Sie mit
						dem Kontrollkästchen "<em>Umweltzonen</em>" steuern, ob die Umweltzonen
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
export default BaederModalMenuHelpSection;
