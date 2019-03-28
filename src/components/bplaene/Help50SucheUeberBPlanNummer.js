import React from 'react';
import GenericModalMenuSection from '../commons/GenericModalMenuSection';
import { Icon } from 'react-fa';

const Component = ({ uiState, uiStateActions }) => {
  return (
    <GenericModalMenuSection
      uiState={uiState}
      uiStateActions={uiStateActions}
      sectionKey="suche-ueber-bplan-nummer"
      sectionTitle="Suche über B-Plan-Nummer"
      sectionBsStyle="success"
      sectionContent={
        <div>
          Um ein B-Plan-Verfahren direkt anzusteuern, geben Sie den Anfang der B-Plan-Nummer im
          Eingabefeld rechts neben&nbsp;
          <Icon name="search" />
          &nbsp;ein (mindestens 2 Ziffern). Alle Verfahren, die mit diesen Ziffern beginnen, werden
          Ihnen in einer inkrementellen Auswahlliste angeboten. (Wenn Sie weitere Zeichen eingeben,
          wird der Inhalt der Auswahlliste angepasst.)
          <br />
          Nach Auswahl eines B-Plan-Verfahrens aus dieser Liste wird ausschlie&szlig;lich der
          zugeh&ouml;rige Plan geladen. Er wird vollst&auml;ndig und zentriert dargestellt. Das ist
          vor allem n&uuml;tzlich, um sich einen &Uuml;berblick &uuml;ber Pl&auml;ne mit einem
          komplizierten Geltungsbereich zu verschaffen. (Probieren Sie mal die Nummer 150.)
          <br />
          Klicken Sie auf&nbsp;
          <Icon name="search" />
          &nbsp;, um alle Pl&auml;ne hinzuzuladen, die im jetzt aktuellen Ausschnitt liegen. Damit
          stellen Sie auch sicher, dass Sie keinen Plan &uuml;bersehen, der sich mit dem zuvor
          gesuchten &uuml;berlappt.
        </div>
      }
    />
  );
};
export default Component;
