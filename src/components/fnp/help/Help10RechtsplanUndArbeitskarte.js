import React from 'react';
import GenericModalMenuSection from 'components/commons/GenericModalMenuSection';
import Icon from 'components/commons/Icon';
const Component = ({ uiState, uiStateActions, showModalMenu }) => {
	return (
		<GenericModalMenuSection
			uiState={uiState}
			uiStateActions={uiStateActions}
			sectionKey='RechtsplanUndArbeitskarte'
			sectionTitle='Rechtsplan und Arbeitskarte'
			sectionBsStyle='warning'
			sectionContent={
				<div>
					<p>
						Der heute gültige Wuppertaler Flächennutzungsplan (FNP) erlangte am
						17.01.2005 Rechtskraft und löste damit den zweiten Wuppertaler FNP vom
						30.06.1967 ab. Nach §5 (1) Baugesetzbuch (BauGB) besteht die Aufgabe des
						Flächennutzungsplans darin, für "das gesamte Gemeindegebiet die sich aus der
						beabsichtigten städtebaulichen Entwicklung ergebende Art der Bodennutzung"
						(z. B. eine Wohnbaufläche oder gewerbliche Baufläche) "nach den
						vorhersehbaren Bedürfnissen der Gemeinde in den Grundzügen darzustellen".
						Der FNP (vorbereitende Bauleitplanung) und die aus ihm zu entwickelnden
						Bebauungspläne (verbindliche Bauleitplanung) sind die Instrumente der
						kommunalen Bauleitplanung.
					</p>
					<p>
						Der FNP-Inspektor ermöglicht Ihnen zwei Annäherungen an den FNP.
						Standardmäßig wird der sogenannte <strong>Rechtsplan</strong> dargestellt,
						ein 1:1-Rasterdatenabbild des FNP, wie er am 17.01.2005 Rechtskraft erlangt
						hat. Im Rechtsplan können Sie die FNP-Änderungsverfahren (ÄV) einblenden,
						auf die zu den ÄV gehörenden Dokumente zuzugreifen und sich so an jedem
						Punkt des Stadtgebiets einen Eindruck davon verschaffen, welchen Zustand der
						FNP heute hat und welche Änderungen aktuell betrieben werden.
					</p>
					<p>
						Mit der Schaltfläche{' '}
						<a>
							<Icon name='random' />
						</a>{' '}
						auf der rechten Seite der Titel-Zeile im Kartenfenster können Sie zur
						sogenannten <strong>Arbeitskarte</strong> wechseln. (Ein erneuter Klick
						führt wieder zurück zum Rechtsplan.) Die Arbeitskarte zeigt nur einen Teil
						der Inhalte des FNP, nämlich die flächenhaften Hauptnutzungen, die auf dem
						gesamten Wuppertaler Stadtgebiet ein lückenloses Mosaik bilden. Die
						Arbeitskarte hat gegenüber dem Rechtsplan zwei Vorteile: zum einen sind die
						Änderungen der Hauptnutzungen aus den rechtswirksamen ÄV bereits in die
						Darstellung auf der Grundlage eines aktuellen Stadtplans eingearbeitet. Sie
						sehen in dieser Hinsicht also den aktuellen Stand des FNP. Zum anderen
						können Sie die einzelnen Hauptnutzungsflächen bequem per Doppelklick
						auswählen und sich den festgelegten Nutzungszweck und weitere Informationen
						zur Fläche anzeigen lassen. Die Arbeitskarte ist also auch leichter zu lesen
						als der Rechtsplan. Der Nachteil der Arbeitskarte: sie zeigt nur einen Teil
						der Inhalte des FNP, es handelt sich also um einen informellen Auszug aus
						dem FNP. Die laufend durchgeführten Fortschreibungen der FNP-Arbeitskarte
						sind daher auch keine Neuaufstellungen des Wuppertaler FNP - hierzu müssten
						selbstverständlich die Verfahrensvorschriften nach dem BauGB beachtet
						werden!
					</p>
					<p>
						Mit der Arbeitskarte erhalten Sie eine schnelle und komfortable erste
						Information über den aktuellen rechtswirksamen Stand des FNP an jedem Punkt
						des Stadtgebiets. Für eine vertiefte Auseinandersetzung mit den
						Planungszielen der Stadt Wuppertal ist es sinnvoll, sich anschließend mit
						dem Rechtsplan und ggf. den relevanten Änderungsverfahren und den jeweils
						zugehörigen Dokumenten auseinanderzusetzen.
					</p>
					<p>
						Die Hintergrundkarten im FNP-Inspektor Wuppertal basieren auf den folgenden
						Geodatendiensten und Geodaten:
						<br />
						<br />
						<ul>
							<li>
								<p style={{ paddingRight: 50 }}>
									<strong>Rechtsplan</strong>: (1) Stadtplan-Kartendienst (WMS)
									des Regionalverbandes Ruhr (RVR). Datengrundlage:{' '}
									<strong>Stadtplanwerk 2.0</strong>. Wöchentlich in einem
									automatischen Prozess aktualisierte Zusammenführung des
									Straßennetzes der OpenStreetMap mit Amtlichen Geobasisdaten des
									Landes NRW aus den Fachverfahren ALKIS (Gebäude,
									Flächennutzungen) und ATKIS (Gewässer). © RVR und
									Kooperationspartner (<a
										target='ackmore'
										href='https://www.rvr.ruhr/?id=1002#c179626'
									>
										CC BY 4.0
									</a>). Lizenzen der Ausgangsprodukte:{' '}
									<a
										target='ackmore'
										href='https://www.govdata.de/dl-de/zero-2-0'
									>
										Datenlizenz Deutschland - Zero - Version 2.0
									</a>{' '}
									(Amtliche Geobasisdaten) und{' '}
									<a
										target='ackmore'
										href='https://www.opendatacommons.org/licenses/odbl/1.0/'
									>
										ODbL
									</a>{' '}
									(OpenStreetMap contributors). (2) Kartendienste (WMS) der Stadt
									Wuppertal. Datengrundlagen: Rasterdaten (Scan) der{' '}
									<strong>Deutschen Grundkarte 1:5.000 (DGK 5)</strong>, Stand
									01/2005, © Geobasis NRW (<a
										target='ackmore'
										href='https://www.govdata.de/dl-de/zero-2-0'
									>
										Datenlizenz Deutschland - Zero - Version 2.0
									</a>) und Rasterdaten (Scan) des{' '}
									<strong>Flächennutzungsplans vom 17.01.2005</strong> © Stadt
									Wuppertal (<a
										target='ackmore'
										href='https://creativecommons.org/licenses/by-nd/4.0/deed.de'
									>
										CC BY-ND 4.0
									</a>).{' '}
								</p>
							</li>
							<li>
								<p style={{ paddingRight: 50 }}>
									<strong>Arbeitskarte</strong>: Stadtplan-Kartendienst (WMS) des
									Regionalverbandes Ruhr (RVR). Datengrundlage:{' '}
									<strong>Stadtplanwerk 2.0</strong> (wie im Rechtsplan).
								</p>
							</li>
						</ul>
						<p>
							Zusätzlich nutzt der FNP-Inspektor im Rechtsplan die Datensätze{' '}
							<a target='ackmore' href='https://offenedaten-wuppertal.de/'>
								Rechtswirksame FNP-Änderungsverfahren
							</a>{' '}
							und{' '}
							<a target='ackmore' href='https://offenedaten-wuppertal.de/'>
								Laufende FNP-Änderungsverfahren
							</a>{' '}
							sowie in der Arbeitskarte den Datensatz{' '}
							<a target='ackmore' href='https://offenedaten-wuppertal.de/'>
								FNP-Hauptnutzungen
							</a>, jeweils aus dem Open-Data-Angebot der Stadt Wuppertal, © Stadt
							Wuppertal (<a
								target='ackmore'
								href='https://creativecommons.org/licenses/by-nd/4.0/deed.de'
							>
								CC BY-ND 4.0
							</a>).{' '}
							<em>
								Hinweis: Die Bereitstellung dieser Datensätze in den
								Open-Data-Portalen ist zzt. noch in Bearbeitung.
							</em>
						</p>
					</p>
				</div>
			}
		/>
	);
};
export default Component;
