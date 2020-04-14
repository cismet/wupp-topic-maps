import React from 'react';
import { Link } from 'react-scroll';
import Icon from 'components/commons/Icon';
import { Label } from 'react-bootstrap';
import GenericModalMenuSection from 'components/commons/GenericModalMenuSection';
import MeinStandort from 'components/commons/GenericHelpTextForMyLocation';
const ModalMenuHelpSection = ({ uiState, uiStateActions }) => {
	return (
		<GenericModalMenuSection
			uiState={uiState}
			uiStateActions={uiStateActions}
			sectionKey='help'
			sectionTitle='Kompaktanleitung'
			sectionBsStyle='default'
			sectionContent={
				<div>
					<div>
						<Link
							to='Datengrundlage'
							containerId='myMenu'
							style={{
								textDecoration: 'none'
							}}
						>
							{' '}
							<Label bsStyle='warning'>Datengrundlage</Label>{' '}
						</Link>
						<Link
							to='KartendarstellungPOI'
							containerId='myMenu'
							style={{
								textDecoration: 'none'
							}}
						>
							{' '}
							<Label bsStyle='warning'>Kartendarstellung der POI</Label>{' '}
						</Link>
						<Link
							to='POIauswahluabfragen'
							containerId='myMenu'
							style={{
								textDecoration: 'none'
							}}
						>
							{' '}
							<Label bsStyle='default'>POI auswählen und abfragen</Label>{' '}
						</Link>
						<Link
							to='InKartePositionieren'
							containerId='myMenu'
							style={{
								textDecoration: 'none'
							}}
						>
							{' '}
							<Label bsStyle='default'>In Karte positionieren</Label>{' '}
						</Link>
						<Link
							to='MeinStandort'
							containerId='myMenu'
							style={{
								textDecoration: 'none'
							}}
						>
							{' '}
							<Label bsStyle='default'>Mein Standort</Label>{' '}
						</Link>
						<Link
							to='MeinThemenstadtplan'
							containerId='myMenu'
							style={{
								textDecoration: 'none'
							}}
						>
							{' '}
							<Label bsStyle='primary'>Mein Themenstadtplan</Label>{' '}
						</Link>
						<Link
							to='Einstellungen'
							containerId='myMenu'
							style={{
								textDecoration: 'none'
							}}
						>
							{' '}
							<Label bsStyle='success'>Einstellungen</Label>{' '}
						</Link>
						<Link
							to='Personalisierung'
							containerId='myMenu'
							style={{
								textDecoration: 'none'
							}}
						>
							{' '}
							<Label bsStyle='success'>Personalisierung</Label>{' '}
						</Link>
					</div>

					<div name='Datengrundlage'>
						<br />
					</div>
					<h4>
						Datengrundlage{' '}
						<Link
							to='help'
							containerId='myMenu'
							style={{
								color: '#00000044'
							}}
						>
							<Icon name='arrow-circle-up' />
						</Link>
					</h4>
					<p>
						Der <strong>Online-Stadtplan Wuppertal</strong> bietet ihnen die folgenden
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
						Zusätzlich nutzt der Online-Stadtplan für die Themendarstellung den
						Datensatz{' '}
						<a
							target='_legal'
							href='https://offenedaten-wuppertal.de/dataset/interessante-orte-wuppertal-poi'
						>
							Interessante Orte Wuppertal (POI)
						</a>{' '}
						aus dem Open-Data-Angebot der Stadt Wuppertal.
					</p>

					<div name='KartendarstellungPOI'>
						<br />
					</div>
					<h4>
						Kartendarstellung der POI{' '}
						<Link
							to='help'
							containerId='myMenu'
							style={{
								color: '#00000044'
							}}
						>
							<Icon name='arrow-circle-up' />
						</Link>
					</h4>
					<p>
						Jeder POI (Point of Interest, 'Interessanter Ort') ist einem oder mehreren
						übergeordneten Themenfeldern wie z. B. "<em>Freizeit</em>" oder "<em>Erholung</em>"
						zugeordnet. Die Hintergrundfarben der POI-Symbole stehen jeweils für eine
						eindeutige Kombination dieser Themenfelder, z. B. Hellgrün für "<em>Freizeit, Erholung</em>
						".
					</p>
					<p>
						Räumlich nah beieinander liegende POI werden standardmäßig maßstabsabhängig
						zu größeren Punkten zusammengefasst, mit der Anzahl der repräsentierten POI
						im Zentrum <img alt='Cluster' src='images/poi_zusammen.png' />. Vergrößern
						Sie ein paar Mal durch direktes Anklicken eines solchen Punktes oder mit{' '}
						<Icon name='plus' /> die Darstellung, so werden die zusammengefassten POI
						Schritt für Schritt in die kleineren Symbole für die konkreten Einzel-POI
						zerlegt. Ab einer bestimmten Maßstabsstufe (Zoomstufe 12) führt ein weiterer
						Klick dazu, dass eine Explosionsgraphik der zusammengefassten POI angezeigt
						wird.
					</p>

					<div name='POIauswahluabfragen'>
						<br />
					</div>
					<h4>
						POI auswählen und abfragen{' '}
						<Link
							to='help'
							containerId='myMenu'
							style={{
								color: '#00000044'
							}}
						>
							<Icon name='arrow-circle-up' />
						</Link>
					</h4>
					<p>
						Bewegen Sie den Mauszeiger im Kartenfenster auf einen konkreten Einzel-POI,
						um sich seine Bezeichnung anzeigen zu lassen. Ein Klick auf das zugehörige
						POI-Symbol setzt den Fokus auf diesen POI. Er wird dann blau hinterlegt und
						die zugehörigen Informationen (Bezeichnung, Info-Text und ggf. Adresse)
						werden in der Info-Box (unten rechts) angezeigt. (Auf einem Tablet-PC wird
						der Fokus durch das erste Antippen des Angebots gesetzt, das zweite Antippen
						blendet die Bezeichnung ein.) Außerdem werden Ihnen in der Info-Box
						weiterführende (Kommunikations-) Links zum POI angezeigt:{' '}
						<Icon name='external-link-square' /> Internet,{' '}
						<Icon name='envelope-square' /> E-Mail und <Icon name='phone' /> Telefon.
						Bei POI, zu denen im Terminkalender von{' '}
						<a href='https://wuppertal-live.de'>www.wuppertal-live.de</a>{' '}
						Veranstaltungen geführt werden, finden sie zusätzlich noch eine{' '}
						<Icon name='calendar' /> Verknüpfung zu wuppertal-live.de, wo sie für viele
						Veranstaltungen auch Online-Tickets erwerben können.
					</p>
					<p>
						Wenn Sie noch nicht aktiv einen bestimmten POI im aktuellen Kartenausschnitt
						selektiert haben, wird der Fokus automatisch auf den nördlichsten POI
						gesetzt. Mit den Funktionen <a>&lt;&lt;</a> vorheriger Treffer und{' '}
						<a>&gt;&gt;</a> nächster Treffer können Sie in nördlicher bzw. südlicher
						Richtung alle aktuell im Kartenfenster angezeigten POI durchmustern.
					</p>
					<p>
						Mit der Schaltfläche <Icon name='chevron-circle-down' /> im dunkelgrau
						abgesetzten rechten Rand der Info-Box lässt sich diese so verkleinern, dass
						nur noch die thematische Zuordnung und die Bezeichnung des POI sowie die
						Link-Symbole angezeigt werden - nützlich für Endgeräte mit kleinem Display.
						Mit der Schaltfläche <Icon name='chevron-circle-up' /> an derselben Stelle
						können Sie die Info-Box dann wieder vollständig einblenden.
					</p>

					<p>
						Zu einigen POI bieten wir Ihnen Fotos oder Fotoserien des bekannten
						Wuppertaler Fotographen Peter Krämer an. Sie finden dann ein Vorschaubild
						direkt über der Info-Box. Klicken Sie auf das Vorschaubild, um einen
						Bildbetrachter ("Leuchtkasten") mit dem Foto&nbsp;/&nbsp;der Fotoserie zu
						öffnen. Aus dem Bildbetrachter gelangen Sie über einen Link im Fußbereich
						auch zur Foto-Anwendung von Peter Krämer.
					</p>

					<div name='InKartePositionieren'>
						<br />
					</div>
					<h4>
						In Karte positionieren{' '}
						<Link
							to='help'
							containerId='myMenu'
							style={{
								color: '#00000044'
							}}
						>
							<Icon name='arrow-circle-up' />
						</Link>
					</h4>
					<p>
						Um eine bestimmte Stelle des Stadtgebietes zu erkunden, geben Sie den Anfang
						eines Stadtteils (Stadtbezirk oder Quartier), einer Adresse, eines
						Straßennamens oder eines POI im Eingabefeld links unten ein (mindestens 2
						Zeichen). In der inkrementellen Auswahlliste werden Ihnen passende Treffer
						angeboten. (Wenn Sie weitere Zeichen eingeben, wird der Inhalt der
						Auswahlliste angepasst.) Durch das vorangestellte Symbol erkennen Sie, ob es
						sich dabei um einen <Icon name='circle' /> Stadtbezirk, ein{' '}
						<Icon name='pie-chart' /> Quartier, eine <Icon name='home' /> Adresse, eine{' '}
						<Icon name='road' /> Straße ohne zugeordnete Hausnummern, einen{' '}
						<Icon name='tag' /> POI, die <Icon name='tags' /> alternative Bezeichnung
						eines POI oder eine <Icon name='child' /> Kindertageseinrichtung handelt.
					</p>
					<p>
						Nach der Auswahl eines Treffers aus der Liste wird die Karte auf die
						zugehörige Position zentriert. Bei Suchbegriffen mit Punktgeometrie
						(Adresse, Straße, POI) wird außerdem ein großer Maßstab (Zoomstufe 14)
						eingestellt und ein Marker{' '}
						<img alt='Cluster' src='images/AdressMarker.jpg' /> auf der Zielposition
						platziert. Bei Suchbegriffen mit Flächengeometrie (Stadtbezirk, Quartier)
						wird der Maßstab so eingestellt, dass die Fläche vollständig dargestellt
						werden kann. Zusätzlich wird der Bereich außerhalb dieser Fläche abgedunkelt
						(Spotlight-Effekt).
					</p>
					<p>
						Durch Anklicken des Werkzeugs <Icon name='times' /> links neben dem
						Eingabefeld können Sie die Suche zurücksetzen (Entfernung von Marker bzw.
						Abdunklung, Löschen des Textes im Eingabefeld).
					</p>

					<div name='MeinStandort'>
						<br />
					</div>
					<h4>
						Mein Standort{' '}
						<Link
							to='help'
							containerId='myMenu'
							style={{
								color: '#00000044'
							}}
						>
							<Icon name='arrow-circle-up' />
						</Link>
					</h4>
					<MeinStandort />

					<div name='MeinThemenstadtplan'>
						<br />
					</div>
					<h4>
						Mein Themenstadtplan{' '}
						<Link
							to='help'
							containerId='myMenu'
							style={{
								color: '#00000044'
							}}
						>
							<Icon name='arrow-circle-up' />
						</Link>
					</h4>
					<p>
						Unter "<strong>Mein Themenstadtplan</strong>" können Sie im Anwendungsmenü{' '}
						<Icon name='bars' /> auswählen, welche POI-Kategorien in der Karte
						dargestellt werden. Über die Schaltfläche{' '}
						<img alt='Cluster' src='images/sf_keinethemenausw.png' /> können Sie die POI
						vollständig ausblenden - auch die Info-Box wird dann nicht mehr angezeigt.
					</p>
					<p>
						Zur Filterung der POI-Kategorien bieten wir Ihnen die oben beschriebenen
						Themenfelder an. Wählen Sie z. B. mit <Icon name='thumbs-up' />{' '}
						ausschließlich das Thema "<em>Kultur</em>" aus. Als Vorschau wird Ihnen ein
						Donut-Diagramm angezeigt, das die Anzahl der zugehörigen POI und deren
						Verteilung auf die Themen-Kombinationen (hier "<em>Kultur, Gesellschaft</em>"
						und "<em>Kultur, Freizeit</em>
						") anzeigt. Bewegen Sie dazu den Mauszeiger auf eines der farbigen Segmente
						des Donut-Diagramms. (Bei einem Gerät mit Touchscreen tippen Sie auf eines
						der farbigen Segmente.)
					</p>
					<p>
						Mit <Icon name='thumbs-down' /> können Sie die POI, die dem entsprechenden
						Thema zugeordnet sind, ausblenden und dadurch die Treffermenge reduzieren.
						Schließen Sie jetzt z. B. das Thema "<em>Gesellschaft</em>" aus. Im
						Donut-Diagramm werden Ihnen dann nur noch die POI mit der Themen-Kombination
						"<em>Kultur, Freizeit</em>" angezeigt (Theater, Museen etc.). Die POI mit
						der Kombination "
						<em>Kultur, Gesellschaft</em>" (Standorte von Verlagen und anderen
						Medienunternehmungen) wurden dagegen entfernt.
					</p>

					<div name='Einstellungen'>
						<br />
					</div>
					<h4>
						Einstellungen{' '}
						<Link
							to='help'
							containerId='myMenu'
							style={{
								color: '#00000044'
							}}
						>
							<Icon name='arrow-circle-up' />
						</Link>
					</h4>
					<p>
						Unter "
						<strong>Einstellungen</strong>
						" können Sie im Anwendungsmenü <Icon name='bars' /> festlegen, wie die POI
						und die Hintergrundkarte angezeigt werden sollen. Zu den POI können Sie
						auswählen, ob Ihre unter "
						<strong>Mein Themenstadtplan</strong>" festgelegte Lebenslagen-Filterung in
						einer Titelzeile ausgeprägt wird oder nicht. Weiter können Sie festlegen, ob
						räumlich nah beieinander liegende POI maßstabsabhängig zu einem Punktsymbol
						zusammengefasst werden oder nicht. Unter "
						<em>
							<strong>Symbolgröße</strong>
						</em>
						" können Sie in Abhängigkeit von Ihrer Bildschirmauflösung und Ihrem
						Sehvermögen auswählen, ob die POI mit kleinen (25 Pixel), mittleren (35
						Pixel) oder großen (45 Pixel) Symbolen angezeigt werden.
					</p>
					<p>
						Unter "<em>
							<strong>Hintergrundkarte</strong>
						</em>" können Sie auswählen, ob Sie die standardmäßig aktivierte farbige
						Hintergrundkarte verwenden möchten ("<em>Stadtplan (Tag)</em>") oder lieber
						eine invertierte Graustufenkarte ("<em>Stadtplan (Nacht)</em>"), zu der uns
						die von vielen PKW-Navis bei Dunkelheit eingesetzte Darstellungsweise
						inspiriert hat. <strong>Hinweis:</strong> Der Stadtplan (Nacht) wird Ihnen
						nur angeboten, wenn Ihr Browser CSS3-Filtereffekte unterstützt, also z. B.
						nicht beim Microsoft Internet Explorer. Die Nacht-Karte erzeugt einen
						deutlicheren Kontrast mit den farbigen POI-Symbolen, die unterschiedlichen
						Flächennutzungen in der Hintergrundkarte lassen sich aber nicht mehr so gut
						unterscheiden wie in der Tag-Karte. Als dritte Möglichkeit steht eine
						Luftbildkarte zur Verfügung, die die Anschaulichkeit des Luftbildes mit der
						Eindeutigkeit des Stadtplans (Kartenschrift, durchscheinende Linien)
						verbindet.{' '}
					</p>
					<p>
						Im Vorschaubild sehen Sie direkt die prinzipielle Wirkung ihrer
						Einstellungen.
					</p>

					<div name='Personalisierung'>
						<br />
					</div>
					<h4>
						Personalisierung{' '}
						<Link
							to='help'
							containerId='myMenu'
							style={{
								color: '#00000044'
							}}
						>
							<Icon name='arrow-circle-up' />
						</Link>
					</h4>
					<p>
						Ihre Themenauswahl und Einstellungen bleiben auch nach einem Neustart der
						Anwendung erhalten. (Es sei denn, Sie löschen den Browser-Verlauf
						einschließlich der gehosteten App-Daten.) Damit können Sie mit wenigen
						Klicks aus unserem Online-Stadtplan einen dauerhaft für Sie optimierten
						Themenstadtplan machen.
					</p>
				</div>
			}
		/>
	);
};
export default ModalMenuHelpSection;
