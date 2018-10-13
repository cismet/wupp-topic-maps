import React from "react";
import BaederModalMenuIntroduction from "./BaederModalMenuIntroduction";
import BaederModalMenuHelpSection from "./BaederModalMenuHelpSection";
import GenericModalApplicationMenu from "../commons/GenericModalApplicationMenu"
import GenericModalMenuSection from "../commons/GenericModalMenuSection"
const BaederModalMenu=({
    uiState,
    uiStateActions
})=> {
    return (
        <GenericModalApplicationMenu
              uiState={uiState}
              uiStateActions={uiStateActions}
              menuIntroduction={(
                <BaederModalMenuIntroduction uiStateActions={uiStateActions}/>
              )}
              menuSections={[
                      <GenericModalMenuSection 
                      key="BaederModalMenuHSettingsSection"
        uiState={uiState}
        uiStateActions={uiStateActions}
        sectionKey="settings"
        sectionTitle="Einstellungen"
        sectionBsStyle="primary"
        sectionContent={<div/>}
            />,

            <BaederModalMenuHelpSection
            key="BaederModalMenuHelpSection"
              uiState={uiState}
            uiStateActions={uiStateActions}/>
              ]}
              />
    );
}
export default BaederModalMenu;