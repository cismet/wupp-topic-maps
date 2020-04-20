import React from 'react';
import GenericModalMenuSection from 'components/commons/GenericModalMenuSection';
import Icon from 'components/commons/Icon';

/* eslint-disable jsx-a11y/anchor-is-valid */

const Component = ({ uiState, uiStateActions }) => {
	return (
		<GenericModalMenuSection
			uiState={uiState}
			uiStateActions={uiStateActions}
			sectionKey='treffermenge-durchmustern'
			sectionTitle='Treffermengen durchmustern'
			sectionBsStyle='info'
			sectionContent={
				<div>
					<p>
						Der beste Treffer einer Suche erhält den Fokus (blaue Umrandung). In der
						Info-Box werden Ihnen immer die Detailinformationen und die Verknüpfung zur
						Dokumentbetrachtung für denjenigen B-Plan angeboten, der gerade den Fokus
						hat.
					</p>
					<p>
						Der farbige Titelbalken der Info-Box greift für den Verfahrensstand
						(Grobkategorie) des B-Plans die Farbsystematik der Kartendarstellung auf:
						Grün für rechtswirksame Pläne, Rot für nicht rechtswirksame, Grün mit einem
						roten Quadrat-Symbol für rechtswirksame Pläne mit laufenden
						Änderungsverfahren. Zusätzlich wird der Verfahrensstand auch als Text im
						Titelbalken ausgeprägt.
					</p>
					<p>
						Mit einem einfachen Klick auf eine andere B-Plan-Fläche aus der Treffermenge
						erhält der zugehörige B-Plan den Fokus. Mit einem weiteren Klick auf diese
						Fläche wird der Kartenausschnitt so angepasst, dass der zugehörige B-Plan
						vollständig und zentriert dargestellt wird.
					</p>
					<p>
						Alternativ k&ouml;nnen Sie die Treffermenge mit den Schaltfl&auml;chen{' '}
						<a>&gt;&gt;</a> (n&auml;chster Treffer) und &nbsp;
						<a>&lt;&lt;</a> (vorheriger Treffer) durchmustern. (Die Treffermenge ist
						geordnet nach zunehmendem Abstand des Plans vom Bezugspunkt ihrer Suche.)
					</p>
					<p>
						Mit&nbsp;
						<a>alle Treffer anzeigen</a>
						&nbsp; k&ouml;nnen Sie den Kartenausschnitt zuvor so anpassen, dass alle
						Pl&auml;ne der Treffermenge vollst&auml;ndig angezeigt werden.
					</p>

					<p>
						Mit der Schaltfläche <Icon name='chevron-circle-down' /> im dunkelgrau
						abgesetzten rechten Rand der Info-Box lässt sich diese so verkleinern, dass
						nur noch die B-Plan-Nummer und das verkleinerte PDF-Symbol zum{' '}
						<a
							onClick={() => {
								uiStateActions.showApplicationMenuAndActivateSection(
									true,
									'dokuumente-betrachten'
								);
							}}
						>
							Starten des Dokumentenviewers
						</a>{' '}
						angezeigt werden - nützlich für Endgeräte mit kleinem Display. Mit der
						Schaltfläche <Icon name='chevron-circle-up' /> an derselben Stelle können
						Sie die Info-Box wieder vollständig einblenden.
					</p>
				</div>
			}
		/>
	);
};
export default Component;
