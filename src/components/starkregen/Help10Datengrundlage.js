import React from 'react';
import GenericModalMenuSection from '../commons/GenericModalMenuSection';

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
						Die Starkregengefahrenkarte Wuppertal stellt in einem 1m x 1m Raster maximale Wasserstände dar,
						die im Verlauf von simulierten Starkregenereignissen auftreten. Die Wasserstände werden dazu in
						vier Stufen (größer als 10, 30, 50 und 100 cm) klassifiziert, die in der Karte durch
						unterschiedliche Einfärbung der Rasterzellen (von blau nach rot) dargestellt werden. Die
						Simulationsberechnungen wurden im Auftrag der Stadt Wuppertal und der Wuppertaler Stadtwerke
						(WSW Energie und Wasser AG) durch das Ingenieurbüro Dr. Pecher AG (Erkrath) durchgeführt. Der
						Regenwasserabfluss im Kanalnetz und durch Überstau aus dem Kanalnetz austretendes Wasser wurden
						hierbei vereinfacht berücksichtigt, ebenso die unterschiedlichen Abflussgeschwindigkeiten auf
						Oberflächen mit unterschiedlicher Rauhigkeit (z. B. auf einer Straße schneller als auf einer
						Wiese).
					</p>

					<p>
						Die Simulationen basieren auf einem Digitalen Geländemodell (DGM) von Wuppertal, abgeleitet aus
						flächenhaften Höhenmessungen, die das Land NRW turnusmäßig mit einem Laserscanner aus einem
						Flugzeug heraus durchführt (verwendeter Datenstand überwiegend Anfang 2015). Das DGM wurde um
						die Gebäude aus dem Wuppertaler Liegenschaftskataster und das Kanalnetz inklusive verrohrter
						Gewässerabschnitte aus der Kanalnetzdatenbank der WSW Energie &amp; Wasser AG ergänzt, um eine
						hydrologisch korrekte Abflussberechnung zu gewährleisten.{' '}
					</p>

					<p>
						Darüber hinaus ist das Ergebnis der Simulation natürlich von der Dauer und Intensität des Regens
						abhängig, der für die Simulation angenommen wird. Wir bieten Ihnen hierzu vier unterschiedliche{' '}
						<a onClick={() => showModalMenu('szenarien')}>simulierte Szenarien</a> an, drei "Modellregen"
						sowie das anhand der Niederschlagsmessungen desselben Tages nachgestellte Starkregenereignis vom
						29.05.2018.{' '}
					</p>

					<p>
						Zur Betrachtung der Wasserstände stellen wir Ihnen drei verschiedene Hintergrundkarten bereit,
						die auf den folgenden Geodatendiensten und Geodaten basieren:
					</p>

					<ul>
						<li>
							<strong>Topographische Karte</strong>: (1) Kartendienste (WMS) der Stadt Wuppertal.
							Datengrundlagen: (a) <strong>Amtliche Basiskarte ABK Graustufen</strong>. (Wöchentlich in
							einem automatisierten Prozess aus dem Fachverfahren ALKIS des Liegenschaftskatasters
							abgeleitete großmaßstäbige topographische Karte in Graustufen.) © Stadt Wuppertal (
							<a target="_more" href="http://www.govdata.de/dl-de/by-2-0">
								Datenlizenz Deutschland - Namensnennung - Version 2.0
							</a>
							). (b) <strong>Hillshade</strong> (Schummerungsdarstellung eines für hydrologische
							Fragestellungen optimierten Digitalen Geländemodells aus Laserscanner-Befliegungen (12/2008
							und 01/2009) mit ergänztem Gebäudebestand (Auflösung 25cm x 25cm), ausgeführt in 2012 vom
							Ingenieurbüro Reinhard Beck GmbH &amp; Co. KG / Wuppertal.) © Wuppertaler Stadtwerke WSW
							Energie &amp; Wasser AG. (2) Kartendienst (WMS) des Bundesamtes für Kartographie und
							Geodäsie (BKG). Datengrundlage:{' '}
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

						<li>
							<strong>Luftbildkarte</strong>: (1) Kartendienst (WMS) der Stadt Wuppertal. Datengrundlage:{' '}
							<strong>True Orthophoto aus Bildflug vom 19.04.2018</strong>, hergestellt durch Aero West
							GmbH/Dortmund, Bodenauflösung 10 cm. (True Orthophoto: Aus Luftbildern mit hoher Längs- und
							Querüberdeckung in einem automatisierten Bildverarbeitungsprozess berechnetes Bild in
							Parallelprojektion, also ohne Gebäudeverkippung und sichttote Bereiche.) © Stadt Wuppertal (
							<a
								target="_more"
								href="https://www.wuppertal.de/geoportal/Nutzungsbedingungen/NB-GDIKOM-C_Geodaten.pdf"
							>
								NB-GDIKOM C
							</a>
							). (2) Kartendienst (WMS) des Regionalverbandes Ruhr (RVR). Datengrundlage:{' '}
							<strong>Stadtplanwerk 2.0 Beta</strong>. (Details s. Hintergrundkarte{' '}
							<strong>Stadtplan</strong>).
						</li>

						<li>
							<strong>Stadtplan</strong>: Kartendienst (WMS) des Regionalverbandes Ruhr (RVR).
							Datengrundlage: <strong>Stadtplanwerk 2.0 Beta</strong>. (Wöchentlich in einem automatischen
							Prozess aktualisierte Zusammenführung des Straßennetzes der OpenStreetMap mit Gebäuden und
							Flächennutzungen aus dem Fachverfahren ALKIS des Liegenschaftskatasters.) © RVR und
							Kooperationspartner (
							<a target="_more" href="https://creativecommons.org/licenses/by/4.0/legalcode.de">
								CC BY 4.0
							</a>). Lizenzen der Ausgangsprodukte: Land NRW (2018){' '}
							<a target="_more" href="http://www.govdata.de/dl-de/by-2-0">
								Datenlizenz Deutschland - Namensnennung - Version 2.0
							</a>{' '}
							und OpenStreetMap contributors (
							<a target="_more" href="http://www.opendatacommons.org/licenses/odbl/1.0/">
								ODbL
							</a>).{' '}
						</li>
					</ul>
				</div>
			}
		/>
	);
};
export default Component;
