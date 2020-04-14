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
				</div>
			}
		/>
	);
};
export default Component;
