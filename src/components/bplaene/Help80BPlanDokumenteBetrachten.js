import React from 'react';
import GenericModalMenuSection from '../commons/GenericModalMenuSection';
import Icon from 'components/commons/Icon';
import { INFO_DOC_DATEINAMEN_URL } from '../../constants/bplaene';

const Component = ({ uiState, uiStateActions, showModalMenu }) => {
  return (
    <GenericModalMenuSection
      uiState={uiState}
      uiStateActions={uiStateActions}
      sectionKey="dokuumente-betrachten"
      sectionTitle="B-Plan-Dokumente betrachten"
      sectionBsStyle="info"
      sectionContent={
        <div>
          Durch Anklicken des Links "Dokumente" in der Info-Box oder des PDF-Symbols direkt darüber
          wird in einer neuen Registerkarte Ihres Browsers ein Dokumentenviewer geöffnet, in dem die
          Dokumente zu demjenigen B-Plan betrachtet werden können, der gerade den Fokus hat. Wenn zu
          dem B-Plan mehrere Dokumente verfügbar sind, werden diese in einer Navigationsleiste am
          linken Rand des Dokumentenviewers angeboten. Klicken Sie auf eines der Symbole in der
          Navigationsleiste, um das zugehörige Dokument in den Anzeigebereich des Dokumentenviewers
          zu laden. Mit den Werkzeugen <Icon name="chevron-left" /> <i>"vorherige Seite"</i> und{' '}
          <Icon name="chevron-right" /> <i>"nächste Seite"</i> in der Werkzeugleiste am oberen Rand
          des Dokumentenviewers können Sie in mehrseitigen Dokumenten vor- und zurückblättern.
          <br />
          Mehrere Dokumente werden angezeigt, wenn der B-Plan mehrere Planteile umfasst oder wenn
          die verfahrensbegleitenden Zusatzdokumente bereits in digitaler Form vorliegen. Die
          Bereitstellung dieser Dokumente ist ein laufendes Vorhaben der Stadtverwaltung Wuppertal,
          Stand 03/2019 sind sie für rund 60% der Wuppertaler B-Pläne verfügbar. Die
          Namenskonventionen für die vielfältigen Zusatzdateien sind im Dokument{' '}
          <a href={INFO_DOC_DATEINAMEN_URL} target="_info">
            Info Dateinamen
          </a>{' '}
          beschrieben, das in der Navigationsleiste als oberstes Zusatzdokument angeboten wird.
          <br />
          Im Anzeigebereich können Sie das Dokument durch Ziehen mit der Maus verschieben. Mit den
          Werkzeugen <Icon name="plus" /> und <Icon name="minus" /> können Sie die Darstellung
          vergrößern bzw. verkleinern. Darüber hinaus finden Sie in der Werkzeugleiste mit{' '}
          <Icon name="arrows-h" /> <i>"an Fensterbreite anpassen"</i> und{' '}
          <span style={{ whiteSpace: 'nowrap' }}>
            <Icon name="arrows-v" /> <i>"an Fensterhöhe anpassen"</i>
          </span>{' '}
          zwei Möglichkeiten zur schnellen Optimierung der Dokumentdarstellung. Wenn Sie für weitere
          B-Pläne aus dem Kartenfenster zur Dokumentbetrachtung wechseln, wird eine ggf. bereits
          zuvor für den Dokumentenviewer geöffnete Registerkarte Ihres Browsers angesteuert.
        </div>
      }
    />
  );
};
export default Component;
