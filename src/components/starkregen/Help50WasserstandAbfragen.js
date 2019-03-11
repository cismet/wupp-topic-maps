import React from "react";
import GenericModalMenuSection from "../commons/GenericModalMenuSection";
import { Icon } from "react-fa";
const Component = ({ uiState, uiStateActions, showModalMenu }) => {
  return (
    <GenericModalMenuSection
      uiState={uiState}
      uiStateActions={uiStateActions}
      sectionKey="wasserstand"
      sectionTitle="Maximalen Wasserstand abfragen"
      sectionBsStyle="success"
      sectionContent={
        <div>
          <p>
            Durch Anklicken der Schaltfläche <Icon name="crosshairs" /> oberhalb des Kontrollfelds
            aktivieren Sie den Modus zur Abfrage des maximalen Wasserstandes, der im Verlauf einer
            Simulation für eine jede 1m x 1m Rasterzelle berechnet worden ist. Anstelle der
            Schaltfläche erscheint in diesem Modus das Anzeigefeld "Maximaler Wasserstand", zunächst
            mit einem kurzen Bedienungshinweis. Ein Klick auf eine beliebige Position in der Karte
            bewirkt jetzt, dass die Zelle in der Karte markiert und der zugehörige maximale
            Wasserstand in diesem Feld angezeigt wird. Die Anzeige wird dabei auf volle 10 cm
            gerundet (z. B. "ca. 90 cm"), um die{" "}
            <a onClick={() => showModalMenu("aussagekraft")}>
              beschränkte Aussagekraft der Simulationsergebnisse
            </a>{" "}
            zu verdeutlichen. Aus demselben Grund werden berechnete Wasserstände von mehr als 150 cm
            nur als "> 150 cm" angezeigt. Wenn Sie nach der Abfrage eines maximalen Wasserstandes
            eine andere Simulation auswählen, wird der angezeigte Zellwert automatisch aktualisiert.
            So können Sie für eine bestimmte Position bequem alle angebotenen Simulations-Szenarien
            durchgehen. Auch im Abfragemodus können Sie die Karte mit gedrückter linker Maustaste
            verschieben. Wenn Sie auf diese Weise oder durch{" "}
            <a onClick={() => showModalMenu("positionieren")}>
              Positionierung über einen Suchbegriff
            </a>{" "}
            einen Kartenausschnitt auswählen, in dem die zuletzt abgefragte Zelle nicht mehr
            enthalten ist, wird das Anzeigefeld auf seinen Startzustand zurückgesetzt. Mit einem
            Klick auf das <Icon name="close" /> Symbol rechts oben im Anzeigefeld beenden Sie den
            Abfragemodus.
          </p>
        </div>
      }
    />
  );
};
export default Component;
