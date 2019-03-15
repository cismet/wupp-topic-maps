import React from 'react';
import GenericModalMenuSection from '../commons/GenericModalMenuSection';

const Component = ({ uiState, uiStateActions, showModalMenu }) => {
  return (
    <GenericModalMenuSection
      uiState={uiState}
      uiStateActions={uiStateActions}
      sectionKey="hintergrundkarte"
      sectionTitle="Hintergrundkarte"
      sectionBsStyle="warning"
      sectionContent={
        <div>
          Die standardm&auml;&szlig;ig eingestellte Hintergrundkarte gibt eine &Uuml;bersicht
          &uuml;ber die Wuppertaler Bebauungspl&auml;ne (B-Pl&auml;ne).
          <br />
          Gr&uuml;ne Fl&auml;chen (&Uuml;bersichtsma&szlig;stab) bzw. Umringe stehen f&uuml;r
          rechtswirksame B-Plan-Verfahren, rote Fl&auml;chen / Umringe f&uuml;r laufende Verfahren.
        </div>
      }
    />
  );
};
export default Component;
