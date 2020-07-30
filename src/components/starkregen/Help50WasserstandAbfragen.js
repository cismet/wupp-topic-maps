import React from 'react';
import GenericModalMenuSection from 'components/commons/GenericModalMenuSection';
import Icon from 'components/commons/Icon';
/* eslint-disable jsx-a11y/anchor-is-valid */

const Component = ({ uiState, uiStateActions, showModalMenu }) => {
	return (
		<GenericModalMenuSection
			uiState={uiState}
			uiStateActions={uiStateActions}
			sectionKey='wasserstand'
			sectionTitle='Max. Wasserstand oder Fließgeschwindigkeit abfragen'
			sectionBsStyle='success'
			sectionContent={
				<div>
					<p>
						Durch Anklicken der Schaltfläche <Icon name='crosshairs' /> oberhalb des
						Kontrollfelds aktivieren Sie abhängig von der eingestellten Kartenansicht
						(Wasserstände vs. Fließgeschwindigkeiten) den Modus zur Abfrage des
						maximalen Wasserstandes bzw. der maximalen Fließgeschwindigkeit. Diese
						Maximalwerte sind im Verlauf jeder Simulation für eine jede 1m x 1m
						Rasterzelle berechnet worden. Anstelle der Schaltfläche erscheint in diesem
						Modus das Anzeigefeld "Maximaler Wasserstand" bzw. "Maximale
						Fließgeschwindigkeit", zunächst mit einem kurzen Bedienungshinweis. Ein
						Klick auf eine beliebige Position in der Karte bewirkt jetzt, dass die Zelle
						in der Karte markiert und der zugehörige Maximalwert des Wasserstandes bzw.
						der Fließgeschwindigkeit in diesem Feld angezeigt wird. Die Anzeige der
						maximalen Wasserstände wird dabei auf volle 10 cm gerundet (z. B. "ca. 90
						cm"), um die{' '}
						<a onClick={() => showModalMenu('aussagekraft')}>
							beschränkte Aussagekraft der Simulationsergebnisse
						</a>{' '}
						zu verdeutlichen. Aus demselben Grund werden berechnete Wasserstände von
						mehr als 150 cm nur als "> 150 cm" angezeigt. Die Anzeige der maximalen
						Fließgeschwindigkeiten erfolgt in der Einheit "Meter pro Sekunde" (m/s),
						gerundet auf eine Nachkommastelle. Fließgeschwindigkeiten von mehr als 6
						Meter pro Sekunde werden als "> 6 m/s" angezeigt.
					</p>
					<p>
						Wenn Sie nach der Abfrage eines maximalen Wasserstandes bzw. einer maximalen
						Fließgeschwindigkeit eine andere Simulation auswählen, wird der angezeigte
						Zellwert automatisch aktualisiert So können Sie für eine bestimmte Position
						bequem alle angebotenen Simulations-Szenarien durchgehen. Auch im
						Abfragemodus können Sie die Karte mit gedrückter linker Maustaste
						verschieben. Wenn Sie auf diese Weise oder durch{' '}
						<a onClick={() => showModalMenu('positionieren')}>
							Positionierung über einen Suchbegriff
						</a>{' '}
						einen Kartenausschnitt auswählen, in dem die zuletzt abgefragte Zelle nicht
						mehr enthalten ist, wird das Anzeigefeld auf seinen Startzustand
						zurückgesetzt. Mit einem Klick auf das <Icon name='close' /> Symbol rechts
						oben im Anzeigefeld beenden Sie den Abfragemodus.
					</p>
				</div>
			}
		/>
	);
};
export default Component;
