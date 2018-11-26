import React from "react";
import GenericModalMenuSection from "../commons/GenericModalMenuSection";
import { Icon } from 'react-fa';

const Component = ({ uiState, uiStateActions }) => {
  return (
    <GenericModalMenuSection
      uiState={uiState}
      uiStateActions={uiStateActions}
      sectionKey="modellfehlermelden"
      sectionTitle="Fehler im Geländemodell melden"
      sectionBsStyle="danger"
      sectionContent={
        <div>
          <p>
            Wenn die Simulationsergebnisse eine Überflutungsgefährdung darstellen, die im
            Widerspruch zu Ihren vor Ort gewonnen Erfahrungen steht, liegt das wahrscheinlich an
            einem Fehler im Digitalen Geländemodell (DGM), das bei der Simulationsberechnung
            verwendet wird. Woher kommen solche Fehler? Das DGM wird aus Höhenmessungen abgeleitet,
            die mit einem Laserscanner aus einem Flugzeug heraus durchgeführt werden. Bei diesem
            Messverfahren werden Brücken, Tunnel und Gewässerdurchlässe, die für das
            Abflussverhalten des Oberflächenwassers wichtig sind, nicht erkannt. Sie werden daher
            nachträglich manuell in das DGM eingearbeitet. Wenn wir dabei ein für den Wasserabfluss
            wichtiges Element übersehen haben, wird u. U. in der Simulationsberechnung aus einer
            Brücke ein Damm. Im Ergebnis wird dann eine Aufstauung des Wassers angezeigt, die sich
            real so nicht einstellen würde!
          </p>
          <p>
            <b>
              Bitte helfen Sie uns bei der Verbesserung des Geländemodells, indem Sie uns auf solche
              möglichen Fehler hinweisen.
            </b>{" "}
            Stellen Sie dazu die Kartenansicht (Ausschnitt, Hintergrundkarte und Simulation) ein,
            die den von Ihnen vermuteten Fehler im DGM bestmöglich darstellt. Durch Anklicken des
            Werkzeugs "Fehler im Geländemodell melden" <Icon name="comment" /> links
            oben im Kartenfenster öffnen Sie das auf Ihrem Rechner eingerichtete
            E-Mail-Programm mit dem Gerüst einer Nachricht an{" "}
            <a href="starkregen@stadt.wuppertal.de">starkregen@stadt.wuppertal.de</a>. Über diese
            Funktionsadresse sprechen Sie eine Gruppe von Experten der Stadtverwaltung, der
            Wuppertaler Stadtwerke (WSW) und des städtischen Eigenbetriebs Wasser und Abwasser
            Wuppertal (WAW) an. Das automatisch erzeugte E-Mail-Gerüst enthält einen Link, mit dem
            diese Experten die Starkregenkarte genau in dem Zustand öffnen können, den Sie
            eingestellt haben. Bitte ergänzen Sie Ihre E-Mail mit einer kurzen Darstellung des
            vermuteten Fehlers. Wo haben wir vermutlich einen Gewässerdurchlass o. ä. übersehen?
          </p>
          <p>
            Wenn die Experten Ihre Fehlermeldung nachvollziehen können, wird diese bei der nächsten
            turnusmäßigen Neuberechnung der Simulationen durch die Firma Dr. Pecher AG
            berücksichtigt. Bitte beachten Sie in diesem Zusammenhang die Versionsangabe der
            Simulationsergebnisse im Fußbereich dieser Kompaktanleitung.
          </p>
        </div>
      }
    />
  );
};
export default Component;
