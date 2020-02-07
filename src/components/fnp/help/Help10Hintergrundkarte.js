import React from 'react';
import GenericModalMenuSection from 'components/commons/GenericModalMenuSection';

const Component = ({ uiState, uiStateActions, showModalMenu }) => {
	return (
		<GenericModalMenuSection
			uiState={uiState}
			uiStateActions={uiStateActions}
			sectionKey='hintergrundkarte'
			sectionTitle='Hintergrundkarte'
			sectionBsStyle='warning'
			sectionContent={
				<div>
					<p>
						<strong>Hintergrundkarte</strong>
					</p>
					<p>
						Die Hintergrundkarte gibt eine Übersicht über die Wuppertaler Bebauungspläne
						(B-Pläne). Grüne Flächen (Übersichtsmaßstab) bzw. Umringe stehen für
						rechtswirksame B-Plan-Verfahren, rote Flächen / Umringe für laufende
						Verfahren.
					</p>
					<p>
						Die Hintergrundkarte basiert auf den folgenden Kartendiensten und Daten, die
						maßstabsabhängig angesprochen werden:
					</p>
					<ul>
						<li>
							<strong>Stadtplan, in allen Maßstäben</strong>: Kartendienst (WMS) des
							Regionalverbandes Ruhr (RVR). Datengrundlage: Stadtplanwerk 2.0 Beta.
							(Wöchentlich in einem automatischen Prozess aktualisierte
							Zusammenführung des Straßennetzes der OpenStreetMap mit Gebäuden und
							Flächennutzungen aus dem Fachverfahren ALKIS des
							Liegenschaftskatasters.) © RVR und Kooperationspartner (<a
								href='https://creativecommons.org/licenses/by/4.0/legalcode.de'
								target='_license'
							>
								CC BY 4.0
							</a>). Lizenzen der Ausgangsprodukte: OpenStreetMap contributors (<a
								href='https://www.opendatacommons.org/licenses/odbl/1.0/'
								target='_license'
							>
								ODbL
							</a>) und Land NRW (2018){' '}
							<a href='http://www.govdata.de/dl-de/by-2-0' target='_license'>
								Datenlizenz Deutschland - Namensnennung - Version 2.0
							</a>.
						</li>
						<li>
							<strong>Amtliche Basiskarte ABK, in Detailmaßstäben</strong>:
							Kartendienst (WMS) der Stadt Wuppertal. Datengrundlage: Amtliche
							Basiskarte ABK Graustufen. (Wöchentlich in einem automatisierten Prozess
							aus dem Fachverfahren ALKIS des Liegenschaftskatasters abgeleitete
							großmaßstäbige topographische Karte in Graustufen.) © Stadt Wuppertal (<a
								href='http://www.govdata.de/dl-de/by-2-0'
								target='_license'
							>
								Datenlizenz Deutschland - Namensnennung - Version 2.0
							</a>).
						</li>
						<li>
							<strong>WebAtlasDE, in Übersichtsdarstellungen</strong>: Kartendienst
							(WMS) des Bundesamtes für Kartographie und Geodäsie (BKG).
							Datengrundlage: WebAtlasDE © GeoBasis-DE / BKG 2018
						</li>
						<li>
							<strong>B-Plan-Geltungsbereiche, in allen Maßstäben</strong>:
							Kartendienst (WMS) der Stadt Wuppertal. Datengrundlage: Geltungsbereiche
							der Wuppertaler{' '}
							<a
								href='https://offenedaten-wuppertal.de/dataset/rechtsverbindliche-bebauungspl%C3%A4ne-wuppertal'
								target='_license'
							>
								rechtsverbindlichen Bebauungspläne
							</a>{' '}
							und der{' '}
							<a
								href='https://offenedaten-wuppertal.de/dataset/laufende-bebauungsplanverfahren-wuppertal'
								target='_license'
							>
								laufenden Bebauungsplan-Verfahren
							</a>{' '}
							aus dem Open-Data-Angebot der Stadt Wuppertal. © Stadt Wuppertal (CC
							BY-ND 4.0)
						</li>
					</ul>
				</div>
			}
		/>
	);
};
export default Component;
