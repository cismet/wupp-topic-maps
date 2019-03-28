import React from 'react';
import GenericModalMenuSection from '../commons/GenericModalMenuSection';

const DemoMenuSettingsSection = ({ uiState, uiStateActions }) => {
  return (
    <GenericModalMenuSection
      uiState={uiState}
      uiStateActions={uiStateActions}
      sectionKey="settings"
      sectionTitle="Einstellungen"
      sectionBsStyle="primary"
      sectionContent={
        <div>
          <ul>
            <li>
              Sie hätten noch ins Boot springen können, aber der Reisende hob ein schweres,
              geknotetes Tau vom Boden.
            </li>
            <li>
              Aber sie überwanden sich, umdrängten den Käfig und wollten sich gar nicht fortrühren.
            </li>
            <li>
              Welcher keine daraus resultierende Freude nach sich zieht, außer um Vorteile daraus zu
              ziehen?
            </li>
          </ul>
        </div>
      }
    />
  );
};
export default DemoMenuSettingsSection;
