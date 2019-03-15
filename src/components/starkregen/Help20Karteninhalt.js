import React from 'react';
import GenericModalMenuSection from '../commons/GenericModalMenuSection';
import { Icon } from 'react-fa';

const Component = ({ uiState, uiStateActions, showModalMenu }) => {
  return (
    <GenericModalMenuSection
      uiState={uiState}
      uiStateActions={uiStateActions}
      sectionKey="karteninhalt"
      sectionTitle="Karteninhalt auswählen"
      sectionBsStyle="success"
      sectionContent={
        <div>
          <p>
            In der rechten unteren Ecke der Anwendung (bei kleinen Displays unten direkt über dem
            Eingabefeld) finden Sie das <b>Kontrollfeld</b>, mit dem Sie den Karteninhalt nach Ihren
            Wünschen festlegen können. Klicken Sie unter <b>Simulation</b> auf eine der vier
            Schaltflächen, um die Starkregensimulation auszuwählen, die angezeigt werden soll.
            Details zu den Simulationsberechnungen finden Sie hier in der Kompaktanleitung unter{' '}
            <a onClick={() => showModalMenu('datengrundlage')}>Datengrundlagen</a> und{' '}
            <a onClick={() => showModalMenu('szenarien')}>Simulierte Szenarien</a>.
          </p>
          <p>
            Unter <b>Karte</b> können Sie aus drei verschiedenen Hintergrundkarten auswählen: einer
            topographischen Karte in Graustufen, einer Luftbildkarte und einem Stadtplan. Die
            topographische Karte verschafft Ihnen den besten Überblick über die Situation, da sie
            einen plastischen Geländeindruck vermittelt. Der Stadtplan eignet sich gut für die
            sichere Identifizierung Ihres Hauses, da hier die Hausnummern aller Gebäude dargestellt
            werden. Die Luftbildkarte ist die anschaulichste Kartengrundlage, sie eignet sich daher
            vor allem für Detailbetrachtungen. Näheres zu den Geodaten, die diesen Karten zu Grunde
            liegen, finden Sie ebenfalls unter{' '}
            <a onClick={() => showModalMenu('datengrundlage')}>Datengrundlagen</a>.
          </p>
          <p>
            Am oberen Rand des Kontrollfeldes befindet sich eine platzsparende Legende, die die vier
            zur Klassifizierung der maximalen simulierten Wasserstände verwendeten Farben erläutert.
            Direkt darunter finden Sie die Bezeichnung und (in kleiner Schrift) eine
            Kurzbeschreibung des aktuell ausgewählten Simulations-Szenarios. Über den Link{' '}
            <a onClick={() => showModalMenu('szenarien')}>(mehr)</a> am Ende jeder Kurzbeschreibung
            gelangen Sie zu einer ausführlicheren Darstellung aller vier Szenarien in der
            Kompaktanleitung. Mit der Schaltfläche <Icon name="chevron-circle-down" /> rechts neben
            der Simulationsbezeichnung lässt sich das Kontrollfeld so verkleinern, dass nur noch die
            Legende und die Simulationsbezeichnung angezeigt werden - nützlich für Endgeräte mit
            kleinem Display. Mit der Schaltfläche <Icon name="chevron-circle-up" /> können Sie das
            Kontrollfeld dann wieder vollständig einblenden.
          </p>
        </div>
      }
    />
  );
};
export default Component;
Component.defaultProps = {
  showModalMenu: () => {}
};
